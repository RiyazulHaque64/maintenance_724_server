/*
  Warnings:

  - You are about to drop the column `cloudId` on the `galleries` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `galleries` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `post_thumbnails` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `galleries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iconId]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconId` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_thumbnailId_fkey";

-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "cloudId",
DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "icon",
ADD COLUMN     "iconId" TEXT NOT NULL;

-- DropTable
DROP TABLE "post_thumbnails";

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "cloudId" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "galleries_imageId_key" ON "galleries"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "services_iconId_key" ON "services"("iconId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
