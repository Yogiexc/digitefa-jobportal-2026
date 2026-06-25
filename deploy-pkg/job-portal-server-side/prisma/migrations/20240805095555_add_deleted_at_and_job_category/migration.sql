/*
  Warnings:

  - You are about to alter the column `category` on the `jobs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `jobs` ADD COLUMN `deleted_at` DATETIME(3) NULL,
    MODIFY `category` ENUM('information_and_communication_technology', 'finance_and_insurance', 'human_resources_and_administration', 'sales_and_marketing', 'healthcare_and_social_assistance', 'education_and_training', 'manufacturing', 'construction', 'arts_entertainment_and_media', 'hospitality_and_tourism', 'transportation_and_logistics', 'public_administration_and_government', 'retail', 'legal', 'science_and_research') NOT NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
