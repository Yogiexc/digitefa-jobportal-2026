/*
  Warnings:

  - You are about to drop the `applicants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `applicants` DROP FOREIGN KEY `applicants_job_id_fkey`;

-- DropForeignKey
ALTER TABLE `applicants` DROP FOREIGN KEY `applicants_job_seeker_id_fkey`;

-- DropTable
DROP TABLE `applicants`;

-- CreateTable
CREATE TABLE `applications` (
    `applicant_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    `resume_url` VARCHAR(191) NOT NULL,
    `expected_salary` BIGINT NULL,
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`applicant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
