import Link from 'next/link';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { searchSimilar } from '@/lib/fts';
import Highlighted from '@/components/Highlighted';

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
  const directHitPromise = db.prepare(`
    SELECT *
    FROM ScamSiteRecord
    WHERE lower(host) = lower(?)
    ORDER BY endDate DESC
  `).bind(host).all<Record>().then(({results}) => results);

  return Promise.all([directHitPromise, searchSimilar(host)]);
}

export default async function Host({params: {host}}: {params: {host: string}}) {
  const [directHits, ftsHits] = await getRecords(host);
  const totalReportCount = directHits.reduce((sum, record) => sum + record.count, 0)

  return (
    <main>
      <h1>{host}</h1>
      {
        totalReportCount === 0 ?
        `${host} is not reported by 165 yet.` :
        <>
          {host} is a confirmed scam by 165. It has been reported {totalReportCount} times.
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
                  <td><Link href={`/name/${record.name}`}>{record.name}</Link></td>
                  <td>{record.url}</td>
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
            <th>Reported</th>
          </tr>
        </thead>
        <tbody>
        {ftsHits.map((record) => (
            <tr key={record.rowid}>
              <td>
                <Link href={`/name/${record.nameTokens.join('')}`}>
                  <Highlighted tokens={record.nameTokens} />
                </Link>
              </td>
              <td>
                <Link href={`/host/${record.host}`}>
                  <Highlighted tokens={record.urlTokens} />
                </Link>
              </td>
              <td>{record.count} time(s) during {record.startDate} and {record.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )

}
