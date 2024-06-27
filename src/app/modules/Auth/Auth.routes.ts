import { Router } from "express";
import { AuthControllers } from "./Auth.controllers";

const router = Router();

router.post("/login", AuthControllers.login);

export const AuthRoutes = router;
