/*
  Warnings:

  - You are about to drop the column `category` on the `galleries` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `galleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
