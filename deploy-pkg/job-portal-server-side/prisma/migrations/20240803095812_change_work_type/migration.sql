/*
  Warnings:

  - The values [full_time,freelance,internship] on the enum `jobs_work_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `jobs` MODIFY `work_type` ENUM('on_site', 'remote', 'hybrid') NOT NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
