-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_prereq_id_fkey";

-- AlterTable
ALTER TABLE "Holiday" ALTER COLUMN "semester_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Prerequisite" ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ALTER COLUMN "prereq_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
