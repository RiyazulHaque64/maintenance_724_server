import { Post, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { TFile } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pagination from "../../utils/pagination";
import { postSearchableTerms } from "./Post.constants";

const createPost = async (user: any, data: Post, file: TFile | undefined) => {
  const thumbnailInfo: Record<string, string> = {};
  if (file) {
    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    thumbnailInfo["path"] = cloudinaryResponse?.secure_url as string;
    thumbnailInfo["cloudId"] = cloudinaryResponse?.public_id as string;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post thumbnail is required");
  }
  const result = await prisma.$transaction(async (transactionClient) => {
    const thumbnail = await transactionClient.postThumbnail.create({
      data: {
        cloudId: thumbnailInfo?.cloudId,
        path: thumbnailInfo?.path,
      },
    });
    const post = await transactionClient.post.create({
      data: {
        ...data,
        authorId: user.id,
        thumbnailId: thumbnail.id,
      },
    });
    return post;
  });
  return result;
};

const getPosts = async (query: Record<string, any>) => {
  const { page, limit, sortBy, sortOrder, searchTerm } = query;
  const { pageNumber, limitNumber, skip, sortWith, sortSequence } = pagination({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const andConditions: Prisma.PostWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: postSearchableTerms.map((item: string) => ({
        [item]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.post.findMany({
    where: {
      isDeleted: false,
      AND: andConditions,
    },
    skip: skip,
    take: limitNumber,
    orderBy: {
      [sortWith]: sortSequence,
    },
    include: {
      author: true,
      thumbnail: true,
    },
  });

  const total = await prisma.post.count({ where: { isDeleted: false } });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
    result,
  };
};

const getSinglePost = async (id: string) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updatePost = async (
  id: string,
  data: Partial<Post>,
  file: TFile | undefined
) => {
  if (file) {
    const thumbnailInfo: Record<string, string> = {};
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        thumbnail: true,
      },
    });
    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    thumbnailInfo["path"] = cloudinaryResponse?.secure_url as string;
    thumbnailInfo["cloudId"] = cloudinaryResponse?.public_id as string;
    await fileUploader.deleteToCloudinary([post.thumbnail.cloudId]);
    const result = await prisma.$transaction(async (transactionClient) => {
      await transactionClient.postThumbnail.delete({
        where: {
          id: post.thumbnail.id,
        },
      });
      const newThumbnail = await transactionClient.postThumbnail.create({
        data: {
          cloudId: thumbnailInfo?.cloudId,
          path: thumbnailInfo?.path,
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

const softDeletePost = async (id: string) => {
  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
  return null;
};

const hardDeletePost = async (id: string) => {
  await prisma.post.delete({
    where: {
      id,
    },
  });
  return null;
};

export const PostServices = {
  createPost,
  getPosts,
  updatePost,
  softDeletePost,
  hardDeletePost,
  getSinglePost,
};
