import { Prisma, Service } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { TFile } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pagination from "../../utils/pagination";

const createService = async (data: Service, file: TFile | undefined) => {
  const image: Record<string, string> = {};
  if (file) {
    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    image["path"] = cloudinaryResponse?.secure_url as string;
    image["cloudId"] = cloudinaryResponse?.public_id as string;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service icon is required");
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    const uploadedImage = await transactionClient.image.create({
      data: {
        cloudId: image?.cloudId,
        path: image?.path,
      },
    });
    const service = await transactionClient.service.create({
      data: {
        ...data,
        iconId: uploadedImage.id,
      },
    });
    return service;
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
    include: {
      icon: true,
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
    include: {
      icon: true,
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
    const image: Record<string, string> = {};
    const service = await prisma.service.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        icon: true,
      },
    });

    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    image["path"] = cloudinaryResponse?.secure_url as string;
    image["cloudId"] = cloudinaryResponse?.public_id as string;
    if (service.icon) {
      await fileUploader.deleteToCloudinary([service.icon.cloudId]);
    }

    const result = await prisma.$transaction(async (transactionClient) => {
      const newIcon = await transactionClient.image.create({
        data: {
          cloudId: image?.cloudId,
          path: image?.path,
        },
      });
      const updatedService = await transactionClient.service.update({
        where: {
          id,
        },
        data: {
          ...data,
          iconId: newIcon.id,
        },
      });

      await transactionClient.image.delete({ where: { id: service.iconId } });

      return updatedService;
    });
    return result;
  } else {
    const result = await prisma.service.update({
      where: {
        id,
      },
      data: data,
    });
    return result;
  }
};

const hardDeleteService = async (id: string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      icon: true,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const deletedService = await transactionClient.service.delete({
      where: {
        id,
      },
    });

    await transactionClient.image.delete({
      where: {
        id: service.iconId,
      },
    });

    return deletedService;
  });

  if (result) {
    await fileUploader.deleteToCloudinary([service.icon.cloudId]);
  }

  return null;
};

export const ServiceServices = {
  createService,
  getServices,
  getSingleService,
  updateService,
  hardDeleteService,
};
