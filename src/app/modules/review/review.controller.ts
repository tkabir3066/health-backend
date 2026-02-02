import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../../types/common";
import { ReviewService } from "./review.service";
import pick from "../../helper/pick";
import { reviewFilterableFields } from "./review.constant";

const createReview = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user;
    const result = await ReviewService.createReview(
      user as IJwtPayload,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Review created successfully",
      data: result,
    });
  },
);
const getAllReviewFromDB = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await ReviewService.getAllReviewFromDB(filters, options);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Reviews retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

export const ReviewController = {
  createReview,
  getAllReviewFromDB,
};
