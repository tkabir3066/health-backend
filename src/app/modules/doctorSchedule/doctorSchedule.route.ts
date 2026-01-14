import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { validateRequest } from "../../middlewares/validateRequset";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getDoctorSchedule
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema
  ),
  DoctorScheduleController.createDoctorSchedule
);

export const DoctorScheduleRoutes = router;
