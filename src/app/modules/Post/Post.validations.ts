import { z } from "zod";

const createPostValidationSchema = z.object({
  title: z
    .string({ required_error: "Post title must be required" })
    .min(1, { message: "Post title must be required" }),
  content: z
    .string({ required_error: "Post content must be required" })
    .min(1, { message: "Post content must be required" }),
});

const updatePostValidationSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  published: z
    .boolean({ invalid_type_error: "Published value must be true or false" })
    .optional(),
});

export const PostValidations = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
