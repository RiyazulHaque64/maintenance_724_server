import { Prisma, Service } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { TFile } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pagination from "../../utils/pagination";

const createService = async (data: Service, file: TFile | undefined) => {
  if (file) {
    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    data.icon = cloudinaryResponse?.secure_url as string;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service icon is required");
  }
  const result = await prisma.service.create({
    data: data,
  });
  return result;
};

const getServices = async (query: Record<string, any>) => {
  const { page, limit, sortBy, sortOrder, searchTerm } = query;
  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.ServiceWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map((item: string) => ({
        [item]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.service.findMany({
    where: {
      AND: andConditions,
    },
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
  });

  const total = await prisma.service.count();

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
    result,
  };
};

const getSingleService = async (id: string) => {
  const result = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updateService = async (
  id: string,
  data: Partial<Service>,
  file: TFile | undefined
) => {
  if (file) {
    const iconInfo: Record<string, string> = {};
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        thumbnail: true,
      },
    });

    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    iconInfo["path"] = cloudinaryResponse?.secure_url as string;
    iconInfo["cloudId"] = cloudinaryResponse?.public_id as string;

    if (post.thumbnail) {
      await fileUploader.deleteToCloudinary([post.thumbnail.cloudId]);
    }

    const result = await prisma.$transaction(async (transactionClient) => {
      if (post.thumbnailId) {
        await prisma.postThumbnail.delete({
          where: {
            id: post.thumbnailId,
          },
        });
      }
      const newThumbnail = await transactionClient.postThumbnail.create({
        data: {
          cloudId: iconInfo?.cloudId,
          path: iconInfo?.path,
        },
      });
      const updatedPost = await transactionClient.post.update({
        where: {
          id,
        },
        data: {
          ...data,
          thumbnailId: newThumbnail.id,
        },
      });
      return updatedPost;
    });
    return result;
  } else {
    const result = await prisma.post.update({
      where: {
        id,
      },
      data: data,
    });
    return result;
  }
};

const hardDeleteService = async (id: string) => {
  await prisma.service.delete({
    where: {
      id,
    },
  });
  return null;
};

export const ServiceServices = {
  createService,
  getServices,
  getSingleService,
  updateService,
  hardDeleteService,
};
