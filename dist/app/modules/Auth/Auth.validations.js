"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: "Old password is required" }),
        newPassword: zod_1.z.string({ required_error: "New password is required" }),
    }),
});
exports.AuthValidations = {
    resetPasswordValidationSchema,
};
