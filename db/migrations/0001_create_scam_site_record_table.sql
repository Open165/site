-- CreateTable
-- Based on 165反詐騙諮詢專線_假投資(博弈)網站
-- URL: https://data.gov.tw/dataset/160055
CREATE TABLE "ScamSiteRecord" (
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "host" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ScamSiteRecord_host_idx" ON "ScamSiteRecord"(lower("host"));

-- CreateIndex
CREATE INDEX "ScamSiteRecord_name_idx" ON "ScamSiteRecord"(lower("name"));
