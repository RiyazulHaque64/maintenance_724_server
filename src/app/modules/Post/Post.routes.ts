import { UserRole } from "@prisma/client";
import { Router } from "express";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { PostControllers } from "./Post.controllers";
import { PostValidations } from "./Post.validations";

const router = Router();

router.get("/", PostControllers.getPosts);
router.get("/:id", PostControllers.getSinglePost);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.singleUpload.single("file"),
  (req, res, next) => {
    if (!req.body?.data) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Post title and content must be required"
      );
    }
    req.body = PostValidations.createPostValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  PostControllers.createPost
);
router.patch(
  "/update/:id",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.singleUpload.single("file"),
  (req, res, next) => {
    if (!req.body?.data) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No data found to update");
    }
    req.body = PostValidations.updatePostValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  PostControllers.updatePost
);
router.delete(
  "/soft-delete/:id",
  auth(UserRole.SUPER_ADMIN),
  PostControllers.softDeletePost
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  PostControllers.hardDeletePost
);

export const PostRoutes = router;
