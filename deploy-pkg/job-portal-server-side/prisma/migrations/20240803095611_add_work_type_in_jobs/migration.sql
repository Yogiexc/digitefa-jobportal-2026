/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.
  - Added the required column `work_type` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `work_type` ENUM('full_time', 'freelance', 'internship') NOT NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
