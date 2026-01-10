import type { Request } from "express";
import { FileUploader } from "../../helper/fileUploader";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { prisma } from "../../../lib/prisma";

const createPatient = async (req: Request) => {
  if (req.file) {
    // Process the uploaded file if needed
    const uploadedResult = await FileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }
  console.log(req.body.patient);

  const hashedPassword = await bcryptjs.hash(
    req.body.password,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

export const UserService = {
  createPatient,
};
