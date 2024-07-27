import { trigram } from 'n-gram';
import { getRequestContext } from '@cloudflare/next-on-pages';

type FTSRecord = {
  rowid: number;
  name: string;
  host: string;
  url: string;
  rank: number;
}

export async function searchSimilar(query: string, limit=20) {
  const db = getRequestContext().env.DB;
  const shouldUseFts = query.length > 2; // ScamSiteRecordFTS is a trigram index
  const whereClause = shouldUseFts ?
    `ScamSiteRecordFTS MATCH '${trigram(query).map(g => `"${g.replaceAll('"', '""')}"`).join(' OR ')}'` :
    `name LIKE ? OR url LIKE ?`;
  const values = shouldUseFts ? [] : [`%${query}%`, `%${query}%`];

  /** Select similar with full-text search, but reject 100% match */
  const sql = `
    SELECT
      max(rowid) AS rowid,
      ranked.name AS name,
      ranked.url AS url,
      ScamSiteRecord.host as host,
      max(rank) AS rank
    FROM (
      SELECT
        rowid,
        highlight(ScamSiteRecordFTS,0,'{{','}}') AS name,
        highlight(ScamSiteRecordFTS,1,'{{','}}') AS url,
        rank
      FROM ScamSiteRecordFTS
      WHERE ${whereClause}
        AND lower(name) != lower(?)
        AND lower(url) != lower(?)
      ORDER BY rank
      LIMIT ${limit*2 /* Not sure query it would fail without LIMIT. Enlarge limit for grouping in the next phase */}
    ) AS ranked
    LEFT JOIN ScamSiteRecord ON rowid = ScamSiteRecord.id
    GROUP BY ranked.name, ranked.url
    ORDER BY rank
    LIMIT ${limit}
  `;

  // console.info(sql, values);

  const { results } = await db.prepare(sql).bind(...values, query, query).all<FTSRecord>();

  return results;
}

