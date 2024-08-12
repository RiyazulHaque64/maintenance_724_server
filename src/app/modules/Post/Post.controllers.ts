import { Request } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PostServices } from "./Post.services";

const createPost = catchAsync(
  async (req: Request & { user?: JwtPayload }, res, next) => {
    const result = await PostServices.createPost(
      req?.user,
      req?.body,
      req.file
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Post created successfully",
      data: result,
    });
  }
);

const getPosts = catchAsync(async (req, res, next) => {
  const result = await PostServices.getPosts(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSinglePost = catchAsync(async (req, res, next) => {
  const result = await PostServices.getSinglePost(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.body);
  const result = await PostServices.updatePost(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
});

const softDeletePost = catchAsync(async (req, res, next) => {
  const result = await PostServices.softDeletePost(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

const hardDeletePost = catchAsync(async (req, res, next) => {
  const result = await PostServices.hardDeletePost(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getPosts,
  updatePost,
  softDeletePost,
  hardDeletePost,
  getSinglePost,
};
