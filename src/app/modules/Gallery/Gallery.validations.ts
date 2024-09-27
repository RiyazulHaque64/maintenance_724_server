import { z } from "zod";

const addImagesValidationSchema = z.object({
  serviceId: z.string({ required_error: "Service is required" }),
});

const updateImagesValidationSchema = z.object({
  serviceId: z.string({ required_error: "Service is required" }).optional(),
});

export const GalleryValidations = {
  addImagesValidationSchema,
  updateImagesValidationSchema,
};
