/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_email_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_email_fkey";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "doctors";

-- DropTable
DROP TABLE "patients";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";
