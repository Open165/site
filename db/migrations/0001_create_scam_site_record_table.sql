-- CreateTable
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
CREATE INDEX "ScamSiteRecord_host_idx" ON "ScamSiteRecord"("host");

-- CreateIndex
CREATE INDEX "ScamSiteRecord_name_idx" ON "ScamSiteRecord"("name");
