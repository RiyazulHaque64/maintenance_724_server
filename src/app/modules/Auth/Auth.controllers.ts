import { Request } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./Auth.services";

const login = catchAsync(async (req, res, next) => {
  const result = await AuthServices.login(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successfully",
    data: result,
  });
});

const resetPassword = catchAsync(
  async (req: Request & { user?: JwtPayload }, res, next) => {
    const result = await AuthServices.resetPassword(req?.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  login,
  resetPassword,
};
