/*
  Warnings:

  - You are about to drop the column `position_level` on the `jobs` table. All the data in the column will be lost.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `jobs` DROP COLUMN `position_level`;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
