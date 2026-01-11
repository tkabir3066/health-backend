import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../helper/pick";
import type { IJwtPayload } from "../../types/common";

//create schedule
const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.createSchedule(req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Schedule created successfully",
      data: result,
    });
  }
);

//get schedules for doctor
const schedulesForDoctor = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]); //pagination, sorting
    const filters = pick(req.query, ["startDateTime", "endDateTime"]); //filtering
    const result = await ScheduleService.schedulesForDoctor(
      user as IJwtPayload,
      filters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedule retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

//delete schedule
const deleteScheduleFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleService.deleteScheduleFromDB(
      req.params.id as string
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedule deleted successfully",
      data: result,
    });
  }
);

export const ScheduleController = {
  createSchedule,
  schedulesForDoctor,
  deleteScheduleFromDB,
};
