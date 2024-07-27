import { getRequestContext } from '@cloudflare/next-on-pages';
import { searchSimilar } from '@/lib/fts';
import Link from 'next/link';

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
  `).bind(name).all<Record>().then(({results}) => results);

  return Promise.all([directHitPromise, searchSimilar(name)]);
}

export default async function Name({params: {name: encodedName}}: {params: {name: string}}) {
  const name = decodeURIComponent(encodedName).trim();
  const [directHits, ftsHits] = await getRecords(name);

  return (
    <main>
      <h1>{name}</h1>
      {
        directHits.length === 0 ? `The name ${name} is not reported by 165 yet.` :
        <>
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
                  <td><Link href={`/host/${record.host}`}>{record.url}</Link></td>
                  <td>{record.count}</td>
                  <td>{record.startDate}</td>
                  <td>{record.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }

      <h2>Similar entries on 165</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>URL</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {ftsHits.map((record) => (
            <tr key={record.rowid}>
              <td><Link href={`/name/${record.name}`}>{record.name}</Link></td>
              <td><Link href={`/host/${record.host}`}>{record.url}</Link></td>
              <td>{record.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )

}
