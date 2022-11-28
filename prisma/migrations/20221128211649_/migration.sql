-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_semester_id_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "semester_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
