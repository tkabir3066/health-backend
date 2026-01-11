import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get(
  "/",
  auth(UserRole.DOCTOR, UserRole.ADMIN),
  ScheduleController.schedulesForDoctor
);
router.post("/", ScheduleController.createSchedule);
router.delete("/:id", ScheduleController.deleteScheduleFromDB);
export const ScheduleRoutes = router;
