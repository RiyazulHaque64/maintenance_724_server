import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/Auth.routes";
import { PostRoutes } from "../modules/Post/Post.routes";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
