import fs from 'fs/promises';

/**
 * 165反詐騙諮詢專線_假投資(博弈)網站
 * https://data.gov.tw/dataset/160055
 */
const NPA_165_SITE_URL = 'https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=3BB8E3CE-8223-43AF-B1AB-5824FA889883';

const SITE_BY_HOST_OUTPUT = 'data/siteByHost.json';
const SITE_BY_NAME_OUTPUT = 'data/siteByName.json';
const HOSTS_OUTPUT = 'data/hosts.txt';
const SITES_OUTPUT = 'data/sites.txt';

type NPA165SiteData = /** Fields from data */
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
  }

/** Sorts the values by endDate for each key decendently */
function sortByEndDate(siteMap: {[key: string]: Pick<NPA165SiteData, 'endDate'>[]}) {
  for (const key in siteMap) {
    siteMap[key].sort((a, b) => {
      return b.endDate.localeCompare(a.endDate);
    });
  }
}

const downloadFile = async () => {
  const scamSiteCsv = await (await fetch(NPA_165_SITE_URL)).text();
  const rawData: NPA165SiteData[] = scamSiteCsv.split('\n').filter(
    // Skip first 2 rows, they are headers
    (row , idx) => row.trim() && idx >= 2
  ).map((line) => {
    const [name, url, count, startDate, endDate] = line.trim().split(',');
    return { name: name.trim(), url: url.trim(), count: +count, startDate: startDate.trim(), endDate: endDate.trim(),
      // url can only be in:
      // - some-domain.com
      // - some-domain.com/some-path
      // - some-domain.com/?some-query
      // - some-domain.com?some-query
      host: url.match(/^([^?\/]+)/)?.[0] ?? url
    };
  });

  const siteByName = rawData.reduce<{[name: string]: Omit<NPA165SiteData, 'name'>[]}>((acc,
    { name, url, count, startDate, endDate, host }) => {
      acc[name] = acc[name] || [];
      acc[name].push({ url, count, startDate, endDate, host });
      return acc;
    }, {});
  sortByEndDate(siteByName);

  const siteByHost = rawData.reduce<{[host: string]: Omit<NPA165SiteData, 'host'>[]}>(
    (acc, { name, host, url, count, startDate, endDate }) => {
      acc[host] = acc[host] || [];
      acc[host].push({ name, url, count, startDate, endDate });
      return acc;
    }, {});
  sortByEndDate(siteByHost);

  // Site names sorted by latest endDate first
  const siteNames = Object.keys(siteByName).sort((a, b) =>
    siteByName[b][0].endDate.localeCompare(siteByName[a][0].endDate)
  );

  // Site names sorted by latest endDate first
  const siteHosts = Object.keys(siteByHost).sort((a, b) =>
    siteByHost[b][0].endDate.localeCompare(siteByHost[a][0].endDate)
  );

  await Promise.all([
    fs.writeFile(SITE_BY_NAME_OUTPUT, JSON.stringify(siteByName, null, 2)),
    fs.writeFile(SITE_BY_HOST_OUTPUT, JSON.stringify(siteByHost, null, 2)),
    fs.writeFile(HOSTS_OUTPUT, siteHosts.join('\n')),
    fs.writeFile(SITES_OUTPUT, siteNames.join('\n'))
  ]);
};


downloadFile().then(() => console.log('Done'), console.error);
