/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `applications` MODIFY `status` ENUM('pending', 'accepted', 'rejected', 'waiting interview', 'interviewing') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
