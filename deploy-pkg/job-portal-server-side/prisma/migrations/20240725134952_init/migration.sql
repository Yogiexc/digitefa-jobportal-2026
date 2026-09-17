-- CreateTable
CREATE TABLE `job_seekers` (
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_seekers_email_key`(`email`),
    PRIMARY KEY (`job_seeker_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_seeker_details` (
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `profile_picture_url` VARCHAR(191) NULL,
    `cv_url` VARCHAR(191) NULL,
    `personal_summary` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `job_seeker_details_job_seeker_id_key`(`job_seeker_id`),
    PRIMARY KEY (`job_seeker_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_info` (
    `personal_info_id` VARCHAR(191) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `personal_info_job_seeker_detail_id_key`(`job_seeker_detail_id`),
    PRIMARY KEY (`personal_info_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education` (
    `education_id` VARCHAR(191) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `university_id` VARCHAR(191) NULL,
    `university_name` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `education_job_seeker_detail_id_key`(`job_seeker_detail_id`),
    PRIMARY KEY (`education_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiences` (
    `experience_id` VARCHAR(191) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `experience_title` VARCHAR(191) NOT NULL,
    `employment_type` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `location_type` VARCHAR(191) NULL,
    `description` VARCHAR(255) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`experience_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `languages` (
    `language_id` VARCHAR(191) NOT NULL,
    `language_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NULL,

    UNIQUE INDEX `languages_language_name_key`(`language_name`),
    PRIMARY KEY (`language_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `skill_id` VARCHAR(191) NOT NULL,
    `skill_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NULL,

    UNIQUE INDEX `skills_skill_name_key`(`skill_name`),
    PRIMARY KEY (`skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills_category` (
    `skill_category_id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `skills_category_category_name_key`(`category_name`),
    PRIMARY KEY (`skill_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `project_id` VARCHAR(191) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `project_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(255) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certifications` (
    `certification_id` VARCHAR(191) NOT NULL,
    `job_seeker_detail_id` VARCHAR(191) NOT NULL,
    `certification_name` VARCHAR(191) NOT NULL,
    `issuing_organization` VARCHAR(191) NULL,
    `issue_date` DATETIME(3) NULL,
    `expiration_date` DATETIME(3) NULL,
    `credential_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`certification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approval` (
    `approval_id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NULL,
    `university_id` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `approval_company_id_key`(`company_id`),
    UNIQUE INDEX `approval_university_id_key`(`university_id`),
    PRIMARY KEY (`approval_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companies` (
    `company_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `status` ENUM('not_submitted', 'submitted', 'accepted', 'rejected') NOT NULL DEFAULT 'not_submitted',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `companies_email_key`(`email`),
    PRIMARY KEY (`company_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_details` (
    `company_detail_id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `legal_name` VARCHAR(191) NULL,
    `market_name` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `company_size` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `full_address` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `facebook_url` VARCHAR(191) NULL,
    `twitter_url` VARCHAR(191) NULL,
    `instagram_url` VARCHAR(191) NULL,
    `youtube_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `company_details_company_id_key`(`company_id`),
    PRIMARY KEY (`company_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `position_levels` (
    `position_level_id` VARCHAR(191) NOT NULL,
    `position_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `position_levels_position_name_key`(`position_name`),
    PRIMARY KEY (`position_level_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `job_id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `employment_type` VARCHAR(191) NOT NULL,
    `position_level` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `salary_type` ENUM('monthly_based', 'project_based') NOT NULL,
    `minimum_salary` INTEGER NULL,
    `maximum_salary` INTEGER NULL,
    `education_requirement` VARCHAR(191) NULL,
    `experience_requirement` VARCHAR(191) NULL,
    `status` ENUM('active', 'expired', 'draft') NOT NULL DEFAULT 'draft',
    `published_at` DATETIME(3) NULL,
    `expired_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_benefits` (
    `job_benefit_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `benefit` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`job_benefit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills_requirement` (
    `skill_requirement_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `skill` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`skill_requirement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicants` (
    `applicant_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`applicant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `universities` (
    `university_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `otpExpires` DATETIME(3) NULL,
    `verified` ENUM('true', 'false') NOT NULL DEFAULT 'false',
    `status` ENUM('not_submitted', 'submitted', 'accepted', 'rejected') NOT NULL DEFAULT 'not_submitted',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `universities_email_key`(`email`),
    PRIMARY KEY (`university_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_details` (
    `university_detail_id` VARCHAR(191) NOT NULL,
    `university_id` VARCHAR(191) NOT NULL,
    `university_name` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `full_address` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `facebook_url` VARCHAR(191) NULL,
    `twitter_url` VARCHAR(191) NULL,
    `instagram_url` VARCHAR(191) NULL,
    `youtube_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `university_details_university_id_key`(`university_id`),
    UNIQUE INDEX `university_details_university_name_key`(`university_name`),
    PRIMARY KEY (`university_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `admin_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_jobs` (
    `saved_job_id` VARCHAR(191) NOT NULL,
    `job_seeker_id` VARCHAR(191) NOT NULL,
    `job_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `saved_jobs_job_id_job_seeker_id_key`(`job_id`, `job_seeker_id`),
    PRIMARY KEY (`saved_job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_activities` (
    `log_activity_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `user_role` VARCHAR(191) NOT NULL,
    `activity` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`log_activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `job_seeker_details` ADD CONSTRAINT `job_seeker_details_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personal_info` ADD CONSTRAINT `personal_info_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `education` ADD CONSTRAINT `education_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `education` ADD CONSTRAINT `education_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`university_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `experiences` ADD CONSTRAINT `experiences_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `languages` ADD CONSTRAINT `languages_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills` ADD CONSTRAINT `skills_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certifications` ADD CONSTRAINT `certifications_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details`(`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approval` ADD CONSTRAINT `approval_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `approval` ADD CONSTRAINT `approval_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`university_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_details` ADD CONSTRAINT `company_details_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_benefits` ADD CONSTRAINT `job_benefits_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills_requirement` ADD CONSTRAINT `skills_requirement_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `university_details` ADD CONSTRAINT `university_details_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`university_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_jobs` ADD CONSTRAINT `saved_jobs_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers`(`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_jobs` ADD CONSTRAINT `saved_jobs_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
