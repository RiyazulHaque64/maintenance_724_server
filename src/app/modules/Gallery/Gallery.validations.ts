import { z } from "zod";

const addImagesValidationSchema = z.object({
  categoryId: z.string({ required_error: "Image category is required" }),
});

const updateImagesValidationSchema = z.object({
  categoryId: z
    .string({ required_error: "Image category is required" })
    .optional(),
});

export const GalleryValidations = {
  addImagesValidationSchema,
  updateImagesValidationSchema,
};
