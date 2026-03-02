/*
  Warnings:

  - The values [approved,declined] on the enum `applications_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `applications` MODIFY `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
