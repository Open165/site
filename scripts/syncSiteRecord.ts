/** Sync ScamSiteRecord from 165 open data to DB by generating the SQL to execute */

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

/**
 * 165反詐騙諮詢專線_假投資(博弈)網站
 * https://data.gov.tw/dataset/160055
 */
const NPA_165_SITE_URL = process.env.CI
  ? // Ronny Wang's mirror to bypass IP region block
    'https://raw.githubusercontent.com/g0v-data/165-data/main/gamble.csv'
  : // Official data source
    'https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=3BB8E3CE-8223-43AF-B1AB-5824FA889883';

const TABLE = 'ScamSiteRecord';
const FTS_TABLE = 'ScamSiteRecordFTS';
const SQL_FILE = './tmp/scamSiteRecord.sql';

type NPA165SiteData =
  /** Fields from data */
  {
    name: string;
    url: string;
    count: number;
    /** In YYYY/MM/DD format */
    startDate: string;
    /** In YYYY/MM/DD format */
    endDate: string;
  } & {
    /** Extracted from url */
    host: string;
  };

async function main(
  /** When provided, only generate SQL file when there are new data after `latestDate` */
  latestDate?: string
) {
  console.log('latestDate:', latestDate);

  const scamSiteCsv = await (await fetch(NPA_165_SITE_URL)).text();

  const rawData: NPA165SiteData[] = scamSiteCsv
    .split('\n')
    .filter(
      // Skip first 2 rows, they are headers
      (row, idx) => row.trim() && idx >= 2
    )
    .map((line) => {
      const [name, url, count, startDate, endDate] = line.trim().split(',');
      return {
        name: name.trim(),
        url: url.trim(),
        count: +count,
        startDate: startDate.trim(),
        endDate: endDate.trim(),

        /**
         * Extract host from url. URL in open data may come in these formats:
         *
         * - some-domain.com
         * - some-domain.com:port
         * - some-domain.com/some-path
         * - some-domain.com/?some-query
         * - some-domain.com?some-query
         * - https://some-domain.com
         *
         * We should use some-domain.com as host for all above cases.
         * */
        host: url.match(/^(?:https?:\/\/)?([^?/:]+)/)?.[1] ?? url,
      };
    })
    .filter((data) => !latestDate || data.endDate > latestDate);
    
  if (!rawData.length) {
    console.log('No new data found');
    return;
  }

  // Sort by endDate ascending
  rawData.sort((a, b) => a.endDate.localeCompare(b.endDate));

  const values = rawData.map(
    (data) =>
      `('${data.name.replaceAll("'", "''")}', '${data.url}', ${data.count}, '${data.startDate}', '${data.endDate}', '${data.host}')`
  );

  await mkdir(path.parse(SQL_FILE).dir, { recursive: true });
  await writeFile(
    SQL_FILE,
    `
      DELETE FROM ${TABLE};
      ${values.map((value) => `INSERT INTO ${TABLE} (name, url, count, startDate, endDate, host) VALUES ${value};`).join('\n')}

      -- Rebuild FTS
      INSERT INTO ${FTS_TABLE}(${FTS_TABLE}) VALUES('rebuild');
    `.trim()
  );
}

main(process.env.LATEST_DATE).catch(console.error);
