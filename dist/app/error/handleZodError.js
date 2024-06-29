"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    const statusCode = 400;
    return {
        statusCode,
        message: "Zod validation error!",
        errorSources,
    };
};
exports.default = handleZodError;
