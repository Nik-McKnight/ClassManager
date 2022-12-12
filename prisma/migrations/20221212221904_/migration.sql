/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CourseUser" ALTER COLUMN "course_grade" SET DEFAULT 100,
ALTER COLUMN "is_enrolled" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");
