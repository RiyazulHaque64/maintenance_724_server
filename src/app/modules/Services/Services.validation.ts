import { z } from "zod";

const createServiceValidationSchema = z.object({
  title: z.string({ required_error: "Service title must be required" }),
  description: z.string({
    required_error: "Service description must be required",
  }),
});

const updateServiceValidationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
