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
};

/** Get records with site name */
export const getRecords = cache(async (name: string) => {
  const db = getRequestContext().env.DB;
  const directHitPromise = db
    .prepare(
      `
        SELECT *
        FROM ScamSiteRecord
        WHERE lower(name) = lower(?)
        ORDER BY endDate DESC
      `
    )
    .bind(name)
    .all<Record>()
    .then(({ results }) => results);

  return Promise.all([directHitPromise, searchSimilar(name)]);
});

/** Get summary text for a site name */
export function getSummary(name: string, directHits: Record[]) {
  if (directHits.length === 0) {
    return `內政部警政署公布的詐騙網站中，目前沒有「${name}」。`;
  }

  const latest = directHits[0];
  const countSum = directHits.reduce((sum, { count }) => sum + count, 0);

  return (
    <>
      近期詐團{' '}
      <mark className="highlighter">使用「{latest.name}」名義行騙</mark>。
      內政部警政署已收到 {countSum} 次民眾檢舉以「{latest.name}」為名的網站，
      最近 {latest.count} 次落在 {latest.endDate} 那週，請務必小心！
    </>
  );
}
