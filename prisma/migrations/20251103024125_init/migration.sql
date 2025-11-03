-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateApplied" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "url" TEXT,
    "resumeVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "followUpDate" DATETIME,
    "notes" TEXT,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RevenueWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekOf" DATETIME NOT NULL,
    "tylerWorkHours" REAL NOT NULL DEFAULT 0,
    "tylerRevenue" REAL NOT NULL DEFAULT 0,
    "clientWorkHours" REAL NOT NULL DEFAULT 0,
    "clientRevenue" REAL NOT NULL DEFAULT 0,
    "templateSalesCount" INTEGER NOT NULL DEFAULT 0,
    "templateSalesAmount" REAL NOT NULL DEFAULT 0,
    "otherIncome" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NetworkContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactName" TEXT NOT NULL,
    "company" TEXT,
    "dateContacted" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" DATETIME,
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekOf" DATETIME NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "topic" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "engagementLikes" INTEGER NOT NULL DEFAULT 0,
    "engagementComments" INTEGER NOT NULL DEFAULT 0,
    "engagementShares" INTEGER NOT NULL DEFAULT 0,
    "leadsGenerated" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekOf" DATETIME NOT NULL,
    "jobApplications" INTEGER NOT NULL DEFAULT 0,
    "deepWorkHours" REAL NOT NULL DEFAULT 0,
    "revenueThisWeek" REAL NOT NULL DEFAULT 0,
    "contentPosted" INTEGER NOT NULL DEFAULT 0,
    "networkOutreach" INTEGER NOT NULL DEFAULT 0,
    "meetingsNotes" TEXT,
    "blockers" TEXT,
    "wins" TEXT,
    "actionItems" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RevenueWeek_weekOf_key" ON "RevenueWeek"("weekOf");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyReview_weekOf_key" ON "WeeklyReview"("weekOf");
