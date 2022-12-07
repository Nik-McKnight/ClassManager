/*
  Warnings:

  - You are about to drop the column `course_id` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[course_user_id]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_user_id` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_course_id_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_student_id_fkey";

-- DropIndex
DROP INDEX "Assignment_course_id_key";

-- DropIndex
DROP INDEX "Assignment_student_id_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "course_id",
DROP COLUMN "student_id",
ADD COLUMN     "course_user_id" INTEGER NOT NULL,
ALTER COLUMN "grade" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CourseUser" ADD COLUMN     "course_grade" INTEGER,
ADD COLUMN     "is_enrolled" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Grade";

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_course_user_id_key" ON "Assignment"("course_user_id");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_id_fkey" FOREIGN KEY ("id") REFERENCES "CourseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
