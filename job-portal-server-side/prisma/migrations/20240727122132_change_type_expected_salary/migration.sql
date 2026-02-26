-- AlterTable
ALTER TABLE `applicants` ALTER COLUMN `updated_at` DROP DEFAULT,
    MODIFY `expected_salary` BIGINT NULL;
