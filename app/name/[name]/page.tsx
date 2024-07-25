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
  const { results } = await db.prepare(`
    SELECT *
    FROM ScamSiteRecord
    WHERE lower(name) = lower(?)
    ORDER BY endDate DESC
  `).bind(name).all<Record>();

  return results;
}

export default async function Name({params: {name: encodedName}}: {params: {name: string}}) {
  const name = decodeURIComponent(encodedName);
  const records = await getRecords(name);

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
          {records.map((record) => (
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
    </main>
  )

}
