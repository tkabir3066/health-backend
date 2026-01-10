import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { UserController } from "./user.controller";
import { FileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const router = Router();

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

export const UserRoutes = router;
