import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { fileUploader } from "../../utils/fileUploader";
import { GalleryControllers } from "./Gallery.controllers";
import { GalleryValidations } from "./Gallery.validations";

const router = Router();

router.get("/", GalleryControllers.getImages);
router.get("/:id", GalleryControllers.getSingleImage);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.multipleUpload,
  (req, res, next) => {
    req.body = GalleryValidations.postImagesValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  GalleryControllers.postImages
);
router.delete(
  "/",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(GalleryValidations.deleteImagesValidationSchema),
  GalleryControllers.hardDeleteImages
);

export const GalleryRoutes = router;
