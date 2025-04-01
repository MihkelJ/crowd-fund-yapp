/*
  Warnings:

  - You are about to drop the column `message` on the `Contribution` table. All the data in the column will be lost.
  - The `tierId` column on the `Contribution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Tier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tier` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_tierId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "message",
DROP COLUMN "tierId",
ADD COLUMN     "tierId" INTEGER;

-- AlterTable
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tier_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
