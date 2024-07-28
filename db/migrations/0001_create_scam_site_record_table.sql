-- CreateTable
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
);

-- CreateIndex
CREATE INDEX "ScamSiteRecord_host_idx" ON "ScamSiteRecord"(lower("host"));

-- CreateIndex
CREATE INDEX "ScamSiteRecord_name_idx" ON "ScamSiteRecord"(lower("name"));
