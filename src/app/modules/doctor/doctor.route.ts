import express from "express";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

router.get("/", DoctorController.getAllDoctors);
router.patch("/:id", DoctorController.updateDoctor);
export const DoctorRoutes = router;
