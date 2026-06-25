/*
  Warnings:

  - You are about to drop the column `skills_category` on the `jobs` table. All the data in the column will be lost.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `skills_category_id` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `skills_category`,
    ADD COLUMN `skills_category_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_skills_category_id_fkey` FOREIGN KEY (`skills_category_id`) REFERENCES `skills_category`(`skill_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
