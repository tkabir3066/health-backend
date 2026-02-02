import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DoctorScheduleService } from "./doctorSchedule.service";
import type { IJwtPayload } from "../../types/common";
import pick from "../../helper/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

const createDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await DoctorScheduleService.createDoctorSchedule(
      user as IJwtPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor schedule created successfully",
      data: result,
    });
  },
);
const getAllDoctorSchedulesFromDB = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await DoctorScheduleService.getAllDoctorSchedulesFromDB(
      filters,
      options,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor schedules retrieved successfully",
      data: result,
    });
  },
);
const getMySchedule = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(
      filters,
      options,
      user as IJwtPayload,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "My schedule retrieved successfully",
      data: result,
    });
  },
);
const deleteDoctorScheduleFromDB = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteDoctorSchedulesFromDB(
      user as IJwtPayload,
      id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "My schedule Deleted successfully",
      data: result,
    });
  },
);

export const DoctorScheduleController = {
  createDoctorSchedule,
  getAllDoctorSchedulesFromDB,
  getMySchedule,
  deleteDoctorScheduleFromDB,
};
