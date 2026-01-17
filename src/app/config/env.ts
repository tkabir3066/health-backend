import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUNDS: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  JWT: {
    ACCESS_TOKEN_SECRETS: string;
    ACCESS_TOKEN_EXPIRES: string;
    REFRESH_TOKEN_SECRETS: string;
    REFRESH_TOKEN_EXPIRES: string;
  };
  OPENROUTER_API_KEY: string;
  STRIPE_SECRET_KEY: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUNDS",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "ACCESS_TOKEN_SECRETS",
    "ACCESS_TOKEN_EXPIRES",
    "REFRESH_TOKEN_SECRETS",
    "REFRESH_TOKEN_EXPIRES",
    "OPENROUTER_API_KEY",
    "STRIPE_SECRET_KEY",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    DATABASE_URL: process.env.DATABASE_URL as string,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    JWT: {
      ACCESS_TOKEN_SECRETS: process.env.ACCESS_TOKEN_SECRETS as string,
      ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES as string,
      REFRESH_TOKEN_SECRETS: process.env.REFRESH_TOKEN_SECRETS as string,
      REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES as string,
    },
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  };
};
export const envVars = loadEnvVariables();
