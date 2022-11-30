/*
  Warnings:

  - You are about to drop the column `semester_id` on the `Holiday` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_semester_id_fkey";

-- AlterTable
ALTER TABLE "Holiday" DROP COLUMN "semester_id";
