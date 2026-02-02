import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { UserController } from "./user.controller";
import { FileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma";

const router = Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile,
);

router.post(
  "/create-patient",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createPatient(req, res, next);
  },
);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createAdmin(req, res, next);
  },
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data),
    );

    return UserController.createDoctor(req, res, next);
  },
);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  UserController.changeProfileStatus,
);

router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.updateMyProfile(req, res, next);
  },
);

export const UserRoutes = router;
