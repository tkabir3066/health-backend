import { Router } from "express";
import { ReviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.createReview);

export const ReviewRoutes = router;
