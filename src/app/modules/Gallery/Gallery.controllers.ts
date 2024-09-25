import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { GalleryServices } from "./Gallery.services";

const postImages = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.postImages(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Images uploaded successfully",
    data: result,
  });
});

const getImages = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.getImages(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleImage = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.getSingleImage(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image retrieved successfully",
    data: result,
  });
});

const updateImage = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.updateImage(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image updated successfully",
    data: result,
  });
});

const hardDeleteImages = catchAsync(async (req, res, next) => {
  const result = await GalleryServices.hardDeleteImages(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image deleted successfully",
    data: result,
  });
});

export const GalleryControllers = {
  postImages,
  getImages,
  getSingleImage,
  updateImage,
  hardDeleteImages,
};
