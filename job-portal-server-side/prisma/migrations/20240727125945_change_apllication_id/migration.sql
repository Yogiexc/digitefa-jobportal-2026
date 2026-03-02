/*
  Warnings:

  - The primary key for the `applications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `applicant_id` on the `applications` table. All the data in the column will be lost.
  - The required column `application_id` was added to the `applications` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `applications` DROP PRIMARY KEY,
    DROP COLUMN `applicant_id`,
    ADD COLUMN `application_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`application_id`);
