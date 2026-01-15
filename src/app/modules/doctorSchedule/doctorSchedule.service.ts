import { prisma } from "../../../lib/prisma";
import type { IJwtPayload } from "../../types/common";

const createDoctorSchedule = async (
  user: IJwtPayload,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId: scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getDoctorSchedule = async () => {
  const result = await prisma.doctorSchedule.findMany();

  return result;
};
export const DoctorScheduleService = {
  createDoctorSchedule,
  getDoctorSchedule,
};
