/*
  Warnings:

  - You are about to drop the column `instructor_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `ta_id` on the `Course` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_instructor_id_key";

-- DropIndex
DROP INDEX "Course_student_id_key";

-- DropIndex
DROP INDEX "Course_ta_id_key";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "due_date" DATE NOT NULL,
ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "is_exam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_quiz" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "instructor_id",
DROP COLUMN "student_id",
DROP COLUMN "ta_id";

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "in_progress" BOOLEAN NOT NULL DEFAULT true,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_student_id_key" ON "Grade"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_course_id_key" ON "Grade"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_assignment_id_key" ON "Grade"("assignment_id");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
