import { Request } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ServiceServices } from "./Services.services";

const createService = catchAsync(async (req: Request, res, next) => {
  const result = await ServiceServices.createService(req?.body, req.file);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Service created successfully",
    data: result,
  });
});

const getServices = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.getServices(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Services retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleService = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.getSingleService(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service retrieved successfully",
    data: result,
  });
});

const updateService = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.updateService(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service updated successfully",
    data: result,
  });
});

const hardDeleteService = catchAsync(async (req, res, next) => {
  const result = await ServiceServices.hardDeleteService(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Service deleted successfully",
    data: result,
  });
});

export const ServiceControllers = {
  createService,
  getServices,
  getSingleService,
  updateService,
  hardDeleteService,
};
