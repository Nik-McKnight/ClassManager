-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "course_number" VARCHAR(255) NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "ta_id" INTEGER NOT NULL,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "credit_hours" INTEGER NOT NULL DEFAULT 1,
    "start_time" TIME,
    "end_time" TIME,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "capacity" INTEGER NOT NULL,
    "enrollment_open" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseUser" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_instructor" BOOLEAN NOT NULL DEFAULT false,
    "is_ta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CourseUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prerequisite" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "prereq_id" INTEGER NOT NULL,

    CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "preferred_name" VARCHAR(255) NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_instructor_id_key" ON "Course"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_student_id_key" ON "Course"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_ta_id_key" ON "Course"("ta_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_student_id_key" ON "Assignment"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_course_id_key" ON "Assignment"("course_id");

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_prereq_id_fkey" FOREIGN KEY ("prereq_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
