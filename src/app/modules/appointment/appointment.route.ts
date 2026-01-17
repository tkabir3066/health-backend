import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment
);

export const AppointmentRoutes = router;
