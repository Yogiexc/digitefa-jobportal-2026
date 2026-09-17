/*
  Warnings:

  - You are about to alter the column `phone_number` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `phone_number` on the `personal_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `phone_number` on the `university_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - Made the column `minimum_salary` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maximum_salary` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `applicants` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `companies` MODIFY `phone_number` VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE `jobs` MODIFY `description` TEXT NOT NULL,
    MODIFY `minimum_salary` BIGINT NOT NULL,
    MODIFY `maximum_salary` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `personal_info` MODIFY `phone_number` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `university_details` MODIFY `phone_number` VARCHAR(15) NULL;
