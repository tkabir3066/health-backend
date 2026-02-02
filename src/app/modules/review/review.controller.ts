import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../../types/common";
import { ReviewService } from "./review.service";

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

export const ReviewController = {
  createReview,
};
