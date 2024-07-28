-- Generated by npm run gen:schema

CREATE TABLE _cf_KV (
      key TEXT PRIMARY KEY,
      value BLOB
    ) WITHOUT ROWID

CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
)

CREATE TABLE sqlite_sequence(name,seq)

CREATE TABLE "ScamSiteRecord"
    -- Based on 165反詐騙諮詢專線_假投資(博弈)網站
    -- URL: https://data.gov.tw/dataset/160055
(
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL, -- number of reports
    "startDate" TEXT NOT NULL, -- number of reports calculation start date in YYYY/MM/DD
    "endDate" TEXT NOT NULL, -- number of reports calculation end date in YYYY/MM/DD
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "host" TEXT NOT NULL -- Extracted from URL
)

CREATE INDEX "ScamSiteRecord_host_idx" ON "ScamSiteRecord"(lower("host"))

CREATE INDEX "ScamSiteRecord_name_idx" ON "ScamSiteRecord"(lower("name"))

CREATE VIRTUAL TABLE "ScamSiteRecordFTS" USING fts5(
  name,
  url,
  content='ScamSiteRecord',
  tokenize='trigram'
)

CREATE TABLE 'ScamSiteRecordFTS_data'(id INTEGER PRIMARY KEY, block BLOB)

CREATE TABLE 'ScamSiteRecordFTS_idx'(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID

CREATE TABLE 'ScamSiteRecordFTS_docsize'(id INTEGER PRIMARY KEY, sz BLOB)

CREATE TABLE 'ScamSiteRecordFTS_config'(k PRIMARY KEY, v) WITHOUT ROWID