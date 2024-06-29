import { z } from "zod";

const postImagesValidationSchema = z.object({
  category: z.string({ required_error: "Image category is required" }),
});

const deleteImagesValidationSchema = z.object({
  body: z.object({
    ids: z.array(z.string()),
    cloudinaryIds: z.array(z.string()),
  }),
});

export const GalleryValidations = {
  postImagesValidationSchema,
  deleteImagesValidationSchema,
};
