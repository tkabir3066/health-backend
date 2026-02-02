import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";
import { validateRequest } from "../../middlewares/validateRequset";
import { AdminController } from "./admin.controller";
import { AdminValidationSchemas } from "./admin.validation";

const router = Router();

router.get("/", auth(UserRole.ADMIN), AdminController.getAllAdminsFromDB);

router.get("/:id", auth(UserRole.ADMIN), AdminController.getByIdFromDB);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(AdminValidationSchemas.update),
  AdminController.updateIntoDB,
);

router.delete("/:id", auth(UserRole.ADMIN), AdminController.deleteFromDB);

router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN),
  AdminController.softDeleteFromDB,
);

export const AdminRoutes = router;
