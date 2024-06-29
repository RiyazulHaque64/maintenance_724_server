import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { fileUploader } from "../../utils/fileUploader";
import { PostControllers } from "./Post.controllers";
import { PostValidations } from "./Post.validations";

const router = Router();

router.get("/", PostControllers.getPost);
router.get("/:id", PostControllers.getSinglePost);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.singleUpload.single("file"),
  (req, res, next) => {
    req.body = PostValidations.createPostValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  PostControllers.createPost
);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(PostValidations.updatePostValidationSchema),
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
