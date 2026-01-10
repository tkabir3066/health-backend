import type { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { JwtHelper } from "../helper/jwtHelper";
import type { JwtPayload } from "jsonwebtoken";

export const auth =
  (...roles: string[]) =>
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new Error("You are not Authorized!");
      }

      const verifiedUser = JwtHelper.verifyToken(
        token,
        envVars.JWT.ACCESS_TOKEN_SECRETS
      ) as JwtPayload;

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not Authorized");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
