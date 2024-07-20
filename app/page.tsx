import { getRequestContext } from '@cloudflare/next-on-pages';
import Link from 'next/link'

export const runtime = 'edge';
const SEP = ';';
const PAGE_SIZE = 25;

type AggregatedRecord = {
  host: string;
  maxEndDate: string;
  names: string[];
}

async function loadData(page: number = 0) {
  'use server';
  const db = getRequestContext().env.DB;
  const { results } = await db.prepare(`
    SELECT
      host,
      max(endDate) AS maxEndDate,
      string_agg(name, ?) AS names
      FROM ScamSiteRecord
      GROUP BY host
      ORDER BY maxEndDate DESC
      LIMIT ?
      OFFSET ?
  `).bind(SEP, PAGE_SIZE, page * PAGE_SIZE).all<Pick<AggregatedRecord, 'host' | 'maxEndDate'> & {names: string}>();

  return results.map((record) => ({
    ...record,
    names: Array.from(new Set(record.names.split(SEP))),
  }))
}

export default async function Home() {
  const hosts = await loadData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Latest scam records</h1>
      <ul>
        {hosts.map(({host, names, maxEndDate}) => (
          <li key={host} className="flex gap-1">
            <h2>
              <Link href={`/host/${host}`}>{host}</Link>
            </h2>
            uses the name
            {names.map((name) => (
              <span key={name}>
                <Link href={`/name/${name}`}>{name}</Link>{', '}
              </span>
            ))}
            last reported on {maxEndDate}
          </li>
        ))}
      </ul>
    </main>
  );
}
