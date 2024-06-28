import { z } from "zod";

const resetPasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z.string({ required_error: "New password is required" }),
  }),
});

export const AuthValidations = {
  resetPasswordValidationSchema,
};
