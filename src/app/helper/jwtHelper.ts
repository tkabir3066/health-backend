import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";

const generateToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  } as SignOptions);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelper = {
  generateToken,
  verifyToken,
};
