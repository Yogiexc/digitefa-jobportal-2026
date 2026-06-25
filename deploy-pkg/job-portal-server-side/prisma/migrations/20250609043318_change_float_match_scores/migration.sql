/*
  Warnings:

  - You are about to alter the column `overall` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `summary` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `skills` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `experience` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `education` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `certifications` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `projects` on the `match_scores` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `event_date` on the `pages` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `match_scores` MODIFY `overall` DOUBLE NULL,
    MODIFY `summary` DOUBLE NULL,
    MODIFY `skills` DOUBLE NULL,
    MODIFY `experience` DOUBLE NULL,
    MODIFY `education` DOUBLE NULL,
    MODIFY `certifications` DOUBLE NULL,
    MODIFY `projects` DOUBLE NULL;

-- AlterTable
ALTER TABLE `pages` MODIFY `event_date` DATETIME NULL;
