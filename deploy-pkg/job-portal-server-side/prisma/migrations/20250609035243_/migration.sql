/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- CreateTable
CREATE TABLE `match_scores` (
    `match_score_id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `overall` INTEGER NULL,
    `summary` INTEGER NULL,
    `skills` INTEGER NULL,
    `experience` INTEGER NULL,
    `education` INTEGER NULL,
    `certifications` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`match_score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `match_scores` ADD CONSTRAINT `match_scores_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications`(`application_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
