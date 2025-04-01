/*
  Warnings:

  - Added the required column `perk` to the `Tier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "perk" TEXT NOT NULL;
