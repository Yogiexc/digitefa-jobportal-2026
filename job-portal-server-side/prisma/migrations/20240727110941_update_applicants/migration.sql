/*
  Warnings:

  - You are about to drop the `job_questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resume_url` to the `applicants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `job_questions` DROP FOREIGN KEY `job_questions_job_id_fkey`;

-- AlterTable
ALTER TABLE `applicants` ADD COLUMN `expected_salary` INTEGER NULL,
    ADD COLUMN `resume_url` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- DropTable
DROP TABLE `job_questions`;
