import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT),
  PrescriptionController.patientPrescription,
);
router.post(
  "/",
  auth(UserRole.DOCTOR),
  PrescriptionController.createPrescription,
);

export const PrescriptionRoutes = router;
