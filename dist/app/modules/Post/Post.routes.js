"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileUploader_1 = require("../../utils/fileUploader");
const Post_controllers_1 = require("./Post.controllers");
const Post_validations_1 = require("./Post.validations");
const router = (0, express_1.Router)();
router.get("/", Post_controllers_1.PostControllers.getPost);
router.get("/:id", Post_controllers_1.PostControllers.getSinglePost);
router.post("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), fileUploader_1.fileUploader.singleUpload.single("file"), (req, res, next) => {
    req.body = Post_validations_1.PostValidations.createPostValidationSchema.parse(JSON.parse(req.body.data));
    next();
}, Post_controllers_1.PostControllers.createPost);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(Post_validations_1.PostValidations.updatePostValidationSchema), Post_controllers_1.PostControllers.updatePost);
router.delete("/soft-delete/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), Post_controllers_1.PostControllers.softDeletePost);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN), Post_controllers_1.PostControllers.hardDeletePost);
exports.PostRoutes = router;
