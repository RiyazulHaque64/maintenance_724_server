import { Post, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import { TFile } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../utils/fileUploader";
import pagination from "../../utils/pagination";
import { postSearchableTerms } from "./Post.constants";

const createPost = async (user: any, data: Post, file: TFile | undefined) => {
  if (file) {
    const convertedFile = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
    const cloudinaryResponse = await fileUploader.uploadToCloudinary(dataURI);
    data.thumbnail = cloudinaryResponse?.secure_url as string;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post thumbnail is required");
  }
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: user.id,
    },
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

const updatePost = async (id: string, data: Partial<Post>) => {
  console.log(data);
  const result = await prisma.post.update({
    where: {
      id,
    },
    data: data,
  });
  return result;
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
