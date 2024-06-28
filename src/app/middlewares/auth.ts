import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../error/ApiError";
import { verifyToken } from "../utils/jwtHelpers";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedUser = verifyToken(token, config.jwt_access_secret);

      if (roles?.length && !roles.includes(verifiedUser?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      req.user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
