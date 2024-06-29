"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    super_admin_name: process.env.SUPER_ADMIN_NAME,
    super_admin_user_name: process.env.SUPER_ADMIN_USER_NAME,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    salt_rounds: process.env.SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expiresin: process.env.JWT_ACCESS_EXPIRESIN,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
