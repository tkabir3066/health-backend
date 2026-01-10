import type { Request } from "express";
import { FileUploader } from "../../helper/fileUploader";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { prisma } from "../../../lib/prisma";
import { UserRole } from "../../../../generated/prisma";

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

const createAdmin = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await FileUploader.uploadToCloudinary(req.file);
    req.body.admin.profilePhoto = uploadedResult?.secure_url;
  }
  const hashedPassword = await bcryptjs.hash(
    req.body.password,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await tnx.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createDoctor = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await FileUploader.uploadToCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadedResult?.secure_url;
  }
  const hashedPassword = await bcryptjs.hash(
    req.body.password,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });

    const createdDoctorData = await tnx.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

//get all users

const getAllUsers = async ({
  page,
  limit,
  searchTerm,
  sortBy,
  sortOrder,
  role,
  status,
}: {
  page: number;
  limit: number;
  searchTerm?: any;
  sortBy?: any;
  sortOrder?: any;
  role?: any;
  status?: any;
}) => {
  const pageNumber = page || 1;
  const pageSize = limit || 10;
  const skip = (pageNumber - 1) * pageSize;
  const result = await prisma.user.findMany({
    skip,
    take: pageSize,
    where: {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
      role: role,
      status: status,
    },
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  return result;
};

export const UserService = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUsers,
};
