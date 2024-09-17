-- Migration number: 0003 	 2024-09-17T17:39:43.162Z

CREATE TABLE "ScamSiteAnnouncement"
    -- 165反詐騙官網「民眾通報假投資(博弈)詐騙網站」系列公告
(
    "id" INTEGER NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL, -- Announcement title
    "endDate" TEXT NOT NULL, -- Announcement range end in "YYYY/MM/DD", maps to "endDate" in "ScamSiteRecord"
    "publishDate" TEXT NOT NULL -- Announcement publish date in "YYYY-MM-DDThh:mm:ss+08:00"
);

-- CreateIndex
CREATE INDEX "ScamSiteAnnouncement_endDate_idx" ON "ScamSiteAnnouncement"("endDate");
CREATE INDEX "ScamSiteRecord_endDate_idx" ON "ScamSiteRecord"("endDate");
