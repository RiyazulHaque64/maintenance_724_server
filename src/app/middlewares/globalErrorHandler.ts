import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default globalErrorHandler;
