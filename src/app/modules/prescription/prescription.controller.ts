import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../../types/common";
import { PrescriptionService } from "./prescription.service";
import pick from "../../helper/pick";

const createPrescription = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await PrescriptionService.createPrescription(
      user as IJwtPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Prescription created successfully",
      data: result,
    });
  },
);
const patientPrescription = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PrescriptionService.patientPrescription(
      user as IJwtPayload,
      options,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Prescription fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

export const PrescriptionController = {
  createPrescription,
  patientPrescription,
};
