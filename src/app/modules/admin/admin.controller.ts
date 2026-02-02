import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "./admin.service";

const getAllAdminsFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AdminService.getAllAdminsFromDB(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Admins retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);
const getByIdFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.getByIdFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin data retrieved successfully",
      data: result,
    });
  },
);
const updateIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.updateIntoDB(id as string, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin data Updated successfully",
      data: result,
    });
  },
);
const deleteFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.deleteFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin data deleted!",
      data: result,
    });
  },
);
const softDeleteFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.softDeleteFromDB(id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin data deleted!",
      data: result,
    });
  },
);

export const AdminController = {
  getAllAdminsFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
