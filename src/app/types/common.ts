import type { UserRole } from "../../../generated/prisma";

export interface IJwtPayload {
  email: string;
  role: UserRole;
}
