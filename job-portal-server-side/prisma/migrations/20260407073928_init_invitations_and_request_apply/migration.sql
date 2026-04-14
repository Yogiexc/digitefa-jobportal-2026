/*
  Warnings:

  - The values [screening,interviewing] on the enum `applications_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `invitations` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(12))`.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `applications` MODIFY `status` ENUM('pending', 'accepted', 'rejected', 'waiting interview') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `invitations` ADD COLUMN `interview_dates` DATETIME(3) NULL,
    MODIFY `status` ENUM('accepted', 'rejected', 'waiting interview') NOT NULL DEFAULT 'waiting interview';

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- CreateTable
CREATE TABLE `request_apply` (
    `request_apply_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `status` ENUM('not applied', 'applied') NOT NULL DEFAULT 'not applied',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `request_apply_job_id_job_seeker_id_key`(`job_id`, `job_seeker_id`),
    PRIMARY KEY (`request_apply_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `request_apply` ADD CONSTRAINT `request_apply_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_apply` ADD CONSTRAINT `request_apply_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE CASCADE ON UPDATE CASCADE;
