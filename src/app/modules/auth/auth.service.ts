import { UserStatus } from "../../../../generated/prisma";
import { prisma } from "../../../lib/prisma";
import bcryptjs from "bcryptjs";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import {
  createNewAccessTokenWithAccessToken,
  createUserTokens,
} from "../../helper/userTokens";
import { envVars } from "../../config/env";
import { JwtHelper } from "../../helper/jwtHelper";
import type { Secret } from "jsonwebtoken";
import { sendEmail } from "./emailSender";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(StatusCodes.FORBIDDEN, `User is ${user.status}`);
  }

  const isPasswordCorrect = await bcryptjs.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid credentials");
  }

  const userTokens = createUserTokens(user);

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithAccessToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcryptjs.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = JwtHelper.generateToken(
    { email: userData.email, role: userData.role },
    envVars.JWT.RESET_PASSWORD_TOKEN_SECRET as Secret,
    envVars.JWT.RESET_PASSWORD_TOKEN_EXPIRE_IN as string,
  );
  const resetPassLink = `${envVars.FRONTEND_URL}/reset-password?id=${userData.id}&token=${resetPassToken}`;

  sendEmail({
    to: userData.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: userData.email,
      resetPassLink,
    },
  });
};
const resetPassword = async (
  token: string,
  payload: { id: string; password: string },
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = JwtHelper.verifyToken(
    token,
    envVars.JWT.RESET_PASSWORD_TOKEN_SECRET as Secret,
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcryptjs.hash(
    payload.password,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

const getMe = async (session: any) => {
  const accessToken = session.accessToken;
  const decodedData = JwtHelper.verifyToken(
    accessToken,
    envVars.JWT.ACCESS_TOKEN_SECRETS as Secret,
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const { id, email, role, needPasswordChange, status } = userData;

  return {
    id,
    email,
    role,
    needPasswordChange,
    status,
  };
};
export const AuthService = {
  login,
  getNewAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};
