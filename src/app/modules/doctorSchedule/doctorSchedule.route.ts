import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { validateRequest } from "../../middlewares/validateRequset";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.PATIENT),
  DoctorScheduleController.getAllDoctorSchedulesFromDB,
);
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule,
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema,
  ),
  DoctorScheduleController.createDoctorSchedule,
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB,
);

export const DoctorScheduleRoutes = router;
