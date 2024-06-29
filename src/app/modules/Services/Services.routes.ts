import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
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
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  ServiceControllers.hardDeleteService
);

export const ServiceRoutes = router;
