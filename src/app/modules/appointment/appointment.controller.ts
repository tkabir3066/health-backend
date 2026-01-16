import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppointmentService } from "./appointment.service";
import type { IJwtPayload } from "../../types/common";

const createAppointment = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJwtPayload,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment created successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
};
