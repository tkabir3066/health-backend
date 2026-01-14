import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const inserIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesService.inserIntoDB(req);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Specialties created successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesService.getAllFromDB();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Specialties data fetched successfully",
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteFromDB(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  }
);

export const SpecialtiesController = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
