import { getRequestContext } from '@cloudflare/next-on-pages';
import Link from 'next/link';
import { Heading } from '@/components/contents';

export const runtime = 'edge';

const SEP = ';';
const PAGE_SIZE = 25;

type AggregatedRecord = {
  host: string;
  maxEndDate: string;
  names: string[];
};

async function loadData(page: number = 0): Promise<AggregatedRecord[]> {
  'use server';
  const db = getRequestContext().env.DB;
  const query = `
    SELECT
      host,
      max(endDate) AS maxEndDate,
      string_agg(name, ?) AS names
    FROM ScamSiteRecord
    GROUP BY host
    ORDER BY maxEndDate DESC
    LIMIT ?
    OFFSET ?
  `;
  const { results } = await db
    .prepare(query)
    .bind(SEP, PAGE_SIZE, page * PAGE_SIZE)
    .all<Pick<AggregatedRecord, 'host' | 'maxEndDate'> & { names: string }>();

  return results.map((record) => ({
    ...record,
    names: Array.from(new Set(record.names.split(SEP))),
  }));
}

function ScamRecord({ host, names, maxEndDate }: AggregatedRecord) {
  return (
    <li className="mb-6 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          <Link
            href={`/host/${host}`}
            className="hover:text-red-600 transition-colors duration-300"
          >
            {host}
          </Link>
        </h2>
        <p className="mb-2 text-gray-600">
          <span className="font-semibold">
            Alias{names.length > 1 ? 'es' : ''}:
          </span>
          {names.map((name, index) => (
            <span key={name} className="ml-1">
              {index > 0 && ', '}
              <Link
                href={`/name/${name}`}
                className="text-blue-500 hover:underline"
              >
                {name}
              </Link>
            </span>
          ))}
        </p>
        <p className="text-sm text-gray-500">
          Last reported:{' '}
          {new Date(maxEndDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </li>
  );
}

export default async function Home() {
  const hosts = await loadData();

  return (
    <>
      <Heading>Latest Scam Records</Heading>
      <ul className="space-y-6">
        {hosts.map((record) => (
          <ScamRecord key={record.host} {...record} />
        ))}
      </ul>
    </>
  );
}
