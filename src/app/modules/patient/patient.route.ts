import { Router } from "express";
import { PatientController } from "./patient.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get("/", PatientController.getAllPatients);

router.get("/:id", PatientController.getPatientById);
router.patch("/", auth(UserRole.PATIENT), PatientController.updateIntoDB);

router.delete("/soft/:id", PatientController.softDelete);

export const PatientRoutes = router;
