/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `skill_category_id` to the `skills_requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- AlterTable
ALTER TABLE `skills_requirement` ADD COLUMN `skill_category_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `skills_requirement` ADD CONSTRAINT `skills_requirement_skill_category_id_fkey` FOREIGN KEY (`skill_category_id`) REFERENCES `skills_category`(`skill_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
