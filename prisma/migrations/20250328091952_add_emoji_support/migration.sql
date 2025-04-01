/*
  Warnings:

  - You are about to drop the column `icon` on the `Tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "emoji" TEXT NOT NULL DEFAULT '🚀';

-- AlterTable
ALTER TABLE "Tier" DROP COLUMN "icon",
ADD COLUMN     "emoji" TEXT NOT NULL DEFAULT '🏅';

-- DropEnum
DROP TYPE "Icon";
