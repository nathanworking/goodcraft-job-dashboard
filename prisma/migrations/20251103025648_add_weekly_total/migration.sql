-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RevenueWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekOf" DATETIME NOT NULL,
    "tylerWorkHours" REAL NOT NULL DEFAULT 0,
    "tylerRevenue" REAL NOT NULL DEFAULT 0,
    "clientWorkHours" REAL NOT NULL DEFAULT 0,
    "clientRevenue" REAL NOT NULL DEFAULT 0,
    "templateSalesCount" INTEGER NOT NULL DEFAULT 0,
    "templateSalesAmount" REAL NOT NULL DEFAULT 0,
    "otherIncome" REAL NOT NULL DEFAULT 0,
    "weeklyTotal" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RevenueWeek" ("clientRevenue", "clientWorkHours", "createdAt", "id", "notes", "otherIncome", "templateSalesAmount", "templateSalesCount", "tylerRevenue", "tylerWorkHours", "updatedAt", "weekOf") SELECT "clientRevenue", "clientWorkHours", "createdAt", "id", "notes", "otherIncome", "templateSalesAmount", "templateSalesCount", "tylerRevenue", "tylerWorkHours", "updatedAt", "weekOf" FROM "RevenueWeek";
DROP TABLE "RevenueWeek";
ALTER TABLE "new_RevenueWeek" RENAME TO "RevenueWeek";
CREATE UNIQUE INDEX "RevenueWeek_weekOf_key" ON "RevenueWeek"("weekOf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
