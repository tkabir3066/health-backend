import { UserStatus } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import bcryptjs from "bcryptjs";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { envVars } from "../../config/env";

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

  const accessToken = jwt.sign(jwtPayload, envVars.JWT.ACCESS_TOKEN_SECRETS, {
    expiresIn: envVars.JWT.ACCESS_TOKEN_EXPIRES,
  } as SignOptions);
  const refreshToken = jwt.sign(jwtPayload, envVars.JWT.REFRESH_TOKEN_SECRETS, {
    expiresIn: envVars.JWT.REFRESH_TOKEN_EXPIRES,
  } as SignOptions);

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
