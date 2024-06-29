"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../modules/Auth/Auth.routes");
const Post_routes_1 = require("../modules/Post/Post.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/auth",
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: "/post",
        route: Post_routes_1.PostRoutes,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
