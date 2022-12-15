/*
  Warnings:

  - Added the required column `school_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "school_id" VARCHAR(255) NOT NULL;
