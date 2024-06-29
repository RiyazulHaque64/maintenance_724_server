"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidations = void 0;
const zod_1 = require("zod");
const createPostValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: "Post title must be required" }),
    content: zod_1.z.string({ required_error: "Post content must be required" }),
});
const updatePostValidationSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    published: zod_1.z
        .boolean({ invalid_type_error: "Published value must be true or false" })
        .optional(),
});
exports.PostValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
