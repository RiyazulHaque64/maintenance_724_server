-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_thumbnailId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "thumbnailId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "post_thumbnails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
