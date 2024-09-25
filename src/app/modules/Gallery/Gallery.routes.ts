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
    req.body = GalleryValidations.addImagesValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  GalleryControllers.postImages
);
router.patch(
  "/update/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(GalleryValidations.updateImagesValidationSchema),
  GalleryControllers.updateImage
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  GalleryControllers.hardDeleteImages
);

export const GalleryRoutes = router;
