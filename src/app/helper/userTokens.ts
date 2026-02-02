import type { JwtPayload } from "jsonwebtoken";
import { UserStatus, type User } from "../../../generated/prisma";
import { envVars } from "../config/env";
import { JwtHelper } from "./jwtHelper";
import { prisma } from "../../lib/prisma";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

export const createUserTokens = (user: Partial<User>) => {
  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = JwtHelper.generateToken(
    jwtPayload,
    envVars.JWT.ACCESS_TOKEN_SECRETS,
    envVars.JWT.ACCESS_TOKEN_EXPIRES,
  );

  const refreshToken = JwtHelper.generateToken(
    jwtPayload,
    envVars.JWT.REFRESH_TOKEN_SECRETS,
    envVars.JWT.REFRESH_TOKEN_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithAccessToken = async (
  refreshToken: string,
) => {
  let verifiedRefreshToken: JwtPayload;

  try {
    verifiedRefreshToken = JwtHelper.verifyToken(
      refreshToken,
      envVars.JWT.REFRESH_TOKEN_SECRETS,
    ) as JwtPayload;
  } catch {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: verifiedRefreshToken.email,
    },
  });

  if (user.status === UserStatus.INACTIVE) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `User is ${user.status}`);
  }

  const jwtPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = JwtHelper.generateToken(
    jwtPayload,
    envVars.JWT.ACCESS_TOKEN_SECRETS,
    envVars.JWT.ACCESS_TOKEN_EXPIRES, // ✅ FIXED
  );

  return accessToken;
};
