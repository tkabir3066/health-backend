import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";

const createPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createPatient(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Patient created successfully",
      data: result,
    });
  }
);

export const UserController = {
  createPatient,
};
