import { trigram } from 'n-gram';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
type Record = {
  id: number;
  name: string;
  url: string;
  count: number;
  startDate: string;
  endDate: string;
  host: string;
}

async function getRecords(name: string) {
  'use server';
  const db = getRequestContext().env.DB;
  const directHitPromise = db.prepare(`
    SELECT *
    FROM ScamSiteRecord
    WHERE lower(name) = lower(?)
    ORDER BY endDate DESC
  `).bind(name).all<Record>();

  const shouldUseFts = name.length > 3;
  const grams = trigram(name);
  const whereClause = shouldUseFts ?
    `ScamSiteRecordFTS MATCH '${grams.map(g => `"${g.replace('"', '""')}"`).join(' OR ')}'` :
    `name LIKE ?`;
  const values = shouldUseFts ? [] : [`%${name}%`];
  const sql = `
    SELECT
      rowid,
      *,
      highlight(ScamSiteRecordFTS,0,'{{','}}') AS name,
      highlight(ScamSiteRecordFTS,1,'{{','}}') AS url
    FROM ScamSiteRecordFTS
    WHERE  ${whereClause}
    ORDER BY rank
  `;

  console.log(sql, values);

  const ftsHitPromise = db.prepare(sql).bind(...values).all<Pick<Record, 'name' | 'url'> & {rowid: string}>();

  return Promise.all([directHitPromise, ftsHitPromise]);
}

export default async function Name({params: {name: encodedName}}: {params: {name: string}}) {
  const name = decodeURIComponent(encodedName);
  const [{results: directHits}, {results: ftsHits}] = await getRecords(name);

  return (
    <main>
      <h1>{name}</h1>
      The name “{name}” is used by the following know scam sites.

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Count</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {directHits.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.url}</td>
              <td>{record.count}</td>
              <td>{record.startDate}</td>
              <td>{record.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      Similar entries
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {ftsHits.map((record) => (
            <tr key={record.rowid}>
              <td>{record.name}</td>
              <td>{record.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )

}
