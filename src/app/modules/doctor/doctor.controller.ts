import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { DoctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, doctorFilterableFields);
    const result = await DoctorService.getAllDoctors(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctors retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await DoctorService.updateDoctor(id as string, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor updated successfully",
      data: result,
    });
  }
);

export const DoctorController = {
  getAllDoctors,
  updateDoctor,
};
