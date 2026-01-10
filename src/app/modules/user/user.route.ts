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

router.post(
  "/create-patient",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return UserController.createPatient(req, res, next);
  }
);

router.post(
  "/create-admin",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return UserController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );

    return UserController.createDoctor(req, res, next);
  }
);

export const UserRoutes = router;
