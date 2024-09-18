import { UserRole } from "@prisma/client";
import { Router } from "express";
import httpStatus from "http-status";
import ApiError from "../../error/ApiError";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../utils/fileUploader";
import { ServiceControllers } from "./Services.controller";
import { ServiceValidations } from "./Services.validation";

const router = Router();

router.get("/", ServiceControllers.getServices);
router.get("/:id", ServiceControllers.getSingleService);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.singleUpload.single("file"),
  (req, res, next) => {
    req.body = ServiceValidations.createServiceValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  ServiceControllers.createService
);
router.patch(
  "/update/:id",
  auth(UserRole.SUPER_ADMIN),
  fileUploader.singleUpload.single("file"),
  (req, res, next) => {
    if (!req.body?.data) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No data found to update");
    }
    req.body = ServiceValidations.updateServiceValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  ServiceControllers.updateService
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  ServiceControllers.hardDeleteService
);

export const ServiceRoutes = router;
