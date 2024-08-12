/*
  Warnings:

  - You are about to drop the column `cloudinaryId` on the `galleries` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[thumbnailId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudId` to the `galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "cloudinaryId",
ADD COLUMN     "cloudId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "post_thumbnails" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "cloudId" TEXT NOT NULL,

    CONSTRAINT "post_thumbnails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_thumbnailId_key" ON "posts"("thumbnailId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "post_thumbnails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
