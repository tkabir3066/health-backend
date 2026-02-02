import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AppointmentService } from "./appointment.service";
import type { IJwtPayload } from "../../types/common";
import pick from "../../helper/pick";
import { appointmentFilterableFields } from "./appointment.constant";

const createAppointment = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IJwtPayload,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment created successfully",
      data: result,
    });
  },
);
const getMyAppointment = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const filters = pick(req.query, ["status", "paymentStatus"]); ////searching, filtering

    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]); //
    const user = req.user;
    const result = await AppointmentService.getMyAppointment(
      user as IJwtPayload,
      filters,
      options,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment fetched successfully!",
      data: result,
    });
  },
);
const getAllAppointmentsFromDB = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const filters = pick(req.query, appointmentFilterableFields); ////searching, filtering

    const options = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]); //
    const user = req.user;
    const result = await AppointmentService.getAllAppointmentsFromDB(
      user as IJwtPayload,
      filters,
      options,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Appointments fetched successfully!",
      data: result,
    });
  },
);

const updateAppointmentStatus = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await AppointmentService.updateAppointmentStatus(
      id as string,
      status,
      user as IJwtPayload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment updated successfully",
      data: result,
    });
  },
);

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllAppointmentsFromDB,
  updateAppointmentStatus,
};
