"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const jwtHelpers_1 = require("../../utils/jwtHelpers");
const login = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = credential;
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            userName,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User name or password is invalid");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwtHelpers_1.generateToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expiresin);
    return {
        accessToken,
    };
});
const resetPassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    const checkPassword = yield bcrypt_1.default.compare(payload.oldPassword, userInfo.password);
    if (!checkPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Old password is invalid");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.salt_rounds));
    const result = yield prisma_1.default.user.update({
        where: {
            id: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return result;
});
exports.AuthServices = {
    login,
    resetPassword,
};
