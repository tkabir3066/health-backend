import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  AuthController.changePassword,
);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

router.get("/me", AuthController.getMe);
export const AuthRoutes = router;
