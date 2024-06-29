/*
  Warnings:

  - Added the required column `category` to the `galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cloudinaryId` to the `galleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "galleries" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "cloudinaryId" TEXT NOT NULL;
