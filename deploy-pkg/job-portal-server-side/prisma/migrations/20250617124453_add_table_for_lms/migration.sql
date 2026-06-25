/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `job_seekers` ADD COLUMN `lmsLinkedAt` DATETIME(3) NULL,
    ADD COLUMN `lmsUserId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
