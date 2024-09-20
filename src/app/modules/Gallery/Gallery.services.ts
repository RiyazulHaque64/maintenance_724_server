import { Prisma } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { TCloudinaryResponse, TFiles } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pagination from "../../utils/pagination";

const postImages = async (req: Request) => {
  const data = req.body;
  const files = req?.files as unknown as TFiles;
  console.log({ data, files });
  if (!files?.images?.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No images found");
  }
  const images: Prisma.ImageCreateManyInput[] = [];
  if (files?.images) {
    for (let i = 0; i < files.images.length; i++) {
      const file = files.images[i];
      const convertedFile = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
      const cloudinaryResponse = (await fileUploader.uploadToCloudinary(
        dataURI
      )) as TCloudinaryResponse;
      images.push({
        path: cloudinaryResponse?.secure_url,
        cloudId: cloudinaryResponse?.public_id,
      });
    }
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.image.createMany({
      data: images,
      skipDuplicates: true,
    });

    const insertedImages = await transactionClient.image.findMany({
      where: {
        cloudId: {
          in: images.map((image) => image.cloudId),
        },
      },
    });

    const galleryData = insertedImages.map((image) => {
      return {
        imageId: image.id,
        category: data.category,
      };
    });

    const insertedGalleryData = await transactionClient.gallery.createMany({
      data: galleryData,
      skipDuplicates: true,
    });

    return {
      totalInserted: insertedGalleryData.count,
    };
  });

  return result;
};

const getImages = async (query: Record<string, any>) => {
  const { page, limit, sortBy, sortOrder, category } = query;
  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.GalleryWhereInput[] = [];

  if (category) {
    andConditions.push({
      category: category,
    });
  }

  const result = await prisma.gallery.findMany({
    where: {
      AND: andConditions,
    },
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
  });

  const total = await prisma.gallery.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
    result,
  };
};

const getSingleImage = async (id: string) => {
  const result = await prisma.gallery.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const hardDeleteImages = async (payload: any) => {
  const { ids, cloudinaryIds } = payload;
  if (cloudinaryIds?.length) {
    const cloudinaryResponse = await fileUploader.deleteToCloudinary(
      cloudinaryIds
    );
    console.log(cloudinaryResponse);
  }
  const result = await prisma.gallery.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return result;
};

export const GalleryServices = {
  postImages,
  getImages,
  getSingleImage,
  hardDeleteImages,
};
