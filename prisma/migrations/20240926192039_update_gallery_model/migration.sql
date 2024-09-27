/*
  Warnings:

  - You are about to drop the column `categoryId` on the `galleries` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `galleries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "galleries" DROP CONSTRAINT "galleries_categoryId_fkey";

-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "categoryId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
