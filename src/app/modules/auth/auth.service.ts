import { UserStatus } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import bcryptjs from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { generateToken } from "../../helper/jwtHelper";

const login = async (payload: { email: string; password: string }) => {
  console.log(payload);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcryptjs.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.ACCESS_TOKEN_SECRETS,
    envVars.JWT.ACCESS_TOKEN_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT.REFRESH_TOKEN_SECRETS,
    envVars.JWT.REFRESH_TOKEN_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
