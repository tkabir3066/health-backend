import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.login);

export const AuthRoutes = router;
