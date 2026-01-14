import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidtaion } from "./specialties.validation";
import { FileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../../generated/prisma";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// Task 1: Retrieve Specialties Data

/**
- Develop an API endpoint to retrieve all specialties data.
- Implement an HTTP GET endpoint returning specialties in JSON format.
- ENDPOINT: /specialties
*/
router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  FileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.inserIntoDB(req, res, next);
  }
);

// Task 2: Delete Specialties Data by ID

/**
- Develop an API endpoint to delete specialties by ID.
- Implement an HTTP DELETE endpoint accepting the specialty ID.
- Delete the specialty from the database and return a success message.
- ENDPOINT: /specialties/:id
*/

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
