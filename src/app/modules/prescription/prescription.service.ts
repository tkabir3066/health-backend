import { StatusCodes } from "http-status-codes";
import {
  AppointmentStatus,
  PaymentStatus,
  UserRole,
  type Prescription,
} from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";
import type { IJwtPayload } from "../../types/common";
import { PaginationHelper, type IOptions } from "../../helper/paginationHelper";

const createPrescription = async (
  user: IJwtPayload,
  payload: Partial<Prescription>,
) => {
  if (!payload.appointmentId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Appointment ID is required");
  }

  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email))
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This is not your appointment",
      );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpdate: payload.followUpdate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

const patientPrescription = async (user: IJwtPayload, options: IOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user.email,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctor: true,
      patient: true,
      appointment: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user.email,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const PrescriptionService = {
  createPrescription,
  patientPrescription,
};
