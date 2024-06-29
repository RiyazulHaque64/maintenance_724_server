import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/Auth.routes";
import { GalleryRoutes } from "../modules/Gallery/Gallery.routes";
import { PostRoutes } from "../modules/Post/Post.routes";
import { ServiceRoutes } from "../modules/Services/Services.routes";

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
  {
    path: "/service",
    route: ServiceRoutes,
  },
  {
    path: "/gallery",
    route: GalleryRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
