/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[job_seeker_detail_id,language_name]` on the table `languages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `languages_job_seeker_detail_id_language_name_key` ON `languages`(`job_seeker_detail_id`, `language_name`);
