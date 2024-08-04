import { cache } from 'react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { searchSimilar } from '@/lib/fts';

/** Scam site report */
type Record = {
  id: number;
  name: string;
  url: string;
  count: number;
  startDate: string;
  endDate: string;
  host: string;
}

export const getRecords = cache(async (host: string) => {
  'use server';
  const db = getRequestContext().env.DB;
  const directHitPromise = db.prepare(`
    SELECT *
    FROM ScamSiteRecord
    WHERE lower(host) = lower(?)
    ORDER BY endDate DESC
  `).bind(host).all<Record>().then(({results}) => results);

  return Promise.all([directHitPromise, searchSimilar(host)]);
});
