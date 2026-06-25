/*
  Warnings:

  - You are about to drop the column `cv_url` on the `job_seeker_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `job_seeker_details` DROP COLUMN `cv_url`;

-- CreateTable
CREATE TABLE `job_questions` (
    `job_question_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`job_question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_questions` ADD CONSTRAINT `job_questions_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
