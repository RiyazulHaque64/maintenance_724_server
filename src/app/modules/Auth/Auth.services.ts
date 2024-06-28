import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../error/ApiError";
import prisma from "../../shared/prisma";
import { generateToken } from "../../utils/jwtHelpers";
import { TChangePasswordPayload, TLoginCredential } from "./Auth.interfaces";

const login = async (credential: TLoginCredential) => {
  const { userName, password } = credential;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      userName,
      status: UserStatus.ACTIVE,
    },
  });

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User name or password is invalid"
    );
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiresin
  );

  return {
    accessToken,
  };
};

const resetPassword = async (user: any, payload: TChangePasswordPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.id,
    },
  });

  const checkPassword = await bcrypt.compare(
    payload.oldPassword,
    userInfo.password
  );
  if (!checkPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Old password is invalid");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_rounds)
  );

  const result = await prisma.user.update({
    where: {
      id: userInfo?.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return result;
};

export const AuthServices = {
  login,
  resetPassword,
};
