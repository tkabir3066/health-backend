import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create-patient", UserController.createPatient);

export const UserRoutes = router;
