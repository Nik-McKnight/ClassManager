/*
  Warnings:

  - You are about to drop the `Holiday` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Holiday";

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "start_date" VARCHAR(255) NOT NULL,
    "end_date" VARCHAR(255) NOT NULL,
    "is_holiday" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
