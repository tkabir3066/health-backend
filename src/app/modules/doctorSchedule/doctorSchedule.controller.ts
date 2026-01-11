import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DoctorScheduleService } from "./doctorSchedule.service";
import type { IJwtPayload } from "../../types/common";

const createDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await DoctorScheduleService.createDoctorSchedule(
      user as IJwtPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  createDoctorSchedule,
};
