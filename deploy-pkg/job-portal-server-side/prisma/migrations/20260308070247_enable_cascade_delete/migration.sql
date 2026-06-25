/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `applications` DROP FOREIGN KEY `applications_job_seeker_id_fkey`;

-- DropForeignKey
ALTER TABLE `certifications` DROP FOREIGN KEY `certifications_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `education` DROP FOREIGN KEY `education_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `experiences` DROP FOREIGN KEY `experiences_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `job_seeker_details` DROP FOREIGN KEY `job_seeker_details_job_seeker_id_fkey`;

-- DropForeignKey
ALTER TABLE `languages` DROP FOREIGN KEY `languages_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `match_scores` DROP FOREIGN KEY `match_scores_application_id_fkey`;

-- DropForeignKey
ALTER TABLE `personal_info` DROP FOREIGN KEY `personal_info_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_job_seeker_detail_id_fkey`;

-- DropForeignKey
ALTER TABLE `saved_jobs` DROP FOREIGN KEY `saved_jobs_job_seeker_id_fkey`;

-- DropForeignKey
ALTER TABLE `skills` DROP FOREIGN KEY `skills_job_seeker_detail_id_fkey`;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `job_seeker_details` ADD CONSTRAINT `job_seeker_details_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personal_info` ADD CONSTRAINT `personal_info_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `education` ADD CONSTRAINT `education_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `languages` ADD CONSTRAINT `languages_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills` ADD CONSTRAINT `skills_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_scores` ADD CONSTRAINT `match_scores_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`application_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_jobs` ADD CONSTRAINT `saved_jobs_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;
