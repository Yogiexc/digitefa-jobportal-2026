/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `applications` MODIFY `status` ENUM('pending', 'screening', 'interviewing', 'accepted', 'rejected') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- CreateTable
CREATE TABLE `interviews` (
    `interview_id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `interview_date` DATETIME(3) NOT NULL,
    `meeting_link` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `interviews_application_id_key`(`application_id`),
    PRIMARY KEY (`interview_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitations` (
    `invitation_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'accepted', 'declined') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `invitations_job_id_job_seeker_id_key`(`job_id`, `job_seeker_id`),
    PRIMARY KEY (`invitation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`application_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;
