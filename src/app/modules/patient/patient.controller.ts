import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { PatientService } from "./patient.service";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { patientFilterableFields } from "./patient.constant";
import type { IJwtPayload } from "../../types/common";

const getAllPatients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await PatientService.getAllPatients(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Patients retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);
const getPatientById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await PatientService.getPatientById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient retrieved successfully",
      data: result,
    });
  },
);
const softDelete = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await PatientService.softDelete(id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient soft deleted successfully",
      data: result,
    });
  },
);
const updateIntoDB = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await PatientService.updateIntoDB(
      user as IJwtPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Patient updated successfully",
      data: result,
    });
  },
);

export const PatientController = {
  getAllPatients,
  getPatientById,
  softDelete,
  updateIntoDB,
};
