/*
  Warnings:

  - Made the column `is_admin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "is_admin" SET NOT NULL;
