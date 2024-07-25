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

async function getRecords(host: string) {
  'use server';
  const db = getRequestContext().env.DB;
  const { results } = await db.prepare(`
    SELECT *
    FROM ScamSiteRecord
    WHERE lower(host) = lower(?)
    ORDER BY endDate DESC
  `).bind(host).all<Record>();

  return results;
}

export default async function Host({params: {host}}: {params: {host: string}}) {
  const records = await getRecords(host);

  return (
    <main>
      <h1>{host}</h1>
      {host} is a confirmed scam by 165. It has been reported {records.reduce((sum, record) => sum + record.count, 0)} times.
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
