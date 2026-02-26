/*
  Warnings:

  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[application_id]` on the table `match_scores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `match_scores_application_id_key` ON `match_scores`(`application_id`);
