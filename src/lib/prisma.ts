import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { envVars } from "../app/config/env.js";

const prisma = new PrismaClient({
  accelerateUrl: envVars.DATABASE_URL,
}).$extends(withAccelerate());

export { prisma };
