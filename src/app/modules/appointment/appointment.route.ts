import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  AppointmentController.getAllAppointmentsFromDB,
);
router.get(
  "/my-appointments",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment,
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentController.createAppointment,
);

router.patch(
  "/status/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  AppointmentController.updateAppointmentStatus,
);

export const AppointmentRoutes = router;
