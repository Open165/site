/** Sync ScamSiteAnnouncement from 165 website to DB by generating the SQL to execute */

import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

/**
 * 165反詐騙官網使用之 API
 */
const NPA_165_ANNOUNCEMENT_API = 'https://165.npa.gov.tw/api/article/list/9';

// {"category":null,"id":1569,"title":"113/8/29-113/9/4民眾通報假投資(博弈)詐騙網站 【網友不會幫你賺錢、請勿聽信網友投資】","content":null,"publishDate":"2024-09-05T20:32:00+08:00","topFlag":null,"lastUpdTm":null,"oldId":null,"hasFile":null,"promoFile":null,"fileName":null}
const TABLE = 'ScamSiteAnnouncement';
const SQL_FILE = './tmp/scamSiteAnnouncement.sql';
const ANNOUCNEMENT_REGEX = /通報假投資/;

type NPA165Announcement = {
  id: string;
  title: string;
  publishDate: string;
};

/**
 * Possible title formats and their respective expected output
 * - 165反詐騙諮詢專線公布108/12/30-109/01/05民眾通報高風險賣場(平臺) --> 2020/01/05
 * - 公布108/12/11-12/17民眾通報假投資博奕網站(投資網站) --> 2019/12/17
 * - 公布2/6-2/12民眾通報假投資(博奕)詐騙網站 --> 2020/02/12 (year comes from publishDate)
 * @param title
 * @returns
 */
function getEndDate(title: string) {
  const matches = title.match(/-(\d+)\/(\d+)\/(\d+)/);
  if (!matches) throw new Error(`Cannot extract end date from "${title}"`);
  const [, rocYear, month, date] = matches;
  return `${+rocYear + 1911}/${month.padStart(2, '0')}/${date.padStart(2, '0')}`;
}

async function main() {
  const announcements: NPA165Announcement[] = await (
    await fetch(NPA_165_ANNOUNCEMENT_API)
  ).json();
  await mkdir(path.parse(SQL_FILE).dir, { recursive: true });
  const values = announcements
    .filter(({ title }) => title.match(ANNOUCNEMENT_REGEX))
    .map(
      ({ id, title, publishDate }) =>
        `(${id}, '${title.replaceAll("'", "''")}', '${getEndDate(title)}', '${publishDate}')`
    );

  await writeFile(
    SQL_FILE,
    `
      DELETE FROM ${TABLE};
      ${values.map((value) => `INSERT INTO ${TABLE} (id, title, endDate, publishDate) VALUES ${value};`).join('\n')}

    `.trim()
  );
}

main().catch(console.error);
