"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFoundHandler_1 = __importDefault(require("./app/middlewares/notFoundHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// middleware configuration
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
// test server
app.get("/", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Maintenance server is working fine",
    });
});
// main routes
app.use("/api", routes_1.default);
// handle error
app.use(globalErrorHandler_1.default);
app.use(notFoundHandler_1.default);
exports.default = app;
