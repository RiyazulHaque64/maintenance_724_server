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
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fileUploader_1 = require("../../utils/fileUploader");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const Post_constants_1 = require("./Post.constants");
const createPost = (user, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const convertedFile = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${convertedFile}`;
        const cloudinaryResponse = yield fileUploader_1.fileUploader.uploadToCloudinary(dataURI);
        data.thumbnail = cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Post thumbnail is required");
    }
    const result = yield prisma_1.default.post.create({
        data: Object.assign(Object.assign({}, data), { authorId: user.id }),
    });
    return result;
});
const getPost = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, searchTerm } = query;
    const { pageNumber, limitNumber, skip, sortWith, sortSequence } = (0, pagination_1.default)({
        page,
        limit,
        sortBy,
        sortOrder,
    });
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: Post_constants_1.postSearchableTerms.map((item) => ({
                [item]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const result = yield prisma_1.default.post.findMany({
        where: {
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
    const total = yield prisma_1.default.post.count();
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total: total,
        },
        result,
    };
});
const getSinglePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
});
const updatePost = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.update({
        where: {
            id,
        },
        data: data,
    });
    return result;
});
const softDeletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.post.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });
    return null;
});
const hardDeletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.post.delete({
        where: {
            id,
        },
    });
    return null;
});
exports.PostServices = {
    createPost,
    getPost,
    updatePost,
    softDeletePost,
    hardDeletePost,
    getSinglePost,
};
