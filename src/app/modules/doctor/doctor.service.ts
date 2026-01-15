import { StatusCodes } from "http-status-codes";
import type { Doctor, Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { PaginationHelper, type IOptions } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import type { IDoctorUpdateInput } from "./doctor.interface";
import { openai } from "../../helper/openRouter";
import { extractDoctorInfo } from "../../helper/extractDoctorInfo";

const getAllDoctors = async (filters: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelper.calculatePagination(options);

  const { searchTerm, specialties, ...filterData } = filters;
  const andConditions: Prisma.DoctorWhereInput[] = [];

  // Search term condition
  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // Filter by specialties

  // "" , "medicine", "cardiology" etc
  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }
  // Additional filters
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: { equals: filterData[key] },
    }));
    andConditions.push({ AND: filterConditions });
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
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

const updateDoctor = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  const { specialties, ...doctorData } = payload;

  const result = await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const specialty of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
      const createSpecialtyIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );

      for (const specialty of createSpecialtyIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updatedData = await tnx.doctor.update({
      where: { id: doctorInfo.id },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return updatedData;
  });

  return result;
};

//AI Doctor Sugestions

const getAISuggestions = async (payload: { symptoms: string }) => {
  if (!(payload && payload.symptoms)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Symptoms are required");
  }

  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  console.log("doctors data loaded.......\n");
  const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

  console.log("analyzing......\n");

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (completion.choices[0]) {
    const messageContent = completion.choices[0].message.content;
    if (messageContent) {
      const result = await extractDoctorInfo(messageContent);
      return result;
    }
  }
};
export const DoctorService = {
  getAllDoctors,
  updateDoctor,
  getAISuggestions,
};
