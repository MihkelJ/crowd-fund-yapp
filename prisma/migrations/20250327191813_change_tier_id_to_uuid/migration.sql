/*
  Warnings:

  - The primary key for the `Tier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_tierId_fkey";

-- AlterTable
ALTER TABLE "Contribution" ALTER COLUMN "tierId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tier_id_seq";

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
