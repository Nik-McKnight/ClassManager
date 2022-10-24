/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "course_number" VARCHAR(255) NOT NULL,
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
