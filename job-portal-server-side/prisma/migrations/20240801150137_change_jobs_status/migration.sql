/*
  Warnings:

  - The values [expired] on the enum `jobs_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `jobs` MODIFY `status` ENUM('active', 'draft') NOT NULL DEFAULT 'draft';
