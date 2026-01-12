import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../generated/prisma";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key error";
      error = err.meta;
      statusCode = StatusCodes.CONFLICT;
    }
    if (err.code === "1000") {
      message = "Authentication failed against database server";
      error = err.meta;
      statusCode = StatusCodes.BAD_GATEWAY;
    }
    if (err.code === "2003") {
      message = "Foreign key constraint failed on";
      error = err.meta;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
    statusCode = StatusCodes.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "Unknown prisma error required";
    error = err.message;
    statusCode = StatusCodes.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = "Prisma Client failed to initialized!";
    error = err.message;
    statusCode = StatusCodes.BAD_REQUEST;
  }
  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
