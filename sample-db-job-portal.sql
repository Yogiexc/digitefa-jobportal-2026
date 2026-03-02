-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jun 17, 2025 at 01:20 PM
-- Server version: 8.0.40
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `job-portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('superadmin','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `email`, `full_name`, `password`, `role`, `created_at`, `updated_at`) VALUES
('0af29b54-9595-4783-8425-1d64c80a3670', 'superadmin@mail.com', 'Superadmin', '$2a$10$Yw43h3B0JkWKAX3CeFj50uanpELRuJm6D0YDXC6XtlA4Gxn8WxMbG', 'superadmin', '2025-02-05 07:52:06.567', '2025-02-05 07:52:06.567'),
('841be195-3fd8-446e-b3cd-46bca5fa7135', 'admin@mail.com', 'Admin', '$2a$10$ZS7hZo2XUHU1J0/I0ej/OuYRxZuRsipr5lO7YImnIPuln500o47qG', 'admin', '2025-02-05 07:52:06.567', '2025-02-05 07:52:06.567');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `job_seeker_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `resume_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expected_salary` bigint DEFAULT NULL,
  `applied_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `application_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_years` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`job_seeker_id`, `job_id`, `status`, `resume_url`, `expected_salary`, `applied_at`, `updated_at`, `application_id`, `experience_years`) VALUES
('4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', '714aca3f-3d15-4086-8f3f-461529b14812', 'pending', 'public/uploads/resume/resume-1749435923749-805298870.pdf', 123222, '2025-06-09 02:25:23.783', '2025-06-09 02:25:23.783', '0bfbe575-d945-4948-97f1-1e5c301b8834', '2'),
('4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', '790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', 'pending', 'public/uploads/resume/resume-1749919335315-617396050.jpg', 1, '2025-06-14 16:42:15.345', '2025-06-14 16:42:15.345', '0dc51a84-8050-4b9c-b575-9882bed88a3e', '2'),
('4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', 'c43deb87-cb22-48f1-99da-ce578d95dc5c', 'pending', 'public/uploads/resume/resume-1749006609140-355528716.png', 20000, '2025-06-04 03:10:09.158', '2025-06-04 03:10:09.158', '54c739ac-3aa5-4531-990b-cf76a208ae8a', '2'),
('4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', '004ed579-06bd-4c12-ae2e-ba25447d057e', 'pending', 'public/uploads/resume/resume-1749443795748-619063966.png', 1, '2025-06-09 04:36:35.799', '2025-06-09 04:36:35.799', 'c876367b-e1b9-459e-9c7b-1ac8af65050c', '1');

-- --------------------------------------------------------

--
-- Table structure for table `approval`
--

CREATE TABLE `approval` (
  `approval_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `university_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `approval`
--

INSERT INTO `approval` (`approval_id`, `company_id`, `university_id`, `notes`, `created_at`, `updated_at`) VALUES
('0b057bdf-380e-4662-ba44-d23c942a82dd', '78f64755-71d4-45b0-ae6c-3b2160745909', NULL, NULL, '2025-04-29 12:20:02.927', '2025-04-29 12:20:02.927'),
('264f34f0-f9d8-49fb-a126-2d38c52be340', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', NULL, NULL, '2025-05-13 10:35:20.093', '2025-05-13 10:35:20.093'),
('27a3e924-da42-4cdf-bcdd-60924612752a', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', NULL, NULL, '2025-05-25 12:21:44.127', '2025-05-25 12:21:44.127'),
('482e6815-8fe3-4202-b3f5-712e017b535c', '553c7af2-32bd-4c1e-a600-c036a990bfcd', NULL, NULL, '2025-05-13 09:54:22.575', '2025-05-13 09:54:22.575'),
('4967a7aa-9c62-414d-8302-9a28e2d543de', '1db185d9-169e-4747-a037-8790fdf2ae72', NULL, NULL, '2025-05-13 10:58:23.378', '2025-05-13 10:58:23.378'),
('62c02613-d27b-47f3-b664-0eb8e0b085db', '7feedb3a-20b2-4009-a3c1-d421028dbc2b', NULL, NULL, '2025-05-25 12:12:18.180', '2025-05-25 12:12:18.180'),
('75784f1f-cf4f-4438-8685-407e7999354c', '474d3aed-ccad-4465-b97a-efc5e6b27903', NULL, NULL, '2025-04-29 11:14:26.232', '2025-04-29 11:14:26.232'),
('884de6b6-6213-4e24-8e4c-68903cd4abeb', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', NULL, NULL, '2025-04-29 10:41:53.446', '2025-04-29 10:41:53.446'),
('99c5ee64-c3ab-4a98-98b3-36e318f47404', '18407767-ad4d-4d4c-8472-8fc55f6adb1f', NULL, NULL, '2025-05-13 11:37:36.859', '2025-05-13 11:37:36.859'),
('aa7e857e-a4fc-4e63-9ba1-4773d6ad7355', '32c95585-e39c-406a-959a-de30d26f173c', NULL, NULL, '2025-04-29 12:49:58.890', '2025-04-29 12:49:58.890'),
('ba10bfd1-69c1-4576-9f1a-d5f6bf60d43e', '8c57d7ab-76b7-46d6-8dc1-098ac50d9302', NULL, NULL, '2025-04-29 12:30:36.914', '2025-04-29 12:30:36.914'),
('bc9ef6c8-091d-4704-be84-3b6775cb0295', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', NULL, NULL, '2025-04-29 13:24:15.705', '2025-04-29 13:24:15.705'),
('c3f4595d-2ce3-41d5-abec-a9045610be77', '5dc6409f-28bc-486f-a88c-ea95898cc12a', NULL, NULL, '2025-05-25 11:54:36.081', '2025-05-25 11:54:36.081'),
('ee15a076-9867-45f6-90c6-cb3749aae96a', '3d690295-6a69-436f-a9f5-d4d5252d98d5', NULL, NULL, '2025-05-25 12:45:31.181', '2025-05-25 12:45:31.181'),
('f66fb516-3547-42e3-a0e5-9c4844daacee', 'caf32328-7dac-4ab2-ab07-6c8bec5b3944', NULL, NULL, '2025-05-13 10:17:38.499', '2025-05-13 10:17:38.499');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `certification_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certification_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuing_organization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_date` datetime(3) DEFAULT NULL,
  `expiration_date` datetime(3) DEFAULT NULL,
  `credential_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`certification_id`, `job_seeker_detail_id`, `certification_name`, `issuing_organization`, `issue_date`, `expiration_date`, `credential_url`, `created_at`, `updated_at`) VALUES
('31cf2e9f-39f2-43d3-8506-389f83bdc88c', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6', 'Certification 5', 'Organization 5', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610'),
('3d9e763c-d0f4-4aa2-b6ef-b437da8ff6ec', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921', 'Certification 12', 'Organization 12', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811'),
('3ec894da-87b8-44a2-8bf2-2bfc2a11417c', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', 'Certification 4', 'Organization 4', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592'),
('6d93dc77-cab0-42d2-b4eb-1ecf6c6273a5', '1907e6d9-7619-431f-942f-54c4d3070913', 'Certification 9', 'Organization 9', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702'),
('6ec9725e-4c1d-4f95-8745-5b3a6ce29c68', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3', 'Certification 10', 'Organization 10', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741'),
('6fac1e42-4359-4c77-9360-3837d3b9defe', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439', 'Certification 6', 'Organization 6', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627'),
('9989ce66-e4fc-4192-a266-9de5749d02ea', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f', 'Certification 14', 'Organization 14', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850'),
('a8e73b19-7cb5-42b1-bf29-a9ac951d0575', '2cad1612-894b-4115-b476-55d51cd677e7', 'Certification 13', 'Organization 13', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836'),
('bece9ede-6d75-4a37-91a5-86b61f34ee7b', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10', 'Certification 7', 'Organization 7', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670'),
('cd421e3b-f171-4387-b214-bd6b23004047', '235b42a9-1886-4aaa-92cf-762912d697cc', 'Certification 15', 'Organization 15', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864'),
('f02c3046-fc6c-43d6-9648-f996b58fc782', '3cf7fbd0-da22-4834-8d78-c11f0f046017', 'Certification 8', 'Organization 8', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686'),
('f051d44e-de02-4c8f-ada9-33e904e958a1', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02', 'Certification 11', 'Organization 11', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', NULL, '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otpExpires` datetime(3) DEFAULT NULL,
  `verified` enum('true','false') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'false',
  `status` enum('not_submitted','submitted','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_submitted',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `email`, `password`, `full_name`, `phone_number`, `otp`, `otpExpires`, `verified`, `status`, `created_at`, `updated_at`) VALUES
('022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'gelora@company.com', '$2a$10$w/ecItADZi.E0dPG/TV7YOYhfSKLFhOJCERSQk3p9zNw.kdqcyyHq', 'Admin', '085523343232', 'df710e1f7dd04d8c460fe94df7ed35be7da7383452c05a243d13509b9aa74172', '2025-05-25 11:13:29.656', 'true', 'accepted', '2025-05-25 10:58:29.657', '2025-05-25 11:02:59.754'),
('18407767-ad4d-4d4c-8472-8fc55f6adb1f', 'antarestar@mail.com', '$2a$10$PGge2cHvtMJUj6PvqyE9ku4juv0qYMdbSTreUjlp2ZiOSfK6LSzeK', 'Faiz Daffa', '08548294495', '1b7ebb8d6c83588729ebc82301e65e86db02ef9fac59ecfb42e35f8094c445a5', '2025-05-13 11:49:00.787', 'true', 'accepted', '2025-05-13 11:34:00.788', '2025-05-13 11:37:36.842'),
('1db185d9-169e-4747-a037-8790fdf2ae72', 'mandiritechnology@mail.com', '$2a$10$psQLXsko5RiuC94xl4TRpOCKhbuRRWMpJN.z6xGKGTAx7Z.eacaiu', 'Niki Zefanya', '0874675858', 'd9374fd55c21b719916e9c3e7d62e8e38229d0770b8205f57bb35f2a39881694', '2025-05-13 11:09:34.729', 'true', 'accepted', '2025-05-13 10:54:34.730', '2025-05-13 10:58:23.362'),
('32c95585-e39c-406a-959a-de30d26f173c', 'waschen@gmail.com', '$2a$10$l5UlLbqydyi5n8IOiOJDvuHC0K6OIYtcpNdMfWTUlnROJoMlugYh2', 'Rangga Galih', '0836468573', '20c4373a54558e54a5a8d0d6146d1ee0f2305a0c5123a65f4d7cda0c2b8a0972', '2025-04-29 13:00:26.398', 'true', 'accepted', '2025-04-29 12:45:26.398', '2025-04-29 12:49:58.876'),
('36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'company@gojek.com', '$2a$10$q0DydSyMbmDb9Cuftyo6DOtw6XLkr85BYNCvZPsgS47/EbXOIIWWm', 'PT Aplikasi Karya Anak Bangsa', '021-5055-8500', NULL, NULL, 'true', 'accepted', '2025-02-17 13:24:40.969', '2025-02-17 13:24:40.969'),
('382ac7fc-771a-4d07-8dd8-c2aa1fae7e68', 'company13@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 13', '01234567813', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.506', '2025-02-05 07:52:06.506'),
('3d690295-6a69-436f-a9f5-d4d5252d98d5', 'astrainsurance@gmail.com', '$2a$10$DCXuh5XGG/EV0LbDNix8GuK3PhdwX074SAstRieYjqE2YZ2Ofs5zu', 'Anton ', '08457738382', 'd742ee1f8e8f9946bd77813ded1c799aa64178f69e2780c682a2f93678ab4e2a', '2025-05-25 12:57:00.520', 'true', 'accepted', '2025-05-25 12:42:00.521', '2025-05-25 12:45:31.159'),
('3d6afe31-e89b-4164-9026-fc53f1418697', 'company10@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 10', '01234567810', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.435', '2025-02-05 07:52:06.435'),
('474d3aed-ccad-4465-b97a-efc5e6b27903', 'yardzeal@gmail.com', '$2a$10$5hrq3qbxQnpDR1asg0YbQ.vg2Rk0AjZPstFwA.SVWIXKoLS5yJ/he', 'Antana Diva', '0837646483', '11bde34a6593b3da0d81a8a71b24dc6f6cf05d18e9f59e610e58ff202263adef', '2025-04-29 11:21:16.386', 'true', 'accepted', '2025-04-29 11:06:16.387', '2025-04-29 11:14:26.209'),
('553c7af2-32bd-4c1e-a600-c036a990bfcd', 'primatrans@mail.com', '$2a$10$HyCSyRYihqi0N3dZHVl3WOSzNEp.m6y2IN8O6Yrp67sVcmcdWJx1m', 'Muhamad Syafiq', '08474783949', '132f6e904a3cab6c529b30f1d7578e67e9a6f384b88eb4a3de0ceae8adea5370', '2025-05-13 10:03:31.665', 'true', 'accepted', '2025-05-13 09:48:31.666', '2025-05-13 09:54:22.559'),
('5dc6409f-28bc-486f-a88c-ea95898cc12a', 'makmurlestari@gmail.com', '$2a$10$MZ9YuHmufltHx9RkwAqJs.KWnE2DIQfkTUub1./Czz2vBzvWCWqWW', 'Yulia ', '0864834885', '528b0f3da89facc67ed8e768c09172db38862e5133ec94197299ff4b8471f241', '2025-05-25 12:04:29.499', 'true', 'accepted', '2025-05-25 11:49:29.500', '2025-05-25 11:54:36.044'),
('6932648b-ecf2-4bba-b513-ce8243496967', 'company15@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 15', '01234567815', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.554', '2025-02-05 07:52:06.554'),
('71c0ece8-9036-4428-84a6-52099712f67d', 'company12@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 12', '01234567812', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.495', '2025-02-05 07:52:06.495'),
('78f64755-71d4-45b0-ae6c-3b2160745909', 'alfamart@gmail.com', '$2a$10$tz3xQEw9Qq9e.IkqWGWi2.sM8Xy1SC2uTvHaNceMFbGATTC4EwLeC', 'Gustia Syafi', '085802970840', 'b5bba040290ced81acc6deaf343d01e650dc1b0c292154550b74f1c6b563a42a', '2025-04-29 12:30:53.895', 'true', 'accepted', '2025-04-29 12:15:53.896', '2025-04-29 12:20:02.906'),
('7d276c51-2edd-426a-9c8d-39a0b5028e1b', 'company2@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 2', '0123456782', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.226', '2025-02-05 07:52:06.226'),
('7feedb3a-20b2-4009-a3c1-d421028dbc2b', 'mitrapajakku@gmail.com', '$2a$10$M8/iBE.PfmAPFDirImXwGeqL/GinA3d1aXXsYFO1oN5Asb5UUOPMO', 'Fiana', '0874859344', '4567f6e4059f4e6d795b79a102336e253421f7d965ee912fdd3485b3f4a88abd', '2025-05-25 12:23:27.553', 'true', 'accepted', '2025-05-25 12:08:27.554', '2025-05-25 12:12:18.159'),
('8043ebe7-6743-4fcd-8a4f-cc8238872d57', 'company1@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 1', '0123456781', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.187', '2025-02-05 07:52:06.187'),
('882bc7ac-b3ab-413b-bf8d-3a7ae549947e', 'company11@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 11', '01234567811', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.475', '2025-02-05 07:52:06.475'),
('8c57d7ab-76b7-46d6-8dc1-098ac50d9302', 'adisarana@gmail.com', '$2a$10$FjRxLEvXBNaUpx0KFgqF0OyKcNbw3bEaxeLwHYv17ShcmxaMgMin6', 'Muhammad Farel', '0833847593', 'bf163743e96880dc3186b9e050079f9453b29ab0149e12d6e18942ed513ddbee', '2025-04-29 12:43:20.121', 'true', 'accepted', '2025-04-29 12:28:20.122', '2025-04-29 12:30:36.894'),
('8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'orangtuagroup@gmail.com', '$2a$10$oPTeANs0AgV/CmKVUt2UPO1OMJUfpgJ4jRs0bzlFkY9iXe/g3siue', 'Ramadhani', '083784958', 'c6d75a1953366cdcc94191f6ff4db255e467e0c8a532b17484fee1172ee8031f', '2025-05-25 12:33:22.954', 'true', 'accepted', '2025-05-25 12:18:22.955', '2025-05-25 12:21:44.105'),
('8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'zociety@gmail.com', '$2a$10$wjuJOMq6rHh2m9RHFismP.juFCKUGJwwR5kQgtR6KGkqMXL6/t9/a', 'Faturahma', '0874758593', 'e001dad6f306c7ddb4c0662753355f15214ca8f3cfa19f8c215530c3ac7a3764', '2025-04-29 13:35:36.788', 'true', 'accepted', '2025-04-29 13:20:36.788', '2025-04-29 13:24:15.691'),
('950ca71d-f439-43c0-8755-841a944609f9', 'company14@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 14', '01234567814', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.517', '2025-02-05 07:52:06.517'),
('9a72ae25-66b3-4e75-9672-a46f7384cacf', 'company4@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 4', '0123456784', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.251', '2025-02-05 07:52:06.251'),
('adc2478b-9a6c-4527-8d63-5b0b7ffc7d40', 'company7@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 7', '0123456787', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.355', '2025-02-05 07:52:06.355'),
('ba9a7147-8f7e-4b50-abc4-b3571d5498d0', 'company@shopee.com', '$2a$10$q0DydSyMbmDb9Cuftyo6DOtw6XLkr85BYNCvZPsgS47/EbXOIIWWm', 'PT Bukalapak.com', '021-5081-3333', NULL, NULL, 'true', 'accepted', '2025-02-17 13:24:40.982', '2025-02-17 13:24:40.982'),
('caf32328-7dac-4ab2-ab07-6c8bec5b3944', 'jntcargo@mail.com', '$2a$10$xK/kiWB1i9jQztwFW7GcOu7oel57J3v3bEuJJ.Tsjr6Aeh4fa2UqW', 'Tia Tiyul', '08743949596', '47b61a126c54a6b117c3fc4ea2023c6a8637572f30ca97c179279cf607f156d0', '2025-05-13 10:28:51.081', 'true', 'accepted', '2025-05-13 10:13:51.082', '2025-05-13 10:17:38.486'),
('d1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'reemotely@mail.com', '$2a$10$c7XoJffpMaO./C1msNX8je9q6T32KqThFEQQZYG2f.5qSaBFyBKae', 'Noviandhy Noer', '084758593', '0f152670cb49ba15131d115d54f5ebff316d9adfeec7e44c66eb860b343786e1', '2025-05-13 10:47:33.380', 'true', 'accepted', '2025-05-13 10:32:33.381', '2025-05-13 10:35:20.076'),
('d5fc6c5f-4d4e-462c-a362-21c58009b011', 'dexagroup@gmail.com', '$2a$10$DP7QJ44Jiii.YcWaHAx3N.9wZUonVrT/UU/0UdnMB2QIfDmifUa0K', 'Ir. Ferry A. Soetikno, M.Sc., M.B.A.', '0873634858374', 'd9eac2f7abefa88804315c24908d93af18cba575416f3a07f5d13033b73b45e5', '2025-04-29 10:48:38.012', 'true', 'accepted', '2025-04-29 10:33:38.013', '2025-04-29 10:41:53.424'),
('da4b162e-993c-4c5b-a114-54c1d8e7e9af', 'company9@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 9', '0123456789', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.418', '2025-02-05 07:52:06.418'),
('e88102c4-d78c-4ef3-9157-514bfd57e57b', 'company@tokopedia.com', '$2a$10$q0DydSyMbmDb9Cuftyo6DOtw6XLkr85BYNCvZPsgS47/EbXOIIWWm', 'PT Tokopedia', '021-5369-3520', NULL, NULL, 'true', 'accepted', '2025-02-17 13:24:40.994', '2025-02-17 13:24:40.994'),
('eb953065-05e6-4309-ace5-e875cf719a0e', 'company3@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 3', '0123456783', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.239', '2025-02-05 07:52:06.239'),
('f55de564-a9ab-4711-8e9e-3586f07a50b0', 'company5@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 5', '0123456785', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.295', '2025-02-05 07:52:06.295'),
('fa656bbf-9b95-4189-a226-321a0d0192f9', 'company8@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 8', '0123456788', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.370', '2025-02-05 07:52:06.370'),
('fcd5a494-bc18-4b98-97b3-f3e17af79c24', 'solutech@company.com', '$2a$10$MdeiTuGEO0IGUm0cH3LSLeqrn8DTx4vniMhFTxosxRsXD/vv6QQXu', 'Admin', '081213123124', '88f8808ea2ac9ede64a60f39b47e475328b4077d7f811ae209dc269dba024649', '2025-05-25 10:50:39.658', 'true', 'accepted', '2025-05-25 10:35:39.659', '2025-05-25 10:41:16.880'),
('ff63052a-cde8-4c08-ba52-5c1ca9be0ab4', 'company6@mail.com', '$2a$10$.oKiIg0/GE4hkxnRyAB7..LXAIeGRHp487mTJ.WT8.VLDp73f.7i2', 'Company 6', '0123456786', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.311', '2025-02-05 07:52:06.311');

-- --------------------------------------------------------

--
-- Table structure for table `company_details`
--

CREATE TABLE `company_details` (
  `company_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `market_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_size` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_details`
--

INSERT INTO `company_details` (`company_detail_id`, `company_id`, `logo_url`, `legal_name`, `market_name`, `category`, `company_size`, `description`, `country`, `province`, `city`, `district`, `full_address`, `postal_code`, `website`, `facebook_url`, `twitter_url`, `instagram_url`, `youtube_url`, `created_at`, `updated_at`) VALUES
('19d55992-7969-411e-88c6-5f7ef9bfe0bc', 'f55de564-a9ab-4711-8e9e-3586f07a50b0', 'http://example.com/logo5.png', 'PT. Company 5', 'Company 5', 'Technology', '100-500', 'Description 5', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 5', '57126', 'http://example.com/5', 'http://facebook.com/5', 'http://twitter.com/5', 'http://instagram.com/5', 'http://youtube.com/5', '2025-02-05 07:52:06.295', '2025-02-05 07:52:06.295'),
('19fc3a36-f29f-4089-b52e-f1d82e5f3cb9', '882bc7ac-b3ab-413b-bf8d-3a7ae549947e', 'http://example.com/logo11.png', 'PT. Company 11', 'Company 11', 'Technology', '100-500', 'Description 11', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 11', '57126', 'http://example.com/11', 'http://facebook.com/11', 'http://twitter.com/11', 'http://instagram.com/11', 'http://youtube.com/11', '2025-02-05 07:52:06.475', '2025-02-05 07:52:06.475'),
('1ef8fc8c-249e-4e0d-a8d1-a7a607b3fb7a', 'ba9a7147-8f7e-4b50-abc4-b3571d5498d0', 'https://logo.com/bukalapak.png', 'PT Shopee International Indonesia', 'Shopee', 'E-commerce', '1000+', 'Shopee is an Indonesian e-commerce platform.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Kemang', 'Office 88, Kasablanka Tower A', '12870', 'https://www.shopee.co.id', 'https://www.facebook.com/shopee', 'https://twitter.com/shopee', 'https://www.instagram.com/shopee', 'https://www.youtube.com/c/shopee', '2025-02-17 13:24:40.982', '2025-02-17 13:24:40.982'),
('1f643ae4-ecba-4abc-b199-ecc1bdb55827', '7d276c51-2edd-426a-9c8d-39a0b5028e1b', 'http://example.com/logo2.png', 'PT. Company 2', 'Company 2', 'Technology', '100-500', 'Description 2', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 2', '57126', 'http://example.com/2', 'http://facebook.com/2', 'http://twitter.com/2', 'http://instagram.com/2', 'http://youtube.com/2', '2025-02-05 07:52:06.226', '2025-02-05 07:52:06.226'),
('30cae78f-cb43-4b8d-a95e-df245fb9aea3', '8043ebe7-6743-4fcd-8a4f-cc8238872d57', 'http://example.com/logo1.png', 'PT. Company 1', 'Company 1', 'Technology', '100-500', 'Description 1', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 1', '57126', 'http://example.com/1', 'http://facebook.com/1', 'http://twitter.com/1', 'http://instagram.com/1', 'http://youtube.com/1', '2025-02-05 07:52:06.187', '2025-02-05 07:52:06.187'),
('37957fa6-138a-4712-a7d7-c6f8c329cade', '7feedb3a-20b2-4009-a3c1-d421028dbc2b', 'public/uploads/logo/logo-company-1748175113257-866170352.jpeg', 'MItra Pajakku', 'Pajakku', 'Accounting & Auditing', '51-200 employees', 'Pajakku adalah perusahaan resmi mitra Direktorat Jenderal Pajak (DJP) yang telah beroperasi sejak 2005 sebagai Penyedia Jasa Aplikasi Perpajakan (PJAP). Dengan legalitas yang kuat melalui SK KEP No. 20/PJ/2005 dan perpanjangan terbaru SK KEP No. 211/PJ/2022, kami menghadirkan solusi perpajakan terlengkap di Indonesia.\r\nMengusung konsep One Stop Solution in TAXnologies, Pajakku menyediakan layanan pajak end-to-end yang mudah digunakan, aman, cepat, dan nyaman bagi seluruh Wajib Pajak. Dengan pengalaman luas dan teknologi inovatif, kami telah dipercaya sebagai \"Your Tax Partner\", membantu berbagai perusahaan dan individu dalam memenuhi kewajiban perpajakan mereka.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Jalan Kemanggisan Utama', 'Jalan Kemanggisan Utama, Jakarta, DKI Jakarta, Indonesia', '83847', 'https://www.pajakku.com/', 'https://www.pajakku.com/', 'https://www.pajakku.com/', 'https://www.pajakku.com/', 'https://www.pajakku.com/', '2025-05-25 12:08:27.554', '2025-05-25 12:11:53.268'),
('39dafbbc-6d07-4c69-a3e8-c10ea6c85541', '950ca71d-f439-43c0-8755-841a944609f9', 'http://example.com/logo14.png', 'PT. Company 14', 'Company 14', 'Technology', '100-500', 'Description 14', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 14', '57126', 'http://example.com/14', 'http://facebook.com/14', 'http://twitter.com/14', 'http://instagram.com/14', 'http://youtube.com/14', '2025-02-05 07:52:06.517', '2025-02-05 07:52:06.517'),
('3bf1c2fa-920e-4ace-bb30-9d01c62fc573', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'public/uploads/logo/logo-company-1748177086506-708917750.jpeg', 'Astra Insurance', 'Asuransi Astra', 'Insurance', '100-499 employees', 'Asuransi Astra has been serving customers for more than half a century, precisely since September 12, 1956. The company, known for its Garda Oto motor vehicle insurance products, serves customers through a network of services spread across 28 branch offices, as well as service units and Garda Centers that continue developing. In addition to motor vehicle insurance, other products from Asuransi Astra are Garda Medika health insurance, mining industry insurance, agribusiness industry insurance, shop insurance, gas station insurance, sharia insurance, and others.\r\nSince 2015, Asuransi Astra has developed its products and services digitally and introduced Garda Mobile as a collection of mobile applications intended for retail, commercial and general customers. The four Garda Mobile applications namely Otocare, Medcare, HR-access, and CR-access are consistently updated through various innovations aimed at customer convenience and comfort. The latest innovation developed in the Garda Mobile Otocare with the presence of GarXia, the first insurance purchase chatbot in Indonesia that can also help customers in reporting claims and the Garda Mall feature that allows users to shop for a variety of automotive needs, Astra Financial financial products, also to buying and selling cars. Asuransi Astra also has four digital products namely Garda Me, Garda Edu, Garda Home, and Garda Trip which can be purchased easily and quickly through the gardaoto.com site.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Lebak Bulus', 'Graha Asuransi Astra, Lebak Bulus, DKI Jakarta, Indonesia', '76557', 'https://www.asuransiastra.com/', 'https://www.asuransiastra.com/', 'https://www.asuransiastra.com/', 'https://www.asuransiastra.com/', 'https://www.asuransiastra.com/', '2025-05-25 12:42:00.521', '2025-05-25 12:44:46.517'),
('3d26225b-77e1-4740-9707-3d04787579f3', 'ff63052a-cde8-4c08-ba52-5c1ca9be0ab4', 'http://example.com/logo6.png', 'PT. Company 6', 'Company 6', 'Technology', '100-500', 'Description 6', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 6', '57126', 'http://example.com/6', 'http://facebook.com/6', 'http://twitter.com/6', 'http://instagram.com/6', 'http://youtube.com/6', '2025-02-05 07:52:06.311', '2025-02-05 07:52:06.311'),
('3eb2cacd-e14e-40e8-8ebb-af7e266d3f44', 'adc2478b-9a6c-4527-8d63-5b0b7ffc7d40', 'http://example.com/logo7.png', 'PT. Company 7', 'Company 7', 'Technology', '100-500', 'Description 7', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 7', '57126', 'http://example.com/7', 'http://facebook.com/7', 'http://twitter.com/7', 'http://instagram.com/7', 'http://youtube.com/7', '2025-02-05 07:52:06.355', '2025-02-05 07:52:06.355'),
('3f46036f-33e7-4ebb-b5ae-069c459ba77a', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', 'public/uploads/logo/logo-company-1745923218725-683779757.jpg', 'Dexa Group', 'Dexa Group', 'Pharmaceutical', '51-200 employees', 'Dexa Group has evolved from a small company established in 1969 to one of Indonesia’s largest ethical pharmaceutical companies at the beginning of the 21st century and has become a prominent, well-respected player in the domestic pharmaceutical market.\r\n\r\nProviding better health care by applying expertise was the foundation on which its founders built this Company. Honesty, trust, dedication and commitment to providing patients with the highest quality of ethical pharmaceutical products and OTC are preserved as the guiding principles, based upon which the highly professional management team and the motivated, competent staff of Dexa Group have developed the Company in the spirit of mutual respect, teamwork and innovation over more than four decades.\r\n\r\nServing as a good corporate citizen is one of our responsibilities and being a strategic asset of Indonesia is one of our foremost desires. For along time Dexa Group has worked together with governing institutions and the Indonesian Pharmaceutical Association – championing compliance and improving the industry standards', 'Indonesia', 'Banten', 'Tangerang', 'Tangerang Selatan', 'Tangerang Selatan, Indonesia', '55342', 'https://www.dexagroup.com/dexa-medica/', 'https://facebook.com', 'https://twitter/dexa.group.com', 'https://instagram.com', 'https://youtube.com', '2025-04-29 10:33:38.013', '2025-04-29 10:40:18.798'),
('3f485383-4f56-4d99-8e55-08e0617e05a8', '32c95585-e39c-406a-959a-de30d26f173c', 'public/uploads/logo/logo-company-1745930983335-421579642.jpeg', 'Waschen Alora Indonesia', 'Waschen Alora ', 'Retail', '51-200 employees', 'Menjadi penyedia layanan laundry terpercaya dan berkualitas tinggi di Indonesia, dengan fokus pada kebersihan, kenyamanan, dan kepuasan pelanggan.', 'Indonesia', 'Jawa Barat', 'Depok', 'Depok', 'Depok, Jawa Barat, Indonesia', '73848', 'https://waschenalora.com', 'https://waschenalora.com', 'https://waschenalora.com', 'https://waschenalora.com', 'https://waschenalora.com', '2025-04-29 12:45:26.398', '2025-04-29 12:49:43.342'),
('43a0cb12-b9d7-4778-a486-ab53c85be563', 'e88102c4-d78c-4ef3-9157-514bfd57e57b', 'https://logo.com/tokopedia.png', 'PT Tokopedia', 'Tokopedia', 'E-commerce', '5000+', 'Tokopedia is an Indonesian technology company specializing in e-commerce.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Kuningan', 'Tokopedia Tower, Jakarta Selatan', '12950', 'https://www.tokopedia.com', 'https://www.facebook.com/tokopedia', 'https://twitter.com/tokopedia', 'https://www.instagram.com/tokopedia', 'https://www.youtube.com/c/tokopedia', '2025-02-17 13:24:40.994', '2025-02-17 13:24:40.994'),
('5dba87b0-1dde-45b3-bc22-e10438198341', '1db185d9-169e-4747-a037-8790fdf2ae72', 'public/uploads/logo/logo-company-1747133878520-10331971.png', 'PT. Mandiri International Technology', 'MI Tech', 'IT Consulting & Services Company', '51-200 employees', 'PT. Mandiri International Technology (MITech) is an Indonesian leading Information and Communication Technology (ICT) Solutions and Services Company, over 180 employees, established in 2014. We help our valued Clients to drive their business growth by delivering innovative digital technology and business transformation. For more visit https://mitech.co.id', 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Jakarta Pusat', 'Jakarta Pusat, DKI Jakarta', '92845', 'https://mitech.co.id/', 'https://mitech.co.id/', 'https://mitech.co.id/', 'https://mitech.co.id/', 'https://mitech.co.id/', '2025-05-13 10:54:34.730', '2025-05-13 10:57:58.526'),
('61b2cde2-c17f-4dd8-a5d8-a6feb9c6f692', '553c7af2-32bd-4c1e-a600-c036a990bfcd', 'public/uploads/logo/logo-company-1747130039586-373194268.jpeg', 'PT Primatrans Java Express', 'Primatrans Java', 'Logistic and Supply Chain', '1-50 employees', 'Primatrans Java EXpress (PJE) adalah perusahaan logistik yang mneyediakan jasa tranportasi dan pengitiman barang', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Surabaya', 'Surabaya, Jawa Timur, Indonesia', '73664', 'https://primatransjava.com', 'https://primatransjava.com', 'https://primatransjava.com', 'https://primatransjava.com', 'https://primatransjava.com', '2025-05-13 09:48:31.666', '2025-05-13 09:53:59.603'),
('630b6cf5-d99e-44bd-9c70-393ae3e7d8eb', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'public/uploads/logo/logo-company-1748170979748-285192298.png', 'PT. Gelora Aksara Pratama', 'Gelora Aksara Pratama', 'Broadcast Media, Entertainment and Publishing', '51-200 employees', 'GAPPRINT started the printing business with eighteen employees and two used machines in a small factory building in South Jakarta. Today, GAPPRINT has become a well know company in the printing industry of Indonesia, employing a large number of workforces and utilizing great capacity of quality printing machines that includes eight webs and twelve sheet printers. In 2008, we produced millions of copies of wide variety books that were distributed all over Indonesia.', 'Indonesia', 'Jakarta', 'Jakarta', 'Ciracas', 'Jl. H. Baping Raya No. 100', '13740', 'https://geloraaksarapratama.co.id/', 'https://geloraaksarapratama.co.id/', 'https://geloraaksarapratama.co.id/', 'https://geloraaksarapratama.co.id/', 'https://geloraaksarapratama.co.id/', '2025-05-25 10:58:29.657', '2025-05-25 11:02:59.754'),
('661028c9-cfe9-4e38-87e8-4c7a13736038', '5dc6409f-28bc-486f-a88c-ea95898cc12a', 'public/uploads/logo/logo-company-1748174027165-439507369.jpeg', 'PT Makmur Lestari Primatama', 'PT Makmur Lestari ', 'Mining, Minerals & Metals', '20-99 employees', 'PT Makmur Lestari Primatama (MLP) is a Foreign Investment Company established on 2006 which focussed on Production of Nickel Ore. MLP has 407 Ha sites mine area in North Konawe, Southeast Sulawesi. The first project of production operation started at the end quartal of 2017 until now.\r\nMLP is growing to be One of the Best Mining Company in Indonesia. The Company is very concern to Mining Regulation, Expertise Employe, Social Responsibility, and Foresty and Environment Sustainability. The goal of the company is also the main target which must be achieve.', 'Indonesia', 'DKI Jakarta', 'Jakarta Raya', 'Jakarta Raya', 'Jakarta Raya, Jakarta Pusat, DKI Jakarta Indonesia', '74859', 'https://www.makmurlestari.com', 'https://www.makmurlestari.com', 'https://www.makmurlestari.com', 'https://www.makmurlestari.com', 'https://www.makmurlestari.com', '2025-05-25 11:49:29.500', '2025-05-25 11:53:47.177'),
('6bc077d5-9fbb-4fb1-b167-bec5ccc02cb4', 'fcd5a494-bc18-4b98-97b3-f3e17af79c24', 'public/uploads/logo/logo-company-1748169676862-748004133.png', 'Solutech Indonesia Maju', 'Solutech Indonesia Maju', 'Consumer Electronics', '1-50 employees', 'Solutech Indonesia Maju', 'Indonesia', 'Jakarta', 'Jakarta', 'Cempaka Putih Timur', 'Lippo Tower Holland Village, Jl. Letjen. Suprapto Kav. 60 No. 1', '10510', 'https://company.com', 'https://company.com', 'https://company.com', 'https://company.com', 'https://company.com', '2025-05-25 10:35:39.659', '2025-05-25 10:41:16.880'),
('72af685e-e4fa-4bb1-adc9-0be47d0d3cd1', '3d6afe31-e89b-4164-9026-fc53f1418697', 'http://example.com/logo10.png', 'PT. Company 10', 'Company 10', 'Technology', '100-500', 'Description 10', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 10', '57126', 'http://example.com/10', 'http://facebook.com/10', 'http://twitter.com/10', 'http://instagram.com/10', 'http://youtube.com/10', '2025-02-05 07:52:06.435', '2025-02-05 07:52:06.435'),
('82bdfe3c-528e-446f-b926-fc3add37aa81', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'public/uploads/logo/logo-company-1747132500049-893050919.jpg', 'Reemotely', 'Reemotely', 'Recruitment Service and Consultant', '1-50 employees', 'At Reemotely, we connect businesses with top-tier virtual professionals, helping companies build agile, scalable teams without the overhead costs. Our remote talent solutions empower businesses in Singapore to grow efficiently, adapt quickly, and stay competitive by tapping into global expertise.', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Sleman', 'Sleman, DI Yogyakarta, Indonesia', '83740', 'https://www.reemotely.com', 'https://www.reemotely.com', 'https://www.reemotely.com', 'https://www.reemotely.com', 'https://www.reemotely.com', '2025-05-13 10:32:33.381', '2025-05-13 10:35:00.056'),
('846f1569-5c0d-473f-adb6-5bd18af31ff2', '474d3aed-ccad-4465-b97a-efc5e6b27903', 'public/uploads/logo/logo-company-1745925219105-562169258.jpeg', 'PT Yard Zeal Indonesia', 'PT Yard Zeal Indonesia', 'Property & Real Estate', '1-50 employees', 'Yard Zeal is Industry Real Estate Broker firm from China that based in Jakarta. With the license to Lease and Sell industry properties such as : 1. Industrial Factory 2. Warehouses 3. Industrial/ Commercial Land 4. Commercial Leasing/sell', 'Indonesia', 'DKI Jakarta', 'Jakarta Barat', 'Jakarta Barat', 'Jakarta Barat, Indonesia', '73485', 'https://yardzeal.com', 'https://facebook.com', 'https://x.com', 'https://instagram.com', 'https://youtube.com', '2025-04-29 11:06:16.387', '2025-04-29 11:13:39.121'),
('86f92eef-5c8c-458d-a39f-9cd611bb42c2', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'public/uploads/logo/logo-company-1745933039632-360921118.jpeg', 'Zociety Hub', 'Zociety Hub', 'Marketing and Advertising', '51-200 employees', 'Zociety Hub specializes in Influencer Management, Community Management, and Digital Resources to elevate brand visibility and engagement.\r\n\r\nWe help brands connect with ideal influencers for impactful collaborations, build loyal and active communities that resonate with brand values, and offer skilled digital marketing support. With Zociety Hub, brands can effortlessly strengthen their digital presence and drive meaningful engagement across all platforms.', 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kuningan', 'Kuningan, Jakarta Selatan', '73647', 'https://zocietyhub.com', 'https://zocietyhub.com', 'https://zocietyhub.com', 'https://zocietyhub.com', 'https://zocietyhub.com', '2025-04-29 13:20:36.788', '2025-04-29 13:23:59.639'),
('933039be-cfb4-4c80-84c7-ac58d9f880be', '18407767-ad4d-4d4c-8472-8fc55f6adb1f', 'public/uploads/logo/logo-company-1747136229797-942716156.png', 'ANTARESTAR', 'Antarestar', 'Apparel & Fashion', '51-200 employees', 'ANTARESTAR is a leading local brand committed to supporting all outdoor activities and fulfilling the needs of adventurers and ‘backpackers.’ Our mission is to empower exploration and deepen the love for our homeland by providing high-quality products that make travel easier and more enjoyable.\r\n\r\nAt Antarestar, we prioritize the needs of backpackers by offering reliable, durable, and practical gear that stands up to the demands of every journey.\r\n\r\nWith Antarestar, exploring the beauty of this country becomes more convenient, inspiring you to venture further and connect with the wonders of the world around you.', 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi', 'Bekasi, Jawa Barat, Indonesia', '83875', 'https://antarestar.com/', 'https://antarestar.com/', 'https://antarestar.com/', 'https://antarestar.com/', 'https://antarestar.com/', '2025-05-13 11:34:00.788', '2025-05-13 11:37:09.806'),
('9f65f467-6d4d-4b3e-96bf-fad124e1f97c', '71c0ece8-9036-4428-84a6-52099712f67d', 'http://example.com/logo12.png', 'PT. Company 12', 'Company 12', 'Technology', '100-500', 'Description 12', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 12', '57126', 'http://example.com/12', 'http://facebook.com/12', 'http://twitter.com/12', 'http://instagram.com/12', 'http://youtube.com/12', '2025-02-05 07:52:06.495', '2025-02-05 07:52:06.495'),
('b68bf3e9-3032-4750-bde7-252f0ceddf04', '6932648b-ecf2-4bba-b513-ce8243496967', 'http://example.com/logo15.png', 'PT. Company 15', 'Company 15', 'Technology', '100-500', 'Description 15', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 15', '57126', 'http://example.com/15', 'http://facebook.com/15', 'http://twitter.com/15', 'http://instagram.com/15', 'http://youtube.com/15', '2025-02-05 07:52:06.554', '2025-02-05 07:52:06.554'),
('b796c2ab-13ea-4048-9141-c6ec9e31f922', '78f64755-71d4-45b0-ae6c-3b2160745909', 'public/uploads/logo/logo-company-1745929190643-446277369.jpg', 'PT Sumber Alfaria Trijaya, Tbk', 'Alfamart', 'Retail', '51-200 employees', 'Alfamart was initiated in 1989 by Djoko Susanto and started its business in trading and distribution. In 1999, the company expanded to minimarket sector and now has become one of the largest retail chains in Indonesia. Having over 18.000 stores, 32 office branch, and more than 130.000 employees, Alfamart has grown to become people\'s choice that provides variety of daily necessities such as groceries, household products, personal care items and e-services at competitive prices across the nation. Since 2009, Alfamart has worked with the government to run a retail education preparation program for Vocational High Schools (SMK) known as Alfamart Class. This program is providing modern retail curriculum subject matter to vocational students, especially business and marketing. Alfamart also transfers knowledge and learning practices to educators at vocational schools who work with, thereby expanding the knowledge of teachers as well as synchronizing the curriculum. In June 2022, it was recorded that more than 190 SMK vocational schools had collaborated that spread across 67 regions in Indonesia. As many as 1533 graduates have worked at Alfamart. In 2016, Alfamart had a concept of Alfability, which is actively providing opportunities for disabilities to join as employees. It was recorded that in October 2022 Alfamart had 1112 employees with disabilities who held several positions in stores, warehouses, and offices. Alfamart is committed to being an inclusive company that respects the diversity of its employees to enable the full contribution of its employees without discrimination to everyone, including employees with disabilities. Alfamart has vision to be Indonesia’s largest and globally competitive widely owned retail distribution network that empowers small entrepreneurs and fulfils customers’ needs and expectations. As we aim to reach our vision, we are looking for more highly-motivated, innovative, and result-driven talent to #jumpandgrowwithus!', 'Indonesia', 'Banten', 'Tangerang', 'Tangerang', 'Tangerang, Banten, Indonesia', '37749', 'https://alfamart.com', 'https://alfamart.com', 'https://alfamart.com', 'https://alfamart.com', 'https://alfamart.com', '2025-04-29 12:15:53.896', '2025-04-29 12:19:50.652'),
('bb0171f5-b5c8-4b63-af4e-bf55ac80ba52', '382ac7fc-771a-4d07-8dd8-c2aa1fae7e68', 'http://example.com/logo13.png', 'PT. Company 13', 'Company 13', 'Technology', '100-500', 'Description 13', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 13', '57126', 'http://example.com/13', 'http://facebook.com/13', 'http://twitter.com/13', 'http://instagram.com/13', 'http://youtube.com/13', '2025-02-05 07:52:06.506', '2025-02-05 07:52:06.506'),
('c50decf1-09d1-4a93-9201-95042a4723ae', 'fa656bbf-9b95-4189-a226-321a0d0192f9', 'http://example.com/logo8.png', 'PT. Company 8', 'Company 8', 'Technology', '100-500', 'Description 8', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 8', '57126', 'http://example.com/8', 'http://facebook.com/8', 'http://twitter.com/8', 'http://instagram.com/8', 'http://youtube.com/8', '2025-02-05 07:52:06.370', '2025-02-05 07:52:06.370'),
('cfb708e5-414b-4a4d-965f-96ac3dd94d90', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'public/uploads/logo/logo-company-1741792169239-55322139.jpeg', 'PT Aplikasi Karya Anak Bangsa', 'Gojek Indonesia', 'Technology', '5000+', 'Gojek is a technology company that offers services ranging from transportation to payments.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Setiabudi', 'Pasaraya Blok M, Jakarta Selatan', '12160', 'https://www.gojek.com', 'https://www.facebook.com/GojekIndonesia', 'https://twitter.com/gojekindonesia', 'https://www.instagram.com/gojekindonesia', 'https://www.youtube.com/c/GojekIndonesia', '2025-02-17 13:24:40.969', '2025-03-12 15:09:29.248'),
('e1fac486-0af2-45e3-aa5a-c729c643add3', 'da4b162e-993c-4c5b-a114-54c1d8e7e9af', 'http://example.com/logo9.png', 'PT. Company 9', 'Company 9', 'Technology', '100-500', 'Description 9', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 9', '57126', 'http://example.com/9', 'http://facebook.com/9', 'http://twitter.com/9', 'http://instagram.com/9', 'http://youtube.com/9', '2025-02-05 07:52:06.418', '2025-02-05 07:52:06.418'),
('e6a7a80c-4f1d-4eed-b0f4-a6bc83608000', 'eb953065-05e6-4309-ace5-e875cf719a0e', 'http://example.com/logo3.png', 'PT. Company 3', 'Company 3', 'Technology', '100-500', 'Description 3', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 3', '57126', 'http://example.com/3', 'http://facebook.com/3', 'http://twitter.com/3', 'http://instagram.com/3', 'http://youtube.com/3', '2025-02-05 07:52:06.239', '2025-02-05 07:52:06.239'),
('ea829411-e493-4b97-97bf-d3dfbfe56c9d', '8c57d7ab-76b7-46d6-8dc1-098ac50d9302', 'public/uploads/logo/logo-company-1745929824134-436426199.jpeg', 'PT Adi Sarana Armada Tbk', 'ASSA Rent', 'Logistics and Transportation', '51-200 employees', 'ASSA Rent (PT Adi Sarana Armada Tbk) adalah perusahaan rental mobil terbesar di Indonesia yang menyediakan berbagai layanan transportasi, termasuk rental kendaraan korporasi, transportasi logistik, layanan pengemudi, balai lelang otomotif, car sharing, jual beli kendaraan online, dan layanan pengiriman parsel. Perusahaan ini memiliki cabang di seluruh kota besar di Indonesia dan fokus pada kenyamanan serta keamanan pelanggan.', 'Indonesia', 'DKI Jakarta', 'Jakarta', 'Jakarta', 'Jakarta, Indonesia', '63748', 'https://adisarana.com', 'https://adisarana.com', 'https://adisarana.com', 'https://adisarana.com', 'https://adisarana.com', '2025-04-29 12:28:20.122', '2025-04-29 12:30:24.144'),
('f456f25e-c2ad-4906-8024-253cea274166', 'caf32328-7dac-4ab2-ab07-6c8bec5b3944', 'public/uploads/logo/logo-company-1747131441116-206230596.png', 'PT Global Jet Cargo', 'J&T Cargo', 'Logistic, Cargo', '100-499 employees', 'J&T Cargo, an innovative cargo company under the J&T Group, leads the way in transforming logistics with cutting-edge technology. We continuously improve efficiency and reduce costs by upholding high operational standards and utilizing strong warehouse, transportation, and distribution systems. Through advanced logistics applications, we enhance business value for our customers and deliver a top-tier logistics experience.', 'Indonesia', 'Jawa Tengah', 'Semarang', 'Semarang', 'Semarang, Jawa Tengah, Indonesia', '53834', 'https://www.jntcargo.com', 'https://www.jntcargo.com', 'https://www.jntcargo.com', 'https://www.jntcargo.com', 'https://www.jntcargo.com', '2025-05-13 10:13:51.082', '2025-05-13 10:17:21.122'),
('f6264c65-54e2-479f-9c33-83a2e1cb20e8', '9a72ae25-66b3-4e75-9672-a46f7384cacf', 'http://example.com/logo4.png', 'PT. Company 4', 'Company 4', 'Technology', '100-500', 'Description 4', 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 Company St 4', '57126', 'http://example.com/4', 'http://facebook.com/4', 'http://twitter.com/4', 'http://instagram.com/4', 'http://youtube.com/4', '2025-02-05 07:52:06.251', '2025-02-05 07:52:06.251'),
('f7900163-e3b2-42b3-9a76-92dfaa574a61', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'public/uploads/logo/logo-company-1748175688684-762683589.jpeg', 'Orang Tua Group', 'Orang Tua Group', 'FMCG Manufacturing', '100-499 employees', 'OT is a consumer goods company that produces a wide range of daily necessities. From a traditional health drink with consistent use of high quality ingredients and standardized processes, OT is increasingly becoming a modern enterprise, without parting from the positive values and dignity instilled by the company\'s founder.\r\nOur products, ranging from food and beverages to personal care products, have since long been part of life for Indonesian consumers. Our established brands include Formula, Tango, Teh Gelas, MintZ, Blaster, Oops, and Kiranti. In point of fact, for its quality, OT products are offered in the international market, so can now also be enjoyed abroad.', 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Cengkareng', 'OT Building Address Jl.Lingkat Luar Barat Kav 35-36 ', '63749', 'https://ot.id/', 'https://ot.id/', 'https://ot.id/', 'https://ot.id/', 'https://ot.id/', '2025-05-25 12:18:22.955', '2025-05-25 12:21:28.698');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `education_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `university_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `degree` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `grade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`education_id`, `job_seeker_detail_id`, `university_id`, `university_name`, `degree`, `major`, `start_date`, `end_date`, `created_at`, `updated_at`, `grade`) VALUES
('1ba400e3-ddfc-47cc-b565-824f8b294ea4', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f', NULL, 'Sebelas Maret University 14', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850', NULL),
('2706ea4f-c0cc-4176-acf3-75963975243b', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921', NULL, 'Sebelas Maret University 12', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811', NULL),
('37e283e8-b728-4920-b0ac-336d055b9a77', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6', NULL, 'Sebelas Maret University 5', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610', NULL),
('3a1f29bc-3e5b-4817-8d4b-d46f13cff9e6', '225074b8-cf76-4a6c-811c-52d5719c57ad', NULL, 'Sebelas Maret University 3', 'Desain Komunikasi Visual', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.556', '2025-06-01 15:55:43.155', '3.6'),
('4a427209-6be8-45ea-aea8-6e4e6b9edc53', '235b42a9-1886-4aaa-92cf-762912d697cc', NULL, 'Sebelas Maret University 15', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864', NULL),
('4a66ba1b-f376-4f9d-83de-e9f647c38139', '1907e6d9-7619-431f-942f-54c4d3070913', NULL, 'Sebelas Maret University 9', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702', NULL),
('580d4a2e-be55-47c0-a593-312f64940f48', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', NULL, 'Sebelas Maret University 4', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592', NULL),
('61ddcf8a-dfe1-4e3e-b1f2-1c2d2afe12d0', 'd364b526-8cd4-407f-a55a-e0863c8f4d57', NULL, 'Sebelas Maret University 1', 'Bachelor', 'Teknik Informatika', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.505', '2025-06-14 16:07:21.059', '3.8'),
('760bb08a-3911-493f-8024-c5e98b9144c6', '3cf7fbd0-da22-4834-8d78-c11f0f046017', NULL, 'Sebelas Maret University 8', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686', NULL),
('8c699f4d-cafe-4b46-a282-53b82dcee619', '2cad1612-894b-4115-b476-55d51cd677e7', NULL, 'Sebelas Maret University 13', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836', NULL),
('92ebd82c-b3f6-4461-9bbd-c0975ac8e3fe', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02', NULL, 'Sebelas Maret University 11', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760', NULL),
('9eb1aa9a-9b65-4b00-9cb9-3346c02d5703', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10', NULL, 'Sebelas Maret University 7', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670', NULL),
('a0d79be5-b23d-45c8-8ae8-ca572021603f', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3', NULL, 'Sebelas Maret University 10', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741', NULL),
('f70a0b17-7fef-4843-8d16-ab0fd4ec9517', '26fc75a4-5eab-4d57-84da-7c7c4af25424', NULL, 'Sebelas Maret University 2', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.537', '2025-02-05 07:52:05.537', NULL),
('fe2889a2-3ec5-4287-aba9-cdcaae897a83', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439', NULL, 'Sebelas Maret University 6', 'Bachelor', 'University', '2020-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `experiences`
--

CREATE TABLE `experiences` (
  `experience_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experiences`
--

INSERT INTO `experiences` (`experience_id`, `job_seeker_detail_id`, `experience_title`, `employment_type`, `company_name`, `location`, `location_type`, `description`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('01d735eb-8fb9-47ac-aecd-ec37d29ffee5', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6', 'Software Engineer 5', NULL, 'Company 5', NULL, NULL, 'Developing software 5', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610'),
('0e09bd6e-fa8d-400c-b781-b49744867f9c', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02', 'Software Engineer 11', NULL, 'Company 11', NULL, NULL, 'Developing software 11', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760'),
('307c93eb-8fd5-416b-8286-702c409dd77c', '1907e6d9-7619-431f-942f-54c4d3070913', 'Software Engineer 9', NULL, 'Company 9', NULL, NULL, 'Developing software 9', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702'),
('41a42d63-89fa-4d77-bd80-a9ee48aec846', '2cad1612-894b-4115-b476-55d51cd677e7', 'Software Engineer 13', NULL, 'Company 13', NULL, NULL, 'Developing software 13', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836'),
('4e6c9f84-4bfb-48ce-9957-7eaa1cd15b91', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921', 'Software Engineer 12', NULL, 'Company 12', NULL, NULL, 'Developing software 12', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811'),
('558e417d-69b3-477d-82e7-47e63da9af58', '235b42a9-1886-4aaa-92cf-762912d697cc', 'Software Engineer 15', NULL, 'Company 15', NULL, NULL, 'Developing software 15', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864'),
('8dd4ad41-2989-475d-b6eb-31698531361a', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', 'Software Engineer 4', NULL, 'Company 4', NULL, NULL, 'Developing software 4', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592'),
('a82a212f-6d4b-4891-96e6-d21297007e20', 'd364b526-8cd4-407f-a55a-e0863c8f4d57', 'Software Engineer', NULL, 'Company 1', NULL, NULL, 'Developing software using ReactJS', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.505', '2025-05-22 15:02:56.802'),
('a8d5cd12-0648-421f-9d79-4b6c4619e7d4', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439', 'Software Engineer 6', NULL, 'Company 6', NULL, NULL, 'Developing software 6', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627'),
('b9f8e58c-498e-46bd-a23b-ed3d34d00f8c', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10', 'Software Engineer 7', NULL, 'Company 7', NULL, NULL, 'Developing software 7', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670'),
('dc560946-1429-4cec-b337-3339e5927938', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f', 'Software Engineer 14', NULL, 'Company 14', NULL, NULL, 'Developing software 14', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850'),
('dd2ee755-f7a9-40f7-beac-fc2cb74e68ff', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3', 'Software Engineer 10', NULL, 'Company 10', NULL, NULL, 'Developing software 10', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741'),
('f4a73fcd-df19-4ec4-b0c4-a9ffeab8060e', '3cf7fbd0-da22-4834-8d78-c11f0f046017', 'Software Engineer 8', NULL, 'Company 8', NULL, NULL, 'Developing software 8', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686');

-- --------------------------------------------------------

--
-- Table structure for table `experience_levels`
--

CREATE TABLE `experience_levels` (
  `experience_level_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `experience_levels`
--

INSERT INTO `experience_levels` (`experience_level_id`, `name`, `created_at`, `updated_at`) VALUES
('27ee0c74-8c03-4be0-8b35-eff28d5d8521', '4 YoE', '2025-02-17 13:40:43.472', '2025-02-17 13:40:43.472'),
('3fbea5ed-030f-4d9e-a16a-1a4ebed60ce8', '2 YoE', '2025-02-17 13:40:31.358', '2025-02-17 13:40:31.358'),
('4e6f9dd4-d5ae-4474-af4e-2a83fd48d966', '3 YoE', '2025-02-17 13:40:38.036', '2025-02-17 13:40:38.036'),
('79df802b-e26f-4e59-846a-48e18a94d3e5', '<1 YoE', '2025-02-17 13:39:59.882', '2025-02-17 13:39:59.882'),
('bb5a8102-31dc-431c-a3bd-bd2e2ff0fbba', '>5 YoE', '2025-02-17 13:40:52.419', '2025-02-17 13:40:52.419');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('information_and_communication_technology','finance_and_insurance','human_resources_and_administration','sales_and_marketing','healthcare_and_social_assistance','education_and_training','manufacturing','construction','arts_entertainment_and_media','hospitality_and_tourism','transportation_and_logistics','public_administration_and_government','retail','legal','science_and_research') COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary_type` enum('monthly_based','project_based') COLLATE utf8mb4_unicode_ci NOT NULL,
  `minimum_salary` bigint DEFAULT NULL,
  `maximum_salary` bigint DEFAULT NULL,
  `education_requirement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_requirement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `published_at` datetime(3) DEFAULT NULL,
  `expired_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `work_type` enum('on_site','remote','hybrid') COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `skills_category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `company_id`, `title`, `category`, `employment_type`, `description`, `location`, `salary_type`, `minimum_salary`, `maximum_salary`, `education_requirement`, `experience_requirement`, `status`, `published_at`, `expired_at`, `created_at`, `updated_at`, `work_type`, `deleted_at`, `skills_category_id`) VALUES
('004ed579-06bd-4c12-ae2e-ba25447d057e', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Account Executive Wilayah Bali', 'retail', 'full_time', 'Kami dari PT Gelora Aksara Pratama (Erlangga Group), sebuah perusahaan ritel terkemuka di Indonesia, mencari seorang Account Executive yang berpengalaman untuk mendukung kami di wilayah Bali. Sebagai Account Executive, Anda akan memainkan peran strategis dalam membangun hubungan jangka panjang dengan mitra bisnis kami dan memastikan kepuasan pelanggan yang tinggi.\n\nTanggung Jawab Utama\n\nMembangun dan memelihara hubungan yang solid dengan pelanggan dan mitra ritel di wilayah Bali\n\nMengidentifikasi peluang bisnis baru dan mengembangkan strategi untuk meningkatkan penjualan dan pertumbuhan\n\nMenyediakan layanan pelanggan yang unggul, mengelola keluhan, dan memastikan kepuasan pelanggan\n\nMenganalisis tren pasar, mengembangkan strategi pemasaran yang efektif, dan membantu tim penjualan mencapai target\n\nMengkoordinasikan dengan tim internal untuk memastikan pengiriman dan ketersediaan produk yang efisien\n\nMenyiapkan laporan kinerja secara rutin dan memberikan wawasan yang berharga untuk pengambilan keputusan\n\nKeterampilan dan Pengalaman yang Dibutuhkan\n\nPemahaman yang kuat tentang pasar ritel di Bali dan hubungan yang luas dengan mitra ritel\n\nKemampuan yang terbukti dalam membangun dan mempertahankan hubungan pelanggan yang kuat\n\nKeterampilan presentasi dan negosiasi yang unggul, mampu mempengaruhi dan meyakinkan pemangku kepentingan\n\nKemampuan analitis yang baik untuk menginterpretasikan data dan mengembangkan strategi yang efektif\n\nPengetahuan yang baik tentang tren industri ritel, pemasaran, dan praktik terbaik\n\nKemampuan komunikasi lisan dan tertulis yang sangat baik, terutama dalam bahasa Indonesia dan Inggris', 'Denpasar, Bali', 'monthly_based', 3298500, 3300000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 11:26:04.872', '2026-01-01 00:00:00.000', '2025-05-25 11:26:04.873', '2025-05-25 11:26:04.873', 'on_site', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('0130a1ce-344f-4536-8a1e-a9a8051470da', '1db185d9-169e-4747-a037-8790fdf2ae72', 'IT Architecture, Infrastructure & Asset Management', 'information_and_communication_technology', 'full_time', 'Analyzing business requirements, designing technical solutions\nApply knowledge of Enterprise Architecture, utilizing the TOGAF ADM framework to ensure alignment with enterprise standards.\nEnsuring the successful integration of systems in alignment with enterprise architecture standards\nProvide expertise in designing and implementing solutions based on cloud platforms\nWork closely with internal teams, stakeholders, and external partners to ensure seamless execution of projectswith a focus on cloud infrastructure, data security, and infrastructure design.', 'Jakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-13 11:06:04.755', '2026-01-01 00:00:00.000', '2025-05-13 11:06:04.756', '2025-05-13 11:06:04.756', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', '18407767-ad4d-4d4c-8472-8fc55f6adb1f', 'Digital Advertiser', 'sales_and_marketing', 'full_time', 'Membuat strategi penjualan dan landing page untuk menaikan penjualan & performa\nMembuat, mengevaluasi dan mengoptimasi dalam bentuk report mingguan\nBertanggung jawab dalam mengoperasikan e-commerce\nMenganalisa strategi promosi iklan\nMenganalisa & memantau pasar yang sedang berkembang serta dapat melaporkan hasilnya secara efektif', 'Bekasi', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 11:45:54.865', '2026-01-01 00:00:00.000', '2025-05-13 11:45:54.866', '2025-05-13 11:45:54.866', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Account Payable Supervisor', 'finance_and_insurance', 'full_time', 'What You\'ll Be Doing :\n\nHandling Invoice Processing\n\nHandling Payment Processing\n\nDouble check all invoice and tax needed for payment\n\nAssist with the month-end and year-end closing processes, ensuring that all accounts payable transactions are accurately recorded.\n\nThe Requirements We Need :\n\nBachelor\'s degree in any field, preferable Accounting / Finance Management with Minimal GPA 3.00.\n\nHave 2 years minimum experiences in Accounting in International Business in FMCG industry is preferable\n\nFluent in English.\n\nWilling to be placed in our Head Office, Cengkareng, West Jakarta.\n\n \n\nOnly candidates who match our requirements are going to be followed up to the next stage of our recruitment process.', 'West Jakarta, Jakarta', 'monthly_based', 7500000, 10000000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-25 12:37:44.217', '2026-01-01 00:00:00.000', '2025-05-25 12:37:44.218', '2025-05-25 12:37:44.218', 'on_site', NULL, 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('0ce9459e-e3b2-4760-b478-9ccee437f455', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Product Manager - Cartography', 'information_and_communication_technology', 'full_time', 'About the Role\n\nBuckle up and get ready to join us as the Product Manager for our Location Selection pod! In this position, you will play a key role within our Cartography team in Jakarta, with a strong emphasis on enhancing our user experience for customers.  As a Product Manager for Navigation Experience will be responsible for crafting a seamless navigation and live tracking experience for both customers and drivers. You will work to ensure that the in-app navigation not only supports efficient routes but also provides real-time updates, addressing challenges as they arise on the road.\n\nYour contributions will have a direct impact on the experiences of our customers and drivers using the Gojek app.\n\nWhat You Will Do\n\nLed the strategy and development of Cartography navigation experience products, collaborating with engineering, design, and other teams to launch significant features and enhancements.\nPartner closely with other product teams in Gojek to integrate Gojek Maps data across Consumer, Driver, and Merchant applications, ensuring a top-notch user support experience.\nGather product ideas and feedback, define requirements, create specifications, and develop workflows, regularly demonstrating progress.\nFoster collaboration with teams across Gojek, including Data Science, AI, Business Intelligence, and various Product teams in Cartography, to drive innovation. identify and prioritize initiatives aimed at improving the accuracy and usability of map data.\nExecute effectively—turn ideas into actionable plans, engage in hands-on implementation, and ensure timely launches of products and features that enhance cartography offerings.\nUnderstand diverse customer needs and conceptualize flexible solutions that can adapt to various scenarios.\nMaintain a detail-oriented approach, having in-depth knowledge of your team\'s work, including technical specifications and API details.\nUtilize data insights to identify key issues and target segments, adopting an experimentation-driven mindset in product development.\nWhat You Will Need\n\n5+ years of product management experience, preferably in consumer-facing mobile or web applications. Also, having experience as a data analyst or engineer is a plus point for this role\nFamiliarity with mapping technologies and navigation systems, skills in OpenStreetMap(OSM), and openly licensed government data are preferable\nMust be skilled at working with a wide variety of stakeholders, the ability to excel in a constantly changing and rapidly growing workplace\nStrong communication skills, the ability to summarize complex and technical topics to a wide range of audiences\nStrong strategic thinking and planning skills with the ability to set and achieve mid-term and long-term objectives.\nYou are a self-starter, you love to understand systems inside out and make it your mission to deliver quality products\nA “Can-Do” Attitude: A positive attitude and passion for learning in fast-paced environments. We move fast!\nData-Driven Mindset: Skilled in leveraging technical resources and data to inform decisions. Proficient in SQL and basic statistics, while recognizing when to step back from excessive metrics\nFluent in written and verbal English\nAbout the Team\n\nAt the heart of Gojek’s businesses, we move things around. Whether that’s people, food, packages, or fresh groceries moving things around boils down to understanding the best route, understanding traffic, and understanding locations. The Cartography team is a platform team that surfaces mapping technologies needed by all internal product teams and business units within Gojek. \n\nWhile the Cartography team is based across the region, we are a tight-knit group who are bonded by two things: how to grow our maps using strong machine learning, engineering automation, and strong operations and emphasize professional development around these areas 🙌. For real - our weekly conversations range from well, mapping, and navigation to competing in friendly online gaming. But whether you like to play online games or you share our love for an afternoon tea/coffee break like us, we’d be stoked to have you join the fam!\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-GOTO\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '>5 YoE', 'draft', '2025-04-20 16:19:46.526', '2026-01-01 00:00:00.000', '2025-03-12 14:11:22.190', '2025-04-20 16:19:46.527', 'on_site', NULL, '9459629e-7d9a-42be-aba8-3998b7444110'),
('10159c92-bdba-4905-bc8e-1f74913989a3', '18407767-ad4d-4d4c-8472-8fc55f6adb1f', 'Project Manager', 'information_and_communication_technology', 'full_time', 'Merencanakan, mengelola, dan mengawasi jalannya proyek, termasuk penetapan target dan pengelolaan sumber daya untuk memastikan kelancaran operasional.\n\nMengidentifikasi dan menyelesaikan kendala teknis atau operasional yang muncul selama pelaksanaan proyek dengan pendekatan analisis akar masalah.\n\nBerkoordinasi dan berkolaborasi dengan berbagai tim lintas divisi dan mitra eksternal untuk memastikan setiap tahapan proyek berjalan sesuai rencana.\n\nMenyiapkan laporan perkembangan proyek dalam bentuk presentasi dan data untuk komunikasi yang efektif kepada tim dan manajemen.\n\nMengkomunikasikan hasil evaluasi dan rekomendasi secara jelas kepada manajemen dan stakeholder proyek.\n\nMemantau indikator keberhasilan proyek (KPI), mengidentifikasi potensi risiko, dan memberikan update rutin kepada semua pihak terkait.', 'Bekasi', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 11:40:16.781', '2026-01-01 00:00:00.000', '2025-05-13 11:40:16.782', '2025-06-01 15:18:56.653', 'on_site', NULL, 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('1970d06f-f892-48cc-93ef-2380cea9eaef', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Staff', 'transportation_and_logistics', 'full_time', 'About The Role\n\nArea Operations Staff accountable and responsible to support Area Operations Supervisor for all spectrum operation drivers at Area level, including but not limited to hold driver engagement activity, driver acquisition, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area.\n\nWhat You Will Do\n\nHandle driver support unit/walk in center in the area: onboarding, troubleshooting, attribute selling, issue escalation;\nManage driver community: coordination, training, troubleshooting, issue escalation;\nConduct online and offline program related to driver partners’ activities;\nMonitor all operations metrics (Demand, Supply, Reliability, Service Level, Risk, etc), propose action plan, and escalate if necessary;\nCoordinate with Area Operations Supervisor for day-to-day escalated issues around driver service.\nWhat You Will Need\n\nFresh graduate, having working experience is a plus;\nDiploma/Bachelor degree with min GPA of 3.0, from top university is a plus;\nGood communication skill and social media literacy;\nGood critical thinking and problem solving skill;\nIntermediate proficiency in Excel/Google Sheet;\nIntermediate proficiency in spoken and written in English.\nAbout The Team\n\nAs Area Operations Staff, he/she will support the Area Operations Supervisor on a day to day basis. He/she also will work closely with the drivers in the field and will be the first contact for driver to escalate any issues.', 'Lampung, Indonesia', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-04-20 16:20:00.666', '2026-01-01 00:00:00.000', '2025-02-17 13:43:30.426', '2025-04-20 16:20:00.667', 'on_site', NULL, '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'Software Engineer Intern', 'information_and_communication_technology', 'internship', '\nAssist in designing and maintaining automation workflows (n8n, Zapier, etc.)\nHelp integrate third-party SaaS platforms (APIs, webhooks, data syncs)\nSupport web development tasks using JavaScript (and optionally TypeScript)\nExplore new tools/technologies for potential adoption to automation and app development\nAttend daily stand-ups (10 AM WIB) and document workflows\nAssist with ad-hoc technical tasks as needed\n', 'Yogyakarta, Indonesia', 'monthly_based', 1500000, 2000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-13 10:39:18.530', '2026-01-01 00:00:00.000', '2025-05-13 10:39:18.531', '2025-05-13 10:39:18.531', 'remote', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('2223856d-5427-43ab-985b-d3917b5fad3d', '1db185d9-169e-4747-a037-8790fdf2ae72', 'IT Project Manager', 'information_and_communication_technology', 'full_time', 'Oversee the development of the project and ensure that team members are carrying out their tasks efficiently while upholding the company\'s standards.\nCollaborate with other department leaders to define, prioritize, and develop projects.\nManage project\'s daily activity, including problem, risk, management, and manage all testing phases and test environments\nAccurately documenting the project\'s creation, development, and execution as well as documenting the project\'s scope, budget, and justification.', 'Jakarta Selatan', 'monthly_based', 8000000, 15000000, 'Bachelor\'s Degree', '3 YoE', 'active', '2025-05-13 11:11:29.873', '2026-01-01 00:00:00.000', '2025-05-13 11:11:29.874', '2025-05-13 11:11:29.874', 'on_site', NULL, 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('2db43178-52ef-4414-9ac1-38a1c25d0e11', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Digital Marketing Strategy', 'sales_and_marketing', 'full_time', 'About The Role\n\nAn exciting role in one of Gojek’s products, GoMart, awaits you! If you\'re eager to be part of a fast-paced, data-driven team and aspire to grow into a marketing leadership role, this opportunity is for you.\n\nAs a Digital Marketing Strategist, you will be responsible for developing and executing digital marketing from the communications strategy to execution from awareness, consideration to conversion funnel that grow GoMart in the quick commerce space in Indonesia.\n\nWhat You Will Do\n\nAdapt in app campaigns across Google Ads, Meta Ads (including Facebook and Instagram), TikTok Ads, and other relevant platforms to boost merchant acquisition and engagement\nExperienced in running retargeting on SRN & Partner networks\nDevelop and execute marketing strategy on digital to drive GoMart’s brand awareness. Customer acquisition and conversion.\nLeverage strong analytical skills to assess the entire customer journey across multiple channels and touchpoints, identifying opportunities for enhancement.\nContinuously monitor and analyze asset performance across platforms to optimize impact and drive better results.\nStay up-to-date with the latest trends and best practices in digital marketing and SEO/SEM\nCollaborate across functions & streams such as; product, social media, business team within GoMart stakeholders\nWhat This Role Needs\n\nAt least 3 years of hands-on experience managing digital advertising campaigns, with a focus on Google Ads, Meta Ads (Facebook/Instagram), and TikTok Ads.\nProficient in data analysis and interpretation, with the ability to derive actionable insights from advertising performance metrics to inform campaign optimization strategies.\nStrong creative instincts and the ability to ideate and execute engaging ad creatives that resonate with merchant audiences across different platforms.\nCapability to showcase what metrics to look out for when running retargeting campaigns and methods of optimization.\nExcellent communication and teamwork skills, with the ability to collaborate effectively with cross-functional teams including design, content, and product teams.\nThrive in a fast-paced, ever-evolving environment, with the adaptability to quickly learn and implement new advertising techniques and strategies as platforms evolve\nProficiency on SQL will be a huge plus\nProficiency on SEO will be a huge plus\nAbout The Team\n\nThe GoMart Marketing team in Jakarta is dedicated to elevating GoMart’s brand, keeping it top-of-mind for our users, and ensuring they continuously engage with and love our platform. This team comprises experts in various disciplines such as marketing management, strategy and planning, brand partnerships, CRM, and digital marketing. Together, we fuse data-driven insights with creativity to launch campaigns and innovations that bring joy to our consumers, ensuring they choose GoMart.\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '3 YoE', 'active', '2025-04-20 16:19:29.268', '2026-01-01 00:00:00.000', '2025-03-12 14:31:16.258', '2025-04-20 16:19:29.269', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', 'Fullstack Developer (Backend and Frontend)', 'information_and_communication_technology', 'full_time', 'Analyze, design, and develop a new feature\nProvide internal test before releasing to QA\nProvide ongoing maintenance, support, and enhancement of existing system\nMaintain code bucket, documentation, and versioning\nMonitor server, perform data tuning, and provide technology improvement\nCollaborate with other functions in a team', 'Tangerang Selatan', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 10:46:28.684', '2026-01-01 00:00:00.000', '2025-04-29 10:46:28.685', '2025-04-29 10:46:28.685', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('36b544f0-34bb-44f0-af09-8c1728167477', 'fcd5a494-bc18-4b98-97b3-f3e17af79c24', 'Graphic Designer', 'arts_entertainment_and_media', 'full_time', 'Kami di Solutech Indonesia Maju sedang mencari seorang Graphic Designer yang berbakat dan kreatif untuk bergabung dalam tim kami. Anda akan memainkan peran penting dalam menciptakan konten visual yang menarik, inovatif, dan selaras dengan identitas merek kami—baik untuk platform digital, media sosial, maupun e-commerce seperti Tokopedia, Shopee, dan TikTok Shop.\n\nKandidat ideal memiliki mata tajam terhadap estetika, pemahaman mendalam tentang tren desain terbaru, dan kemampuan untuk menerjemahkan ide menjadi solusi visual yang berdampak.\n\nTanggung Jawab\nMerancang dan mengembangkan berbagai aset visual seperti logo, ilustrasi, infografis, kemasan, dan materi pemasaran lainnya.\n\nMembuat desain iklan dan konten visual untuk media sosial (Instagram & Tiktok) dan e-commerce (Tokopedia, Shopee, TikTok Shop).\n\nBekerja sama erat dengan tim Marketing dan Konten untuk memahami kebutuhan dan menciptakan materi yang relevan serta efektif secara visual.\n\nMengoptimalkan desain untuk berbagai platform digital dan offline, memastikan konsistensi pengalaman pengguna.\n\nMemantau dan mengimplementasikan tren desain terkini untuk menjaga tampilan visual yang segar dan modern.\n\nMenangani beberapa proyek secara bersamaan dalam lingkungan yang cepat dan deadline ketat.\n\nMemberikan ide dan masukan kreatif dalam proses brainstorming untuk mendukung strategi pemasaran visual.\n\nPersyaratan\nLulusan Desain Grafis, Komunikasi Visual, atau bidang terkait.\n\nPengalaman minimal 1 tahun sebagai Graphic Designer, dengan portofolio yang kuat dan bervariasi.\n\nMenguasai Adobe Creative Cloud (Photoshop, Illustrator, InDesign), Figma, dan perangkat lunak desain lainnya.\n\nPaham tren desain terkini, teori warna, tipografi, dan prinsip desain visual.\n\nTerbiasa membuat materi promosi untuk media sosial, e-commerce, dan kampanye digital.\n\nKomunikatif, detail-oriented, dan mampu bekerja dalam tim lintas fungsi.\n\nCekatan, efisien, dan mampu bekerja di bawah tekanan dengan kualitas kerja yang konsisten tinggi.', 'Jakarta Pusat', 'monthly_based', 5500000, 8250000, 'Senior High School', '<1 YoE', 'active', '2025-05-25 10:47:45.475', '2026-01-01 00:00:00.000', '2025-05-25 10:47:45.478', '2025-05-25 10:47:45.478', 'on_site', NULL, '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('36ca9838-845c-40f2-9713-e51f64188be1', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'Social Media Intern', 'sales_and_marketing', 'full_time', 'Sebagai Brand Communication Intern, kamu akan mendapatkan kesempatan berupa:\n\nPengalaman langsung di dunia Marketing Communications\n\nKesempatan bekerja dengan tim profesional dan kreatif\n\nLingkungan kerja yang suportif\n\nDengan detail pekerjaan sebagai berikut:\n\nSocial Media Content Creation : Membantu dan berkoordinasi dengan tim Brandcomm dalam pembuatan konten rutin untuk akun resmi perusahaan\n\nContent & Video Editing : Membantu membuat isi content, melaksanakan shooting dan mengedit content keseluruhan untuk membuat proses pembuatan lebih cepat dengan target 2 video dalam 1 minggu\n\nMembantu pembuatan storyline video podcast, video testimoni pelanggan, Reels, dan lainnya\n\nMinimum Kriteria:\n\nsedang menempuh studi Jurusan Design Komunikasi Visual (Photography/Videography/Content Creation/Sinematography/Animation Editing)\n\nKemampuan menulis yang baik dan mampu menyusun konten untuk para audiens yang beragam, di berbagai macam platform social media\n\nKemampuan public speaking yang baik\n\nKeterlibatan secara aktif di organisasi kampus\n\nFamiliar dengan berbagai platform social media', 'Jakarta Selatan, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:51:57.259', '2026-01-01 00:00:00.000', '2025-05-25 12:51:57.261', '2025-05-25 12:51:57.261', 'on_site', NULL, '87164d99-8e1a-4940-bf28-d5e4dab15468'),
('378c8241-a8a1-44ca-8a53-8584ed856711', '5dc6409f-28bc-486f-a88c-ea95898cc12a', 'Supervisor HSE', 'healthcare_and_social_assistance', 'full_time', 'Uraian Pekerjaan\n\nMelakukan pengawasan terhadap pemenuhan standard Reklamasi paska tambang guna mengembalikan Kembali fungsi lahan yang sudah berakhir masa produksi. Melaksanakan Rencana-rencana terkait Manpower Planning yang di arahkan oleh pimpinan.\n\nMemastikan keberlangsungan pelaksanaan program lingkungan baik pengelolaan dan pemantauan Lingkungan sesuai dengan Amanah dokumen Amdal.\n\nIkut berperan serta meningkatkan keberlangsungan Program Lingkungan dengan menjadi kategori perusahaan penerima Proper.\n\nMemastikan setiap Dokumen Lingkungan tersedia dengan baik guna menjadi pelaporan Kegiatan Lingkungan Perusahaan.\n\nMelakukan Maintenance Area Sediment Pond yang terdapat alat sparing.\n\nMelakukan Maintenance alat sparing.\n\nMemastikan air pada titik IPAL dan titik pantau tidak melewati baku mutu yang telah ditentukan.\n\nMembuat dan mengevaluasi induksi karyawan baru, visitor, atau siswa magang.\n\nMembuat laporan kegiatan HSE-SO Dept untuk di Submit ke Dept Head HSE dan KTT.\n\nMenyiapkan dan membuat, merevisi standard operasional prosedure kerja yang berlaku dan telah ditetapkan.\n\nMelakukan investigasi terhadap adanya kecelakaan kerja, serta membuat rekomendasi perbaikan sebagai tindakan serta langkah awal untuk corrective dan preventive.\n\nMembuat laporan yang berhubungan dengan pekerjaan secara tehknis serta memberi masukkan terhadap kinerja yang tidak aman kepada atasan.\n\nMembuat dan melaksanakan program internal training Dept K3L.\n\n', 'Konawe Utara, Sulawesi Tenggara', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '>5 YoE', 'active', '2025-05-25 12:04:45.566', '2026-01-01 00:00:00.000', '2025-05-25 12:04:45.567', '2025-05-25 12:04:45.567', 'on_site', NULL, 'fce9a01b-1661-4532-9163-09534b3a23a8'),
('3808e583-44d6-41e0-83aa-b0b4d2ca53d3', '474d3aed-ccad-4465-b97a-efc5e6b27903', 'Digital Marketing Specialist', 'sales_and_marketing', 'full_time', '\n1. Develop and execute targeted digital marketing campaigns to approach property owners in Indonesia.\n\n2. Create and manage content for social media, websites, and email marketing.\n\n3. Manage and optimize paid ad campaigns (e.g., Google Ads, Facebook Ads, other Social Media tools).\n\n4. Monitor, analyze, and report on campaign performance to improve results.\n\n5. Collaborate with the BD and Consultant teams to align marketing strategies.\n\n6. Build and maintain the company’s online presence to attract potential clients.', 'Jakarta Barat', 'monthly_based', 6000000, 10000000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-04-29 11:17:54.141', '2026-01-01 00:00:00.000', '2025-04-29 11:17:54.143', '2025-04-29 11:17:54.143', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('3bb94b9c-265a-4ea3-b238-9e3c1a0c69f5', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Associate', 'transportation_and_logistics', 'full_time', 'About the Role\n\nArea Operations Associate is accountable and responsible to support Area Operations Manager for all spectrum operation drivers in the area level, including but not limited to balancing supply and demand (BCR), utilization, driver acquisition, driver engagement, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area\n\nWhat Will You Do\n\nAccountable to support Area Operations Manager tasks by managing day-to-day operations monitoring (2W and 4W) including:  driver acquisition management, driver engagement management (loyalty & retention and safety & performance training), driver exit (i.e. drivers suspension, etc.) management and inventory management (driver attributes and driver warrants), driver income through driver expenses reduction or providing alternative income (i.e. Swadaya, Promo Go) \nCollaborate with Area Operations Manager for day-to-day escalated issues around driver services\nLearn and apply good insights from an operations perspective during the process of establishing new areas of service\nResponsible for end-to-end processes at the channel walk-in center (Driver Support Unit) in the district\nEnsure SOP and legal compliance in the district\nSupport AOM in product changes roll out in the region\nSupport AOM by providing analysis for operations and consumer engagement activities in the area\nWhat Will You Need\n\nHaving at min 3 years experience in operations\nHaving strong analytical thinking and problem-solving skills using various improvement tools (SQL, Big query, metabase) and methods\nHaving a good understanding of supply and demand planning\nHaving good communication skills and good attention to detail and routine activities\nAble to create creative solutions toward operation issues and empower relevant teams to execute properly\nAble to handle communication in community or mass conflict \nFluent in Bahasa Indonesia & proficient in spoken and written in English\nAbout the Team\n\nAs an Area Operations Associate, he/she will support the Area Operations Manager. He/she will work very intensively and collaborate with other Region Operations Managers. He/she also will work closely with the Analytics team to analyze Operations data to get valuable insight and recommendations for the business.', 'Depok', 'monthly_based', 0, 0, 'Senior High School', '3 YoE', 'active', '2025-04-20 16:18:36.236', '2026-01-01 00:00:00.000', '2025-02-25 07:21:04.543', '2025-04-20 16:18:36.237', 'on_site', NULL, '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('410c16d5-523e-4088-bdbc-8630efb43cc1', '5dc6409f-28bc-486f-a88c-ea95898cc12a', 'Staff Legal', 'legal', 'full_time', 'Mengurus perizinan online perusahaan;\n\nMembuat dan/atau mereview kontrak bisnis perusahaan;\n\nMengadministrasikan seluruh surat dan dokumen legal termasuk dokumen teknis secara rapi dan konsisten;\n\nMelakukan korespondensi dengan bisnis partner dan/atau pemerintah secara online;\n\nBekerja sama dengan divisi lain sehubungan dengan kebutuhan data-data legal perusahaan;\n\nMengupdate perkembangan regulasi terutama di sektor pertambangan, lingkungan, & kehutanan;\n\nBerkoordinasi dengan notaris sehubungan dengan perubahan Akta Perusahaan\n\nMerancang dokumen hukum terkait pembebasan/kompensasi lahan', 'Jakarta Pusat, Jakarta Raya', 'project_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 11:57:46.667', '2026-01-01 00:00:00.000', '2025-05-25 11:57:46.668', '2025-05-25 11:57:46.668', 'on_site', NULL, '0c748f50-1089-436f-a569-e39bb45d18fd'),
('4215bb59-0033-4c04-ad7e-42b6cb80749b', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', ' Petugas Gudang Wilayah Jogjakarta', 'transportation_and_logistics', 'full_time', 'Kualifikasi :\n\nMin. Pendidikan SMA semua jurusan\n\nDiutamakan memiliki pengalaman sebagai pelaksana gudang\n\nJobdesk :\n\nMenerima dan memproses barang masuk dan keluar di gudang\n\nMencatat perubahan stok\n\nMempersiapkan barang yang akan dikirim', 'Yogyakarta', 'monthly_based', 2655000, 2655000, 'Senior High School', '<1 YoE', 'active', '2025-05-25 11:08:59.739', '2026-01-01 00:00:00.000', '2025-05-25 11:08:59.740', '2025-05-25 11:08:59.740', 'on_site', NULL, '24864d31-9dca-4358-8ee0-19785af2e606'),
('43070f00-5b84-42d2-b904-9357ff2fcfe9', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', 'Tax Senior Officer', 'finance_and_insurance', 'freelance', 'Prepare and file various tax returns, including income tax, sales tax, and payroll tax, ensuring compliance with all applicable laws and regulations\nStay updated on changes to tax laws and regulations and communicate potential impacts to the organization\nAssist in tax planning activities to optimize tax efficiency and minimize liabilities\nAssist in the preparation of documentation and support for tax audits and examinations\nEnsure compliance with internal controls and policies related to tax accounting and accounts receivable management\nIdentify opportunities to streamline tax compliance processes and accounts receivable procedures to improve efficiency and accuracy', 'Tangerang Selatan', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '4 YoE', 'active', '2025-04-29 11:03:01.486', '2026-01-01 00:00:00.000', '2025-04-29 11:03:01.487', '2025-04-29 11:04:11.225', 'on_site', '2025-04-29 11:04:11.224', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('46afeddd-d872-426b-bea8-d8e9d46e40b1', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Sales buku Wilayah Siantar', 'retail', 'full_time', 'Kualifikasi :\n\nPendidikan Minimal D3 – Semua Jurusan\n\nEnergik, Target Oriented Dan Komunikatif\n\nWajib memiliki SIM C \n\nMenyukai Dunia Marketing\n\nBersedia Untuk Bekerja Secara Mobile Di Lapangan\n\nJobdesk :\n\nMelakukan Promosi Produk - Produk Buku Tulis, Kertas HVS Dan Jasa Cetak Kepada Customer\n\nMelakukan Peliputan Dan Kunjungan Ke Pelanggan\n\nMelayani Pesanan Pembelian Dari Para Pelanggan\n\nMeraih Target Yang Sudah Ditetapkan (target Bulanan, Semester, Tahunan)\n\nMemastikan Pembayaran Tepat Waktu', 'Siantar, Sumatera Utara', 'monthly_based', 3500000, 4000000, 'Associate Degree', '<1 YoE', 'active', '2025-05-25 11:17:07.079', '2026-01-01 00:00:00.000', '2025-05-25 11:17:07.080', '2025-05-25 11:17:07.080', 'on_site', NULL, 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('49360c9e-d0f8-4dbf-a4c4-3651638183ea', '78f64755-71d4-45b0-ae6c-3b2160745909', 'Coordinator Trainee - Accounting', 'finance_and_insurance', 'full_time', 'Melalui program Coordinator Trainee, Anda akan dipersiapkan untuk menjadi seorang Leader dan menempati posisi strategis di perusahaan. Dengan mengikuti program ini, Anda akan diberikan pelatihan dan pengembangan diri oleh para retailer, profesional, dan Top Leaders dari Alfamart yang memiliki banyak pengalaman dan kompetensi di berbagai aspek industri retail dan kepemimpinan.\n\nProgram Coordinator Trainee Logistic akan diawali dengan pendidikan intensif di dalam kelas, on the job training di store, dan rotasi di beberapa kantor cabang Alfamart. Kompetensi Anda akan dikembangkan melalui proyek yang relevan dengan industri retail modern. Hingga pada akhirnya, Anda akan menjadi seorang Finance Accounting Coordinator dengan tanggung jawab memastikan seluruh transaksi keuangan antara Head Office dengan Branch berjalan dengan lancar, serta memastikan seluruh laporan keuangan (laporan Neraca, Rugi Laba, Laporan Hubungan R/K antara toko, warehouse, HO, dan Laporan Hutang Piutang) berjalan dengan akurat dan tepat waktu.', 'Tangerang', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '4 YoE', 'active', '2025-04-29 12:22:50.685', '2026-01-01 00:00:00.000', '2025-04-29 12:22:50.686', '2025-04-29 12:22:50.686', 'on_site', NULL, 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('4e2f3ab7-87c7-46b8-89e7-f99a5ebe9b15', '5dc6409f-28bc-486f-a88c-ea95898cc12a', 'Supervisor Mine Civil Construction', 'construction', 'full_time', 'Kualifikasi :\n\nMinimal D3 Teknik Sipil dari universitas terakreditasi.\n\nMemiliki Sertifikasi K3 Konstruksi (lebih disukai).\n\nMinimal 5 tahun pengalaman sebagai Civil Engineer, dengan 3 tahun di area pertambangan atau proyek infrastruktur berat (heavy civil).\n\nPengalaman dalam mengawasi proyek konstruksi tambang seperti: pembangunan jalan tambang, infrastruktur tailing, jembatan, tanggul, mess, kantor atau fasilitas pengolahan.\n\nMampu membaca gambar teknik sipil, menghitung volume pekerjaan (cut & fill), dan melakukan estimasi biaya serta perencanaan waktu pelaksanaan.\n\nMampu menghitung budget konstruksi dan RAB\n\nMenguasai software teknik sipil seperti AutoCAD, LandDesktop, Civil 3D, SAP2000, STAAD.Pro, atau sejenisnya.\n\nMampu mengawasi operasional lapangan terutama dalam pengawasan kontraktor\n\nBersedia ditempatkan di site KES (Konawe Utara) dan bekerja dengan sistem roster.', 'Konawe Utara, Sulawesi Tenggara', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '>5 YoE', 'active', '2025-05-25 12:01:04.889', '2026-01-01 00:00:00.000', '2025-05-25 12:01:04.891', '2025-05-25 12:01:04.891', 'remote', NULL, '00ea170e-7c1a-4653-861d-b921319a5ee1'),
('4e8014d5-873c-44e3-90fd-36e403a3c284', '8c57d7ab-76b7-46d6-8dc1-098ac50d9302', 'Digital Marketing - Analyst', 'sales_and_marketing', 'full_time', 'Create marketing strategies (end-to-end) from structuring campaigns based on relevant marketing funnels to evaluating marketing strategy performance with the aim of improving the quality of coordination between individuals in the marketing team\nCreate updated content in accordance with the current trends\nCreate campaign plans that have a big impact and are likely to go viral on social media', 'Jakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-04-29 12:36:05.813', '2026-01-01 00:00:00.000', '2025-04-29 12:36:05.814', '2025-04-29 12:36:05.814', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('504354c4-b842-46ed-a681-108f0a87341d', 'fcd5a494-bc18-4b98-97b3-f3e17af79c24', 'Photographer & Videographer', 'arts_entertainment_and_media', 'full_time', 'Kami dari perusahaan Solutech Indonesia Maju sedang mencari seorang Photographer & Videographer yang kreatif dan berbakat untuk bergabung dengan tim kami di kantor kami yang berlokasi di Cempaka Putih, Jakarta. Dalam posisi ini, Anda akan memainkan peran penting dalam menghasilkan konten visual yang menarik dan inovatif untuk mendukung berbagai inisiatif pemasaran dan periklanan perusahaan kami.\n\nTanggung Jawab\n\nMengambil foto dan video yang berkualitas tinggi untuk digunakan dalam berbagai kampanye, publikasi, dan materi komunikasi perusahaan.\n\nBerkolaborasi dengan tim pemasaran dan konten untuk memahami kebutuhan proyek dan menghasilkan visual yang selaras dengan strategi merek.\n\nMengelola pengaturan pemotretan, peralatan, dan lokasi untuk memastikan hasil optimal.\n\nMengedit dan memperbaiki foto dan video untuk memastikan kualitas dan konsistensi.\n\nMemberikan saran kreatif dan ide-ide baru untuk meningkatkan konten visual perusahaan.\n\nMematuhi tenggat waktu yang ketat dan mempertahankan standar kualitas yang konsisten.\n\nPersyaratan\n\nMinimal 1 tahun pengalaman dalam fotografi dan videografi profesional.\n\nKeahlian yang terbukti dalam mengambil, mengedit, dan memproduksi konten visual yang menarik secara estetika.\n\nPenguasaan alat-alat fotografi dan videografi profesional, serta kemahiran dalam perangkat lunak pengeditan.\n\nPemahaman yang baik tentang tren desain dan fotografi terkini.\n\nKemampuan bekerja dengan baik dalam tim dan beradaptasi dengan lingkungan yang berubah cepat.\n\nMemiliki rasa kreatif yang kuat dan kemampuan memecahkan masalah.', 'Jakarta Pusat', 'monthly_based', 5500000, 7000000, 'Senior High School', '<1 YoE', 'active', '2025-05-25 10:49:48.942', '2026-01-01 00:00:00.000', '2025-05-25 10:49:48.942', '2025-05-25 10:49:48.942', 'on_site', NULL, 'e8a6e6c2-6659-4c0a-9e34-bd3f98ec9f9f'),
('5332404c-fa80-42ee-97c4-497bb364d9f2', 'fcd5a494-bc18-4b98-97b3-f3e17af79c24', 'Content Creator', 'arts_entertainment_and_media', 'full_time', 'Solutech Indonesia Maju, perusahaan yang bergerak di bidang penjualan produk elektronik, sedang mencari individu kreatif dan penuh semangat untuk bergabung sebagai Content Creator. Anda akan menjadi bagian dari tim pemasaran yang dinamis dan berkontribusi dalam menciptakan konten media sosial yang menarik guna memperkuat brand dan meningkatkan penjualan. Posisi ini terbuka untuk semua, tidak diperlukan pengalaman kerja atau latar belakang pendidikan tertentu. Yang kami butuhkan hanyalah kemauan untuk belajar dan berkembang bersama kami.\n\nTanggung Jawab Utama\n\nPekerjaan Anda akan mencakup (minimal dua hal berikut):\n\nMembuat konten menarik dan kreatif untuk platform media sosial seperti Instagram dan TikTok, termasuk video pendek, foto, dan caption.\n\nMerencanakan dan menjadwalkan konten mingguan/bulanan berdasarkan kalender konten.\n\nMendesain grafis untuk promosi, iklan, dan visual produk.\n\nMembantu pengembangan strategi media sosial dengan mengikuti tren, riset hashtag, dan analisis kompetitor.\n\nMembantu membalas komentar dan pesan di media sosial serta memantau performa konten menggunakan analitik.\n\nMendukung proses photoshoot produk dan pembuatan konten, termasuk pengaturan properti dan lokasi.\n\nKualifikasi yang Diutamakan (Tidak Wajib)\n\nMinat dan pemahaman terhadap media sosial dan dunia konten digital.\n\nKeterampilan dasar desain grafis.\n\nKemampuan komunikasi yang baik dan mampu bekerja dalam tim.\n\nKreatif, terbuka terhadap ide baru, dan mampu berpikir out-of-the-box.\n\nCatatan Tambahan\nKami percaya bahwa potensi lebih penting dari pengalaman. Jika Anda memiliki semangat belajar, rasa ingin tahu yang tinggi, dan tertarik dengan media sosial serta produk elektronik, kami sangat ingin mengenal Anda.', 'Jakarta Pusat', 'monthly_based', 5000000, 7000000, 'Senior High School', '<1 YoE', 'active', '2025-05-25 10:45:03.142', '2026-01-01 00:00:00.000', '2025-05-25 10:45:03.143', '2025-05-25 10:45:03.143', 'on_site', NULL, '8d358309-6960-43d4-a006-f4e537951474'),
('533c1bbd-4eb2-4d64-beee-cad15039eb28', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', 'Tax Senior Officer', 'finance_and_insurance', 'freelance', 'Prepare and file various tax returns, including income tax, sales tax, and payroll tax, ensuring compliance with all applicable laws and regulations\nStay updated on changes to tax laws and regulations and communicate potential impacts to the organization\nAssist in tax planning activities to optimize tax efficiency and minimize liabilities\nAssist in the preparation of documentation and support for tax audits and examinations\nEnsure compliance with internal controls and policies related to tax accounting and accounts receivable management\nIdentify opportunities to streamline tax compliance processes and accounts receivable procedures to improve efficiency and accuracy', 'Tangerang Selatan', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '4 YoE', 'active', '2025-04-29 11:03:00.524', '2026-01-01 00:00:00.000', '2025-04-29 11:03:00.525', '2025-04-29 11:03:00.525', 'on_site', NULL, 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('54523e88-9358-4979-891f-88ef57d8e3e8', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Account Executive Semarang', 'sales_and_marketing', 'full_time', 'Tanggung jawab Kerja:\n\nMenangani promosi pasar dan produk, panggilan dan kunjungan pelanggan, menegoisasikan penjualan dan menutup pesanan untuk memenuhi kuota penjualan\n\nSanggup menggali potensi pasar Horeka\n\nMencapai penjualan sesuai dengan target yang diberikan\n\nMenjaga hubungan baik dengan industri F&B, seperti: Hotel, apartemen restoran, cafe dan institusi lainnya untuk mencapai target pejualan bulanan\n\nMembuat laporan harian, mingguan, maupun bulanan\n\nMenguasai peta Semarang', 'Semarang, Central Java', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:39:55.418', '2026-01-01 00:00:00.000', '2025-05-25 12:39:55.419', '2025-05-25 12:39:55.419', 'on_site', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('590431d2-7ea1-4fdb-97fe-59fc79a8de8c', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Business Analyst Staff', 'sales_and_marketing', 'full_time', 'Deskripsi Pekerjaan: \n\nMonitoring & Performance Analysis : Memonitor dan menganalisa performa sales dari masing-masing divisi, serta performa sales secara keseluruhan.\n\nMengelola Data : Mengumpulkan dan mengolah data tim operasional sesuai dengan template laporan untuk dikirimkan ke PIC terkait dan juga kepada pimpinan.\n\nMenyusun Rencana Kerja : Menyusun rencana kerja dan perbaikan berdasarkan analisa performance dari masing-masing divisi untuk mendapatkan hasil yang lebih baik dan efisien.\n\nMembuat Laporan : Menyusun dan mengembangkan kebutuhan laporan sales ataupun yang dibutuhkan oleh perusahaan dan memberikan saran terhadap output laporan untuk pengambilan keputusan yang baik dalam penjualan.\n\nManagement Reporting : Memeriksa dan mengevaluasi setiap laporan serta memastikan tersedianya laporan perusahaan termasuk laporan progress, performa penjualan, analisa pasar, dsb sesuai yang dibutuhkan user/ pimpinan business unit/management perusahaan secara berkala dan akurat\n\nPengelolaan dan Pengembangan Tim : Mampu berpartisipasi dalam mendukung pengembangan tim.\n\nPembuatan SOP : Membantu menyusun dokumentasi SOP dan proses bisnis baru.', 'West Jakarta, Jakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:32:29.338', '2026-01-01 00:00:00.000', '2025-05-25 12:32:29.341', '2025-05-25 12:32:29.341', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('5b8ca058-d0c2-467c-8638-cc389c34944a', '18407767-ad4d-4d4c-8472-8fc55f6adb1f', 'E-Commerce Specialist', 'information_and_communication_technology', 'full_time', 'Merencanakan, menjalankan, dan memantau strategi e-commerce di berbagai platform (website, marketplace seperti Tokopedia, Shopee, dll.).\nMenganalisis performa penjualan dan campaign, serta mengoptimalkannya.\nMengelola operasional dan pengembangan platform e-commerce (termasuk iklan di Meta, TikTok, Google, dan marketplace).\nMemantau tren pasar, menganalisis kompetitor, dan menemukan peluang pertumbuhan.\nBerkolaborasi dengan tim lain untuk konten dan kelancaran operasional e-commerce.\nMengelola anggaran e-commerce dan memastikan ROI yang baik.', 'Bekasi', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '3 YoE', 'active', '2025-05-13 11:42:53.702', '2026-01-01 00:00:00.000', '2025-05-13 11:42:53.702', '2025-05-13 11:42:53.702', 'on_site', NULL, 'f8a51df4-199b-46a5-ba08-528d35427b29'),
('5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'caf32328-7dac-4ab2-ab07-6c8bec5b3944', 'Marketing Staff', 'sales_and_marketing', 'full_time', 'Analisa pasar, penarikan pasar, pengumpulan informasi pelanggan, penyebaran iklan.\n\nMembangun dan Mempertahankan hubungan dengan pelanggan, menegosiasikan Kerjasama logistic dan transportasi dan membimbing pelanggan dan untuk menandatanganin kontrak pengirim.\n\nBertanggung jawab atas koordinasi operasional pelanggan VIPPemeliharaan pelanggan dan kunjungan follow up untuk memastikan bahwa pengalamanoperasional pelanggan tidak terpengaruh', 'Medan, Sumatera Utara', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-05-13 10:29:46.170', '2026-01-01 00:00:00.000', '2025-05-13 10:29:46.171', '2025-05-13 10:29:46.171', 'on_site', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500');
INSERT INTO `jobs` (`job_id`, `company_id`, `title`, `category`, `employment_type`, `description`, `location`, `salary_type`, `minimum_salary`, `maximum_salary`, `education_requirement`, `experience_requirement`, `status`, `published_at`, `expired_at`, `created_at`, `updated_at`, `work_type`, `deleted_at`, `skills_category_id`) VALUES
('5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', '32c95585-e39c-406a-959a-de30d26f173c', 'Digital Marketing', 'sales_and_marketing', 'full_time', '1. Pengembangan Strategi Digital Marketing\n\n• Bekerja sama dengan tim digital marketing dan buisness development untuk merancang dan menerapkan strategi pemasaran yang efektif untuk layanan produk dan jasa yang ditawarkan ke market potensial.\n\n• Menguasai penggunaan aplikasi untuk melakukan layanan iklan digital, seperti: Meta Ads, E-commerce Ads & Social Media Strategy.\n\n2. Manajemen Merek (Brand Management )\n\n• Memastikan konsistensi merek di semua saluran pemasaran (digital, offline, acara).\n\n• Mengelola aktivitas digital marketing dan pencitraan merek yang selaras dengan target preferensi pasar.\n\n3. Creative Campaigns & Activations\n\n• Mengembangkan dan mengelola kampanye iklan (ads).\n\n• Berkolaborasi dengan tim kreatif dan media untuk membuat konten yang menarik.\n\n• Membangun strategi digital marketing untuk meningkatkan penjualan dan brand growth.\n\n4. Market Research\n\n• Mampu melakukan analisa pasar (market research) dan analisa perilaku konsumen (consumer behaviour) dengan berkolaborasi dengan tim data analyst dan data scientist.\n\n• Memahami kebutuhan klien yang berhubungan dengan bisnis dan memberikan solusi terhadap permintaan mereka.', 'Depok', 'monthly_based', 3500000, 7500000, 'Associate Degree', '<1 YoE', 'active', '2025-04-29 12:55:31.748', '2026-01-01 00:00:00.000', '2025-04-29 12:55:31.749', '2025-04-29 12:55:31.749', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('6166c8e2-63b5-4626-bb3b-b7efe6957a90', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Operator Forklift Jakarta', 'transportation_and_logistics', 'full_time', 'DESKRIPSI PEKERJAAN\n\n\n- Melakukan Verifikasi Ceklis Forklift Untuk Gudang\n\n- Menyampaikan Jadwal Kedatangan Barang \n\n- Melakukan Pengecekan Kartu Stock\n\nPERSYARATAN PELAMAR\n\n\n- Min. SMK Semua Jurusan \n\n- Usia Maks. 27 Tahun \n\n- Mampu Mengendarai Forklif & Memiliki SIO ', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-05-25 11:10:13.621', '2026-01-01 00:00:00.000', '2025-05-25 11:10:13.622', '2025-05-25 11:10:13.622', 'on_site', NULL, '24864d31-9dca-4358-8ee0-19785af2e606'),
('650f3fb0-3941-4250-a626-945fef2317ac', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Staff', 'transportation_and_logistics', 'full_time', 'About The Role\n\nArea Operations Staff accountable and responsible to support Area Operations Supervisor for all spectrum operation drivers at Area level, including but not limited to hold driver engagement activity, driver acquisition, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area.\n\nWhat You Will Do\n\nHandle driver support unit/walk in center in the area: onboarding, troubleshooting, attribute selling, issue escalation;\nManage driver community: coordination, training, troubleshooting, issue escalation;\nConduct online and offline program related to driver partners’ activities;\nMonitor all operations metrics (Demand, Supply, Reliability, Service Level, Risk, etc), propose action plan, and escalate if necessary;\nCoordinate with Area Operations Supervisor for day-to-day escalated issues around driver service.\nWhat You Will Need\n\nFresh graduate, having working experience is a plus;\nDiploma/Bachelor degree with min GPA of 3.0, from top university is a plus;\nGood communication skill and social media literacy;\nGood critical thinking and problem solving skill;\nIntermediate proficiency in Excel/Google Sheet;\nIntermediate proficiency in spoken and written in English.\nAbout The Team\n\nAs Area Operations Staff, he/she will support the Area Operations Supervisor on a day to day basis. He/she also will work closely with the drivers in the field and will be the first contact for driver to escalate any issues.', 'Lampung, Indonesia', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-02-17 13:42:30.902', '2026-01-01 00:00:00.000', '2025-02-17 13:42:30.904', '2025-02-17 13:43:54.621', 'on_site', '2025-02-17 13:43:54.620', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('67bcedad-17b7-4e7f-8f72-2a4b66b2db48', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Software Engineer', 'information_and_communication_technology', 'full_time', 'About the Role\n\nThis role will require you to develop scalable and reliable web services and solutions within the location search domain. Be part of a highly-productive and motivated engineering team on its journey to deliver the best products to GoJek users and internal customers. This role provides an opportunity to work on challenging real-world geospatial problems in one of the most prominent startups in South-East Asia.\n\nWhat You Will Do\n\nAs a backend engineer, you will play a critical role in designing, developing, and deploying highly performant search services to be used by the core GOTO businesses - mobility, ecommerce, logistics\nBe responsible for the end-to-end development and delivery of small to medium size features and services\nSupport production and integration environments with your colleagues and participate in incident resolution\nCollaborate closely with the Cartography Data Science team to turn their models and data into practical solutions\nWork with the Map Ops team to develop features that help curation and fine-tuning of geospatial data\nActively support the tracking and reporting execution metrics within your team\nWhat You Will Need\n\n2+ years of strong experience in software development\nExperience in designing, developing, testing and deploying large-scale applications in any language or stack, preferably using Golang\nDeep knowledge of different databases (SQL / NoSQL) and their tradeoffs. We primarily use Redis, PostgreSQL + PostGIS, and ElasticSearch; familiarity with any is a plus\nProficiency in OOP, including design patterns. Experience with functional programming is a plus\nKnowledge of Unit Testing, Integration Testing, Load / Stress Testing, and Test Driven Development\nAbility to absorb the best engineering practices and take pride in your work\nTo be a generalist with a growth mindset\nAbout the Team\n\nAt the heart of Gojek’s businesses, we move things around. Whether that’s people, food, packages, fresh groceries, etc. Moving things around boils down to understanding the best route, traffic, and locations. The Cartography team is an internal team that surfaces mapping technologies needed by all internal product teams within Gojek. Cartography is a small but critical team that significantly impacts the lives of our drivers and users.\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-GOTO\n\n#LI-Onsite', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '2 YoE', 'active', '2025-04-20 16:19:39.277', '2026-01-01 00:00:00.000', '2025-03-12 14:06:43.953', '2025-04-20 16:19:39.277', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('6bf0136f-1f8f-4916-969a-0014607c6bbb', '7feedb3a-20b2-4009-a3c1-d421028dbc2b', 'Junior Legal Staff', 'legal', 'full_time', 'Job Descriptions\n\nDrafting and/or reviewing NDAs (Non-Disclosure Agreements) and PKS (Cooperation Agreements) with Product Application Service Users\n\nEnsuring the completeness of administrative documents for potential Partners and Vendors\n\nEnsuring that all documents comply with applicable laws and regulations\n\nConducting reviews of all internal and external legal documents of the company\n\nRegularly update and report on legal documentation related to the company’s operations', 'Jakarta Barat, Jakarta Raya', 'monthly_based', 2000000, 3000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:14:43.806', '2026-01-01 00:00:00.000', '2025-05-25 12:14:43.807', '2025-05-25 12:14:43.807', 'on_site', NULL, '0c748f50-1089-436f-a569-e39bb45d18fd'),
('6db391e1-5f10-4531-8bb1-7867138437a4', '5dc6409f-28bc-486f-a88c-ea95898cc12a', 'Superintendent HRGA-IT', 'information_and_communication_technology', 'full_time', 'Job Deskripsi :\n\nMenyusun dan mengimplementasikan kebijakan HR sesuai dengan regulasi ketenagakerjaan.\n\nMenangani hubungan industrial, penyelesaian konflik, dan administrasi ketenagakerjaan.\n\nMemastikan kelancaran proses penilaian kinerja dan pengembangan SDM.\n\nMengelola akomodasi, transportasi, fasilitas kantor, dan konsumsi untuk seluruh karyawan site.\n\nMenyusun laporan aset dan pengelolaan inventaris di site.\n\nMenjalin hubungan eksternal yang baik dengan pemerintah lokal, masyarakat, dan vendor.\n\nMengawasi operasional jaringan dan infrastruktur IT di site.\n\nBekerja sama dengan tim IT pusat untuk pengembangan sistem dan troubleshooting.\n\nMenjamin keamanan data dan operasional sistem IT untuk mendukung kegiatan pertambangan.', 'Konawe Utara, Sulawesi Tenggara', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '>5 YoE', 'active', '2025-05-25 12:07:00.210', '2026-01-01 00:00:00.000', '2025-05-25 12:07:00.211', '2025-05-25 12:07:00.211', 'on_site', NULL, '90bad989-8cb1-493a-bc45-3edeb6084bd6'),
('714aca3f-3d15-4086-8f3f-461529b14812', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Account Executive', 'finance_and_insurance', 'full_time', 'As an Account Executive International at PT Gelora Aksara Pratama (Erlangga Group), you will be responsible for managing and developing relationships with key international customers. In this role, you will play a vital part in driving sales growth and maintaining strong, long-lasting partnerships with our global client base.\n\nWhat you\'ll be doing\n\nActively prospect and identify new international sales opportunities\n\nManage and grow existing international customer accounts through exceptional relationship building and account management\n\nNegotiate and close sales contracts with international clients\n\nCollaborate closely with cross-functional teams to deliver exceptional customer service and support\n\nDevelop and execute effective sales strategies to meet and exceed quarterly and annual sales targets\n\nProvide regular reporting and analysis on sales performance, customer activity and market trends\n\nWhat we\'re looking for\n\nProven track record of success in an international sales or account management role, ideally within the sales industry\n\nStrong communication and interpersonal skills, with the ability to build rapport and negotiate effectively with senior-level stakeholders\n\nExcellent commercial acumen and analytical skills to identify business opportunities and drive sales growth\n\nFluency in English, with proficiency in an additional language highly desirable\n\nWillingness to travel internationally to meet with clients as required', 'Jakarta Timur', 'monthly_based', 5397500, 5400000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 11:24:39.316', '2026-01-01 00:00:00.000', '2025-05-25 11:24:39.317', '2025-06-01 15:17:22.438', 'on_site', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Sales Wilayah Jogja', 'retail', 'full_time', 'Kami dari PT Gelora Aksara Pratama (Erlangga Group) membuka posisi Sales Wilayah Jogja yang strategis untuk bergabung dengan tim kami. Sebagai seorang Sales, Anda akan memainkan peran penting dalam mempromosikan dan menjual produk-produk kami di wilayah Yogyakarta. Ini adalah peluang yang menarik bagi kandidat yang berpengalaman di bidang penjualan ritel dan siap untuk mengambil tanggung jawab yang lebih besar.\n\nTanggung Jawab Utama\n\nMengembangkan dan memelihara hubungan dengan pelanggan ritel di wilayah Yogyakarta\n\nMempromosikan dan menjual produk-produk kami secara efektif, memenuhi atau melampaui target penjualan yang ditetapkan\n\nMemastikan ketersediaan produk di toko-toko ritel mitra\n\nMemberikan masukan dan saran untuk meningkatkan strategi penjualan dan pemasaran kami\n\nMelaporkan kemajuan dan pertumbuhan penjualan secara berkala\n\nMenjadi duta merek yang baik dan mendukung inisiatif pemasaran kami\n\nKeterampilan, Kualifikasi, dan Pengalaman yang Dibutuhkan\n\nPemahaman yang baik tentang pasar ritel dan tren di wilayah Yogyakarta\n\nKemampuan berkomunikasi dan bernegosiasi yang kuat, dengan orientasi pelanggan yang tinggi\n\nKeahlian dalam menganalisis data penjualan dan membuat strategi berdasarkan wawasan tersebut\n\nKemampuan untuk bekerja secara mandiri dan di bawah tekanan\n\nMemiliki kendaraan pribadi dan SIM C yang masih berlaku', 'Yogyakarta', 'monthly_based', 2655000, 2700000, 'Senior High School', '<1 YoE', 'active', '2025-05-25 11:22:32.260', '2026-01-01 00:00:00.000', '2025-05-25 11:22:32.261', '2025-05-25 11:22:32.261', 'on_site', NULL, 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('79972b71-82b0-4e42-a3aa-371b4b2488ca', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'HR Payroll Internship', 'human_resources_and_administration', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu pembuatan slip gaji karyawan setiap bulan\nMengelola dan merapikan data payroll & absensi\nMembantu tugas administratif HR lainnya', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Associate Degree', '<1 YoE', 'active', '2025-04-29 13:28:57.457', '2026-01-01 00:00:00.000', '2025-04-29 13:28:57.458', '2025-04-29 13:28:57.458', 'remote', NULL, '0e57d284-21c7-4958-9f41-efc488823c93'),
('7aec7881-000d-4443-ac2c-79a663ae1673', '474d3aed-ccad-4465-b97a-efc5e6b27903', 'Business Development', 'sales_and_marketing', 'full_time', 'Identifying, qualifying and securing industrial property opportunities\nGive most suitable property recommendation based on client requirements\nCreate and present a long term cooperation with relevant industries\nCollaboration with sales team for site inspection with client\nAct as a trusted advisor to clients, offering insights and recommendations on real estate investment strategies and market dynamics\nLead negotiations and contract discussions to secure new business opportunities and partnerships\nRepresent the company at industry events, conferences, and networking functions to enhance our brand visibility and reputation\nStay updated on industry regulations, market conditions, and best practices to inform strategic decision-making and maintain a competitive edge', 'Semarang', 'monthly_based', 6000000, 8000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 11:44:50.052', '2026-01-01 00:00:00.000', '2025-04-29 11:44:50.053', '2025-04-29 11:44:50.053', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('7d93b9a5-45d2-412e-a8c1-626e4996eb32', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Senior Data Analyst - Growth', 'information_and_communication_technology', 'full_time', 'About the role:\n\nHere comes a new challenge for you who is seeking the next leap in your career growth, being our Assortment and Conversion Analytics for GoFood! In this role, you will lead problem-solving processes and execute solutions with focus on improving demand and growth metrics for GoFood. Combining business strategy and customer experience & behavior analysis, you will do experiments and campaigns that will encourage our users to experience the product’s core value as quickly as possible which will also improve the product\'s account spending. In short, you’ll get out of bed every day thinking about new ways to solve exciting problems and grow the business, how cool is that!\n\nDiscover growth opportunities in the business metrics and customer metrics by exploring business data, transaction data, customer activity within apps and actual customer insights\nDrive actionable insights recommendation such as making funnel conversion analysis, cohort analysis, long-term trends, user segmentation, etc.\nIdentify the business need and generate hypothesis based on business need to design & run experiments\nBuild predictive model or clustering model to improve consumer targeting intervention effectiveness\nAbility to integrate qualitative data (user interviews, surveys, and behavioral research) alongside quantitative analysis to enhance EDA, refine hypothesis testing, and identify friction points to improve customer experience and business strategies\nCreate and manage dashboards and data pipelines to monitor metrics to measure business performance\nWorking closely with the Business team and other data team (Data Engineer, Data Science) to implement data solution. \nBS/MS in Engineering, Computer Science, Math, Statistics, or equivalent experience\nMinimum 3 years of working experience in data analytics field\nProficiency in data analysis tools and programming languages such as Python, R, SQL, and data visualization tools like Tableau, or Looker. Strong analytical skills to interpret complex data sets and extract actionable insights.\nHigh proficient in Experiment and Hypothesis Testing for multiple scenarios of business\nHigh proficient in Descriptive Analytics, Predictive Analytics, Clustering analytics\nData Management: Familiarity with data collection, storage, and management best practices. \nStrong business acumen and project management skills with successful experience in collaborating with cross-functional teams\nEnd to end the problem-solving mindset that can work in increments and exponents\nExperience in a Marketplace, Food Delivery or other technology companies is a plus\nMeet the team that has been instrumental in Gojek\'s growth! We served more than 200 million transactions every month! Also, we strengthen the business group by having deeper knowledge about what are the best recommendations and promotions that are suitable for the customer\'s needs. From recommending what is the best meal to cheat your diet at 10 pm or offering the latest promotion near your place, we always seek how to extend the product value through our most up-to-date data and marketing solution.\n\nGoFood Growth pod consists of more than 50 persons that consist of different roles , we seek to improve ourselves by learning from everyone. You will get to meet with almost every team there is in Gojek, from the Product Manager, Data Science, to the Operation team. This team is the melting-pot for the Econ, Marketeers, and the Data geeks. While the script running and the campaign launching, we often kill the time by fooling around by imposing ourselves in Among Us or build an alibi as the \"Loyal servant of the Arthur\" in Avalon (hey, I\'m not the minion guys 😃).\n\nPsst, at the moment we are aiming to upgrade our operation through automation and machine learning. If you are interested in solving business problems through the latest cutting-edge data solution, this is the right place for you!\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '3 YoE', 'active', '2025-04-20 16:18:45.821', '2026-01-01 00:00:00.000', '2025-03-12 14:26:10.478', '2025-04-20 16:18:45.822', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('836e1950-1cd0-4be1-92e9-c40e820ea351', 'caf32328-7dac-4ab2-ab07-6c8bec5b3944', 'Finance Settlement Staff', 'finance_and_insurance', 'full_time', 'Assist for Income and Commission data of E-commerce especially for reporting Monthly to Accounting Team\nDo analyze for checking & Compare Data From system for invoicing.\nPrepare Reconcile of Proforma Invoice with platform\nAssist for COD Report Daily Update and COD Monthly report\nProvide anything requested by both internal & External parties.\nImprovement Operational\nAdministratif and like detailing things', 'Jakarta Utara, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-13 10:27:17.437', '2026-01-01 00:00:00.000', '2025-05-13 10:27:17.438', '2025-05-13 10:27:17.438', 'on_site', NULL, 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('8a2137e1-3964-4bca-b10a-c53a1cab86bb', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'KOL Internship', 'sales_and_marketing', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu tim mencari dan menghubungi KOL/Influencer\nMonitoring dan follow-up kampanye yang sedang berjalan\nMembuat report hasil kerja sama dengan KOL\nRiset KOL baru yang relevan dengan brand dan komunikasi KOL\n', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 13:31:56.451', '2026-01-01 00:00:00.000', '2025-04-29 13:31:56.452', '2025-04-29 13:31:56.452', 'remote', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('8c19dc05-9b17-4712-ac4e-384c30fc6d85', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'HR Payroll Internship', 'human_resources_and_administration', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu pembuatan slip gaji karyawan setiap bulan\nMengelola dan merapikan data payroll & absensi\nMembantu tugas administratif HR lainnya', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Associate Degree', '<1 YoE', 'active', '2025-04-29 13:28:30.130', '2026-01-01 00:00:00.000', '2025-04-29 13:28:30.131', '2025-04-29 13:29:10.285', 'remote', '2025-04-29 13:29:10.284', '0e57d284-21c7-4958-9f41-efc488823c93'),
('8c380a5c-3497-472a-bc3a-b1050f20875c', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'HR Payroll Internship', 'human_resources_and_administration', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu pembuatan slip gaji karyawan setiap bulan\nMengelola dan merapikan data payroll & absensi\nMembantu tugas administratif HR lainnya', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Associate Degree', '<1 YoE', 'active', '2025-04-29 13:28:25.726', '2026-01-01 00:00:00.000', '2025-04-29 13:28:25.727', '2025-04-29 13:29:04.958', 'remote', '2025-04-29 13:29:04.958', '0e57d284-21c7-4958-9f41-efc488823c93'),
('8cc071a5-7507-437b-8eae-a886c03de4d5', '1db185d9-169e-4747-a037-8790fdf2ae72', 'Performance Test Engineer', 'information_and_communication_technology', 'full_time', 'Design, develop, and execute performance testing scripts to evaluate system behavior\nCollaborate with developers and business analysts to understand system requirements and translate them into performance test scenarios.\nAnalyze test results, identify bottlenecks, and work closely with the development team to provide recommendations for improvement.\nAssist in ensuring application performance standards are met, particularly for products in the banking and financial services industry.\nDocument testing procedures, scenarios, and results with precision and clarity.\nParticipate in sprint planning and QA reviews, and support cross-functional teams in a fast-paced and agile environment.\nDemonstrate proactive problem-solving skills and maintain a customer-oriented mindset throughout the testing cycle.', 'Jakarta', 'monthly_based', 5800000, 6500000, 'Bachelor\'s Degree', '<1 YoE', 'draft', '2025-05-13 11:14:18.186', '2026-01-01 00:00:00.000', '2025-05-13 11:14:18.187', '2025-05-13 11:14:18.187', 'on_site', NULL, '154c21a0-af95-415b-9b14-ab849f08dc84'),
('8cd754fb-6def-4b9c-a004-f2d40c82048f', '1db185d9-169e-4747-a037-8790fdf2ae72', 'IT Business Analyst', 'information_and_communication_technology', 'full_time', 'Analyzing Clients needs and make business flow for application to a document such as BRD Business Requirement Document.\nDo research for company product\nResponsible for analyzing business and technical documentation including data mapping rules, product description and parameterization\nDelegating tasks to the programmer and monitoring progress profession\nValidate the results by supporting the functional test and acceptance processes, as well as test application\nProvide references by writing technical documentation\nDevelop solutions by preparing and evaluating alternative workflow solutions', 'Yogyakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '3 YoE', 'active', '2025-05-13 11:20:47.522', '2026-01-01 00:00:00.000', '2025-05-13 11:20:47.523', '2025-05-13 11:20:47.523', 'remote', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Software Engineer (Android) - Comms Platform', 'information_and_communication_technology', 'full_time', 'About the Role\n\nAs a backend engineer on the Help Experience team at Gojek, you’ll play a crucial role in enhancing how we connect with our users across various channels. Your work will involve tackling complex technical challenges & building large-scale systems. The solutions you develop will directly affect every Gojek customer & driver.\n\nWhat You Will Do\n\nCollaborate with Help Experience Tech Leads to develop and implement features that enhance communication efficiency and ensure high scalability\nTakes responsibility for the entire lifecycle of their stories: development, test, production, and subsequent fixes and improvements\nDesign and develop customized solutions that are scalable and generic, catering to the diverse needs of the platform’s clients\nMaintain the security and integrity of the platform and its integrations\nPerforms code reviews that follow the standards and practices of the engineering handbook and that are recognized by their team as helpful\nCollaborates with other engineers, designers and QAs to flesh out implementation details based on the established pattern in the stream\nActively contribute to tracking and reporting system metrics within the team.\nWhat You Will Need\n\nShould have at least 2+ years of experience with Android development \nProficient in Kotlin programming, Java, and Android APIs\nStrong knowledge of Android Apps architecture and implementation\nAbility to write model code for functional and nonfunctional requirements and help improve the code quality standards across the team\nWorking experience with popular libraries for networking, async, image loading, etc\nWell-versed with Agile methodologies, TDD, and Test Engineering & Automation\nBonus points if: Have experience in Running A/B or multi-variant experiments for features that you built\nAbout the Team\n\nThe Help Experience team is a key function for our customer care vision of providing the best in class customer service using multiple channels. This team is part of the larger Communications Platform. We support the entire Gojek ecosystem handling the entire customer, merchant and driver domain.One of the biggest challenges we deal with is how to leverage technology and automation to provide fast and correct problem resolution using our Chatbots, ML models and in-app SDKs in a multi region, multilingual and multi domain way. We value a great learning culture, having a growth mindset and providing great ownership to each individual. We also know the importance of having fun and enjoying working.', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '2 YoE', 'active', '2025-04-20 16:19:08.034', '2026-01-01 00:00:00.000', '2025-03-12 14:16:22.878', '2025-04-20 16:19:08.035', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'Data Science Intern', 'information_and_communication_technology', 'full_time', 'Job Description\nas a Project support Intern, responsibilities as listed below, but not limited to:\n\nsupporting on going project on Health Claims Team\nAnalyzing & visualizing Big Data using machine learning tools\nCoordination with related department regarding the solution needed\nCreate reports regarding the projects\nMinimum Qualifications\nCurrently pursuing bachelor degree from any major\nAttention to detail\nProficient in using microsoft excel & machine learning tools such as pythons\nStrong analytical and planning skills;\nGood communication and presentation skills;', 'Kebayoran Lama, Jakarta Raya', 'monthly_based', 5000000, 6000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:48:11.031', '2026-01-01 00:00:00.000', '2025-05-25 12:48:11.032', '2025-05-25 12:48:11.032', 'on_site', NULL, 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('934b1525-7184-489f-a70f-864aaeaded5e', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Finance & Accounting Staff', 'finance_and_insurance', 'full_time', 'Job descriptions:\n\nRekonsiliasi omset\n\nMembuat dan menagih invoice\n\nMembuat laporan terkait piutang dagang dan omset\n\nMengecek dan menerima nota retur\n\nMengecek dan menerima nota debet\n\nMenginput transaksi kas bank\n\nRekonsiliasi bank\n\nCash opname\n\nStock opname', 'Jakarta Barat, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:28:43.091', '2026-01-01 00:00:00.000', '2025-05-25 12:28:43.092', '2025-05-25 12:28:43.092', 'on_site', NULL, 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('9d731152-4c5b-41e6-9781-aef7cb3adb7f', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Logistic Staff', 'manufacturing', 'full_time', 'Qualifications:\n\n Bachelor\'s degree in Engineering (Industrial), Accounting, or Management\n Minimum GPA of 3.00\nWilling to be placed in Semarang\nJob Description:\n\nProviding efficient support and ensuring success of procurement and logistic activities\nProviding efficient utilization of resources under applicable standards', 'Semarang, Jawa Tengah', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:30:32.538', '2026-01-01 00:00:00.000', '2025-05-25 12:30:32.539', '2025-05-25 12:30:32.539', 'on_site', NULL, '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('9f774803-bb84-40c1-a73b-2ec9c2521b2e', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Senior Data Analyst', 'information_and_communication_technology', 'full_time', 'Create business impact by working on strategic initiatives in Gojek focussed on analysis and experimentation. \nBuild & maintain dashboards for tracking business performance and product adoption.\nDeliver insight, analysis using statistical tools, data visualization, and business use case to product and business team.\nPartner closely with Product Managers and Business teams to help them make decisions.\nHandle Gojek Product and Business team in identifying product or business opportunities and support in product delivery such as experimentation.\nAutomate data extraction by creating denormalized tables or data mart based on business or product requirement.\nAt least 3 years of working experience with basic statistics or product analytics. Furthermore with a strong business sense and data-driven role background\nExpert in SQL , data visualization and dashboarding . \nComfortable working both independently with minimal guidance and in a team setting\nAbility to use critical thinking daily to manage daily tasks while being goal-oriented\nAbility to transform an ambiguous business or product problem into a well-scoped and impactful analysis; able to design simple experiments\nExposure to visualization and dashboarding tools like   Tableau, Metabase, Google Data Studio, Clevertap, Python, etc is a plus.\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '3 YoE', 'active', '2025-04-20 16:18:52.630', '2026-01-01 00:00:00.000', '2025-03-12 14:19:39.694', '2025-04-20 16:18:52.632', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('9fc93fa5-3565-4f60-b94d-b30d5bab8d27', '553c7af2-32bd-4c1e-a600-c036a990bfcd', 'Staff HRD Lapangan', 'human_resources_and_administration', 'full_time', '- Mengelola sistem penggajian termasuk data absensi (sistem shift) dan payroll (lembur)\n* Mengidentifikasi komponen gaji karyawan (upah pokok, tunjangan, komisi).\n* Mengelola database karyawan (softfile dan hardfile).\n* Menyusun peraturan perusahaan dan kontrak kerja.\n* Membuat dan mensosialisasikan SOP perusahaan.\n* Mengelola proses rekrutmen dari awal hingga akhir.\n- Mengelola proses onboarding untuk karyawan baru.', 'Surabaya', 'monthly_based', 4000000, 4500000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 10:11:51.504', '2026-01-01 00:00:00.000', '2025-05-13 10:11:51.505', '2025-05-13 10:11:57.554', 'on_site', '2025-05-13 10:11:57.553', '0e57d284-21c7-4958-9f41-efc488823c93'),
('a19d968a-a097-42d1-ad80-f3039fe26cda', '553c7af2-32bd-4c1e-a600-c036a990bfcd', 'Staff HRD Lapangan', 'human_resources_and_administration', 'full_time', '- Mengelola sistem penggajian termasuk data absensi (sistem shift) dan payroll (lembur)\n* Mengidentifikasi komponen gaji karyawan (upah pokok, tunjangan, komisi).\n* Mengelola database karyawan (softfile dan hardfile).\n* Menyusun peraturan perusahaan dan kontrak kerja.\n* Membuat dan mensosialisasikan SOP perusahaan.\n* Mengelola proses rekrutmen dari awal hingga akhir.\n- Mengelola proses onboarding untuk karyawan baru.', 'Surabaya', 'monthly_based', 4000000, 4500000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 10:11:33.878', '2026-01-01 00:00:00.000', '2025-05-13 10:11:33.878', '2025-05-13 10:11:33.878', 'on_site', NULL, '0e57d284-21c7-4958-9f41-efc488823c93'),
('a87dbe94-d95b-423d-9fcb-29eb06e5fdce', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Product Manager - Ads', 'information_and_communication_technology', 'full_time', 'About the Role\n\nGojek is looking for a data-driven problem solver to drive the strategy and execution of our Ads products. As the Product Manager, you will be at the forefront of the leading display ads business and new ads inventory development end to end from merchant to consumer implementation. You will be responsible for the growth of the display ads business and contribute directly to the overall ads revenue with new inventories This is a high-impact role in which during the 6 months you will lead initiatives and work together with cross-functional teams across the Business, Design, Engineering, and Operation to solve business problems such as Acquisition, Retention, and Profitability, through utilizing data-driven insights and fast iterations to millions of users in Indonesia.\n\nWhat You Will Do\n\nIdentify user needs and pain points, turn them into product insight/action and roadmaps, and collaborate with teams across functions to drive it into reality (including but not limited to: Engineering, Design, Data, Research, Business, Ops, Marketing) \nWrite specs, create wireframes, create launch plan, conduct necessary gradual rollouts or A/B Testing, share learning iteratively with stakeholders, and iterate products to the next level\nCreate analysis, identify, and propose solutions with optimal trade-offs for the ads ecosystem.\nBuild and prioritize roadmaps based on customer needs and strategic business impact. Act as the champion of the roadmap, responsible for influencing and driving common understanding across the cross-functional team\nTranslate and proactively monitor data and key metrics into product insights and improvements. \nShowcase detail-oriented thinking in both Business and Engineering processes. \nWhat You Will Need\n\n3+ years of working experience in the product management space, preferably in a consumer-facing product role.\nBE degree or equivalent practical experience would be a plus\nPossess basic/ intermediate understanding of ads business. Understand ad ecosystems, including the factors that drive the unit economics, competitive landscapes, and overall customer journey.\nAn entrepreneurial mindset. You are proactive and independent, able to ask for help and talk with everyone across cross-team members.\nStrong communication skills, and ability to summarize complex and technical topics to a wide range of audiences. \nData-driven thinking. You make decisions based on supporting insights and data. You can identify and prioritize the right usage of measurement metrics for different problems in ads and also familiarity/understanding of SQL.\nPossess a growth mindset and curiosity. Have track records of continuously evolving your understanding of a domain, and thriving in a fast-moving environment.\nAbout the Team\n\nYou will be joining Gojek\'s Product Management team in the Ads team, a hub of innovation and collaboration. You will be working with leaders across multiple different units, bringing different perspectives with the ultimate goal of creating an excellent experience for customers to buy what they want, when they need it, delivered fast, at scale. If you have the curiosity, passion for technology, and collaborative spirit, work with us, and let\'s solve the problems with technology.\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '3 YoE', 'active', '2025-04-20 16:19:22.818', '2026-01-01 00:00:00.000', '2025-03-12 14:28:47.932', '2025-04-20 16:19:22.819', 'on_site', NULL, '9459629e-7d9a-42be-aba8-3998b7444110'),
('a92810d6-8be9-42ad-ae53-cd4082822f54', '32c95585-e39c-406a-959a-de30d26f173c', 'Data Analyst & Market Research', 'sales_and_marketing', 'full_time', 'Menyediakan laporan berbasis data (data-driven reports) untuk mendukung pengambilan keputusan bisnis.\nMengumpulkan, menganalisis, dan melaporkan data kinerja aktivitas digital marketing.\nMengidentifikasi tren dan wawasan dari data untuk mengoptimalkan strategi marketing.\nMembuat laporan dan visualisasi data yang mudah dipahami.\nMenggunakan alat analisis data (misalnya, Google Analytics, Excel, SQL) untuk mengolah data.\nMemantau dan menganalisis KPI (Key Performance Indicators) untuk mengukur efektivitas marketing.\nMenyajikan hasil analisis data kepada tim marketing dan manajemen.\nMengembangkan dan memelihara dasbor data.\nMelakukan analisis kompetitif dan riset pasar.\nMengolah dan menganalisis data untuk memberikan insight bisnis.\nMelakukan riset pasar untuk mengidentifikasi tren industri dan peluang bisnis.\nMenyusun dan menyajikan laporan analisis kepada tim terkait.\nBerkolaborasi dengan divisi marketing, sales dan operasional Perusahaan.\nMengelola akses dan keamanan data (data access and security) untuk laporan.', 'Depok', 'monthly_based', 4000000, 7000000, 'Associate Degree', '2 YoE', 'active', '2025-04-29 12:58:27.883', '2026-01-01 00:00:00.000', '2025-04-29 12:58:27.884', '2025-04-29 12:58:27.884', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'IT Quality Control Engineer', 'information_and_communication_technology', 'full_time', 'Job Description\nAs an IT Quality Control Engineer, you\'ll be responsible for:\n\nDeveloping & reviewing testing plan & testing script\nCreate automatic testing using (Katalon, Selenium, Mocha, Jmeter)\nImplement manual and automatic testing to ensure our application running based on standard\nCreate report based on application testing\nDoing User Acceptance Test (UAT) with business users, to get a mutual agreement about application results.\nMinimum Qualifications\nPossess at least Bachelors Degree majoring in Information Technology/ Information System/ Computer Engineering/ Computer Science\nExperienced 2 years about testing (manual/ automatic)\nDeep analytical thinking skill\nExcellent problem solving skill\nAttention to detail\nGreat communication & presentation skills\nSelection Test will be consist of a few test, and will be conducted offline', 'Kebayoran Lama, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-25 12:54:59.741', '2026-01-01 00:00:00.000', '2025-05-25 12:54:59.742', '2025-05-25 12:54:59.742', 'on_site', NULL, '154c21a0-af95-415b-9b14-ab849f08dc84'),
('ae0f4a4f-b980-44df-b172-d626e213ceba', 'd5fc6c5f-4d4e-462c-a362-21c58009b011', 'Graphic Designer (3D/Booth/Event Designer)', 'arts_entertainment_and_media', 'full_time', 'Deskripsi Pekerjaan\nDevelop creative concepts and designs for event branding, including banners, signage, posters, backdrops, and digital displays.\nCreate exhibition booth designs, including layouts, graphics, and visual elements that attract and engage visitors.\nWork closely with event organizers, marketing teams, and users to understand project requirements and objectives.\nEnsure all designs adhere to brand guidelines and maintain consistency across all materials.\nPrepare production-ready artwork and liaise with vendors or production teams to ensure high-quality output.\nManage multiple projects simultaneously, meeting deadlines and maintaining quality standards.', 'Tangerang Selatan', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 10:58:22.653', '2026-01-01 00:00:00.000', '2025-04-29 10:58:22.654', '2025-04-29 10:58:22.654', 'on_site', NULL, '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'Virtual Assistant', 'information_and_communication_technology', 'full_time', 'Client Success & Administration\n\nServing as the primary liaison for client communications via email and chat platforms\nFacilitating remote client onboarding processes and maintaining CRM databases\nImplementing document management protocols to ensure efficient remote workflow operations\nProcurement Management\n\nManaging the complete procurement cycle, including supplier identification, contract negotiation, and digital purchase order processing\nMaintaining vendor databases and monitoring inventory levels through cloud-based management systems\nEvaluating supplier performance and optimizing procurement strategies\nFinance & Accounting\n\nExecuting full-cycle accounting operations, including accounts payable/receivable, payroll administration, bank reconciliations, and financial reporting\nProcessing vendor invoices, monitoring expense allocations, and providing tax preparation support\nConducting cash flow analysis and preparing monthly financial statements', 'Yogyakarta, Indonesia', 'monthly_based', 3500000, 4000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-13 10:50:55.346', '2026-01-01 00:00:00.000', '2025-05-13 10:50:55.347', '2025-05-13 10:50:55.347', 'remote', NULL, 'a856c9a6-c471-4619-87d9-e4f568e796b2');
INSERT INTO `jobs` (`job_id`, `company_id`, `title`, `category`, `employment_type`, `description`, `location`, `salary_type`, `minimum_salary`, `maximum_salary`, `education_requirement`, `experience_requirement`, `status`, `published_at`, `expired_at`, `created_at`, `updated_at`, `work_type`, `deleted_at`, `skills_category_id`) VALUES
('b4be1289-7003-4ae4-b095-44271f32caa8', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Staff', 'transportation_and_logistics', 'full_time', 'About The Role\n\nArea Operations Staff accountable and responsible to support Area Operations Supervisor for all spectrum operation drivers at Area level, including but not limited to hold driver engagement activity, driver acquisition, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area.\n\nWhat You Will Do\n\nHandle driver support unit/walk in center in the area: onboarding, troubleshooting, attribute selling, issue escalation;\nManage driver community: coordination, training, troubleshooting, issue escalation;\nConduct online and offline program related to driver partners’ activities;\nMonitor all operations metrics (Demand, Supply, Reliability, Service Level, Risk, etc), propose action plan, and escalate if necessary;\nCoordinate with Area Operations Supervisor for day-to-day escalated issues around driver service.\nWhat You Will Need\n\nFresh graduate, having working experience is a plus;\nDiploma/Bachelor degree with min GPA of 3.0, from top university is a plus;\nGood communication skill and social media literacy;\nGood critical thinking and problem solving skill;\nIntermediate proficiency in Excel/Google Sheet;\nIntermediate proficiency in spoken and written in English.\nAbout The Team\n\nAs Area Operations Staff, he/she will support the Area Operations Supervisor on a day to day basis. He/she also will work closely with the drivers in the field and will be the first contact for driver to escalate any issues.', 'Lampung, Indonesia', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-02-17 13:42:36.322', '2026-01-01 00:00:00.000', '2025-02-17 13:42:36.323', '2025-02-17 13:43:59.515', 'on_site', '2025-02-17 13:43:59.514', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('b92d9ac2-1338-4ad6-b27c-930e415bb458', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'SEO Specialist Internship', 'sales_and_marketing', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu riset keyword dan optimasi konten blog/website untuk SEO\nSupport pembuatan artikel SEO-friendly\nMonitoring performa konten via tools SEO & SEM\nKolaborasi dengan tim content & marketing\nMembantu dengan kampanye iklan SEM (Google Ads, dsb.)', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 13:33:59.724', '2026-01-01 00:00:00.000', '2025-04-29 13:33:59.725', '2025-04-29 13:33:59.725', 'remote', NULL, 'f1a9a36e-3207-4c47-96df-366eef605f93'),
('ba13fc34-4ac8-45ba-94c7-c0fde001e419', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Sales buku Wilayah Jakarta', 'retail', 'full_time', 'Kualifikasi :\n\nPendidikan Minimal D3 – Semua Jurusan\n\nEnergik, Target Oriented Dan Komunikatif\n\nMemiliki Minimal SIM C \n\nMenyukai Dunia Marketing\n\nBersedia Untuk Bekerja Secara Mobile Di Lapangan\n\nJobdesk:\n\nMelakukan Promosi Produk - Produk Buku Tulis, Kertas HVS Dan Jasa Cetak Kepada Customer\n\nMelakukan Peliputan Dan Kunjungan Ke Pelanggan\n\nMelayani Pesanan Pembelian Dari Para Pelanggan\n\nMeraih Target Yang Sudah Ditetapkan (target Bulanan, Semester, Tahunan)\n\nMemastikan Pembayaran Tepat Waktu', 'Jakarta Raya', 'monthly_based', 5397500, 5397500, 'Associate Degree', '<1 YoE', 'active', '2025-05-25 11:14:16.814', '2026-01-01 00:00:00.000', '2025-05-25 11:14:16.815', '2025-05-25 11:17:14.814', 'on_site', NULL, 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('bd319feb-c7f8-4628-91c8-c006c2b57129', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'Talent Acquisition Intern', 'human_resources_and_administration', 'full_time', 'Requirements:\n\nAn Active College Student (Preferably Final Year Student in Psychology Undergraduate Program) [Can issue an active student certificate from the student\'s university]\n\nBasic Excel Skills\n\nWe need an active student who can work from office minimum 4 days a week\n\nResponsibilities:\n\nTalent Acquisition Intern will be responsible for:\n- Contacting and scheduling candidates for recruitment processes.\n- Screening CVs/profiles for various positions.\n- Managing the Talent Acquisition database.', 'Jakarta Selatan, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:56:38.277', '2026-01-01 00:00:00.000', '2025-05-25 12:56:38.279', '2025-05-25 12:56:38.279', 'on_site', NULL, '0e57d284-21c7-4958-9f41-efc488823c93'),
('bd663b1a-dbe5-4cf9-9632-1365329d6ddf', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Engineering Manager', 'information_and_communication_technology', 'full_time', 'About the Role\n\nIn this role, you will play a key role in the growth of the transport product lines at Gojek. You will be exposed to complexities that will challenge your problem solving skills and will learn how to build and operate high throughput systems.  \n\nWhat You Will Do\n\nDesign and develop highly scalable, reliable and fault tolerant platforms for one of the world\'s fastest growing unicorns\nYou will be responsible for the overall delivery and the solution architecture of the offerings your team will be working on \nOwning prioritization of initiatives to maximize achievements on objectives and growth for engineering at GoTo\nUnderstanding product engineering and having empathy with problems and pain points of Product Engineers, continuously contribute to make their experience better\nYou shall write code, and lead the team with examples\nCommunicate, collaborate and work effectively with product teams distributed in a global environment\nYou will be responsible for the overall growth, learning and happiness of 2-3 sub pods within your scope, and provide mentorship to at least 15-20 engineers\nOwn delivery and prioritization of product & tech charters of the team.\nWhat You Will Need\n\nAt least 8-10+ years of relevant experience, mandatory to have experience & knowledge in Golang, is a plus with other object oriented or functional programming language experience i.e. Java, Clojure, Python, Ruby etc building applications from scratch\nDeep understanding and working exp of distributed systems fundamentals, large scale systems, observability stack, prometheus fundamentals, container technologies, event driven architectures, and can architect solutions based on the popular patterns\nAbility to go into depth and breadth across the tech stack used in the product\nHands-on experience to troubleshoot issues across network, OS file systems, containers, CI/CD pipelines, etc\nBelief in left-shift approach when it comes to testing and holds him/her-self accountable on setting the right example for the team\nStrong people leadership skills including growing and guiding your team members. Passion for your team\'s mission and the self-starting personality to make things happen\nHave experience in leading a team of 6-8 engineers and owning the members to grow on top of overall delivery for the teams.\nAbout the Team\n\nOur Transport team is a big family of 100+ members made up of engineers, product managers, business strategy planners spread out across Jakarta, Bangalore, Singapore, and Vietnam. We run Southeast Asia’s leading and fastest-growing ride-hailing business and oversee all things related to our riders and driver-partners\' needs in daily transport and work daily to create solutions to these issues. It’s our job to ensure that our Transport services run seamlessly from the inside out.\n\nOur team recently figured out that our existing third-party SDK for in-app live tracking of vehicles was not operating as smoothly as we had expected. So, guess what? We fixed this by building our own live tracking SDK - Navic. Right now, our team has been busy working on projects that aim to effectively grow our user base in the region (and beyond!).\n\nWe, the Transporters, know how to work hard and play hard. When we aren’t busy working, you’d probably find us playing online games like Among Us and Sketchful, or catching up with each other on our virtual hangouts. We work as a team to get our job done well, and genuinely enjoy each other\'s company.', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '>5 YoE', 'active', '2025-04-20 16:18:28.102', '2026-01-01 00:00:00.000', '2025-03-12 14:34:01.073', '2025-04-20 16:18:28.103', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('bd9ac047-8517-4160-b37a-4d89bfced1d4', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Legal Staff', 'legal', 'full_time', 'Job Descriptions:\n\nPrepare authorization documents BPOM/Non-BPOM and KEMENKES\n\nCarry out licensing registration for all products (BPOM/Non-BPOM, KEMENKES, etc)\n\nUpdate licensing database\n\nEstablish and maintain good relations with government\n\nSocialize the latest regulations with business units\n\nQualifications:\n\nBachelor\'s degree in Law (Min GPA 3.00)\n\nFresh Graduate are welcome to apply\n\nFluent in English will be advantages', 'Jakarta Barat, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:24:13.350', '2026-01-01 00:00:00.000', '2025-05-25 12:24:13.351', '2025-05-25 12:24:13.351', 'on_site', NULL, '0c748f50-1089-436f-a569-e39bb45d18fd'),
('bf26275c-eeba-4952-9c77-995d32bf14b3', '7feedb3a-20b2-4009-a3c1-d421028dbc2b', 'Marketing Communication', 'sales_and_marketing', 'full_time', 'Job Descriptions\n\nDevelop engaging content for marketing materials\n\nManage social media and audience interaction\n\nBuild relationship with media, influencers and partners\n\nUnderstand ads and SEO optimization\n\nPlan and execute marketing promotions and events', 'Jakarta Barat, Jakarta Raya', 'monthly_based', 2000000, 3500000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:17:16.423', '2026-01-01 00:00:00.000', '2025-05-25 12:17:16.424', '2025-05-25 12:17:16.424', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('c09015fb-a894-48e5-9201-baeb50119b53', '553c7af2-32bd-4c1e-a600-c036a990bfcd', 'Staff HRD Lapangan', 'human_resources_and_administration', 'full_time', '- Mengelola sistem penggajian termasuk data absensi (sistem shift) dan payroll (lembur)\n* Mengidentifikasi komponen gaji karyawan (upah pokok, tunjangan, komisi).\n* Mengelola database karyawan (softfile dan hardfile).\n* Menyusun peraturan perusahaan dan kontrak kerja.\n* Membuat dan mensosialisasikan SOP perusahaan.\n* Mengelola proses rekrutmen dari awal hingga akhir.\n- Mengelola proses onboarding untuk karyawan baru.', 'Surabaya', 'monthly_based', 4000000, 4500000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 10:11:37.271', '2026-01-01 00:00:00.000', '2025-05-13 10:11:37.272', '2025-05-13 10:12:04.653', 'on_site', '2025-05-13 10:12:04.652', '0e57d284-21c7-4958-9f41-efc488823c93'),
('c43deb87-cb22-48f1-99da-ce578d95dc5c', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Sales buku Wilayah Medan', 'retail', 'full_time', 'Job Description:\n\nMelakukan Promosi Produk - Produk Buku Tulis, Kertas HVS Dan Jasa Cetak Kepada Customer\n\nMelakukan Peliputan Dan Kunjungan Ke Pelanggan\n\nMelayani Pesanan Pembelian Dari Para Pelanggan\n\nMeraih Target Yang Sudah Ditetapkan (target Bulanan, Semester, Tahunan)\n\nKualifikasi :\n\nPendidikan Minimal D3 – Semua Jurusan\n\nEnergik, Target Oriented Dan Komunikatif\n\nMemiliki Minimal SIM C \n\nMenyukai Dunia Marketing\n\nBersedia Untuk Bekerja Secara Mobile Di Lapangan', 'Medan, Sumatera Utara', 'monthly_based', 4015000, 4015000, 'Associate Degree', '<1 YoE', 'active', '2025-05-25 11:21:14.277', '2026-01-01 00:00:00.000', '2025-05-25 11:21:14.278', '2025-05-25 11:21:14.278', 'on_site', NULL, 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'Digital Marketing Intern', 'sales_and_marketing', 'internship', 'About Us\n\nWe are a fast-growing and innovative organization committed to streamlining operations and achieving excellence. Our team thrives on collaboration, creativity, and adaptability, and we are excited to welcome Digital Marketer with diverse expertise to join our mission.\n\nRole Overview\n\nAs a Digital Marketing Intern, you will gain hands-on experience in content creation, social media management, and SEO optimization. Your responsibilities include developing and executing marketing campaigns, creating engaging visuals and copy, analyzing market trends, and managing social media posts. Additionally, you will support SEO efforts and collaborate on creative marketing strategies to enhance brand awareness.\n\nThis internship is a great opportunity for those looking to develop a diverse skill set as a Digital Marketing in a dynamic, fast-paced environment while working remotely.\n\nKey Responsibilities\n\nDepending on your skills and expertise, you may be involved in:\n\nResponsibilities:\n\nAssist in developing and executing digital marketing campaigns across various platforms/\nCreate engaging content, including graphics, videos, and copywriting, to enhance brand awareness.\nManage and schedule social media posts while monitoring engagement and analytics.\nConduct market research and competitor analysis to identify trends and opportunities.\nSupport SEO efforts by optimizing website content and researching keywords.\nCollaborate with the team to brainstorm creative marketing ideas and strategies.', 'Yogyakarta, Indonesia', 'monthly_based', 2000000, 2400000, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-13 10:46:33.232', '2026-01-01 00:00:00.000', '2025-05-13 10:46:33.233', '2025-05-13 10:46:33.233', 'remote', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('d0779b79-07a2-47c6-9dfd-7f292c9cd81e', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Staff', 'transportation_and_logistics', 'full_time', 'About The Role\n\nArea Operations Staff accountable and responsible to support Area Operations Supervisor for all spectrum operation drivers at Area level, including but not limited to hold driver engagement activity, driver acquisition, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area.\n\nWhat You Will Do\n\nHandle driver support unit/walk in center in the area: onboarding, troubleshooting, attribute selling, issue escalation;\nManage driver community: coordination, training, troubleshooting, issue escalation;\nConduct online and offline program related to driver partners’ activities;\nMonitor all operations metrics (Demand, Supply, Reliability, Service Level, Risk, etc), propose action plan, and escalate if necessary;\nCoordinate with Area Operations Supervisor for day-to-day escalated issues around driver service.\nWhat You Will Need\n\nFresh graduate, having working experience is a plus;\nDiploma/Bachelor degree with min GPA of 3.0, from top university is a plus;\nGood communication skill and social media literacy;\nGood critical thinking and problem solving skill;\nIntermediate proficiency in Excel/Google Sheet;\nIntermediate proficiency in spoken and written in English.\nAbout The Team\n\nAs Area Operations Staff, he/she will support the Area Operations Supervisor on a day to day basis. He/she also will work closely with the drivers in the field and will be the first contact for driver to escalate any issues.', 'Lampung, Indonesia', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-02-17 13:42:43.268', '2026-01-01 00:00:00.000', '2025-02-17 13:42:43.270', '2025-02-17 13:44:04.965', 'on_site', '2025-02-17 13:44:04.964', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('d5b00756-9347-4f22-9b05-47721b9fea1c', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Senior Software Engineer', 'information_and_communication_technology', 'full_time', 'About the Role\n\nIf you’re looking to be a part of a dynamic, highly-analytical team and a chance to hone in on your engineering skills, look no further. As our Senior Software Engineer for the Driver Platform Team, you will be handed the reins in overseeing Backend Engineering at Gojek - designing and developing highly scalable, reliable, maintainable and fault tolerant systems. Along with owing the entire lifecycle of these projects, you will establish and evangelize the best engineering practices for your team to follow. Working closely with product managers, QA engineers, and designers, you will get to build world-class products and meet the technological needs of the Gojek\'s driver partners, ensuring they get the quality care and service that they deserve.\n\nWhat You Will Do\n\nTranslate business requirements into scalable technical solutions\nOwn the overall delivery and the solution architecture of the feature your team will be working on\nCross team/role boundaries and work with other teams/other roles (Mobile, Web etc) and Communicate, collaborate and work effectively with product and business stakeholders across distributed teams in a global environment\nPair with team members on functional and nonfunctional requirements and spread design philosophy, goals and improve the code quality across the team\nTake responsibility for multiple services maintained by the team\nResearch new tools, learn and experiment with new languages and technologies\nWhat You Will Need\n\nShould have at least 4-5+ years of hands-on experience in software development - designing, developing, testing and deploying large scale applications in any language or stack\nGood understanding of at least one programming language Golang/Java/Clojure/Ruby\nData modelling experience in either Relational or NoSQL databases\nDesign and implement low latency GRPC/RESTful services\nProficient in OOP, SQL, Design Patterns. Experience with functional programming is a plus\nGood understanding of PostgreSQL/MongoDB, Kafka and Redis\nWell-versed with Agile methodologies, Writing unit tests and maintaining good coverage (TDD is a Plus)\nContinuously refactor applications and architectures to maintain high quality levels and experience in troubleshooting server performance - ­memory issues, GC tuning and resource leaks\nAbout the Team\n\nOur Driver Partners are one of the key pillars of our business. From delivering food orders to transporting people and goods from one place to another, there is very little that our drivers can’t do. \n\nOur Driver Platform Team consists of Android, Backend, Front-end, QA and Data Engineer. Often working alongside the product and design teams, we are predominantly concerned with meeting the technological needs of our driver partners via the systems and tools we build and provide for them.\n\nWe are a big team of home bakers, Netflix watchers, and K-pop fans who enjoy using technology to ease the lives of the people in our community. We work hard and play hard, and believe it or not, we actually enjoy each other’s company!\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-GOTO\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '>5 YoE', 'active', '2025-04-20 16:18:59.965', '2026-01-01 00:00:00.000', '2025-03-12 14:14:56.167', '2025-04-20 16:18:59.966', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('d76ced3a-d02a-4924-bc26-400870ba7093', '8d2660ff-b8e3-43d9-bdc9-e5e089401dd3', 'Digital Marketing Staff', 'sales_and_marketing', 'full_time', 'Qualifications:\n\nBachelor\'s Degree in Marketing, Management, Communication or equivalent with minimum GPA 3.00\nStrong understanding of social media marketing trends\nProficient in Photoshop, Adobe Illustrator & Premiere\nWilling to be placed in Jakarta Barat\nJob Description:\n\nAssisting in Digital Marketing campaign\nContent Creation and Management \nSocial Media Management', 'Jakarta Barat, Jakarta Raya', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:26:14.783', '2026-01-01 00:00:00.000', '2025-05-25 12:26:14.784', '2025-05-25 12:26:14.784', 'on_site', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('dde36436-82a0-4412-b0c8-c7b2d63049e4', 'caf32328-7dac-4ab2-ab07-6c8bec5b3944', 'Legal Staff', 'legal', 'full_time', 'Pengurusan administrasi-administrasi yang berhubungan dengan Legal\n\nMelakukan review, pendataan, dan mengarsipkan data mitra\n\nMembuat SP mitra\n\nPembuatan memo internal / eksternal perusahaan\n\nPengurusan dan pembuatan kontrak sewa unit / bangunan/ yang lainnya', 'Semarang, Jawa Tengah', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 10:20:40.936', '2026-01-01 00:00:00.000', '2025-05-13 10:20:40.937', '2025-05-13 10:20:40.937', 'on_site', NULL, '0c748f50-1089-436f-a569-e39bb45d18fd'),
('deb736b3-602c-47e9-94eb-b8abd554f19d', 'd1cf3cc3-9d35-437a-a1ee-1e096f2ad415', 'Virtual SEM & Digital Marketing Specialist', 'sales_and_marketing', 'full_time', 'Position Overview:\n\nAre you a digital marketing enthusiast ready to make a real impact? We are seeking an experienced and motivated SEO & Digital Marketing Specialist to lead our digital marketing efforts and manage a team of freelancers. This fully remote position is perfect for someone with 3+ years of experience who\'s eager to lead, grow, and achieve big things in the world of digital marketing. This role focuses on planning, executing, and optimizing digital campaigns to drive brand growth, engagement, and lead generation.\n\nWhat You\'ll Do:\n\nCampaign Planning & Execution:\nCraft and launch digital marketing campaigns across different channels like SEM, SEO, social media, content marketing, and email marketing.\nResearch keywords, write attention-grabbing ad copy, and manage paid search campaigns to attract the right audience and generate leads.\nPerformance Analysis & Optimization:\nKeep a close eye on campaign performance using key metrics like impressions, clicks, conversions, and ROI.\nPrepare regular reports on campaign performance and share your insights on what\'s working and what could be improved.\nContent Creation & Management:\nCreate engaging and informative content, such as blog posts, social media updates, email newsletters, and landing page copy.\nMake sure all content is optimized for search engines and reflects our brand\'s voice.\nManage our social media channels and interact with followers to build brand awareness and create a community.', 'Yogyakarta, Indonesia', 'monthly_based', 5000000, 7000000, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-05-13 10:42:28.694', '2026-01-01 00:00:00.000', '2025-05-13 10:42:28.695', '2025-05-13 10:42:28.695', 'remote', NULL, '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Software Engineer (iOS) - Transport', 'information_and_communication_technology', 'full_time', 'About the Role\n\nIn this role, you will play a key role in the growth of the transport product lines at Gojek. You will be exposed to complexities that will challenge your problem solving skills and will learn how to build and operate high throughput systems. You will be responsible for designing, developing and deploying iOS applications/SDKs for some of the most critical and technically complex offerings that Gojek has. Your ownership, drive and passion would help provide for a world-class user experience and stability of our iOS products. You will be a key part of the team and will work with some of the brightest minds in the industry across design, product and engineering in solving meaningful real-world problems impacting the lives of millions of users. \n\nWhat You Will Do\n\nSolve technical problems and build the next generation of products for our consumers\nSpike new technologies and find a viable way to improve customers experience\nImprove the testability and maintainability of the code\nBuild reusable iOS software components for interfacing with multiple applications\nImprove and stabilize IOS sdks used by number of internal and external clients\nFormulate and create clear and efficient technical documentation\nWrite code that is clear, concise, performant, tested, and easily understood by others\nWork with backend, UX teams, both within and outside the team to build robust, well-designed interfaces\nWhat You Will Need\n\nAt Least 2 years of full-time iOS engineering experience\nExperience developing, maintaining, and innovating large scale, consumer mobile application\nPredictability and balance of product delivery speed and quality\nIn-depth knowledge of iOS app architecture and implementation including proficiency in Swift programming, Cocoa, Xcode and the iOS SDK\nStrong problem solving and analytical skills\nCommand over the technology ecosystem and ability to learn and ramp up on the latest trends\nWorking experience with popular libraries for networking, async, image loading, etc\nAbility to write model code for functional and non-functional requirements and help improve the code quality standard across the team\nExperience and knowledge of writing testable and high-quality code\n About the team\n\nOur Transport team is a big family of 100+ members made up of engineers and product managers spread out across Jakarta, Bangalore, Singapore, and Vietnam. We run Southeast Asia’s leading and fastest-growing ride-hailing business and oversee all things related to our riders and driver-partners\' needs in daily transport and work daily to create solutions to these issues. It’s our job to ensure that our Transport services run seamlessly from the inside out.\n\nOur team recently figured out that our existing third-party SDK for in-app live tracking of vehicles was not operating as smoothly as we had expected. So, guess what? We fixed this by building our own live tracking SDK - Navic. Right now, our team has been busy working on projects that aim to effectively grow our user base in the region (and beyond!).\n\nWe, the Transporters, know how to work hard and play hard. When we aren’t busy working, you’d probably find us playing online games like Among Us and Sketchful, or hanging out with each other. We work as a team to get our job done well, and genuinely enjoy each other\'s company.', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '2 YoE', 'active', '2025-04-20 16:18:17.266', '2026-01-01 00:00:00.000', '2025-03-12 14:37:56.144', '2025-04-20 16:18:17.267', 'on_site', NULL, '02cba157-3907-49c8-a64f-b98804265c72'),
('e5604673-7267-4eb8-a219-b5a286e21ef2', '1db185d9-169e-4747-a037-8790fdf2ae72', 'Oracle Database Administrator', 'information_and_communication_technology', 'full_time', 'Install, configure, and upgrade Oracle database software and related products.\nMonitor database performance, implement tuning and optimization strategies.\nManage database backup, recovery, and disaster recovery plans using tools such as RMAN.\nEnsure data security, integrity, and compliance with corporate and regulatory standards.\nPerform regular database maintenance tasks including patching and updates.\nManage user access and roles to maintain data security and access control.\nSupport development teams with database design, queries, and performance analysis.\nTroubleshoot and resolve database-related issues in a timely manner.\nMaintain documentation for database architecture, configurations, and standard procedures.\nImplement and manage high availability solutions such as Oracle RAC and Data Guard', 'Jakarta Selatan', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '3 YoE', 'active', '2025-05-13 11:03:34.153', '2026-01-01 00:00:00.000', '2025-05-13 11:03:34.154', '2025-05-13 11:03:34.154', 'on_site', NULL, '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('eb07308a-b3ec-4782-91c7-795d91c0b470', '8c57d7ab-76b7-46d6-8dc1-098ac50d9302', 'ICT Network Specialist', 'information_and_communication_technology', 'full_time', ' Creates and maintains overall network plans, encompassing the communication of data (including voice, text, and images), in the support of an organization business strategy\nCreates and maintains the production of network designs and design policies, strategies, architectures, and documentation, covering voice, data, text, e-mail, facsimile and image, to support strategy and business requirements for connectivity, capacity, interfacing, security, resilience, recovery, access and remote access.\nThe provision of network maintenance and support services.\nTakes lead in investigating and resolving problems and providing information about the systems.', 'Jakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-04-29 12:40:00.530', '2026-01-01 00:00:00.000', '2025-04-29 12:40:00.531', '2025-04-29 12:40:00.531', 'on_site', NULL, '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('ec4026e7-7dd0-4726-aeb6-a6146cea8f86', '3d690295-6a69-436f-a9f5-d4d5252d98d5', 'Account Officer or Sales Officer Bogor', 'sales_and_marketing', 'full_time', 'Job Description\nSalah satu garda terdepan Asuransi Astra dalam memberikan layanan terbaik bagi pelanggan adalah Account officer, yang memiliki tanggung jawab utama sebagai berikut:\n\nMenjaga hubungan baik dengan dealer otomotif rekanan Asuransi Astra\nMembina dan menjaga relasi dengan customer produk retail Asuransi Astra\nDapat bekerja berdasarkan target yang telah ditentukan (bahkan melebihi target)\nMinimum Qualifications\nPendidikan minimal D1/D2/d3/S1 semua jurusan\nFresh Graduate are welcome\nBerjiwa marketing\nmemiliki kemampuan komunikasi yang baik\nTerbiasa bekerja dengan target\nNilai lebih bagi yang memiliki pengalaman marketing/sales minimal 6 bulan - 1 tahun\nBersedia ditempatkan di kantor cabang Cilandak /Puri Indah / Mangga Dua / Tendean / Bekasi / Kelapa Gading / BSD / Serang', 'Bogor, Jawa Barat', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-05-25 12:49:51.481', '2026-01-01 00:00:00.000', '2025-05-25 12:49:51.483', '2025-05-25 12:49:51.483', 'on_site', NULL, '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('ed9f12a1-c04b-4117-8248-c98e15843c25', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Area Operations Staff', 'transportation_and_logistics', 'full_time', 'About The Role\n\nArea Operations Staff accountable and responsible to support Area Operations Supervisor for all spectrum operation drivers at Area level, including but not limited to hold driver engagement activity, driver acquisition, and consistently helping to solve driver problems on the field. Handle conflict, regulation compliance and maintain stakeholders in the area.\n\nWhat You Will Do\n\nHandle driver support unit/walk in center in the area: onboarding, troubleshooting, attribute selling, issue escalation;\nManage driver community: coordination, training, troubleshooting, issue escalation;\nConduct online and offline program related to driver partners’ activities;\nMonitor all operations metrics (Demand, Supply, Reliability, Service Level, Risk, etc), propose action plan, and escalate if necessary;\nCoordinate with Area Operations Supervisor for day-to-day escalated issues around driver service.\nWhat You Will Need\n\nFresh graduate, having working experience is a plus;\nDiploma/Bachelor degree with min GPA of 3.0, from top university is a plus;\nGood communication skill and social media literacy;\nGood critical thinking and problem solving skill;\nIntermediate proficiency in Excel/Google Sheet;\nIntermediate proficiency in spoken and written in English.\nAbout The Team\n\nAs Area Operations Staff, he/she will support the Area Operations Supervisor on a day to day basis. He/she also will work closely with the drivers in the field and will be the first contact for driver to escalate any issues.', 'Lampung, Indonesia', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-02-17 13:42:45.608', '2026-01-01 00:00:00.000', '2025-02-17 13:42:45.609', '2025-02-17 13:43:50.772', 'on_site', '2025-02-17 13:43:50.771', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('f0f6227c-b550-4ed7-8a33-875e3a7d83ca', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Lead Software Engineer - Transport', 'information_and_communication_technology', 'full_time', 'At Gojek, engineering is central to everything we do to bring cheer to the lives of millions. In this role, you will be part of Gojek’s transport engineering team, building some of the most critical products for our consumers. As a Software Engineer in Gojek, you will be responsible for building systems and products across the various areas of business for Gojek Transport. Your ownership, drive and passion would help provide for a world-class user experience and stability of Transport products for mobility or people and packages.\n\nWe are looking for Lead software engineers for the Transport team who appreciates good engineering and user experience. The person should be passionate about maintaining a clean and maintainable codebase. Your primary focus will be technically leading the development and management of mission critical systems.\n\nDesign and develop highly scalable, highly available, reliable, secure and fault tolerant systems with minimal guidance for one of the world\'s fastest growing company in travel\nTranslate business requirements into scalable and extensible design\nPair with team members on functional and nonfunctional requirements and spread design philosophy, goals and improve the code quality across the team\nPartner with the product management team to define and execute the feature roadmap\nCoordinate with cross functional teams (Mobile, DevOps, UX, QA etc.) on planning and execution\nProactively manage stakeholder communication related to deliverables, risks, changes and dependencies\nProvide technology leadership to the team and foster engineering excellence\nResearch new technologies and tools that enable building the next generation of Gojek services\nShould at least have 7+ years of hands on experience in designing, developing, testing and deploying applications on Java, Ruby or Go for large scale applications\nProficient in OOP, SQL, Linux/Unix and Design Patterns. Experience with functional programming is a plus\nData modeling experience in Relational and NoSQL databases\nAbility to understand and implement Continuous Integration and Continuous Delivery\nWell versed with Agile methodologies, TDD and Test Engineering and Automation\nAbility to design and implement low latency RESTful services\nExcellent understanding of interactive application development paradigm, memory management, performance/resource optimisations, database interactions, network programming, concurrency and multithreading, fault tolerance, monitoring, security and operability of systems\nAbout the Team\n\nOur Transport team is a big family of 100+ members made up of engineers and product managers spread out across Jakarta, Bangalore, Singapore, and Vietnam. We run Southeast Asia’s leading and fastest-growing ride-hailing business and oversee all things related to our riders and driver-partners\' needs in daily transport and work daily to create solutions to these issues. It’s our job to ensure that our Transport services run seamlessly from the inside out.\n\nOur team recently figured out that our existing third-party SDK for in-app live tracking of vehicles was not operating as smoothly as we had expected. So, guess what? We fixed this by building our own live tracking SDK - Navic. Right now, our team has been busy working on projects that aim to effectively grow our user base in the region (and beyond!).\n\nWe, the Transporters, know how to work hard and play hard. Though working from home has been a significant change, it hasn’t made work boring - in fact, we’ve been enjoying this new work setup more than we expected! When we aren’t busy working, you’d probably find us playing online games like Among Us and Sketchful, or catching up with each other on our virtual hangouts. We work as a team to get our job done well, and genuinely enjoy each other\'s company.\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '>5 YoE', 'active', '2025-04-20 16:19:54.116', '2026-01-01 00:00:00.000', '2025-03-12 14:02:07.004', '2025-04-20 16:19:54.117', 'on_site', NULL, '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('f256f35b-7f50-47e7-a217-4d526e09ecf3', '36f357c9-989d-4d10-bbe9-bd02dbd4292b', 'Product Manager - Fulfillment', 'information_and_communication_technology', 'full_time', 'About the Role\n\nAs a Product Manager for the Fulfillment platform at Gojek, you will be at the forefront of crafting the product\'s vision, setting strategic objectives and timelines, and steering the realization of this vision with a focus on growing the Fulfillment business, in alignment with the company\'s goals. Collaborating extensively across various departments, you will liaise with business and region teams and coordinate with other product teams connected to the Fulfillment team.\n\nWhat Will You Do\n\nDeliver. You do more than talk - you put things on paper, get your hands dirty, and execute with precision to make sure products and features are launched \nSeek product ideas and feedback, gather requirements, write specs, create wireframes and workflows, and demo them early and often\nUnderstand that “one size doesn’t fit all” and conceptualize solutions that are configurable and adaptable to the maximum extent possible\nGiving clarity to the product development group and stakeholders on the requirement and the impact of each feature as well as the go-to-market strategy to ensure adoption of the features. \nUsing data to analyze each feature\'s adoption and impact, while improving the features to solve merchants\' pain points.\nDevelop strong relationships with stakeholders to understand their goals and priorities. Then, work with them to help them turn these goals into reality.\nDefine, prioritize, and plan the product features that must be implemented, through alignment with all stakeholders.\nWhat You Will Need\n\nAt least 2 years of total experience, with 1-2 years experience in data, business, tech, or product\nCritical and analytical thinking ability\nExperience working on Objectives and Key results model of goal setting\nData-oriented with excellent analytical skills; Able to dig into data to discover nuances, and define & measure success on every project. Prior experience with experimentation is a strong plus\nStrong strategic planning and organizational skills\nExcellent written & verbal communication skills focused on improving collaboration, understanding & information exchange across all stakeholders\nBe able to work with agile product development teams and identify new ways to help your team be productive. Experience working with distributed teams is desired\nFluency in written and verbal English\nAbout the Team\n\nJoin Gojek\'s Product Management team, a hub of innovation and collaboration, to revolutionize everyday experiences at scale, while embracing a culture that values creativity and meaningful impact. We welcome people from all backgrounds who seek the opportunity to help build a future where everyone and everything can move independently. If you have the curiosity, passion for technology, and collaborative spirit, work with us, and let\'s solve the problems with technology. \n\nThe Logistics Platform team at Gojek oversees all aspects of package delivery, from developing APIs for our B2B product line to solving intracity peer-to-peer delivery for Gojek users. Our team is dedicated to enhancing customer and driver partners\' experience while continuously exploring new growth opportunities.\n\nAbout GoTo Group\n\nGoTo Group is the largest digital ecosystem in Indonesia with its mission to “Empower Progress’ by offering technological infrastructure and solutions for everyone to access and thrive in the digital economy. The GoTo ecosystem consists of on-demand transportation services, food and grocery delivery, logistics and fulfillment, as well as financial and payment services through the Gojek and GoTo Financial platforms.It is the first platform in Southeast Asia that hosts these crucial cases in a single ecosystem, capturing the majority of Indonesia’s vast consumer household.\n\nAbout Gojek \n\nGojek is Southeast Asia’s leading on-demand platform and pioneer of the multi-service ecosystem with over 2.5 million driver partners across the regions offering a wide range of services such as transportation, food delivery, logistics and more. With its mission to create impact at scale, Gojek is committed to resolving consumer problems and raising standards of living by connecting consumers to the best providers of goods and services in the market.\n\nAbout GoTo Financial\n\nGoTo Financial accelerates financial inclusion through its leading financial services and merchants solutions. Its consumer services include GoPay and GoPayLater and serve businesses of all sizes through Midtrans, Moka, GoBiz Plus, GoBiz, and Selly. With its trusted and inclusive ecosystem of products, GoTo Financial is open to new growth opportunities and aims to empower everyone to Make It Happen, Make It Together, Make It Last.\n\nGoTo and its business units, including Gojek and GoToFinancial (\"GoTo\") only post job opportunities on our official channels on our respective company websites and on LinkedIn. GoTo is not liable for any job postings or job offers that did not originate from us. You should conduct your own due diligence to prevent being victims of any fake job scams, if they did not originate from GoTo\'s official recruitment channels.\n\n#LI-GOTO\n\n#LI-ONSITE', 'Jakarta Raya', 'monthly_based', 0, 0, 'Senior High School', '2 YoE', 'active', '2025-04-20 16:19:15.582', '2026-01-01 00:00:00.000', '2025-03-12 14:22:07.498', '2025-04-20 16:19:15.583', 'on_site', NULL, '9459629e-7d9a-42be-aba8-3998b7444110'),
('f95f72bf-7d07-4557-a211-80f647b7ad19', '78f64755-71d4-45b0-ae6c-3b2160745909', 'Product Analyst - Specialist', 'sales_and_marketing', 'full_time', 'Mengelola dan memaintenance database produk, supplier , dan principle , secara efektif dan efisien, dan menyajikan analisa data tentang efektifitas dan efisiensi produk yang dijual perusahaan, beserta aktifitas/ event promosi yang berlangsung di perusahaan secara optimal.', 'Tangerang', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '<1 YoE', 'active', '2025-04-29 12:26:11.078', '2026-01-01 00:00:00.000', '2025-04-29 12:26:11.079', '2025-04-29 12:26:11.079', 'on_site', NULL, '9459629e-7d9a-42be-aba8-3998b7444110'),
('fc5d0c9d-13f7-4412-a697-749d918dd5cc', '8fa055dd-7e2f-4eb1-94ff-b6e9cb944ad1', 'HR Payroll Internship', 'human_resources_and_administration', 'internship', 'Deksripsi Pekerjaan:\n\nMembantu pembuatan slip gaji karyawan setiap bulan\nMengelola dan merapikan data payroll & absensi\nMembantu tugas administratif HR lainnya', 'Jakarta Selatan', 'monthly_based', 1000000, 1000000, 'Associate Degree', '<1 YoE', 'active', '2025-04-29 13:28:33.319', '2026-01-01 00:00:00.000', '2025-04-29 13:28:33.320', '2025-04-29 13:29:16.190', 'remote', '2025-04-29 13:29:16.189', '0e57d284-21c7-4958-9f41-efc488823c93'),
('fdd928ba-908f-46e3-9f18-2d8386dd9736', '022a31c2-1b6f-469d-a6ab-f5688e28ecd3', 'Operator Produksi', 'transportation_and_logistics', 'full_time', 'PT. Gelora Aksara Pratama sedang membuka lowongan untuk posisi Penuh waktu Operator Produksi di Ciracas, Daerah Khusus Ibukota Jakarta. Lamar sekarang untuk menjadi bagian dari tim kami.\n\n\nKualifikasi pekerjaan:\nTersedia jam fleksibel\nDiperlukan 1 tahun pengalaman kerja yang relevan untuk posisi ini\nGaji yang diinginkan: Rp5,397,000 per bulan\n\n1. Mengoperasikan forklift dengan aman dan sesuai dengan prosedur.\n\n2. Melakukan pembongkaran muatan yang masuk menggunakan forklift.\n\n3. Memindahkan dan mengangkat material dan barang dengan menggunakan forklift sesuai instruksi.', 'Jakarta', 'monthly_based', 0, 0, 'Senior High School', '<1 YoE', 'active', '2025-05-25 11:05:12.287', '2026-01-01 00:00:00.000', '2025-05-25 11:05:12.288', '2025-05-25 11:05:12.288', 'on_site', NULL, '24864d31-9dca-4358-8ee0-19785af2e606'),
('ff22c978-4c03-4011-bf89-a61fa64b1d14', '8c57d7ab-76b7-46d6-8dc1-098ac50d9302', 'Product - Analyst', 'information_and_communication_technology', 'full_time', 'Coordinate with Product Development Section Head in preparing development strategy and product requirement document (PRD) as a requirement for product development.\nCarry out product development and ensure product development align with timeline and development plan\nResponsible to conduct testing for every product development\nMonitor and evaluate product to ensure product run without any problem / issue\nCollaborate with Data Analyst to analyze customer feedback, market research, and data performance to gain insight in making decision / solution for develop product\nCreating report to give an update of product development progress and result to management and any others stakeholder ', 'Jakarta', 'monthly_based', 0, 0, 'Bachelor\'s Degree', '2 YoE', 'active', '2025-04-29 12:34:20.135', '2026-01-01 00:00:00.000', '2025-04-29 12:34:20.137', '2025-04-29 12:34:20.137', 'on_site', NULL, 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a');

-- --------------------------------------------------------

--
-- Table structure for table `job_benefits`
--

CREATE TABLE `job_benefits` (
  `job_benefit_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_benefits`
--

INSERT INTO `job_benefits` (`job_benefit_id`, `job_id`, `benefit`, `created_at`, `updated_at`) VALUES
('01bb0513-514b-4e0d-9e78-686f4973a47e', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'International Exposure', '2025-05-13 10:50:55.361', '2025-05-13 10:50:55.361'),
('020603a1-be6a-43c2-a059-71e48b043e67', 'ec4026e7-7dd0-4726-aeb6-a6146cea8f86', 'Loans', '2025-05-25 12:49:51.505', '2025-05-25 12:49:51.505'),
('022727c8-d538-4187-855e-12e273d54e00', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Kesempatan untuk bertumbuh dan berkembang di perusahaan yang bereputasi baik.', '2025-04-29 12:58:27.903', '2025-04-29 12:58:27.903'),
('02547427-3417-4411-876e-33e3d7e4e7a2', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'THR/Bonus system', '2025-04-29 10:46:28.708', '2025-04-29 10:46:28.708'),
('029c4203-4c77-4248-9d64-109d2b4b5adb', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Employee Discounts', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('03c0e1d4-b7a4-4a18-901d-54de452f25f1', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Competitive Salary', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('04bea690-3c5e-4c84-8319-a7703e4fac95', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Competitive Salary', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('04de41fe-4222-4874-8a53-cba6fd1e762d', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Parking', '2025-05-25 12:24:13.377', '2025-05-25 12:24:13.377'),
('0690dde9-0f71-49c6-b3e1-ca66061e2b40', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Transportation', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('070951ee-2342-445f-872e-3bc162e7811f', '54523e88-9358-4979-891f-88ef57d8e3e8', 'Medical', '2025-05-25 12:39:55.440', '2025-05-25 12:39:55.440'),
('09290541-4939-49f7-8f58-f66a6dd5cba5', '10159c92-bdba-4905-bc8e-1f74913989a3', 'THR / Bonus system', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('0addef7a-373e-4873-a809-ef00912f932e', '1970d06f-f892-48cc-93ef-2380cea9eaef', 'Salary', '2025-02-17 13:43:30.442', '2025-02-17 13:43:30.442'),
('0bc7496f-ccb9-4def-8ae9-88bfe953d5d0', '36ca9838-845c-40f2-9713-e51f64188be1', 'Medical', '2025-05-25 12:51:57.281', '2025-05-25 12:51:57.281'),
('0c13dfbe-73e1-45b4-8a70-311b9ee8e395', '0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', 'Parking', '2025-05-25 12:37:44.239', '2025-05-25 12:37:44.239'),
('0d67d1b0-e7c6-4f8a-ba75-17567da5c949', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Competitive Salary', '2025-05-13 10:39:18.548', '2025-05-13 10:39:18.548'),
('0dcc4cf1-eeb7-42d2-aaa8-4ac23493192b', '9d731152-4c5b-41e6-9781-aef7cb3adb7f', 'Dental', '2025-05-25 12:30:32.568', '2025-05-25 12:30:32.568'),
('0f09d968-5673-423f-94ee-57a18fd9f83e', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Paid Sick Days', '2025-05-13 10:39:18.548', '2025-05-13 10:39:18.548'),
('0fc078e0-1ecf-427a-9dea-40a588b1d203', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'Sertifikat', '2025-04-29 13:31:56.468', '2025-04-29 13:31:56.468'),
('12b056c0-1c83-406b-9f04-e85114e7a186', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'THR/Bonus System', '2025-05-13 10:42:28.712', '2025-05-13 10:42:28.712'),
('1328c83f-99cd-4532-bd93-6a9c4afd79f6', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Competitive Salary', '2025-04-29 12:36:05.833', '2025-04-29 12:36:05.833'),
('13f63c32-7faa-4105-8f9a-3e52655aae42', 'fdd928ba-908f-46e3-9f18-2d8386dd9736', 'Salary', '2025-05-25 11:05:12.308', '2025-05-25 11:05:12.308'),
('149701ad-f4f2-4cc2-9c10-6bac9e0a5a0b', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'International Exposure', '2025-05-13 10:39:18.548', '2025-05-13 10:39:18.548'),
('15676b89-a1d1-4a45-8186-a56fb2253d4e', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'Salary', '2025-03-12 14:06:43.972', '2025-03-12 14:06:43.972'),
('15882455-6bf0-4209-a3f9-cdb4d15d8f52', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Dental Insurance', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('15af408a-c383-47f2-9e1d-49e496702a9e', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Professional Development', '2025-04-29 12:34:20.158', '2025-04-29 12:34:20.158'),
('16b55084-ecbd-4836-8557-e8f7641db018', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Competitive Salary', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('1785bd92-0df6-4d03-a7cc-4ff6eba69b40', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Recreational Area', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('17a4f016-011f-4a12-8a98-6556f1600ab2', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'Salary', '2025-03-12 14:31:16.277', '2025-03-12 14:31:16.277'),
('1916b757-b26a-48af-b44e-ffaf99365a34', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'BPJS (Asuransi kesehatan)', '2025-04-29 12:58:27.903', '2025-04-29 12:58:27.903'),
('19f30e9a-3589-44d1-982b-c82a68de1fa6', '836e1950-1cd0-4be1-92e9-c40e820ea351', 'Asuransi Kesehatan', '2025-05-13 10:27:17.459', '2025-05-13 10:27:17.459'),
('1c6a1364-344e-4312-8f37-15c4fdfc095f', 'bd319feb-c7f8-4628-91c8-c006c2b57129', 'Miscellaneous allowance', '2025-05-25 12:56:38.302', '2025-05-25 12:56:38.302'),
('1d07e873-f67e-48d1-af49-4458c272d2d5', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Team Building Activity', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('1e21a0fe-bddd-42f7-bbb8-0fb8598218a9', '54523e88-9358-4979-891f-88ef57d8e3e8', 'Sports', '2025-05-25 12:39:55.440', '2025-05-25 12:39:55.440'),
('1e575956-1248-47cb-9a68-a3bd3153670d', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'THR / Bonus system', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('1f0b52fb-8c4c-42bb-bd17-8cf7046d14fb', '6166c8e2-63b5-4626-bb3b-b7efe6957a90', 'Salary', '2025-05-25 11:10:13.636', '2025-05-25 11:10:13.636'),
('1f694121-5c4a-4aa9-833f-18d4b7db1ef0', '8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', 'Salary', '2025-03-12 14:16:22.894', '2025-03-12 14:16:22.894'),
('1fecc2e0-af4b-4611-aebd-f563bb7014e5', 'bd319feb-c7f8-4628-91c8-c006c2b57129', 'Loans', '2025-05-25 12:56:38.302', '2025-05-25 12:56:38.302'),
('20cf1ae2-03c5-48b9-8d9c-a3c24069eaff', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Medical', '2025-05-25 12:32:29.371', '2025-05-25 12:32:29.371'),
('20dc3b59-8675-4f66-b5fd-9bb0c23e20bd', '46afeddd-d872-426b-bea8-d8e9d46e40b1', 'Salary', '2025-05-25 11:17:07.093', '2025-05-25 11:17:07.093'),
('21cfcb2c-db12-40ba-b30d-f8d26bf39eab', '43070f00-5b84-42d2-b904-9357ff2fcfe9', 'THR/Bonus System', '2025-04-29 11:03:01.509', '2025-04-29 11:03:01.509'),
('223336f9-faa5-4c20-898e-c646ed9a3c29', '0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', 'Dental', '2025-05-25 12:37:44.239', '2025-05-25 12:37:44.239'),
('22b91cf8-e0a6-4cdb-a8bb-aa01f1a2d7f7', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'THR/BOnus System', '2025-04-29 11:17:54.176', '2025-04-29 11:17:54.176'),
('235797d3-d91f-42bb-8d2e-bc3f230a9f0d', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'Competitive Salary', '2025-04-29 10:58:22.680', '2025-04-29 10:58:22.680'),
('2637c62f-4f0f-472f-b080-06177cc71a15', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Bonus Uang Saku', '2025-04-29 13:28:57.471', '2025-04-29 13:28:57.471'),
('27191845-f4db-4c1a-80a1-3f4bdcb2ed0c', '43070f00-5b84-42d2-b904-9357ff2fcfe9', 'Medical Insurance', '2025-04-29 11:03:01.509', '2025-04-29 11:03:01.509'),
('271f73d8-2633-4542-b65d-56a1fc3a9653', '9f774803-bb84-40c1-a73b-2ec9c2521b2e', 'Salary', '2025-03-12 14:19:39.715', '2025-03-12 14:19:39.715'),
('273e3eae-2a9c-4196-bb9e-c709c597715e', '43070f00-5b84-42d2-b904-9357ff2fcfe9', 'Competitive Salary', '2025-04-29 11:03:01.509', '2025-04-29 11:03:01.509'),
('279ddf82-dbfc-47dc-b0c7-c4776c0e3095', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Sports', '2025-05-25 12:24:13.377', '2025-05-25 12:24:13.377'),
('27ec729f-229f-46ea-8fd5-2cdd010d1543', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'Competitive Salary', '2025-05-13 10:46:33.247', '2025-05-13 10:46:33.247'),
('2bdb0ebf-f731-498b-8d9a-7e9bcf0e2881', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Team Building Activity', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('2ca99abb-274a-4ee7-9e48-50ef97d765be', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Medical Insurance', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('2d0a322b-c780-4a20-8bcc-510b1119ac7d', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Parking', '2025-05-25 12:26:14.804', '2025-05-25 12:26:14.804'),
('2d4418c7-f96e-417b-9ca1-ddc4a4c05e43', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Competitive Salary', '2025-05-13 10:42:28.712', '2025-05-13 10:42:28.712'),
('2f8175e6-8071-4481-b4c3-f4ec5276e528', '504354c4-b842-46ed-a681-108f0a87341d', 'Salary', '2025-05-25 10:49:48.962', '2025-05-25 10:49:48.962'),
('2f830b64-19df-4647-9d92-223f1ca529b3', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Transportation', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('3223f5e3-9112-4ef3-a6e3-2e070d8c4755', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'THR/Bonus system', '2025-04-29 12:26:11.100', '2025-04-29 12:26:11.100'),
('32af85e5-2d9e-423c-936c-d4848feb089f', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Asuransi', '2025-04-29 12:55:31.769', '2025-04-29 12:55:31.769'),
('360e457f-359f-4c9b-bf3c-49d8e1b3e0d9', '7aec7881-000d-4443-ac2c-79a663ae1673', 'THR/Bonus system', '2025-04-29 11:44:50.077', '2025-04-29 11:44:50.077'),
('368249bf-8c27-4b7c-8169-b01486fd46b0', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Dental', '2025-05-25 12:32:29.371', '2025-05-25 12:32:29.371'),
('36877c25-54db-443c-906d-6b002c81f686', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Miscellaneous allowance', '2025-05-25 12:48:11.059', '2025-05-25 12:48:11.059'),
('37a489a8-b039-448c-9169-69571f32f75f', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Medical Insurance ', '2025-04-29 12:34:20.158', '2025-04-29 12:34:20.158'),
('3805e0a9-8975-40a1-8bf8-d05adf2a858b', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'THR / Bonus system', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('3a242da5-81c6-4b95-b346-96f88d821d82', '9d731152-4c5b-41e6-9781-aef7cb3adb7f', 'Medical', '2025-05-25 12:30:32.568', '2025-05-25 12:30:32.568'),
('3a4affeb-cb84-41f6-a792-342a1ca65c59', '410c16d5-523e-4088-bdbc-8630efb43cc1', 'Bonus Bulanan', '2025-05-25 11:57:46.707', '2025-05-25 11:57:46.707'),
('3a4f4d2d-4d0d-4b32-a9e7-d3b19030ab36', '934b1525-7184-489f-a70f-864aaeaded5e', 'Sports', '2025-05-25 12:28:43.113', '2025-05-25 12:28:43.113'),
('3d821f74-1316-41c4-8a28-14b214840c5c', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Employee Discounts', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('3e7bc41c-5900-4595-99f7-52ede02d27df', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Competitive Salary', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('3e7fb7e0-fef4-44dc-8198-65fc2ed42002', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'Salary', '2025-03-12 14:02:07.030', '2025-03-12 14:02:07.030'),
('3edee2bf-7cf9-45e7-badf-58e60db54eef', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'Paid Sick Days', '2025-04-29 11:17:54.176', '2025-04-29 11:17:54.176'),
('4010b209-eb0e-4db1-b1d4-a6148ebef1f5', '36ca9838-845c-40f2-9713-e51f64188be1', 'Loans', '2025-05-25 12:51:57.281', '2025-05-25 12:51:57.281'),
('41138d4f-2481-45a4-97fe-e917da7d08e4', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Transportation', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('43eba0d1-281e-4d3b-a31e-0b357cb522c1', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Salary', '2025-03-12 14:14:56.192', '2025-03-12 14:14:56.192'),
('475c828a-03d0-479e-8613-6ad4ebfa12d0', '0ce9459e-e3b2-4760-b478-9ccee437f455', 'Salary', '2025-03-12 14:11:22.212', '2025-03-12 14:11:22.212'),
('497cc84c-ec0f-4cc1-a1e6-1cc2820ee3a8', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'Competitive Salary', '2025-04-29 12:26:11.100', '2025-04-29 12:26:11.100'),
('4a32593b-aade-483a-8499-9b325fd90a02', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'THR / Bonus system', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('4e16f13c-da6e-43f0-809a-42f5e2055f26', '934b1525-7184-489f-a70f-864aaeaded5e', 'Parking', '2025-05-25 12:28:43.113', '2025-05-25 12:28:43.113'),
('4ec25142-1212-4fb8-baa9-52d5c7d23530', '934b1525-7184-489f-a70f-864aaeaded5e', 'Dental', '2025-05-25 12:28:43.113', '2025-05-25 12:28:43.113'),
('51c096cb-c29d-49e2-8398-5ab7c9be7d4b', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Dental', '2025-05-25 12:26:14.804', '2025-05-25 12:26:14.804'),
('52259c92-b72d-4f2a-8c90-43bea7d84b6e', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Period Leave', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('52729844-7206-4433-80b4-5b12628eca5f', '533c1bbd-4eb2-4d64-beee-cad15039eb28', 'Medical Insurance', '2025-04-29 11:03:00.543', '2025-04-29 11:03:00.543'),
('52bcb090-ec53-43a5-8ec8-6238937c5e71', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Sports', '2025-05-25 12:26:14.804', '2025-05-25 12:26:14.804'),
('55a0dad0-fec6-4e81-9e17-021a97c61f40', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'Asuransi Kesehatan', '2025-05-13 10:11:51.524', '2025-05-13 10:11:51.524'),
('573128d2-4a35-4196-8fe6-fad9805b2ad6', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Team Building Activity', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('57605094-130d-4d37-8b1a-30481109d1ee', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Company Outings', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('57682d38-21a7-4307-8f9a-7f105f8b7081', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Loans', '2025-05-25 12:54:59.763', '2025-05-25 12:54:59.763'),
('5b162eac-ecc4-42bb-8797-43223ad8e2de', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Medical', '2025-05-25 12:48:11.059', '2025-05-25 12:48:11.059'),
('5c142e13-70c3-4202-a9be-dcfaae598ffa', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Medical Insurance', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('5d9ca590-ab6c-431a-9ac3-a1b07330dc32', '533c1bbd-4eb2-4d64-beee-cad15039eb28', 'Competitive Salary', '2025-04-29 11:03:00.543', '2025-04-29 11:03:00.543'),
('5e8ba3dc-8d28-4a71-b21e-7560418d6119', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Dental Insurance', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('5eea51b1-f896-4e4d-9522-a3d54e24b19f', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'Professional Development', '2025-04-29 12:40:00.547', '2025-04-29 12:40:00.547'),
('611ca898-c5d3-4b61-837e-571211456bbd', 'ec4026e7-7dd0-4726-aeb6-a6146cea8f86', 'Miscellaneous allowance', '2025-05-25 12:49:51.505', '2025-05-25 12:49:51.505'),
('61e0c92e-044b-444d-ba30-54d096aff457', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Competitive Salary', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('6260f0a2-0c16-4ad6-a575-a7ad7deb7bd1', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Bantuan tempat kerja', '2025-04-29 12:55:31.769', '2025-04-29 12:55:31.769'),
('62ada0a0-2215-4af5-90df-efc1fab0eb0d', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'Salary', '2025-03-12 14:22:07.516', '2025-03-12 14:22:07.516'),
('63ea2257-6d5c-4951-adf8-1a914884e91e', '36b544f0-34bb-44f0-af09-8c1728167477', 'Salary', '2025-05-25 10:47:45.495', '2025-05-25 10:47:45.495'),
('644ef52c-6bfd-498c-8476-27c143973e10', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'THR / Bonus system', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('681d6472-25c0-4b5b-8e0b-f4e737c5f2db', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Dental Insurance', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('6ae085b4-dd9b-4a48-9dd7-f0a599fcb0ec', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Work From Home', '2025-05-13 10:42:28.712', '2025-05-13 10:42:28.712'),
('6aefc83a-34ed-4167-87f5-3bc0cd81d729', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Dental Insurance', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('6dd3e888-844e-40a4-b2e4-8ab9a276d375', '36ca9838-845c-40f2-9713-e51f64188be1', 'Miscellaneous allowance', '2025-05-25 12:51:57.281', '2025-05-25 12:51:57.281'),
('6f9e8da2-b1ba-4e9d-87da-fbfbf1c9746b', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'Medical Insurance', '2025-04-29 10:46:28.708', '2025-04-29 10:46:28.708'),
('73ee66b9-3bdd-4de2-ac33-d743012f1e92', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Competitive Salary', '2025-05-13 10:50:55.361', '2025-05-13 10:50:55.361'),
('751bb2d6-1480-47fb-94c8-076b526f306f', '934b1525-7184-489f-a70f-864aaeaded5e', 'Medical', '2025-05-25 12:28:43.113', '2025-05-25 12:28:43.113'),
('75626938-536a-4b70-a49b-1f7209fe21a9', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'Sertifikat', '2025-04-29 13:33:59.752', '2025-04-29 13:33:59.752'),
('78cdf6cf-3c40-43b6-84b3-7c7a700dbc54', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Period Leave', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('7abd6888-ddef-40f6-b2b3-89bc480dafa9', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Bonus Uang Saku', '2025-05-13 10:20:40.954', '2025-05-13 10:20:40.954'),
('7c4ee7c6-b902-41be-be02-c60e492aa4ae', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Dental Insurance', '2025-05-13 11:14:18.208', '2025-05-13 11:14:18.208'),
('7d7d9ee3-fcf1-4ee9-8300-ef3b31ec8a97', '0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', 'Medical', '2025-05-25 12:37:44.239', '2025-05-25 12:37:44.239'),
('7ed02f4d-c9e0-42ea-b8b0-fc5040b3b18d', 'bd319feb-c7f8-4628-91c8-c006c2b57129', 'Medical', '2025-05-25 12:56:38.302', '2025-05-25 12:56:38.302'),
('83154daa-7932-41f4-99ca-5de3b30a84ae', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'Medical Insurance', '2025-04-29 10:58:22.680', '2025-04-29 10:58:22.680'),
('8684967f-6dd6-4224-9762-fcd554f29ffb', '4215bb59-0033-4c04-ad7e-42b6cb80749b', 'Salary', '2025-05-25 11:08:59.754', '2025-05-25 11:08:59.754'),
('8960bca5-8409-4782-b892-ad266bc473a6', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'THR/Bonus System', '2025-05-13 10:50:55.361', '2025-05-13 10:50:55.361'),
('8b40c0d4-8acf-475b-ae42-b748cb1699b0', '5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'Bonus Bulanan', '2025-05-13 10:29:46.188', '2025-05-13 10:29:46.188'),
('8b9b913b-ac0e-4e17-a6f3-0e71cc5eb850', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'International Exposure', '2025-05-13 10:42:28.712', '2025-05-13 10:42:28.712'),
('8c0c7941-0177-4302-977d-3b942e888e1b', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Transportation', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('8c526142-22c5-416c-9fa1-7fcb72ba1fe5', 'ec4026e7-7dd0-4726-aeb6-a6146cea8f86', 'Medical', '2025-05-25 12:49:51.505', '2025-05-25 12:49:51.505'),
('8d04a268-ebd8-4379-820d-4fb757fb11e4', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Recreational Area', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('8ee7bb3f-4329-418f-a195-1e5bec76fd23', '004ed579-06bd-4c12-ae2e-ba25447d057e', 'Salary', '2025-05-25 11:26:04.894', '2025-05-25 11:26:04.894'),
('8fa40425-01b4-4e8c-adfc-8b61eeb5b0b7', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Medical Insurance', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('9133ef3c-711b-4c33-8245-d75747f4d225', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Competitive Salary', '2025-04-29 12:34:20.158', '2025-04-29 12:34:20.158'),
('96bb8f3d-e3ef-4eaa-b653-fc1b796aab34', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Liburan & Cuti', '2025-04-29 12:55:31.769', '2025-04-29 12:55:31.769'),
('973b1348-f586-48c8-9f76-669765a8bbb5', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Employee Discounts', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('9789f6ff-7591-4867-a700-54b63fcbb6f7', '0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', 'Sports', '2025-05-25 12:37:44.239', '2025-05-25 12:37:44.239'),
('995ee5c7-0dc9-40a4-9986-0f8e9b25a032', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Competitive Salary', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('998888fb-dabd-44f7-8041-26cd5a2d6524', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Asuransi Kesehatan', '2025-05-13 10:20:40.954', '2025-05-13 10:20:40.954'),
('9b1de357-0b02-4542-9a38-5304fd285748', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Miscellaneous allowance', '2025-05-25 12:54:59.763', '2025-05-25 12:54:59.763'),
('9f5a8406-92d1-4814-8555-aac9b7be26f5', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Period Leave', '2025-06-01 15:18:56.681', '2025-06-01 15:18:56.681'),
('9f6759cb-cb57-43a6-b34e-21a91cccf6aa', '49360c9e-d0f8-4dbf-a4c4-3651638183ea', 'THR/Bonus system', '2025-04-29 12:22:50.705', '2025-04-29 12:22:50.705'),
('a0737562-306d-46b5-a064-e9347d3d3729', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'Competitive Salary', '2025-04-29 11:17:54.176', '2025-04-29 11:17:54.176'),
('a1621912-ee99-449a-991f-b2313463e54a', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'THR/Bonus System', '2025-05-13 10:46:33.247', '2025-05-13 10:46:33.247'),
('a27c1f19-c6bf-42ee-a8d0-25b85b1b881e', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Medical Insurance', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('a327cbb9-c752-4314-95ac-a366b9ab748b', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Competitive Salary', '2025-05-13 11:06:04.773', '2025-05-13 11:06:04.773'),
('a41c68f0-1a76-46f1-b4f0-18e64f0957d5', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'Competitive Salary', '2025-04-29 12:40:00.547', '2025-04-29 12:40:00.547'),
('a565a4fb-f56f-4d32-a09b-f008f342d61e', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Paid Sick Days', '2025-05-13 10:42:28.712', '2025-05-13 10:42:28.712'),
('a8f5c9b6-463d-4953-b8bf-2fb2e30a4d8f', 'bf26275c-eeba-4952-9c77-995d32bf14b3', 'Tunjangan Kesehatan', '2025-05-25 12:17:16.449', '2025-05-25 12:17:16.449'),
('a902cb48-71c2-4851-bb10-54543b008629', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Medical', '2025-05-25 12:54:59.763', '2025-05-25 12:54:59.763'),
('a9633853-4bb5-4c42-ba93-3e36659f055b', '7aec7881-000d-4443-ac2c-79a663ae1673', 'Compotitive Salary', '2025-04-29 11:44:50.077', '2025-04-29 11:44:50.077'),
('a9c4bea7-d0bf-4f6a-800e-a857281bbbc0', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'THR/Bonus System', '2025-05-13 10:39:18.548', '2025-05-13 10:39:18.548'),
('a9de0fb6-efd1-4e88-9d71-0c4dcd3d0ec5', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Medical', '2025-05-25 12:24:13.377', '2025-05-25 12:24:13.377'),
('aaf4eed0-2bde-4799-a10e-b72753ca9a3c', '836e1950-1cd0-4be1-92e9-c40e820ea351', 'Bonus Bulanan', '2025-05-13 10:27:17.459', '2025-05-13 10:27:17.459'),
('b1cde6e7-abe5-49cf-a448-1239e665c0f1', '6db391e1-5f10-4531-8bb1-7867138437a4', 'Bonus', '2025-05-25 12:07:00.235', '2025-05-25 12:07:00.235'),
('b4712a46-8b51-4114-a30e-7ac0e8ac1ad7', 'c43deb87-cb22-48f1-99da-ce578d95dc5c', 'Salary', '2025-05-25 11:21:14.290', '2025-05-25 11:21:14.290'),
('b6114862-c4c2-41af-a2e5-c61f8327afe9', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Medical Insurance', '2025-04-29 12:36:05.833', '2025-04-29 12:36:05.833'),
('b64b6480-a901-496b-9ea7-bd95b7fe8b2f', '54523e88-9358-4979-891f-88ef57d8e3e8', 'Dental', '2025-05-25 12:39:55.440', '2025-05-25 12:39:55.440'),
('b656d41d-ba48-4496-ac6d-070e6262b8c1', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Sports', '2025-05-25 12:32:29.371', '2025-05-25 12:32:29.371'),
('b911ecaa-7203-4bcb-822c-6c6f0ea0fc25', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'THR / Bonus system', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('bbfa56cc-439e-470c-af58-6a64e2c6c9ec', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Loans', '2025-05-25 12:48:11.059', '2025-05-25 12:48:11.059'),
('bc0dbaf4-6408-4725-a3fc-330fca75a1dc', '7aec7881-000d-4443-ac2c-79a663ae1673', 'Paid Sick Days', '2025-04-29 11:44:50.077', '2025-04-29 11:44:50.077'),
('bd03f7cf-cfb4-4057-9966-9d3b575a68c7', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Gaji yang kompetitif dengan insentif kinerja.', '2025-04-29 12:58:27.903', '2025-04-29 12:58:27.903'),
('bf4012fe-bca2-4a5d-adbd-e4c30685f449', '49360c9e-d0f8-4dbf-a4c4-3651638183ea', 'Professional Development', '2025-04-29 12:22:50.705', '2025-04-29 12:22:50.705'),
('c051836d-c442-4385-8b7f-f4636611e58b', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'Medical Insurance', '2025-04-29 12:40:00.547', '2025-04-29 12:40:00.547'),
('c1bdf8b2-244e-4786-a25a-e3b19396c373', '6bf0136f-1f8f-4916-969a-0014607c6bbb', 'Tunjangan Kesehatan', '2025-05-25 12:14:43.828', '2025-05-25 12:14:43.828'),
('c2eb453a-cdd1-4849-a935-6afa51507ca5', '5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'Asuransi Kesehatan', '2025-05-13 10:29:46.188', '2025-05-13 10:29:46.188'),
('c5a7b1c0-256b-482d-b044-088b7ea94657', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'THR/Bonus System', '2025-04-29 10:58:22.680', '2025-04-29 10:58:22.680'),
('cb80bf61-0670-411d-a819-33dc3fea1e5e', '4e2f3ab7-87c7-46b8-89e7-f99a5ebe9b15', 'Bonus', '2025-05-25 12:01:04.908', '2025-05-25 12:01:04.908'),
('ce547824-ffa4-49b3-b4cc-a37b2c15dfa3', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'Team Building Activity', '2025-04-29 11:17:54.176', '2025-04-29 11:17:54.176'),
('cf416d3d-bae7-498d-a508-f1962a27bfff', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'Paid Sick Days', '2025-05-13 10:46:33.247', '2025-05-13 10:46:33.247'),
('d189dda8-773b-418a-ae55-a3537f3c2d9c', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'Bonus Uang Saku', '2025-05-13 10:11:51.524', '2025-05-13 10:11:51.524'),
('d1b060bf-382c-4790-ae90-18e97a9d5706', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Sertifikat', '2025-04-29 13:28:57.471', '2025-04-29 13:28:57.471'),
('d22d3a8f-a071-43b7-86b5-4484cf34228b', '3bb94b9c-265a-4ea3-b238-9e3c1a0c69f5', 'Salary', '2025-02-25 07:21:04.562', '2025-02-25 07:21:04.562'),
('d7819af5-501d-4e1e-8be9-bdc38d731b42', '7aec7881-000d-4443-ac2c-79a663ae1673', 'Team Building Activity', '2025-04-29 11:44:50.077', '2025-04-29 11:44:50.077'),
('d81e91e6-d810-42d4-913d-52aeab8c8991', '5332404c-fa80-42ee-97c4-497bb364d9f2', 'Salary', '2025-05-25 10:45:03.158', '2025-05-25 10:45:03.158'),
('d87c9acd-db6b-4025-856c-e8fc9e0d76f4', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Recreational Area', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('da562517-bd49-4d12-8259-6367b3cc40cf', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Company Outings', '2025-05-13 11:45:54.884', '2025-05-13 11:45:54.884'),
('deec9122-d84d-4a8a-be33-98f23213fab8', '790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', 'Salary', '2025-05-25 11:22:32.274', '2025-05-25 11:22:32.274'),
('df3a5c99-925a-43d5-bfb4-29b644c7a68b', '9d731152-4c5b-41e6-9781-aef7cb3adb7f', 'Parking', '2025-05-25 12:30:32.568', '2025-05-25 12:30:32.568'),
('e00c5f70-edcf-4773-9d61-58fb8c3d6f15', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Company Outings', '2025-05-13 11:42:53.719', '2025-05-13 11:42:53.719'),
('e04a33f9-6716-47b0-af2f-60aa33136f33', '533c1bbd-4eb2-4d64-beee-cad15039eb28', 'THR/Bonus System', '2025-04-29 11:03:00.543', '2025-04-29 11:03:00.543'),
('e3035d64-fe0e-4e4b-9864-72920cbdee27', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Parking', '2025-05-25 12:32:29.371', '2025-05-25 12:32:29.371'),
('e36721bc-cd63-4edd-a32e-7e86a6fc3730', '378c8241-a8a1-44ca-8a53-8584ed856711', 'BONUS', '2025-05-25 12:04:45.589', '2025-05-25 12:04:45.589'),
('e57b3646-7286-484d-a775-0bd7dd722a29', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Dental', '2025-05-25 12:24:13.377', '2025-05-25 12:24:13.377'),
('e6761aa3-bc33-4665-a35b-f7c9405e1fd2', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Paid Sick Days', '2025-05-13 10:50:55.361', '2025-05-13 10:50:55.361'),
('e6a30da9-52b2-46ca-af76-23a1d62d3380', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Salary', '2025-03-12 14:34:01.092', '2025-03-12 14:34:01.092'),
('e73e5a8b-34cf-448a-bb06-b6a29fd144f2', '49360c9e-d0f8-4dbf-a4c4-3651638183ea', 'Competitive Salary', '2025-04-29 12:22:50.705', '2025-04-29 12:22:50.705'),
('e85c3341-2d59-4a49-8723-f478bb9c3428', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'Professional Development', '2025-04-29 12:26:11.100', '2025-04-29 12:26:11.100'),
('e9ce50de-3b63-464b-b25f-505f6f5e41cf', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Pertumbuhan Karir', '2025-04-29 12:55:31.769', '2025-04-29 12:55:31.769'),
('eab1db49-52c3-41b1-962a-2a6e7257e789', '714aca3f-3d15-4086-8f3f-461529b14812', 'Salary', '2025-06-01 15:17:22.469', '2025-06-01 15:17:22.469'),
('eb083190-1394-4885-b7d5-14a14b065885', '2223856d-5427-43ab-985b-d3917b5fad3d', 'THR / Bonus system', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('ec84a1a2-e4d0-4b40-a4a1-83735d01de0d', 'ba13fc34-4ac8-45ba-94c7-c0fde001e419', 'Salary', '2025-05-25 11:17:14.837', '2025-05-25 11:17:14.837'),
('ecf29c67-fa85-4997-a787-9c2dffd753a7', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Salary', '2025-03-12 14:26:10.499', '2025-03-12 14:26:10.499'),
('ed7f6620-641a-44dd-9a75-a103f5158d4c', '54523e88-9358-4979-891f-88ef57d8e3e8', 'Parking', '2025-05-25 12:39:55.440', '2025-05-25 12:39:55.440'),
('ee7ae8a6-a44f-48b3-80cc-940d8ac85a79', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Medical Insurance', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('eff28c1e-e284-4e3c-878e-a98fde8e207e', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'THR/Bonus System', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('f23bcb39-486a-4ab3-b971-5f3743e6debc', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Team Building Activity', '2025-05-13 11:11:29.891', '2025-05-13 11:11:29.891'),
('f2497425-f995-41ea-8725-e04796d5c71f', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'Bonus Uang Saku', '2025-04-29 13:33:59.752', '2025-04-29 13:33:59.752'),
('f406afbc-faf1-4005-9965-42fa8ef042ce', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'International Exposure', '2025-05-13 10:46:33.247', '2025-05-13 10:46:33.247'),
('f6c74626-bd76-4f42-8da8-a04796896ad0', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Team Building Activity', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('f77e60df-e12b-4b05-b532-6bc79237d43b', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Transportation', '2025-05-13 11:03:34.170', '2025-05-13 11:03:34.170'),
('fb47cfd3-4b2d-49b0-8998-6e03afc44383', '9d731152-4c5b-41e6-9781-aef7cb3adb7f', 'Sports', '2025-05-25 12:30:32.568', '2025-05-25 12:30:32.568'),
('fbb9d091-daf5-4d83-8754-c286997185da', 'a87dbe94-d95b-423d-9fcb-29eb06e5fdce', 'Salary', '2025-03-12 14:28:47.949', '2025-03-12 14:28:47.949'),
('fc400b7f-981e-46b0-a814-5bb884353d68', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'Competitve Salary', '2025-04-29 10:46:28.708', '2025-04-29 10:46:28.708'),
('fc9a9932-2f5b-471f-901b-d67519b3ea87', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'Bonus Uang saku', '2025-04-29 13:31:56.468', '2025-04-29 13:31:56.468'),
('fcd1ebb5-7b4d-4980-b9da-33192fc37903', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Professional Development', '2025-04-29 12:36:05.833', '2025-04-29 12:36:05.833'),
('fe44881d-0ef3-4c5a-8e15-f798bb761aad', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Medical', '2025-05-25 12:26:14.804', '2025-05-25 12:26:14.804'),
('ff44c79b-1b6f-4ac7-846b-f52dd07416e0', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Competitive Salary', '2025-05-13 11:20:47.537', '2025-05-13 11:20:47.537'),
('ff6c7809-c08b-4b5b-ae53-4cce2e887e31', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'Salary', '2025-03-12 14:37:56.159', '2025-03-12 14:37:56.159');

-- --------------------------------------------------------

--
-- Table structure for table `job_seekers`
--

CREATE TABLE `job_seekers` (
  `job_seeker_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otpExpires` datetime(3) DEFAULT NULL,
  `verified` enum('true','false') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'false',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `lmsLinkedAt` datetime(3) DEFAULT NULL,
  `lmsUserId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_seekers`
--

INSERT INTO `job_seekers` (`job_seeker_id`, `email`, `password`, `full_name`, `otp`, `otpExpires`, `verified`, `created_at`, `updated_at`, `lmsLinkedAt`, `lmsUserId`) VALUES
('09775101-2121-4e0e-8788-558a8ed76b20', 'jobseeker10@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 10', NULL, NULL, 'true', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741', NULL, NULL),
('2377f1d6-bc61-4bbf-adbb-44f341748b68', 'jobseeker15@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 15', NULL, NULL, 'true', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864', NULL, NULL),
('324b23cc-197a-4e8f-adab-56b14dcafb7e', 'jobseeker7@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 7', NULL, NULL, 'true', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670', NULL, NULL),
('3c022494-dea6-4a6f-94b3-cbab97530f91', 'jobseeker11@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 11', NULL, NULL, 'true', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760', NULL, NULL),
('45a4fda3-751d-40e0-a036-82b1eb2e1860', 'jobseeker9@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 9', NULL, NULL, 'true', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702', NULL, NULL),
('4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', 'jobseeker1@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Leonardus Reka', NULL, NULL, 'true', '2025-02-05 07:52:05.505', '2025-05-07 10:25:05.142', NULL, NULL),
('55c11768-ef2e-4342-add4-a1f1be92b59e', 'jobseeker3@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 3', NULL, NULL, 'true', '2025-02-05 07:52:05.556', '2025-06-04 01:30:25.410', NULL, NULL),
('5e1c61b9-1907-4a40-a03e-04d29f74babe', 'jobseeker6@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 6', NULL, NULL, 'true', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627', NULL, NULL),
('97b950b7-b0ef-4ed0-8270-06accde8e340', 'jobseeker4@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 4', NULL, NULL, 'true', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592', NULL, NULL),
('b1fafeae-fa76-4d95-9d78-ef6732cd56cd', 'jobseeker5@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 5', NULL, NULL, 'true', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610', NULL, NULL),
('b4cf2fc4-21a1-4136-bcf0-0e3402c610ce', 'jobseeker2@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 2', NULL, NULL, 'true', '2025-02-05 07:52:05.537', '2025-05-23 04:07:00.281', NULL, NULL),
('c907b0d5-afda-4f35-b0b0-6e479eed5b49', 'leonardusrekajaktipuspito15@gmail.com', '$2a$10$D5FWvVRhoazrOVhSMe89ueyWImFnV7KCOrlIRAziXhBVCWL5qWjFi', 'Leonardus Reka', NULL, NULL, 'true', '2025-02-26 17:32:16.104', '2025-02-26 17:32:16.104', NULL, NULL),
('e76c6fbe-ca2e-4f63-a4dc-cd593cbbde39', 'jobseeker12@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 12', NULL, NULL, 'true', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811', NULL, NULL),
('ed17ee7d-9bd8-435a-aff1-ddc8fba08ddc', 'jobseeker8@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 8', NULL, NULL, 'true', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686', NULL, NULL),
('f1bea311-f228-4587-9972-c93bc78be3f4', 'jobseeker13@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 13', NULL, NULL, 'true', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836', NULL, NULL),
('fbc7e65a-c69d-45b9-acdd-842ce3412402', 'jobseeker14@mail.com', '$2a$10$NTpk8wvFvy5/dzLi4IRwluYkKeq677YdjenYPWc.rlo725CILkTuO', 'Job Seeker 14', NULL, NULL, 'true', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `job_seeker_details`
--

CREATE TABLE `job_seeker_details` (
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_picture_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `personal_summary` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_seeker_details`
--

INSERT INTO `job_seeker_details` (`job_seeker_detail_id`, `job_seeker_id`, `profile_picture_url`, `personal_summary`, `created_at`, `updated_at`) VALUES
('1907e6d9-7619-431f-942f-54c4d3070913', '45a4fda3-751d-40e0-a036-82b1eb2e1860', 'profile/js9.jpg', 'Experienced job seeker 9', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702'),
('1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', '97b950b7-b0ef-4ed0-8270-06accde8e340', 'profile/js4.jpg', 'Experienced job seeker 4', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592'),
('1edf7bd2-5ce0-4a9a-a313-b496a72916f6', 'b1fafeae-fa76-4d95-9d78-ef6732cd56cd', 'profile/js5.jpg', 'Experienced job seeker 5', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610'),
('225074b8-cf76-4a6c-811c-52d5719c57ad', '55c11768-ef2e-4342-add4-a1f1be92b59e', 'public/uploads/profile-picture/profile-picture-1749000625332-717471124.png', 'Seorang graphic designer kreatif dengan pengalaman dalam merancang identitas visual, materi promosi, dan konten digital yang menarik dan fungsional. Terbiasa bekerja dengan berbagai klien dan tim lintas fungsi untuk mengubah ide menjadi desain visual yang kuat dan relevan. Terampil menggunakan Adobe Creative Suite, memiliki pemahaman mendalam tentang prinsip desain, dan selalu mengikuti tren desain terbaru untuk menciptakan karya yang segar dan berdampak.', '2025-02-05 07:52:05.556', '2025-06-04 01:30:25.343'),
('235b42a9-1886-4aaa-92cf-762912d697cc', '2377f1d6-bc61-4bbf-adbb-44f341748b68', 'profile/js15.jpg', 'Experienced job seeker 15', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864'),
('256e2c00-5eb2-47fc-a8c6-299a3be5ca10', '324b23cc-197a-4e8f-adab-56b14dcafb7e', 'profile/js7.jpg', 'Experienced job seeker 7', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670'),
('26fc75a4-5eab-4d57-84da-7c7c4af25424', 'b4cf2fc4-21a1-4136-bcf0-0e3402c610ce', 'public/uploads/profile-picture/profile-picture-1747973220229-978053894.png', 'Saya adalah akuntan profesional dengan pengalaman lebih dari 5 tahun di bidang keuangan dan akuntansi perusahaan. Terampil dalam penyusunan laporan keuangan, rekonsiliasi akun, pengelolaan anggaran, dan analisis data keuangan untuk mendukung pengambilan keputusan bisnis yang efektif. Memiliki pemahaman mendalam mengenai standar akuntansi dan peraturan perpajakan. Saya juga terbiasa menggunakan aplikasi seperti SAP, Accurate, dan Microsoft Excel untuk meningkatkan efisiensi kerja. Berkomitmen untuk menjaga akurasi dan transparansi dalam seluruh proses keuangan serta selalu beradaptasi dengan perubahan regulasi dan teknologi terbaru.', '2025-02-05 07:52:05.537', '2025-05-23 04:07:00.236'),
('2cad1612-894b-4115-b476-55d51cd677e7', 'f1bea311-f228-4587-9972-c93bc78be3f4', 'profile/js13.jpg', 'Experienced job seeker 13', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836'),
('3cf7fbd0-da22-4834-8d78-c11f0f046017', 'ed17ee7d-9bd8-435a-aff1-ddc8fba08ddc', 'profile/js8.jpg', 'Experienced job seeker 8', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686'),
('b9e55bcc-d881-4084-b4d1-13cb4b2e5f98', 'c907b0d5-afda-4f35-b0b0-6e479eed5b49', NULL, NULL, '2025-02-26 17:32:16.104', '2025-02-26 17:32:16.104'),
('d364b526-8cd4-407f-a55a-e0863c8f4d57', '4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', 'public/uploads/profile-picture/profile-picture-1746613503916-890832303.jpg', 'Backend Developer dengan pengalaman dalam JavaScript dan TypeScript, serta keahlian dalam membangun dan mengelola server-side aplikasi yang scalable dan efisien. Terampil dalam menggunakan framework seperti Node.js, Express, dan NestJS, serta mengelola database dengan PostgreSQL, MongoDB, dan MySQL. Memiliki pemahaman mendalam tentang RESTful API, GraphQL, autentikasi, serta arsitektur berbasis microservices. Berorientasi pada performa dan keamanan, serta terbiasa bekerja dalam lingkungan pengembangan berbasis CI/CD dan cloud computing. Senang memecahkan masalah kompleks dan selalu berusaha meningkatkan efisiensi sistem.', '2025-02-05 07:52:05.505', '2025-05-07 10:25:04.232'),
('e820b5d2-2339-4a8a-a0d2-58b8c368f439', '5e1c61b9-1907-4a40-a03e-04d29f74babe', 'profile/js6.jpg', 'Experienced job seeker 6', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627'),
('ead2218e-db7a-4efd-a0e9-b1b19b16bb02', '3c022494-dea6-4a6f-94b3-cbab97530f91', 'profile/js11.jpg', 'Experienced job seeker 11', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760'),
('eb85d60a-57fa-4b97-822c-ef80e4d9ead3', '09775101-2121-4e0e-8788-558a8ed76b20', 'profile/js10.jpg', 'Experienced job seeker 10', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741'),
('fb8e2233-8d1a-4b36-b941-612c9e9c3921', 'e76c6fbe-ca2e-4f63-a4dc-cd593cbbde39', 'profile/js12.jpg', 'Experienced job seeker 12', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811'),
('fd67ae95-c44a-4745-bcd3-e1b1d88a624f', 'fbc7e65a-c69d-45b9-acdd-842ce3412402', 'profile/js14.jpg', 'Experienced job seeker 14', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850');

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `language_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_activities`
--

CREATE TABLE `log_activities` (
  `log_activity_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_scores`
--

CREATE TABLE `match_scores` (
  `match_score_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overall` double DEFAULT NULL,
  `summary` double DEFAULT NULL,
  `skills` double DEFAULT NULL,
  `experience` double DEFAULT NULL,
  `education` double DEFAULT NULL,
  `certifications` double DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `projects` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `match_scores`
--

INSERT INTO `match_scores` (`match_score_id`, `application_id`, `overall`, `summary`, `skills`, `experience`, `education`, `certifications`, `created_at`, `updated_at`, `projects`) VALUES
('7437ed9b-a12d-424b-9e79-8c1f460994ff', '0dc51a84-8050-4b9c-b575-9882bed88a3e', 29.11, 34.03, 10.04, 25.96, 19.28, 0, '2025-06-14 16:42:15.345', '2025-06-14 16:42:15.345', 19.41),
('f34143ae-006a-43f2-8d11-be1ecf237333', 'c876367b-e1b9-459e-9c7b-1ac8af65050c', 42.6, 28.98, 6.26, 20.98, 9.43, 0, '2025-06-09 04:36:35.799', '2025-06-09 04:36:35.799', 12.6);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` enum('about_us','privacy_policy','event','news') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `page_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_info`
--

CREATE TABLE `personal_info` (
  `personal_info_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`personal_info_id`, `job_seeker_detail_id`, `address`, `phone_number`, `date_of_birth`, `created_at`, `updated_at`) VALUES
('1bcd5050-071a-40e4-920b-7ad8e769044a', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', '123 Job Seeker St 4', '0123456784', '2000-01-13 00:00:00.000', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592'),
('236439ee-835f-4891-b121-52f332cd012c', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3', '123 Job Seeker St 10', '01234567810', '2000-01-23 00:00:00.000', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741'),
('29f98a5b-69d8-4c2e-91d7-5091604d67f4', 'd364b526-8cd4-407f-a55a-e0863c8f4d57', '123 Job Seeker St 1', '0123456781', '2000-01-16 00:00:00.000', '2025-02-05 07:52:05.505', '2025-05-07 10:25:05.157'),
('31915899-6e54-4340-8f9e-c2424a62cfd6', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439', '123 Job Seeker St 6', '0123456786', '2000-01-03 17:00:00.000', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627'),
('4343e8cd-dded-421d-b936-48fc6bd83d54', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f', '123 Job Seeker St 14', '01234567814', '2000-01-07 17:00:00.000', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850'),
('79fd98ab-7b67-4362-9f80-9a71d748afef', '235b42a9-1886-4aaa-92cf-762912d697cc', '123 Job Seeker St 15', '01234567815', '2000-01-05 17:00:00.000', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864'),
('7a257e01-b99c-466f-bbb8-d7e66ef22373', '225074b8-cf76-4a6c-811c-52d5719c57ad', '123 Job Seeker St 3', '0123456783', '2000-01-16 00:00:00.000', '2025-02-05 07:52:05.556', '2025-06-04 01:30:25.430'),
('83cf3739-0bfb-4dca-bc88-402d4925b85a', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6', '123 Job Seeker St 5', '0123456785', '2000-01-08 17:00:00.000', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610'),
('86e55695-643e-478a-b058-d12dd345fcf2', '2cad1612-894b-4115-b476-55d51cd677e7', '123 Job Seeker St 13', '01234567813', '2000-01-30 00:00:00.000', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836'),
('bfc2c48c-2d38-41c6-a703-7212390a2fd2', '26fc75a4-5eab-4d57-84da-7c7c4af25424', '123 Job Seeker St 2', '0123456782', '2000-01-19 00:00:00.000', '2025-02-05 07:52:05.537', '2025-05-23 04:07:00.293'),
('d9cc4362-2921-4643-85fd-101c676538c2', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02', '123 Job Seeker St 11', '01234567811', '2000-01-22 00:00:00.000', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760'),
('e5f175c2-c49f-4528-930a-02e000ac5c14', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921', '123 Job Seeker St 12', '01234567812', '2000-01-03 17:00:00.000', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811'),
('ef7d364f-3331-49ca-9f52-37a49e58f470', '1907e6d9-7619-431f-942f-54c4d3070913', '123 Job Seeker St 9', '0123456789', '2000-01-03 17:00:00.000', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702'),
('fa45155c-2062-46cc-a4a9-c1216f59d34b', '3cf7fbd0-da22-4834-8d78-c11f0f046017', '123 Job Seeker St 8', '0123456788', '2000-01-24 00:00:00.000', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686'),
('ff090ad6-ec5a-4251-a78c-2aab80bb324e', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10', '123 Job Seeker St 7', '0123456787', '2000-01-30 00:00:00.000', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670');

-- --------------------------------------------------------

--
-- Table structure for table `position_levels`
--

CREATE TABLE `position_levels` (
  `position_level_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `position_levels`
--

INSERT INTO `position_levels` (`position_level_id`, `position_name`, `created_at`, `updated_at`) VALUES
('008440a7-ef2b-4e39-be75-b360e4939d9f', 'Publisher', '2025-02-05 07:52:35.804', '2025-02-05 07:52:35.804'),
('00967864-9e4e-4f11-8130-aa0436fb49bb', 'HR Manager', '2025-02-05 07:52:34.609', '2025-02-05 07:52:34.609'),
('00d61895-66a0-4c4e-9534-d24f736f0919', 'Event Planner', '2025-02-05 07:52:35.690', '2025-02-05 07:52:35.690'),
('035bcd59-206d-4cc3-9980-c1c4d3cc007b', 'Oil and Gas Engineer', '2025-02-05 07:52:36.541', '2025-02-05 07:52:36.541'),
('040cdbb5-7b3a-4a0e-a8df-124fc119e888', 'Marketing Manager', '2025-02-05 07:52:34.542', '2025-02-05 07:52:34.542'),
('0788f4a6-560e-43cd-a487-5d87e5ad1b53', 'Application Developer', '2025-02-05 07:52:34.772', '2025-02-05 07:52:34.772'),
('0dd0ccf0-91b9-473c-898f-92479de0c209', 'Automotive Engineer', '2025-02-05 07:52:36.014', '2025-02-05 07:52:36.014'),
('10a8b8f0-53b1-4fe5-bd97-a49f7180065d', 'Legal Advisor', '2025-02-05 07:52:35.444', '2025-02-05 07:52:35.444'),
('12248ad3-cd44-4e48-8a6e-6ac372fc9ec2', 'Hotel Manager', '2025-02-05 07:52:36.332', '2025-02-05 07:52:36.332'),
('148e28db-096d-49de-9560-42bbab895176', 'Archivist', '2025-02-05 07:52:35.902', '2025-02-05 07:52:35.902'),
('17210801-0473-4918-ae7a-065a5a58fdd5', 'Principal Developer', '2025-02-05 07:52:34.189', '2025-02-05 07:52:34.189'),
('17c8b334-8c92-4d5f-bcff-d3eac6556134', 'Big Data Engineer', '2025-02-05 07:52:35.005', '2025-02-05 07:52:35.005'),
('18d0ed44-6465-4530-b0a1-e4f5917a1699', 'Data Scientist', '2025-02-05 07:52:34.443', '2025-02-05 07:52:34.443'),
('1bb135c7-10b4-4f96-a342-47fe226ed95e', 'Developer', '2025-02-05 07:52:34.158', '2025-02-05 07:52:34.158'),
('1bb22dbc-fcd5-4d05-82ef-414a1d24be9e', 'Mobile Developer', '2025-02-05 07:52:34.787', '2025-02-05 07:52:34.787'),
('1c89cb84-a134-46a3-a56c-94cebfc4f041', 'Technical Support Specialist', '2025-02-05 07:52:34.524', '2025-02-05 07:52:34.524'),
('1c9f7980-3a8d-46db-bdb1-bebf86539732', 'Video Editor', '2025-02-05 07:52:35.214', '2025-02-05 07:52:35.214'),
('1de04349-7850-4404-89ef-9ec6b2a33af5', 'Operations Manager', '2025-02-05 07:52:34.637', '2025-02-05 07:52:34.637'),
('1e9a3e35-5401-4cdb-bde7-ae98f754033e', 'Training Specialist', '2025-02-05 07:52:34.628', '2025-02-05 07:52:34.628'),
('2263616e-faa7-470c-8d77-34f5aaad6084', 'Database Administrator', '2025-02-05 07:52:34.711', '2025-02-05 07:52:34.711'),
('237b2757-955e-49c5-83c4-73b3779620a3', 'Frontend Developer', '2025-02-05 07:52:34.832', '2025-02-05 07:52:34.832'),
('25af9121-d995-4e87-857e-56232f459502', 'Librarian', '2025-02-05 07:52:35.893', '2025-02-05 07:52:35.893'),
('279bc9b2-e350-4427-8c71-f22f2703ab0d', 'Cloud Engineer', '2025-02-05 07:52:34.891', '2025-02-05 07:52:34.891'),
('27a65edb-0836-466e-b432-961b76bdd2ce', 'Corporate Trainer', '2025-02-05 07:52:35.671', '2025-02-05 07:52:35.671'),
('28f379a9-43ba-421f-a06e-f3c175a2d7ec', 'Penetration Tester', '2025-02-05 07:52:34.936', '2025-02-05 07:52:34.936'),
('2ca26416-8b10-48f0-baa3-5e2ee0215491', 'Employee Relations Manager', '2025-02-05 07:52:35.603', '2025-02-05 07:52:35.603'),
('2d8daf7c-8049-4e8b-88ce-93d9fa39a9d9', 'Lead Developer', '2025-02-05 07:52:34.180', '2025-02-05 07:52:34.180'),
('32d67d42-2467-48b2-a5ac-f47d32a03831', 'Professor', '2025-02-05 07:52:35.834', '2025-02-05 07:52:35.834'),
('37b2493b-c482-401c-b258-97388738445d', 'Government Affairs Specialist', '2025-02-05 07:52:35.943', '2025-02-05 07:52:35.943'),
('39fbc74e-0e6e-4e43-b678-67b1d19a93b2', 'Fundraising Manager', '2025-02-05 07:52:35.927', '2025-02-05 07:52:35.927'),
('3b787f43-958e-41d3-8e4a-f84e3233dd2b', 'HR Generalist', '2025-02-05 07:52:35.539', '2025-02-05 07:52:35.539'),
('3b949847-b6da-4844-bcf2-e9c51e632ac4', 'Cloud Architect', '2025-02-05 07:52:34.906', '2025-02-05 07:52:34.906'),
('3ef04974-4bd5-4e7a-aae9-d99ba491a929', 'Communications Manager', '2025-02-05 07:52:35.746', '2025-02-05 07:52:35.746'),
('405089ab-9a35-491a-9354-04b29868dd0f', 'Chemical Engineer', '2025-02-05 07:52:36.134', '2025-02-05 07:52:36.134'),
('416f175b-1c9c-478c-9938-87c90b1a11d3', 'Electronic Engineer', '2025-02-05 07:52:36.092', '2025-02-05 07:52:36.092'),
('419bc3bb-6838-4c83-95ad-dd983f048b91', 'Litigation Lawyer', '2025-02-05 07:52:35.479', '2025-02-05 07:52:35.479'),
('430b532a-a4b9-484c-92e3-fc6ba20f68ab', 'Compliance Officer', '2025-02-05 07:52:35.454', '2025-02-05 07:52:35.454'),
('46b20539-e0aa-42bf-91e7-4b696a1a7197', 'Business Analyst', '2025-02-05 07:52:34.371', '2025-02-05 07:52:34.371'),
('4774dfc8-8923-42d5-85b5-ca11ae7dabd3', 'Volunteer Coordinator', '2025-02-05 07:52:35.935', '2025-02-05 07:52:35.935'),
('49ad20ea-5527-4ba2-b03c-144f83e04a14', 'Senior Developer', '2025-02-05 07:52:34.170', '2025-02-05 07:52:34.170'),
('4d0acc41-8dbd-4b49-8ac5-47d96bc1da1d', 'Ethical Hacker', '2025-02-05 07:52:34.977', '2025-02-05 07:52:34.977'),
('4fb47399-82af-4fd7-bc3d-463b7036ba04', 'Entertainment Manager', '2025-02-05 07:52:36.224', '2025-02-05 07:52:36.224'),
('51920308-ad72-41f7-9a84-2f03e3c9e0cf', 'Affiliate Marketing Manager', '2025-02-05 07:52:35.376', '2025-02-05 07:52:35.376'),
('52a9971a-b8d1-485f-b5ea-82540deb6c20', 'Animator', '2025-02-05 07:52:35.194', '2025-02-05 07:52:35.194'),
('5387f107-c2ad-4d16-a4bb-377de13711de', 'Pharmaceutical Engineer', '2025-02-05 07:52:36.162', '2025-02-05 07:52:36.162'),
('53f6eb18-e21a-439b-9d48-d590a469258f', 'Organizational Development Manager', '2025-02-05 07:52:35.623', '2025-02-05 07:52:35.623'),
('550c59eb-e645-4e24-a42a-b00a4182dcbf', 'CEO', '2025-02-05 07:52:34.309', '2025-02-05 07:52:34.309'),
('5d14725f-4d09-40fa-ab61-77919cdbc094', 'Recruiter', '2025-02-05 07:52:34.619', '2025-02-05 07:52:34.619'),
('5fdf6429-0cdc-4ba6-bf62-412b688857fc', 'Construction Manager', '2025-02-05 07:52:36.357', '2025-02-05 07:52:36.357'),
('61bab02a-8061-49f2-8526-3b4eda139807', 'Machine Learning Scientist', '2025-02-05 07:52:35.088', '2025-02-05 07:52:35.088'),
('6279f1fe-5825-4f7b-b579-3d56a81bb5dd', 'CTO', '2025-02-05 07:52:34.301', '2025-02-05 07:52:34.301'),
('660f4814-3856-46dd-a948-6b1e11d32931', 'Content Writer', '2025-02-05 07:52:34.515', '2025-02-05 07:52:34.515'),
('67bdc09e-da2d-4e15-b6d6-cb69a92b9c45', 'Financial Analyst', '2025-02-05 07:52:34.568', '2025-02-05 07:52:34.568'),
('682d0312-3dfd-473b-a378-85c604e73ebd', 'Sales Manager', '2025-02-05 07:52:34.551', '2025-02-05 07:52:34.551'),
('6be024b5-4c8b-4946-8b1b-2e8c7b03aa92', 'Sports Coach', '2025-02-05 07:52:36.286', '2025-02-05 07:52:36.286'),
('6c45c7e2-ee03-4bec-90a7-7642c397eea7', 'Director of Engineering', '2025-02-05 07:52:34.244', '2025-02-05 07:52:34.244'),
('6dd25132-f13b-4d1c-bf56-4c51a6ee504b', 'HR Specialist', '2025-02-05 07:52:35.547', '2025-02-05 07:52:35.547'),
('6e7d3247-557c-417b-bc70-446b3113141b', 'Logistics Coordinator', '2025-02-05 07:52:36.418', '2025-02-05 07:52:36.418'),
('6e811a0f-3a59-40ad-a0d3-1c8f003cf4a6', 'System Analyst', '2025-02-05 07:52:34.379', '2025-02-05 07:52:34.379'),
('6f3b74a7-db2d-4e50-bcbb-8f729a6f425a', 'Digital Marketing Manager', '2025-02-05 07:52:35.289', '2025-02-05 07:52:35.289'),
('728732a7-30fd-4ce9-ad3d-3ffa7c69dca1', 'Real Estate Agent', '2025-02-05 07:52:36.340', '2025-02-05 07:52:36.340'),
('730e0a4a-28c3-4c19-908d-803c7900a502', 'Quality Assurance Engineer', '2025-02-05 07:52:34.386', '2025-02-05 07:52:34.386'),
('733bdda1-f2e2-4cb2-943c-9a71919c0398', 'Renewable Energy Specialist', '2025-02-05 07:52:36.501', '2025-02-05 07:52:36.501'),
('73ddb77d-7484-4f19-8c60-ed59de2ffbee', 'Illustrator', '2025-02-05 07:52:35.157', '2025-02-05 07:52:35.157'),
('73de9782-93de-4e4a-aeaa-a9c35914bb12', 'Product Designer', '2025-02-05 07:52:35.126', '2025-02-05 07:52:35.126'),
('749ee622-99e8-4048-ad26-af9efd229742', 'Tour Guide', '2025-02-05 07:52:36.323', '2025-02-05 07:52:36.323'),
('7586a1e9-fdf1-45bc-92dd-7ddd2d18ea79', 'Web Developer', '2025-02-05 07:52:34.779', '2025-02-05 07:52:34.779'),
('7e7dbdbd-60e5-4818-aade-9e63c644e340', 'Mechanical Engineer', '2025-02-05 07:52:36.024', '2025-02-05 07:52:36.024'),
('81c95f44-f52e-4fdd-b183-b5ecd3ae79a9', 'Data Engineer', '2025-02-05 07:52:35.013', '2025-02-05 07:52:35.013'),
('82188eaf-93ae-4ea3-a13f-274e51710df0', 'Full Stack Developer', '2025-02-05 07:52:34.842', '2025-02-05 07:52:34.842'),
('8552785e-516e-45e8-bcd8-9e08ae10c85b', 'Structural Engineer', '2025-02-05 07:52:36.073', '2025-02-05 07:52:36.073'),
('86924ba2-6e3a-45ae-bfeb-31e33d5934d3', 'Engineering Manager', '2025-02-05 07:52:34.233', '2025-02-05 07:52:34.233'),
('8884cca2-f728-4629-80f4-41c5095eb734', 'PPC Specialist', '2025-02-05 07:52:35.335', '2025-02-05 07:52:35.335'),
('8d4e4082-b040-4e37-b9df-67da060edee5', 'Business Intelligence Analyst', '2025-02-05 07:52:35.052', '2025-02-05 07:52:35.052'),
('8e044ec2-3ad6-4804-b661-b2745852228f', 'Industrial Designer', '2025-02-05 07:52:35.133', '2025-02-05 07:52:35.133'),
('8ebca8c5-14de-4280-97d0-b018bbd366cd', 'Military Officer', '2025-02-05 07:52:35.994', '2025-02-05 07:52:35.994'),
('8fc25773-e240-40d9-92ec-fe85bf2eae62', 'Environmental Engineer', '2025-02-05 07:52:36.143', '2025-02-05 07:52:36.143'),
('9007a30d-b77d-4a77-9cc2-3da941b24ef8', 'Biotech Engineer', '2025-02-05 07:52:36.170', '2025-02-05 07:52:36.170'),
('9570098d-c25b-4e91-a7b5-b3e8f58f1aff', 'Property Manager', '2025-02-05 07:52:36.349', '2025-02-05 07:52:36.349'),
('968187ae-410e-4e2d-aeb9-b36d78cd5c84', 'Compensation and Benefits Manager', '2025-02-05 07:52:35.591', '2025-02-05 07:52:35.591'),
('96b978d1-7b98-40ca-825c-4f58e7e4bf0a', 'Civil Engineer', '2025-02-05 07:52:36.063', '2025-02-05 07:52:36.063'),
('96cff092-8132-48d3-a801-158465a94fd8', 'Project Manager', '2025-02-05 07:52:34.317', '2025-02-05 07:52:34.317'),
('971db4a7-ea9b-44f3-9aaa-76216f4c4cfd', 'Biomedical Engineer', '2025-02-05 07:52:36.153', '2025-02-05 07:52:36.153'),
('9d2bdf5c-d69d-4bd2-b3c1-78d4fc46b20f', 'Cyber Security Engineer', '2025-02-05 07:52:34.917', '2025-02-05 07:52:34.917'),
('9e4cf2f6-a622-45b5-9569-fe6571f7096a', 'Intellectual Property Specialist', '2025-02-05 07:52:35.531', '2025-02-05 07:52:35.531'),
('9ee100ef-a0a0-4eed-9132-4da6510561f5', 'Statistician', '2025-02-05 07:52:35.062', '2025-02-05 07:52:35.062'),
('a37cf979-eae2-4579-a348-b4f717f4be7b', 'IT Support Specialist', '2025-02-05 07:52:34.683', '2025-02-05 07:52:34.683'),
('a533cc53-1db5-4ff5-a057-4d692eba3614', 'Network Administrator', '2025-02-05 07:52:34.692', '2025-02-05 07:52:34.692'),
('a71f334d-1a06-4768-8d9f-bedd6354bbb3', 'Architect', '2025-02-05 07:52:34.197', '2025-02-05 07:52:34.197'),
('a87d6db5-8c76-40d5-a3cc-802c816fed68', 'Warehouse Manager', '2025-02-05 07:52:36.427', '2025-02-05 07:52:36.427'),
('a9257321-cb19-411f-9f2a-daa2e1d9ca58', 'Non-profit Manager', '2025-02-05 07:52:35.918', '2025-02-05 07:52:35.918'),
('aab6851f-b955-494a-96a7-815b8b96476a', 'Fashion Designer', '2025-02-05 07:52:36.214', '2025-02-05 07:52:36.214'),
('ab33259e-1a06-4d3e-a745-746294e67f4d', 'Product Manager', '2025-02-05 07:52:34.352', '2025-02-05 07:52:34.352'),
('ab465ef7-7032-46b6-8c99-f77869e6aad4', 'Technical Writer', '2025-02-05 07:52:35.408', '2025-02-05 07:52:35.408'),
('ac23ca7a-36f1-4568-92fb-70f83f90da68', 'Junior Developer', '2025-02-05 07:52:34.119', '2025-02-05 07:52:34.119'),
('af9ab871-fb2a-404b-8a01-df2836c59b55', 'System Administrator', '2025-02-05 07:52:34.702', '2025-02-05 07:52:34.702'),
('b13ba568-31d5-41ff-bb95-31d695660095', 'Electrical Engineer', '2025-02-05 07:52:36.083', '2025-02-05 07:52:36.083'),
('b25c29e5-b5f6-4cad-a421-8b8b80725bfc', 'Information Security Manager', '2025-02-05 07:52:34.928', '2025-02-05 07:52:34.928'),
('b3949b86-b85c-419a-8b83-2021eddd91ff', 'SEO Specialist', '2025-02-05 07:52:35.247', '2025-02-05 07:52:35.247'),
('b53bafd2-fc4e-4735-bb8a-6838aed54476', 'Security Analyst', '2025-02-05 07:52:34.751', '2025-02-05 07:52:34.751'),
('b79adf07-8a31-4592-8245-9752ec357893', 'Policy Analyst', '2025-02-05 07:52:35.984', '2025-02-05 07:52:35.984'),
('b7d605aa-e8b0-4979-9393-03042a335a12', 'Robotics Engineer', '2025-02-05 07:52:35.080', '2025-02-05 07:52:35.080'),
('b84c9b68-5648-4c86-9ed5-af76e1268940', 'Brand Manager', '2025-02-05 07:52:35.387', '2025-02-05 07:52:35.387'),
('bb2e21e0-2c57-4bd5-8228-32c94acc67cf', 'Game Developer', '2025-02-05 07:52:36.277', '2025-02-05 07:52:36.277'),
('be0bd3dd-ff7b-4785-9834-aab06d996183', 'Sound Engineer', '2025-02-05 07:52:35.229', '2025-02-05 07:52:35.229'),
('c09975a0-c4a5-4544-a19d-fadf725b61fc', 'Intern', '2025-02-05 07:52:34.104', '2025-02-05 07:52:34.104'),
('c14cd972-a569-4162-b665-c775fe59f69c', 'Art Director', '2025-02-05 07:52:35.149', '2025-02-05 07:52:35.149'),
('c35e6a65-4e80-4a24-9fa9-37e6058165ec', 'Graphic Designer', '2025-02-05 07:52:34.505', '2025-02-05 07:52:34.505'),
('c3c630bf-a433-4cd5-a970-291dc08a197b', 'Game Designer', '2025-02-05 07:52:36.265', '2025-02-05 07:52:36.265'),
('c3e35189-7810-4903-af5b-e686bb3e0a00', 'Aviation Manager', '2025-02-05 07:52:36.471', '2025-02-05 07:52:36.471'),
('c41116fc-a4af-4b57-961c-ad64d725dff5', 'Scrum Master', '2025-02-05 07:52:34.361', '2025-02-05 07:52:34.361'),
('c4393ee2-ec3a-475c-bd6d-e6de7ccaa518', 'Mining Engineer', '2025-02-05 07:52:36.551', '2025-02-05 07:52:36.551'),
('c5cf0071-475d-4150-ac74-b4e49fd1b875', 'Author', '2025-02-05 07:52:35.814', '2025-02-05 07:52:35.814'),
('c5ead873-0b2a-4752-b7ef-0230bd76be8d', 'Researcher', '2025-02-05 07:52:35.882', '2025-02-05 07:52:35.882'),
('c7fd9493-865f-493f-8d59-bb6a9d6ca471', 'Social Media Manager', '2025-02-05 07:52:35.305', '2025-02-05 07:52:35.305'),
('c83892ed-6a42-43f5-84d9-b733bb9321b9', 'Creative Director', '2025-02-05 07:52:35.141', '2025-02-05 07:52:35.141'),
('ccfb8ac2-5297-480c-9c1c-f78cfdfce037', 'Machine Learning Engineer', '2025-02-05 07:52:34.450', '2025-02-05 07:52:34.450'),
('cdc5f1f8-eb57-4f41-bf41-030f978c8984', 'Customer Support Specialist', '2025-02-05 07:52:34.533', '2025-02-05 07:52:34.533'),
('ceb9b82f-9129-4e0b-8ba6-026eb2f47b2a', 'Retail Manager', '2025-02-05 07:52:36.397', '2025-02-05 07:52:36.397'),
('cf7ef8b6-9fc9-4ffb-8ae0-080f9d925581', 'Teacher', '2025-02-05 07:52:35.824', '2025-02-05 07:52:35.824'),
('d4579061-f2a4-44fa-81e5-6e6a65898fa4', 'Corporate Lawyer', '2025-02-05 07:52:35.472', '2025-02-05 07:52:35.472'),
('d6bb006f-b6a1-41dc-b069-0ba152e94df2', 'VP of Engineering', '2025-02-05 07:52:34.292', '2025-02-05 07:52:34.292'),
('d74e5484-8e92-4152-9f20-6f52559c2073', 'Software Tester', '2025-02-05 07:52:34.762', '2025-02-05 07:52:34.762'),
('d85f3ee1-5a7a-4ec9-90c6-f5345e862be5', 'Backend Developer', '2025-02-05 07:52:34.822', '2025-02-05 07:52:34.822'),
('d926841b-43c7-4f7d-bc90-be990aeb7afd', 'Event Coordinator', '2025-02-05 07:52:35.682', '2025-02-05 07:52:35.682'),
('d9d3eecc-1cfe-447f-9e57-52266d9d749b', 'Energy Consultant', '2025-02-05 07:52:36.491', '2025-02-05 07:52:36.491'),
('d9eb2c5c-b144-4a6c-94a4-897c12da58b8', 'UI/UX Designer', '2025-02-05 07:52:34.494', '2025-02-05 07:52:34.494'),
('dab6fa4f-a83d-4e93-8506-773c527bc95d', 'Account Manager', '2025-02-05 07:52:34.560', '2025-02-05 07:52:34.560'),
('dbb360e1-cbee-488c-a14d-ac547fb665d8', 'Editor', '2025-02-05 07:52:35.763', '2025-02-05 07:52:35.763'),
('dc5ce56d-6acf-40d0-b3c1-ad8bdd437f3e', 'Public Relations Specialist', '2025-02-05 07:52:35.701', '2025-02-05 07:52:35.701'),
('dc9fb665-019d-42a3-8bae-4e1da13bae08', 'Learning and Development Manager', '2025-02-05 07:52:35.664', '2025-02-05 07:52:35.664'),
('dca7ddfc-2b3c-4fa4-b8ef-cbb75ca44a90', 'Journalist', '2025-02-05 07:52:35.755', '2025-02-05 07:52:35.755'),
('e012ce77-7af8-40fb-ac2a-8d7de2e84c40', 'Data Analyst', '2025-02-05 07:52:34.996', '2025-02-05 07:52:34.996'),
('e3131648-995f-4cde-b528-24e6db2d32b2', 'Lecturer', '2025-02-05 07:52:35.843', '2025-02-05 07:52:35.843'),
('e430f52d-a391-433b-97f7-b0ead7f1d80b', 'Copywriter', '2025-02-05 07:52:35.398', '2025-02-05 07:52:35.398'),
('e45b32f6-8664-42ee-baf6-ec6fee923a3a', 'Cyber Security Specialist', '2025-02-05 07:52:34.434', '2025-02-05 07:52:34.434'),
('e610f120-ad4a-47f3-bd51-a2ea5228facc', 'PR Manager', '2025-02-05 07:52:35.737', '2025-02-05 07:52:35.737'),
('e63cca2b-d807-4391-a20e-576f1cdd0139', 'DevOps Engineer', '2025-02-05 07:52:34.423', '2025-02-05 07:52:34.423'),
('e709b5c4-b5f2-4e9e-9c8d-98bcdfcdc484', 'Patent Attorney', '2025-02-05 07:52:35.519', '2025-02-05 07:52:35.519'),
('e7368a8d-d13e-42b2-a258-754e7060f14d', 'Research Scientist', '2025-02-05 07:52:35.071', '2025-02-05 07:52:35.071'),
('ea0e430d-a4c6-4c8e-b5cd-36ed99052710', 'Food Scientist', '2025-02-05 07:52:36.206', '2025-02-05 07:52:36.206'),
('eb12ba7e-41b3-4f22-8b84-faf6003ff878', 'Transportation Manager', '2025-02-05 07:52:36.436', '2025-02-05 07:52:36.436'),
('ebd850dc-550a-4fc4-a86f-e3193f9fb9af', 'Payroll Specialist', '2025-02-05 07:52:35.582', '2025-02-05 07:52:35.582'),
('ebffc3d3-99d9-474e-a218-b9669bfba660', 'Grant Writer', '2025-02-05 07:52:35.910', '2025-02-05 07:52:35.910'),
('ece72bfd-d7e2-4e8b-8512-45297d372304', 'Paralegal', '2025-02-05 07:52:35.463', '2025-02-05 07:52:35.463'),
('ed2d24ca-7ab3-4386-ae5d-b416a60346b9', 'Supply Chain Manager', '2025-02-05 07:52:36.408', '2025-02-05 07:52:36.408'),
('f2814ad8-8cc7-4ecf-94c4-cd2e6a017c77', 'Email Marketing Specialist', '2025-02-05 07:52:35.326', '2025-02-05 07:52:35.326'),
('f2ae8519-cd39-431f-aa78-44ae7d63cf3f', 'Aerospace Engineer', '2025-02-05 07:52:36.005', '2025-02-05 07:52:36.005'),
('f2b4f172-40ba-48bd-8fbd-f852b8aa0605', 'DevOps Manager', '2025-02-05 07:52:34.850', '2025-02-05 07:52:34.850'),
('f2ed65c1-f8ee-4216-846f-b30dc48d68b1', 'AI Engineer', '2025-02-05 07:52:34.987', '2025-02-05 07:52:34.987'),
('f46f7e6f-5c20-46a5-abc9-58c77afc2e1c', 'Talent Acquisition Specialist', '2025-02-05 07:52:35.614', '2025-02-05 07:52:35.614'),
('f472818a-9dd0-4dd3-b9da-81fd6186b462', 'Video Producer', '2025-02-05 07:52:35.203', '2025-02-05 07:52:35.203'),
('f59a65d0-26eb-470b-a4fb-6ac681fa05f1', 'Maritime Manager', '2025-02-05 07:52:36.481', '2025-02-05 07:52:36.481'),
('f78209d2-411f-43bb-be18-711ab4f22509', 'Photographer', '2025-02-05 07:52:35.238', '2025-02-05 07:52:35.238'),
('fa4653b9-ef43-4afd-8f55-c141d0b6dc48', 'Office Manager', '2025-02-05 07:52:34.674', '2025-02-05 07:52:34.674'),
('fd86d163-e47b-4850-a341-cdab121938e7', 'AI Specialist', '2025-02-05 07:52:34.460', '2025-02-05 07:52:34.460'),
('fefbb4c6-a589-4f14-ad17-0249023c6521', 'Content Manager', '2025-02-05 07:52:35.316', '2025-02-05 07:52:35.316');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `job_seeker_detail_id`, `project_name`, `description`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('1834a33c-8cb8-4eb3-aa52-3e5164ef3ca6', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f', 'Project 14', 'Description 14', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850'),
('1c39492a-da7b-4782-8db1-eca585195003', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10', 'Project 7', 'Description 7', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670'),
('4347c81f-ed4f-499a-88f4-17031531e933', '2cad1612-894b-4115-b476-55d51cd677e7', 'Project 13', 'Description 13', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836'),
('4c345c8b-653b-4ee1-a032-59157ef84466', 'd364b526-8cd4-407f-a55a-e0863c8f4d57', 'Project ReactJS', 'Build ReeactJS', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.505', '2025-05-22 15:15:45.561'),
('4d8566f5-e56a-49fa-9e04-8d0d3fed20df', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439', 'Project 6', 'Description 6', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627'),
('604583fc-e5b7-4bc9-9d76-df58b6555547', '1907e6d9-7619-431f-942f-54c4d3070913', 'Project 9', 'Description 9', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702'),
('85c3a232-7e25-4af5-8d11-4e87ada25967', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3', 'Project 10', 'Description 10', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741'),
('8a549f8e-7373-4f79-ad20-1e78ef6c5085', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921', 'Project 12', 'Description 12', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811'),
('b72d1312-e716-4508-9a78-ed72be86a7c5', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6', 'Project 5', 'Description 5', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610'),
('bd39802c-6376-4c76-b7c1-a90c2176769c', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7', 'Project 4', 'Description 4', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592'),
('c1aae1bb-551f-445d-923b-64063fc33da6', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02', 'Project 11', 'Description 11', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760'),
('c4df7313-08b1-41e9-95f6-d254297f5a84', '235b42a9-1886-4aaa-92cf-762912d697cc', 'Project 15', 'Description 15', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864'),
('d8585b51-b5d5-467b-840a-3a32784635ed', '3cf7fbd0-da22-4834-8d78-c11f0f046017', 'Project 8', 'Description 8', '2024-01-01 00:00:00.000', '2026-01-01 00:00:00.000', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686');

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `saved_job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_seeker_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`saved_job_id`, `job_seeker_id`, `job_id`, `created_at`, `updated_at`) VALUES
('314d70e9-eefd-47f4-bf6b-452cd17fcf50', '4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', '2025-03-14 07:15:09.770', '2025-03-14 07:15:09.770'),
('3c97de9c-a80e-4953-8876-47aed8e2d7ad', '4c7a48c1-b103-4721-b5d3-f281bbfa1a9d', '8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', '2025-03-12 15:35:51.891', '2025-03-12 15:35:51.891');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `skill_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `job_seeker_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`skill_id`, `skill_name`, `created_at`, `updated_at`, `job_seeker_detail_id`) VALUES
('073cdd39-5ff0-4d93-ab8d-a7c41513d4c7', 'Figma', '2025-06-01 15:56:03.790', '2025-06-01 15:56:03.790', '225074b8-cf76-4a6c-811c-52d5719c57ad'),
('14591c2a-0b6d-411e-87db-1cbcba87a741', 'Java 8', '2025-02-05 07:52:05.686', '2025-02-05 07:52:05.686', '3cf7fbd0-da22-4834-8d78-c11f0f046017'),
('150fe260-2836-430d-8142-ac9584e9540e', 'MySQL', '2025-05-22 15:02:13.953', '2025-05-22 15:02:13.953', 'd364b526-8cd4-407f-a55a-e0863c8f4d57'),
('1ba661bb-ff99-4cb8-9507-0d1fcabcbf41', 'Java 6', '2025-02-05 07:52:05.627', '2025-02-05 07:52:05.627', 'e820b5d2-2339-4a8a-a0d2-58b8c368f439'),
('45cf1f66-17c5-4ced-a7ee-2b16484762d6', 'Canva', '2025-06-01 15:55:59.250', '2025-06-01 15:55:59.250', '225074b8-cf76-4a6c-811c-52d5719c57ad'),
('502a1c9f-8a32-44ce-beb9-b76a424906d2', 'Java 10', '2025-02-05 07:52:05.741', '2025-02-05 07:52:05.741', 'eb85d60a-57fa-4b97-822c-ef80e4d9ead3'),
('645c8b82-ac2d-4950-939c-d2bfd1b46d9a', 'Java 12', '2025-02-05 07:52:05.811', '2025-02-05 07:52:05.811', 'fb8e2233-8d1a-4b36-b941-612c9e9c3921'),
('667a27ed-aa70-402d-a30b-ffc17d6e3075', 'Java 7', '2025-02-05 07:52:05.670', '2025-02-05 07:52:05.670', '256e2c00-5eb2-47fc-a8c6-299a3be5ca10'),
('7d5fe6d9-af45-4bad-83f9-da65161bdf54', 'NodeJS', '2025-05-22 15:02:25.847', '2025-05-22 15:02:25.847', 'd364b526-8cd4-407f-a55a-e0863c8f4d57'),
('8ee21cfa-ebcb-4dd7-9ce1-2d260b394394', 'ReactJS', '2025-05-22 15:02:04.622', '2025-05-22 15:02:04.622', 'd364b526-8cd4-407f-a55a-e0863c8f4d57'),
('a9b0edb9-572d-433d-b946-de84ee63f642', 'Adobe Photoshop', '2025-06-01 15:55:54.528', '2025-06-01 15:55:54.528', '225074b8-cf76-4a6c-811c-52d5719c57ad'),
('ace3b9ca-f8b9-4371-94a0-e99393480036', 'Java 14', '2025-02-05 07:52:05.850', '2025-02-05 07:52:05.850', 'fd67ae95-c44a-4745-bcd3-e1b1d88a624f'),
('bdcb51cc-9136-4456-ab1a-b4045d0e1042', 'Java 13', '2025-02-05 07:52:05.836', '2025-02-05 07:52:05.836', '2cad1612-894b-4115-b476-55d51cd677e7'),
('beee2876-274e-42b2-bd0c-7708494e1cf7', 'Java 11', '2025-02-05 07:52:05.760', '2025-02-05 07:52:05.760', 'ead2218e-db7a-4efd-a0e9-b1b19b16bb02'),
('c29972eb-6f4f-48a9-96fc-692d52473808', 'Java 9', '2025-02-05 07:52:05.702', '2025-02-05 07:52:05.702', '1907e6d9-7619-431f-942f-54c4d3070913'),
('c49d3ef8-e4da-4591-b4e9-7b3447444d0d', 'NextJS', '2025-05-22 15:02:19.798', '2025-05-22 15:02:19.798', 'd364b526-8cd4-407f-a55a-e0863c8f4d57'),
('d0c99858-db76-405c-9d5a-a787256470fe', 'Java 15', '2025-02-05 07:52:05.864', '2025-02-05 07:52:05.864', '235b42a9-1886-4aaa-92cf-762912d697cc'),
('d9bf8af9-91db-4518-b5d8-eb666247229b', 'Java 5', '2025-02-05 07:52:05.610', '2025-02-05 07:52:05.610', '1edf7bd2-5ce0-4a9a-a313-b496a72916f6'),
('e11fa30c-591a-48c3-a908-668ec1bb6f94', 'Java 4', '2025-02-05 07:52:05.592', '2025-02-05 07:52:05.592', '1990dbf2-7df1-4c5e-af76-0504ea8e6ea7'),
('e232b8dc-ec6b-43a3-9eea-749d2f5017f8', 'Adobe Illustrator', '2025-06-01 15:56:10.102', '2025-06-01 15:56:10.102', '225074b8-cf76-4a6c-811c-52d5719c57ad');

-- --------------------------------------------------------

--
-- Table structure for table `skills_category`
--

CREATE TABLE `skills_category` (
  `skill_category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills_category`
--

INSERT INTO `skills_category` (`skill_category_id`, `category_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
('00ea170e-7c1a-4653-861d-b921319a5ee1', 'Construction', '2025-02-05 07:52:24.478', '2025-02-05 07:52:24.478', NULL),
('02cba157-3907-49c8-a64f-b98804265c72', 'Mobile Development', '2025-02-05 07:52:23.250', '2025-02-05 07:52:23.250', NULL),
('062c70d2-6f4b-4767-9691-9477fc0cb235', 'Full Stack Development', '2025-02-05 07:52:23.512', '2025-02-05 07:52:23.512', NULL),
('06dad5b0-c92d-4285-afd8-0a4f7cc255dd', 'Property Management', '2025-02-05 07:52:24.469', '2025-02-05 07:52:24.469', NULL),
('0c748f50-1089-436f-a569-e39bb45d18fd', 'Legal Services', '2025-02-05 07:52:23.966', '2025-02-05 07:52:23.966', NULL),
('0e57d284-21c7-4958-9f41-efc488823c93', 'Human Resources', '2025-02-05 07:52:23.976', '2025-02-05 07:52:23.976', NULL),
('134b770a-ad2e-47cb-8b85-6698884c12ff', 'Real Estate', '2025-02-05 07:52:24.462', '2025-02-05 07:52:24.462', NULL),
('1439ad82-ba15-4071-ad39-339e4910bd02', 'Pharmaceuticals', '2025-02-05 07:52:24.344', '2025-02-05 07:52:24.344', NULL),
('154c21a0-af95-415b-9b14-ab849f08dc84', 'Quality Assurance', '2025-02-05 07:52:23.606', '2025-02-05 07:52:23.606', NULL),
('15d9cb58-0519-4491-b5ec-265aa2c656ac', 'Non-profit', '2025-02-05 07:52:24.117', '2025-02-05 07:52:24.117', NULL),
('2442f04a-2370-4377-9ca2-6b6e952964cf', 'Cloud Computing', '2025-02-05 07:52:23.330', '2025-02-05 07:52:23.330', NULL),
('24864d31-9dca-4358-8ee0-19785af2e606', 'Warehousing', '2025-02-05 07:52:24.537', '2025-02-05 07:52:24.537', NULL),
('274e3e49-0d5f-4ca4-a937-e83bd2726c57', 'Illustration', '2025-02-05 07:52:23.913', '2025-02-05 07:52:23.913', NULL),
('2a9d4588-b9ff-4e6a-8518-aebf76dc4a6a', 'UI/UX Design', '2025-02-05 07:52:23.459', '2025-02-05 07:52:23.459', NULL),
('305dbcdb-b3f9-4060-ad54-a1586f59913b', 'Electrical Engineering', '2025-02-05 07:52:24.242', '2025-02-05 07:52:24.242', NULL),
('31ad26a8-005d-47f1-a03c-d14d16a2aa28', 'Web Development', '2025-02-05 07:52:23.240', '2025-02-05 07:52:23.240', NULL),
('31b45b4a-6634-46f9-9719-e9102c7e17b6', 'Aerospace Engineering', '2025-02-05 07:52:24.176', '2025-02-05 07:52:24.176', NULL),
('31bc4ddb-8213-4c18-baa6-93a124d8cd6e', 'Adobe CReative Suite', '2025-04-29 10:48:54.100', '2025-04-29 10:55:17.010', '2025-04-29 10:55:17.009'),
('33928b03-6b04-45fa-897a-e7d219365d64', 'Kanban', '2025-02-05 07:52:23.665', '2025-02-05 07:52:23.665', NULL),
('33c67a3e-41e2-4615-8a25-16ca5794385c', 'Game Development', '2025-02-05 07:52:23.448', '2025-02-05 07:52:23.448', NULL),
('33ffae9d-a333-44dd-9808-d0ed57947bd9', 'Frontend Development', '2025-02-05 07:52:23.502', '2025-02-05 07:52:23.502', NULL),
('39d11a1a-6539-4534-b765-0cce2e646930', 'Public Relations', '2025-02-05 07:52:24.043', '2025-02-05 07:52:24.043', NULL),
('3d277a2b-0cc9-4adc-9576-c56a78b9d8e2', 'Event Management', '2025-02-05 07:52:24.032', '2025-02-05 07:52:24.032', NULL),
('448545cf-b664-4919-8952-c9c82b7d31c3', 'Chemical Engineering', '2025-02-05 07:52:24.253', '2025-02-05 07:52:24.253', NULL),
('454c1abe-4ea6-4c94-b519-2933bce94e0d', 'Database Management', '2025-02-05 07:52:23.366', '2025-02-05 07:52:23.366', NULL),
('47a64b71-9169-4d83-be89-c462751e963b', 'Education', '2025-02-05 07:52:24.070', '2025-02-05 07:52:24.070', NULL),
('489ae09e-8760-4a0a-bc1a-70c093294dbf', 'Networking', '2025-02-05 07:52:23.429', '2025-02-05 07:52:23.429', NULL),
('4af3374e-fd3a-42f7-a60d-b68418e520cb', 'Government', '2025-02-05 07:52:24.127', '2025-02-05 07:52:24.127', NULL),
('550d8a58-dcc2-45a8-aaac-b833377bf937', 'Biotechnology', '2025-02-05 07:52:24.354', '2025-02-05 07:52:24.354', NULL),
('57005ca1-7e32-4b19-84ef-39e95be3f99d', 'Fashion Industry', '2025-02-05 07:52:24.407', '2025-02-05 07:52:24.407', NULL),
('5a8a694d-ae1a-4469-9c52-16aed0522677', 'Programming Languages', '2025-02-05 07:52:23.223', '2025-02-05 07:52:23.223', NULL),
('5cd84fcc-ea21-4e21-8bc7-e6e9f5dfbd10', 'Training & Development', '2025-02-05 07:52:23.991', '2025-02-05 07:52:23.991', NULL),
('5d0b9139-4089-49b1-a2fc-5def96117fa7', 'Recruitment', '2025-02-05 07:52:23.983', '2025-02-05 07:52:23.983', NULL),
('61758fa4-b3ed-4ab9-805e-126b435a42b7', 'Agile Methodologies', '2025-02-05 07:52:23.643', '2025-02-05 07:52:23.643', NULL),
('65769c61-7859-4f87-8faf-fe7c58f3f07f', 'Software Engineering', '2025-02-05 07:52:23.569', '2025-02-05 07:52:23.569', NULL),
('68a9bc1d-d9e4-4a3d-b47a-d65aee858eca', 'System Administration', '2025-02-05 07:52:23.590', '2025-02-05 07:52:23.590', NULL),
('69cbeb22-e09f-4c38-b13f-d5384f03b1e1', 'Automotive Engineering', '2025-02-05 07:52:24.185', '2025-02-05 07:52:24.185', NULL),
('6a1d3f33-a71b-4e12-9c2a-e52fdcab7dd1', 'Technical Support', '2025-02-05 07:52:23.683', '2025-02-05 07:52:23.683', NULL),
('6d2c5aea-2445-4ac4-ba44-f447c022f08e', 'Graphic Design', '2025-02-05 07:52:23.849', '2025-02-05 07:52:23.849', NULL),
('6ef2e59c-64c7-448c-92cf-44d4f456159e', 'Data Science', '2025-02-05 07:52:23.289', '2025-02-05 07:52:23.289', NULL),
('6fafd9ca-2ae3-42c5-8dcd-8b9b68d8adb9', 'Biomedical Engineering', '2025-02-05 07:52:24.307', '2025-02-05 07:52:24.307', NULL),
('76cfd826-9178-4692-a9ee-6baadd0ffc49', 'Journalism', '2025-02-05 07:52:24.053', '2025-02-05 07:52:24.053', NULL),
('7b09e90e-bd04-4647-8475-ee8c0b39879f', 'Food Industry', '2025-02-05 07:52:24.365', '2025-02-05 07:52:24.365', NULL),
('7d56e094-4347-4244-b101-032123fcb8b9', 'Oil & Gas', '2025-02-05 07:52:24.645', '2025-02-05 07:52:24.645', NULL),
('7d92d499-3756-4e8d-8d51-5ab06e6287bb', 'Logistics', '2025-02-05 07:52:24.530', '2025-02-05 07:52:24.530', NULL),
('87164d99-8e1a-4940-bf28-d5e4dab15468', 'Social Media Marketing', '2025-02-05 07:52:23.825', '2025-02-05 07:52:23.825', NULL),
('8adba8ad-f7c7-4c3b-aa48-fbc624df6500', 'Marketing', '2025-02-05 07:52:23.809', '2025-02-05 07:52:23.809', NULL),
('8d358309-6960-43d4-a006-f4e537951474', 'Content Management', '2025-02-05 07:52:23.817', '2025-02-05 07:52:23.817', NULL),
('8d5e7076-7b8f-4bea-9022-42692c8d1905', 'Digital Marketing', '2025-02-05 07:52:23.841', '2025-02-05 07:52:23.841', NULL),
('90bad989-8cb1-493a-bc45-3edeb6084bd6', 'IT Management', '2025-02-05 07:52:23.598', '2025-02-05 07:52:23.598', NULL),
('9459629e-7d9a-42be-aba8-3998b7444110', 'Product Management', '2025-02-05 07:52:23.673', '2025-02-05 07:52:23.673', NULL),
('9517415c-d5f0-40db-adce-7e96a9cd8bf6', 'Environmental Engineering', '2025-02-05 07:52:24.294', '2025-02-05 07:52:24.294', NULL),
('9562adc8-c147-470c-be68-253dfd097c2c', 'ERP Systems', '2025-02-05 07:52:23.744', '2025-02-05 07:52:23.744', NULL),
('95bff36d-76fb-4cff-be74-aa933506a5ae', 'AI & Robotics', '2025-02-05 07:52:23.439', '2025-02-05 07:52:23.439', NULL),
('95dec71e-d2f9-4df1-85f7-a7632c2f40d7', 'Backend Development', '2025-02-05 07:52:23.466', '2025-02-05 07:52:23.466', NULL),
('96cb2e4a-cae5-4593-a2df-b1a6cc540533', 'Embedded Systems', '2025-02-05 07:52:23.522', '2025-02-05 07:52:23.522', NULL),
('99e74a87-3650-40b3-8ddc-4efdb2988f56', 'Sports', '2025-02-05 07:52:24.437', '2025-02-05 07:52:24.437', NULL),
('9a90ddbd-85e8-4390-acad-879920ac8c73', 'Civil Engineering', '2025-02-05 07:52:24.206', '2025-02-05 07:52:24.206', NULL),
('a0f9a0c7-d8c6-41bf-9e6e-9895652d5a3a', 'DevOps', '2025-02-05 07:52:23.312', '2025-02-05 07:52:23.312', NULL),
('a5e46d82-d618-4c81-8b6c-64609301983d', 'Military', '2025-02-05 07:52:24.137', '2025-02-05 07:52:24.137', NULL),
('a648c6c6-e317-4831-8812-a0bd8ce40c29', 'Travel & Tourism', '2025-02-05 07:52:24.445', '2025-02-05 07:52:24.445', NULL),
('a7c17cec-f6e7-4dbb-a28c-93b2988735d1', 'IoT', '2025-02-05 07:52:23.531', '2025-02-05 07:52:23.531', NULL),
('a856c9a6-c471-4619-87d9-e4f568e796b2', 'Project Management', '2025-02-05 07:52:23.374', '2025-02-05 07:52:23.374', NULL),
('aa4bca2f-267b-41cd-8c0a-565bdae05a07', 'Customer Support', '2025-02-05 07:52:23.722', '2025-02-05 07:52:23.722', NULL),
('ab993670-0da3-466f-b103-47f06b24095f', 'Video Editing', '2025-02-05 07:52:23.856', '2025-02-05 07:52:23.856', NULL),
('b02ee8c7-10a6-4bfd-a14c-e717e984755a', 'Adobe Photoshop', '2025-04-29 10:48:20.303', '2025-04-29 10:55:24.819', '2025-04-29 10:55:24.818'),
('b330ccf4-d084-4eb8-88f9-ff559ab1d576', 'Design', '2025-02-05 07:52:23.381', '2025-02-05 07:52:23.381', NULL),
('b37e84b7-f690-43a3-98c2-b20eedf86f9e', 'Supply Chain Management', '2025-02-05 07:52:24.522', '2025-02-05 07:52:24.522', NULL),
('b4f48fc4-e440-4af6-8d63-8f39a1efc751', 'Copywriting', '2025-02-05 07:52:23.921', '2025-02-05 07:52:23.921', NULL),
('becefc71-8a20-47b8-aad0-cb4e52af7c62', 'Maritime', '2025-02-05 07:52:24.598', '2025-02-05 07:52:24.598', NULL),
('c02eb34b-f180-4339-b2b0-bbfd6a851ad8', 'Animation', '2025-02-05 07:52:23.904', '2025-02-05 07:52:23.904', NULL),
('c119e00e-e291-44a3-bd33-558d25a62e37', 'Scrum', '2025-02-05 07:52:23.655', '2025-02-05 07:52:23.655', NULL),
('c34b926f-93e1-4c24-8e09-08a5e7b3152f', 'Transportation', '2025-02-05 07:52:24.576', '2025-02-05 07:52:24.576', NULL),
('c5c05363-7ab8-477a-8596-3b6ab9eeaaa0', 'Healthcare IT', '2025-02-05 07:52:23.753', '2025-02-05 07:52:23.753', NULL),
('c6f2cbc0-8a89-4cc1-8853-6db398c6483a', 'Business Analysis', '2025-02-05 07:52:23.579', '2025-02-05 07:52:23.579', NULL),
('cbf61711-f296-402c-b939-5d8be5cbd32d', 'Retail', '2025-02-05 07:52:24.513', '2025-02-05 07:52:24.513', NULL),
('cd2eacaa-76d0-4476-8d5f-9f5cd0489484', 'Aviation', '2025-02-05 07:52:24.587', '2025-02-05 07:52:24.587', NULL),
('d1b40992-f986-4348-8f2b-89497424a1dd', 'Energy', '2025-02-05 07:52:24.605', '2025-02-05 07:52:24.605', NULL),
('d26a1c9e-0091-4d4d-9d5e-37574684cae9', 'Publishing', '2025-02-05 07:52:24.061', '2025-02-05 07:52:24.061', NULL),
('d507e94e-4d89-4705-ba1e-4b4a8d4e69d7', 'Salesforce', '2025-02-05 07:52:23.733', '2025-02-05 07:52:23.733', NULL),
('d57f2af9-4195-4b8b-af61-56665cb3020a', 'Testing', '2025-02-05 07:52:23.389', '2025-02-05 07:52:23.389', NULL),
('df427ba7-dc46-49d2-8924-06999fb632b6', 'Machine Learning', '2025-02-05 07:52:23.300', '2025-02-05 07:52:23.300', NULL),
('e222b3c5-6dae-41aa-aa87-f49b33923c49', 'Finance', '2025-02-05 07:52:23.799', '2025-02-05 07:52:23.799', NULL),
('e8a6e6c2-6659-4c0a-9e34-bd3f98ec9f9f', 'Photography', '2025-02-05 07:52:23.895', '2025-02-05 07:52:23.895', NULL),
('e9bea6cb-0d73-486e-a23e-d3a4df99fa6a', 'Translation', '2025-02-05 07:52:23.957', '2025-02-05 07:52:23.957', NULL),
('eadef768-993b-475a-99e4-a96c9a0ecc3a', 'Cyber Security', '2025-02-05 07:52:23.321', '2025-02-05 07:52:23.321', NULL),
('ed0fbef6-4814-454e-a9b8-c2a734cdce53', 'Research', '2025-02-05 07:52:24.105', '2025-02-05 07:52:24.105', NULL),
('eda1541c-929c-46b1-be0f-8d9f93942875', 'Mechanical Engineering', '2025-02-05 07:52:24.195', '2025-02-05 07:52:24.195', NULL),
('f1a9a36e-3207-4c47-96df-366eef605f93', 'SEO', '2025-02-05 07:52:23.834', '2025-02-05 07:52:23.834', NULL),
('f8a51df4-199b-46a5-ba08-528d35427b29', 'E-commerce', '2025-02-05 07:52:23.788', '2025-02-05 07:52:23.788', NULL),
('f98cb42b-844e-477d-85f7-1ad2ba255d05', 'Hospitality', '2025-02-05 07:52:24.453', '2025-02-05 07:52:24.453', NULL),
('fc3db022-487e-4ae3-83f0-8d0bb594f5ae', 'Entertainment Industry', '2025-02-05 07:52:24.418', '2025-02-05 07:52:24.418', NULL),
('fce9a01b-1661-4532-9163-09534b3a23a8', 'Mining', '2025-02-05 07:52:24.657', '2025-02-05 07:52:24.657', NULL),
('fdfd33c4-c2ba-4315-bce1-6740925b5dd5', 'Gaming Industry', '2025-02-05 07:52:24.428', '2025-02-05 07:52:24.428', NULL),
('ff45b90f-f447-480b-aeab-dfc7c6b1b43a', 'Renewable Energy', '2025-02-05 07:52:24.612', '2025-02-05 07:52:24.612', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `skills_requirement`
--

CREATE TABLE `skills_requirement` (
  `skill_requirement_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `skill_category_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills_requirement`
--

INSERT INTO `skills_requirement` (`skill_requirement_id`, `job_id`, `skill`, `created_at`, `updated_at`, `skill_category_id`) VALUES
('003428eb-12d2-439c-b65f-bec71ba7ded3', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'GRPC', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('00893c5b-c961-4ad4-8a35-00944039ce33', '0b82c14f-2b2a-40a0-8c51-0e95fd4f1ef3', 'Fluent English', '2025-05-25 12:37:44.253', '2025-05-25 12:37:44.253', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('00e71c0c-e75a-4827-bf56-900e319b2f81', '4e2f3ab7-87c7-46b8-89e7-f99a5ebe9b15', 'LandDesktop', '2025-05-25 12:01:04.924', '2025-05-25 12:01:04.924', '00ea170e-7c1a-4653-861d-b921319a5ee1'),
('02475094-e934-4bc7-835e-b9edf69211df', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Predictive Analytics', '2025-03-12 14:26:10.506', '2025-03-12 14:26:10.506', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('03021505-09b2-466b-bf85-005bf41fe2fd', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Ruby', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('04abd68f-6e2e-43fd-a929-ccc03c6bd7bf', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'Adobe Creative Suite', '2025-04-29 10:58:22.694', '2025-04-29 10:58:22.694', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('0898317c-5bf8-437c-902f-bf51d82bf576', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'Data REporting', '2025-04-29 13:31:56.476', '2025-04-29 13:31:56.476', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('08ea0cc3-512b-4eed-ba47-109cd661ca45', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Meta Ads', '2025-04-29 12:36:05.844', '2025-04-29 12:36:05.844', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('09f7539e-09ed-48db-b759-c47444c6a437', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'Xcode', '2025-03-12 14:37:56.168', '2025-03-12 14:37:56.168', '02cba157-3907-49c8-a64f-b98804265c72'),
('0acccd14-3b55-49f6-8be6-13fb1aaef8b8', '410c16d5-523e-4088-bdbc-8630efb43cc1', 'Contract Law', '2025-05-25 11:57:46.722', '2025-05-25 11:57:46.722', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('0b52724b-0592-4796-9e77-5b5752e31a35', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'English', '2025-03-12 14:22:07.528', '2025-03-12 14:22:07.528', '9459629e-7d9a-42be-aba8-3998b7444110'),
('0d5e65b5-160c-486e-a641-59c0878cfe1d', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Market Research', '2025-05-25 12:26:14.821', '2025-05-25 12:26:14.821', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('0dc893ed-1a71-412d-91d7-51d68f30d309', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Market Research', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('0e57ea3a-4ba3-4ea1-8ff0-9116f38d8d33', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Content Marketing', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('0e9d45c7-75e8-4d81-a892-594e87cb892e', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Google Analytics', '2025-04-29 12:55:31.781', '2025-04-29 12:55:31.781', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('0f1f992a-3276-4e08-a90e-95e32503868a', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Contract Law', '2025-05-25 12:24:13.391', '2025-05-25 12:24:13.391', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('0f95b37b-63cb-4f0a-9339-b560a610d357', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Negosiasi', '2025-05-13 10:20:40.962', '2025-05-13 10:20:40.962', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('0fe0bea6-7257-47c3-91e4-15e60348da24', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Power BI', '2025-04-29 12:58:27.916', '2025-04-29 12:58:27.916', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('106de9cc-a8d2-4fcd-83ee-2aa2d8cc8959', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Ruby', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('14107fbf-a0e8-4c06-bb0c-142270b92ec5', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Meta Ads', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('148466b0-4925-4f62-87a3-e2fe60d4ff7f', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'Linux', '2025-03-12 14:02:07.040', '2025-03-12 14:02:07.040', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('1644a61a-d57e-4df0-9be7-59e5811e9a88', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'TCP/IP-based services', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('178e410d-9eff-4a4b-8487-9dc205421307', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'Swift', '2025-03-12 14:37:56.168', '2025-03-12 14:37:56.168', '02cba157-3907-49c8-a64f-b98804265c72'),
('17b27f59-b600-401c-af04-7c300e8366fe', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Descriptive Analytics', '2025-05-25 12:32:29.392', '2025-05-25 12:32:29.392', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('182475e4-7ed7-43aa-a7ab-885e55145191', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'SEO', '2025-04-29 13:33:59.765', '2025-04-29 13:33:59.765', 'f1a9a36e-3207-4c47-96df-366eef605f93'),
('18375c7a-af1f-42b5-bff5-d288772bec0d', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Google Ads', '2025-04-29 12:36:05.844', '2025-04-29 12:36:05.844', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('1a5e7c70-db28-46e2-bb21-a9dc887fdad1', '8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', 'Kotlin', '2025-03-12 14:16:22.903', '2025-03-12 14:16:22.903', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('1a843d24-9230-47b0-a3d3-cddf65cc1caa', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Negotiation', '2025-05-13 11:06:04.782', '2025-05-13 11:06:04.782', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('1b2f4a92-cb97-447b-afba-691f3b21c2cc', '36ca9838-845c-40f2-9713-e51f64188be1', 'Content Writter', '2025-05-25 12:51:57.295', '2025-05-25 12:51:57.295', '87164d99-8e1a-4940-bf28-d5e4dab15468'),
('1c081521-6280-4af0-80a7-b7aa31706409', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'Analytical', '2025-03-12 14:22:07.528', '2025-03-12 14:22:07.528', '9459629e-7d9a-42be-aba8-3998b7444110'),
('216dd5d9-98ff-4da6-a1f5-8f5ebcf80458', 'c43deb87-cb22-48f1-99da-ce578d95dc5c', 'Retail', '2025-05-25 11:21:14.298', '2025-05-25 11:21:14.298', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('21f9959b-306d-4cf2-a065-6d7c9390335f', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'Microsoft EXcel', '2025-04-29 13:33:59.765', '2025-04-29 13:33:59.765', 'f1a9a36e-3207-4c47-96df-366eef605f93'),
('222d43e9-6b52-49c2-af23-b4bf96cd5eac', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Legal Drafting', '2025-05-13 10:20:40.962', '2025-05-13 10:20:40.962', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('22d88c52-4276-4ea0-ba1a-89b88e0c5efe', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'HR Consulting', '2025-05-13 10:11:51.537', '2025-05-13 10:11:51.537', '0e57d284-21c7-4958-9f41-efc488823c93'),
('238317ad-ba2f-442b-81f0-7a717ecc9530', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Microsoft Excel', '2025-04-29 13:28:57.479', '2025-04-29 13:28:57.479', '0e57d284-21c7-4958-9f41-efc488823c93'),
('23cd333b-1fed-43bf-8c67-fc805ecae977', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'SSH', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('2494d37f-f512-4e01-a819-da165e295f0f', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Scrum', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('2595422b-fefb-4107-8810-efa1db2eab99', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'Google Ads', '2025-04-29 13:33:59.765', '2025-04-29 13:33:59.765', 'f1a9a36e-3207-4c47-96df-366eef605f93'),
('26707ff1-f67c-4b00-a97d-ecb54cc0241b', '533c1bbd-4eb2-4d64-beee-cad15039eb28', 'Microsoft Excel', '2025-04-29 11:03:00.554', '2025-04-29 11:03:00.554', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('2811c558-9250-4c63-a93c-5e5b1a19a707', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Data Analysis', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('2827df26-0f8d-4123-af61-9c0fc5127eab', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Analytical Skills', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('29bffef4-bd00-455f-b89f-8e57262acd5c', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Zoom', '2025-05-13 10:50:55.371', '2025-05-13 10:50:55.371', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('2aeb8394-914d-4b3b-b6ec-b257cf880246', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Java', '2025-05-13 11:14:18.217', '2025-05-13 11:14:18.217', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('2b871228-069a-471d-80ca-d46b495bf800', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Mocha', '2025-05-25 12:54:59.778', '2025-05-25 12:54:59.778', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('2b9bcab1-b31a-4af9-9d6b-3d37b0e695ae', '7aec7881-000d-4443-ac2c-79a663ae1673', 'Negotiation', '2025-04-29 11:44:50.106', '2025-04-29 11:44:50.106', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('2d5ec8eb-c95c-4007-a212-92d6d7d803c7', '10159c92-bdba-4905-bc8e-1f74913989a3', 'PDCA Cycle', '2025-06-01 15:18:56.698', '2025-06-01 15:18:56.698', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('2e1e7c83-0cea-4724-951f-57505cc35876', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Administration', '2025-04-29 13:28:57.479', '2025-04-29 13:28:57.479', '0e57d284-21c7-4958-9f41-efc488823c93'),
('2e26ae88-c873-48aa-a68b-e6edc09aac30', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'Java', '2025-04-29 10:46:28.723', '2025-04-29 10:46:28.723', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('2ee4006e-6853-4d3e-b207-5752db5d1f8f', 'ba13fc34-4ac8-45ba-94c7-c0fde001e419', 'Communication', '2025-05-25 11:17:14.853', '2025-05-25 11:17:14.853', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('2f8869f3-5f52-4c75-9eed-dd115d0ea71b', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'DHCP', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('2fe6bf7b-1f64-4beb-9f48-a6aac69ba229', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Kafka', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('3103988e-d26f-47fb-8a41-4c94816fe19b', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Descriptive Analytics', '2025-05-13 11:06:04.782', '2025-05-13 11:06:04.782', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('316cfc46-886f-48c5-8eca-1b5f9680c4c7', 'bd319feb-c7f8-4628-91c8-c006c2b57129', 'Communication Skills', '2025-05-25 12:56:38.316', '2025-05-25 12:56:38.316', '0e57d284-21c7-4958-9f41-efc488823c93'),
('3348afda-1a18-4e4c-8006-1d07b25d0e05', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Vue.js', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('355af0c9-2392-4258-aeba-ae9de3550257', '410c16d5-523e-4088-bdbc-8630efb43cc1', 'Microsoft Office', '2025-05-25 11:57:46.722', '2025-05-25 11:57:46.722', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('379de84c-07b8-428b-835a-2a8e1b36cff0', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Google Workspace', '2025-06-01 15:18:56.698', '2025-06-01 15:18:56.698', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('383740bd-2b9a-4de0-aea7-86c4f51eba69', '9f774803-bb84-40c1-a73b-2ec9c2521b2e', 'Critical Thinking', '2025-03-12 14:19:39.724', '2025-03-12 14:19:39.724', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('3913ac55-ae62-490d-918d-c5f94823264f', '0ce9459e-e3b2-4760-b478-9ccee437f455', 'Collaboration', '2025-03-12 14:11:22.219', '2025-03-12 14:11:22.219', '9459629e-7d9a-42be-aba8-3998b7444110'),
('3ac123ec-ad8e-4cd1-8f65-d8d80d57cd44', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'Microsoft Office', '2025-04-29 11:17:54.193', '2025-04-29 11:17:54.193', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('3b077a44-86b2-40f8-8aec-90257728f801', 'ba13fc34-4ac8-45ba-94c7-c0fde001e419', 'Marketing', '2025-05-25 11:17:14.853', '2025-05-25 11:17:14.853', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('3beee543-ed14-46be-a2fb-02c95aec327f', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Golang', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('3bf15951-0ccc-49c9-bd6f-0e4c1e0e7aa5', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'Teamwork', '2025-04-29 13:31:56.476', '2025-04-29 13:31:56.476', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('3c43322a-ccda-4a02-9ead-2744c1add1c1', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Good Analytical', '2025-05-13 11:14:18.217', '2025-05-13 11:14:18.217', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('3d01da3f-dd62-47c4-97ec-505c04fe8026', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'NoSQL', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('3dc8ca44-2d22-4a13-9ed9-cc65d8cc4160', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'SEO', '2025-04-29 12:55:31.781', '2025-04-29 12:55:31.781', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('3ddd0043-ce63-464a-b897-460a9b7cc884', '410c16d5-523e-4088-bdbc-8630efb43cc1', 'Legal Drafting', '2025-05-25 11:57:46.722', '2025-05-25 11:57:46.722', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('3e1a4f5f-fb5f-472e-b472-10231ec5d948', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'PHP', '2025-05-13 11:14:18.217', '2025-05-13 11:14:18.217', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('3faa3d6a-acb5-4aee-89e2-30d7829e6c17', '6166c8e2-63b5-4626-bb3b-b7efe6957a90', 'Warehousing', '2025-05-25 11:10:13.645', '2025-05-25 11:10:13.645', '24864d31-9dca-4358-8ee0-19785af2e606'),
('405d052e-f03e-49e5-bed2-193d7ef05429', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'OOP', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('42ba66e5-6eb4-441e-8c7d-012ebb144754', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Meta Ads', '2025-05-25 12:26:14.821', '2025-05-25 12:26:14.821', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('44e882db-55e3-4181-a9d1-e83276c94615', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Data Migration', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('453a48a0-0031-4cb7-877a-1ee0dd5ea057', '590431d2-7ea1-4fdb-97fe-59fc79a8de8c', 'Microsoft Excel', '2025-05-25 12:32:29.392', '2025-05-25 12:32:29.392', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('45e12b63-d1d1-4dfb-8cdb-5a32fff374cb', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'OOP', '2025-03-12 14:02:07.040', '2025-03-12 14:02:07.040', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('46725c28-8e9f-4830-a113-a965b4863074', '43070f00-5b84-42d2-b904-9357ff2fcfe9', 'Microsoft Excel', '2025-04-29 11:03:01.518', '2025-04-29 11:03:01.518', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('47bf0bf2-83bc-4192-9e79-94b1d567d2d2', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Leadership', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('47c1573c-2d6c-42e7-a007-53d7cce4b26b', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Agile', '2025-04-29 12:34:20.171', '2025-04-29 12:34:20.171', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('496da093-17a5-4b05-bcec-823e980f478c', '790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', 'Communication', '2025-05-25 11:22:32.283', '2025-05-25 11:22:32.283', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('4a9fb636-347c-4eb5-ba17-27a414f24ee8', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'Negotiation', '2025-04-29 13:31:56.476', '2025-04-29 13:31:56.476', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('4e720e12-b344-4a04-a898-a24cdfd603b9', 'a87dbe94-d95b-423d-9fcb-29eb06e5fdce', 'Ad Ecosystem', '2025-03-12 14:28:47.959', '2025-03-12 14:28:47.959', '9459629e-7d9a-42be-aba8-3998b7444110'),
('50d4d95e-a853-4083-bfc0-0352fa3562f2', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'OSPF', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('50d99703-be8a-4ece-8d7a-432b9e440af6', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Oracle DBA', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('519631b2-51b3-4c06-ac5a-12913d4172b8', '504354c4-b842-46ed-a681-108f0a87341d', 'Photography', '2025-05-25 10:49:48.971', '2025-05-25 10:49:48.971', 'e8a6e6c2-6659-4c0a-9e34-bd3f98ec9f9f'),
('519e1d0f-828c-4bd3-a522-62f4a9447a0c', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Microsoft', '2025-04-29 12:34:20.171', '2025-04-29 12:34:20.171', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('547aee66-50b8-42f1-b0ad-e04757833a37', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'Data Analysis', '2025-04-29 12:36:05.844', '2025-04-29 12:36:05.844', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('55bab389-f857-4260-833e-2514e48fd4c6', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'DNS', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('55c3b2ae-c157-4022-8601-0695687364ae', 'eb07308a-b3ec-4782-91c7-795d91c0b470', 'BGP', '2025-04-29 12:40:00.559', '2025-04-29 12:40:00.559', '489ae09e-8760-4a0a-bc1a-70c093294dbf'),
('571879a8-01cb-4093-89d5-9260402fdea7', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'Organizational', '2025-03-12 14:22:07.528', '2025-03-12 14:22:07.528', '9459629e-7d9a-42be-aba8-3998b7444110'),
('574c3594-1fd6-408a-a8cc-9a1deebba9c7', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'TikTok Ads', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('58518f58-3388-4bbd-9c5f-3a0124613232', '004ed579-06bd-4c12-ae2e-ba25447d057e', 'Teamwork', '2025-05-25 11:26:04.903', '2025-05-25 11:26:04.903', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('5872239f-2caa-458a-a4aa-ac30c310b494', '0ce9459e-e3b2-4760-b478-9ccee437f455', 'Cartography', '2025-03-12 14:11:22.219', '2025-03-12 14:11:22.219', '9459629e-7d9a-42be-aba8-3998b7444110'),
('5b122823-eee9-4ac9-ade8-40e33e5b98a9', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Market Research', '2025-04-29 12:55:31.781', '2025-04-29 12:55:31.781', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('5b94705c-24ab-4c36-8fb9-319216ce9a26', '378c8241-a8a1-44ca-8a53-8584ed856711', 'AK3 Umum', '2025-05-25 12:04:45.602', '2025-05-25 12:04:45.602', 'fce9a01b-1661-4532-9163-09534b3a23a8'),
('5bc2d477-1bd9-412e-b84b-faf49bc0d88e', 'b92d9ac2-1338-4ad6-b27c-930e415bb458', 'SEMrush', '2025-04-29 13:33:59.765', '2025-04-29 13:33:59.765', 'f1a9a36e-3207-4c47-96df-366eef605f93'),
('5c39aee3-e739-4526-b5e8-635b0bcd0b68', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Selenium', '2025-05-25 12:54:59.778', '2025-05-25 12:54:59.778', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('5c8cf75f-2898-4aaf-afc7-ce78add07fda', '378c8241-a8a1-44ca-8a53-8584ed856711', 'Auditor SMKP', '2025-05-25 12:04:45.602', '2025-05-25 12:04:45.602', 'fce9a01b-1661-4532-9163-09534b3a23a8'),
('5d2cc1e7-ba7a-4d93-a907-77440224f9f8', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Critical Thinking', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('5db24d3a-53e5-442b-b838-9188e01d4666', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'Data Analysis', '2025-04-29 12:55:31.781', '2025-04-29 12:55:31.781', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('5fadea28-baba-42f5-9ebc-c9b0e74592aa', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'Fluent Mandarin', '2025-04-29 11:17:54.193', '2025-04-29 11:17:54.193', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('6064a3fc-e913-435f-85ea-c93e49fd1446', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Jira', '2025-05-13 10:50:55.371', '2025-05-13 10:50:55.371', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('60938c0c-05dd-404d-9767-a4531cc53fb5', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'MIcrosoft Excel', '2025-04-29 12:26:11.112', '2025-04-29 12:26:11.112', '9459629e-7d9a-42be-aba8-3998b7444110'),
('60c64c1a-1f3e-4b45-87b7-66e060b5983d', '378c8241-a8a1-44ca-8a53-8584ed856711', 'Sertifikasi POP/POM', '2025-05-25 12:04:45.602', '2025-05-25 12:04:45.602', 'fce9a01b-1661-4532-9163-09534b3a23a8'),
('60f33f1b-f183-4760-9159-b0640501ccf9', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Agile', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('620e3b90-d522-4ba9-908b-30d6f93e99c7', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'SEM Tools', '2025-04-29 11:17:54.193', '2025-04-29 11:17:54.193', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('626c5101-dc55-4ff5-918e-b548b974e15b', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Analytics', '2025-05-13 11:42:53.731', '2025-05-13 11:42:53.731', 'f8a51df4-199b-46a5-ba08-528d35427b29'),
('62f06fdc-398a-4a64-9303-e17ce11b1b74', 'ec4026e7-7dd0-4726-aeb6-a6146cea8f86', 'Teamwork', '2025-05-25 12:49:51.519', '2025-05-25 12:49:51.519', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('6413dcbc-e398-4777-8c85-494f043003f0', '004ed579-06bd-4c12-ae2e-ba25447d057e', 'Negotiation', '2025-05-25 11:26:04.903', '2025-05-25 11:26:04.903', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('6415a3fb-288f-4885-8816-9a9908c63b56', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Hukum Perdata', '2025-05-13 10:20:40.962', '2025-05-13 10:20:40.962', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('64fbd811-5419-46c0-8f1c-3fd071452b30', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Python', '2025-04-29 12:58:27.916', '2025-04-29 12:58:27.916', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('65c11ea8-56dc-4ce2-8c9b-595bc6e70b95', '410c16d5-523e-4088-bdbc-8630efb43cc1', 'Corporate Law', '2025-05-25 11:57:46.722', '2025-05-25 11:57:46.722', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('65daefdf-4063-46ca-a106-9a88ad30c4eb', '836e1950-1cd0-4be1-92e9-c40e820ea351', 'Microsoft Excel', '2025-05-13 10:27:17.468', '2025-05-13 10:27:17.468', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('67390f3c-87c5-4662-ba12-19daf5139b40', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'Mobile', '2025-03-12 14:02:07.040', '2025-03-12 14:02:07.040', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('677200de-f490-4e02-aaa4-a9ce420664cb', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'SEM Tools', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('67e0762d-054b-40ae-8785-7f92e856d131', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Agile', '2025-06-01 15:18:56.698', '2025-06-01 15:18:56.698', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('680bd39d-4191-429d-93a7-acc35b76cb4a', '54523e88-9358-4979-891f-88ef57d8e3e8', 'Negotiation', '2025-05-25 12:39:55.452', '2025-05-25 12:39:55.452', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('68281032-d310-4b62-8843-c8b8c683c733', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'Microsoft Excel', '2025-05-13 10:11:51.537', '2025-05-13 10:11:51.537', '0e57d284-21c7-4958-9f41-efc488823c93'),
('6998ea49-58cf-4bea-8d13-99fbbad2f6eb', '6166c8e2-63b5-4626-bb3b-b7efe6957a90', 'Forklift', '2025-05-25 11:10:13.645', '2025-05-25 11:10:13.645', '24864d31-9dca-4358-8ee0-19785af2e606'),
('69c8dc73-03fc-48e5-9963-f20764f9f07c', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Google Workspace', '2025-05-13 10:50:55.371', '2025-05-13 10:50:55.371', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('6c3e3519-0318-4559-b305-4d00b1ec3168', '46afeddd-d872-426b-bea8-d8e9d46e40b1', 'Retail', '2025-05-25 11:17:07.101', '2025-05-25 11:17:07.101', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('6d0392c5-caf0-4d7f-80ad-173e71754766', '4e2f3ab7-87c7-46b8-89e7-f99a5ebe9b15', 'Civil 3D', '2025-05-25 12:01:04.924', '2025-05-25 12:01:04.924', '00ea170e-7c1a-4653-861d-b921319a5ee1'),
('703aa630-4153-4da5-9d2e-0575d60e556c', '54523e88-9358-4979-891f-88ef57d8e3e8', 'MIcrosoft Excel', '2025-05-25 12:39:55.452', '2025-05-25 12:39:55.452', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('70bb549d-c42b-4319-9467-88dda32ef175', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'SQL', '2025-04-29 12:58:27.916', '2025-04-29 12:58:27.916', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('72371024-be0c-4ebb-9623-5ac9f7c0c2c1', '004ed579-06bd-4c12-ae2e-ba25447d057e', 'Data REporting', '2025-05-25 11:26:04.903', '2025-05-25 11:26:04.903', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('75ec2180-275f-481f-9b5a-8118fa98feb9', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'SAP', '2025-05-13 10:50:55.371', '2025-05-13 10:50:55.371', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('77037c70-c434-498b-9ccf-101043a47d0e', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Python', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('798452c3-381a-47a2-9b35-7e35ef4af889', 'bf26275c-eeba-4952-9c77-995d32bf14b3', 'Microsoft Office', '2025-05-25 12:17:16.467', '2025-05-25 12:17:16.467', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('79f72280-82f5-4b70-bb54-f74956aed337', '934b1525-7184-489f-a70f-864aaeaded5e', 'Accounting Software', '2025-05-25 12:28:43.127', '2025-05-25 12:28:43.127', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('7a102572-f3ad-43d5-b5a2-f7fb0d62a03e', '9f774803-bb84-40c1-a73b-2ec9c2521b2e', 'Data Visualization', '2025-03-12 14:19:39.724', '2025-03-12 14:19:39.724', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('7c03750b-1010-4061-be98-efd95d8e0426', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Patch', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('7d617f5a-ce1c-48fa-b8ac-322249a813b7', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Corporate Law', '2025-05-25 12:24:13.391', '2025-05-25 12:24:13.391', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('7dead0ed-acfe-4ed2-b6cb-85af1f1e6e52', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'Google Ads', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('80bd9465-cb39-4d28-bdf8-dad830a4da1e', '49360c9e-d0f8-4dbf-a4c4-3651638183ea', 'Accounting Software', '2025-04-29 12:22:50.717', '2025-04-29 12:22:50.717', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('80c9b423-e941-4490-a1d9-20019ba01b10', '46afeddd-d872-426b-bea8-d8e9d46e40b1', 'Communication', '2025-05-25 11:17:07.101', '2025-05-25 11:17:07.101', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('8239c6f5-8e0d-49a2-b6ed-44a5914db8c3', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'Golang', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('8478c9c6-3340-4c5f-9eef-dfdc109173b9', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'Adobe Photoshop', '2025-04-29 10:58:22.694', '2025-04-29 10:58:22.694', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('86fcab02-dc81-41e1-9a62-e65250ecbf12', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Critical Thinking', '2025-03-12 14:26:10.506', '2025-03-12 14:26:10.506', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('881b0a02-db90-4002-b8af-6c12b9d7955e', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'Organizational', '2025-04-29 12:26:11.112', '2025-04-29 12:26:11.112', '9459629e-7d9a-42be-aba8-3998b7444110'),
('88a0ed78-d448-424f-b24b-acbb328af5b2', 'dde36436-82a0-4412-b0c8-c7b2d63049e4', 'Problem Solving', '2025-05-13 10:20:40.962', '2025-05-13 10:20:40.962', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('88df5e77-382e-4eaf-886b-1a3b6b9c5329', '5332404c-fa80-42ee-97c4-497bb364d9f2', 'Content Creator', '2025-05-25 10:45:03.167', '2025-05-25 10:45:03.167', '8d358309-6960-43d4-a006-f4e537951474'),
('89cf8020-71a9-4f95-b964-f1d37ac9879e', '533c1bbd-4eb2-4d64-beee-cad15039eb28', 'Accounting Software', '2025-04-29 11:03:00.554', '2025-04-29 11:03:00.554', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('89d00b27-e405-44b7-ae0f-95534053340e', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'SQL', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('8ad68ab6-9377-4d23-b512-4601182c7f9e', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Java', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('8ce1115c-1ed9-42a3-bcfb-d1e34c375120', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'AS400', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('8f2e7dfb-3276-4c80-bc11-b6fe3ff432a0', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Microsoft Excel', '2025-04-29 12:58:27.916', '2025-04-29 12:58:27.916', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('8f33c9ea-409f-4b83-a10c-59ff7ade08d2', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Ads', '2025-05-13 11:42:53.731', '2025-05-13 11:42:53.731', 'f8a51df4-199b-46a5-ba08-528d35427b29'),
('8f388bda-919e-4153-be44-004e7fc5958e', 'ff22c978-4c03-4011-bf89-a61fa64b1d14', 'Ambiguity', '2025-04-29 12:34:20.171', '2025-04-29 12:34:20.171', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('8f836103-9cd4-449f-a0aa-f79897f571d5', 'fdd928ba-908f-46e3-9f18-2d8386dd9736', 'Forklift', '2025-05-25 11:05:12.319', '2025-05-25 11:05:12.319', '24864d31-9dca-4358-8ee0-19785af2e606'),
('90ef8e9c-df75-4cc2-93d3-da4dfb5f8e55', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'Meta Ads', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('92c9f620-90ef-4678-8dee-3688d0107cef', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Google Ads', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('93d31688-9703-438f-bcb3-46f6e759d60b', '4215bb59-0033-4c04-ad7e-42b6cb80749b', 'Warehousing', '2025-05-25 11:08:59.762', '2025-05-25 11:08:59.762', '24864d31-9dca-4358-8ee0-19785af2e606'),
('94ffaf64-89bf-4bd1-90d8-2f5e285b595d', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'Data Analysis', '2025-05-13 10:46:33.259', '2025-05-13 10:46:33.259', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('965ed141-1841-4900-885d-687a39f039d0', '6bf0136f-1f8f-4916-969a-0014607c6bbb', 'Labor Law', '2025-05-25 12:14:43.840', '2025-05-25 12:14:43.840', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('97caac4a-db77-4336-8fec-10acec87d5ef', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Clojure', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('983fd7bb-6a91-4675-bb02-878d0fcd83de', '2223856d-5427-43ab-985b-d3917b5fad3d', 'PMBOK', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('987ac6b8-2583-4131-8d0f-3ca4fbd2322f', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'OOP', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('9a137c73-3658-47fc-9170-db50a4fd2b42', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Agile', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('9aef07a8-c52b-40dd-89b3-00674521584a', 'a87dbe94-d95b-423d-9fcb-29eb06e5fdce', 'Data-driven thinking', '2025-03-12 14:28:47.959', '2025-03-12 14:28:47.959', '9459629e-7d9a-42be-aba8-3998b7444110'),
('9af542fb-79d2-4c3d-9ca2-6b6a38760ef0', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'Strategic Planning', '2025-03-12 14:22:07.528', '2025-03-12 14:22:07.528', '9459629e-7d9a-42be-aba8-3998b7444110'),
('9b54fc60-3739-486e-b26e-711832879378', '46afeddd-d872-426b-bea8-d8e9d46e40b1', 'Marketing', '2025-05-25 11:17:07.101', '2025-05-25 11:17:07.101', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('9db7e1b5-5b6c-46de-8c79-e16153b6b6a5', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'Google Ads', '2025-05-13 10:46:33.259', '2025-05-13 10:46:33.259', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('9de53e2f-f5df-43cb-8f26-54de50f22578', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'User Acceptance Test (UAT)', '2025-05-25 12:54:59.778', '2025-05-25 12:54:59.778', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('9f55a86f-d39c-4aea-8c58-2c1cbf18d18d', '5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'MIcrosoft Excel', '2025-05-13 10:29:46.198', '2025-05-13 10:29:46.198', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('9ff53a8e-9df9-4004-b129-d23955af46a7', '5f57a0ed-82e7-4229-a19a-3b7c12d82aa7', 'B2B Marketing', '2025-04-29 12:55:31.781', '2025-04-29 12:55:31.781', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('a101fe70-9c5e-44d9-a49b-0e323c3acc75', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'Google Analytics', '2025-05-13 10:46:33.259', '2025-05-13 10:46:33.259', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('a1c3b4c5-dcba-4da3-9aea-73226d5d06a9', '36b544f0-34bb-44f0-af09-8c1728167477', 'Adobe Photoshop', '2025-05-25 10:47:45.505', '2025-05-25 10:47:45.505', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('a51331fd-4e60-4626-9f1a-b2bcd8b1b0c6', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'CI/CD', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('a5c705b2-729f-4d0f-b225-6fb452be144a', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Good Communication', '2025-05-25 12:48:11.072', '2025-05-25 12:48:11.072', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('a65ad5bb-ba57-4f68-9abb-6046ebf27762', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Oracle Data Guard', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('a716da4d-30c6-4f4e-a3e9-307de2e4eb68', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Data Management', '2025-04-29 13:28:57.479', '2025-04-29 13:28:57.479', '0e57d284-21c7-4958-9f41-efc488823c93'),
('a74520b7-923c-49c2-b2f7-c1a7227548c0', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Clustering Analytics', '2025-03-12 14:26:10.506', '2025-03-12 14:26:10.506', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('a77576ff-7c70-482d-b9d9-5023917da631', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Visio', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('a99570ec-a2f4-48d4-9e57-f859301f5ae9', '836e1950-1cd0-4be1-92e9-c40e820ea351', 'Accounting Software', '2025-05-13 10:27:17.468', '2025-05-13 10:27:17.468', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('a9b32dd1-84bd-4f39-9bc2-90fc572e9fe3', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'TikTok Ads', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('aa145a22-9c43-4aef-8ab6-9538c7f667e8', '4e2f3ab7-87c7-46b8-89e7-f99a5ebe9b15', 'AutoCAD', '2025-05-25 12:01:04.924', '2025-05-25 12:01:04.924', '00ea170e-7c1a-4653-861d-b921319a5ee1'),
('aaeb8bf6-b06c-4efe-9ecd-92ba20e8b4b7', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'SQL', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('ac84ad59-3a0c-4135-9d54-6ca871e239ac', '9f774803-bb84-40c1-a73b-2ec9c2521b2e', 'Python', '2025-03-12 14:19:39.724', '2025-03-12 14:19:39.724', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('ad02b19f-32f1-499f-902d-4ed7ef69590b', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Content Writing', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('ad413572-2d73-4f86-a026-4a5e4fd6850a', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Microsoft', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('adfe5d12-80e2-4285-9747-cd75283d772f', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Descriptive Analytics', '2025-03-12 14:26:10.506', '2025-03-12 14:26:10.506', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('ae15a2b3-d0e1-4650-b1d8-65954896eefd', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'SQL Queries', '2025-05-13 11:14:18.217', '2025-05-13 11:14:18.217', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('aec40c78-f59e-41f7-94c7-6868268e5c68', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'OCA/OCP', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('aecb5339-a622-4702-beb9-6c2760c8fc0e', '2223856d-5427-43ab-985b-d3917b5fad3d', 'Jira', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('af4b63cf-faa1-4b50-a34a-84c80a2caa13', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'Python', '2025-04-29 10:46:28.723', '2025-04-29 10:46:28.723', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('af80723d-bb74-4138-a906-db8bb43aff7f', '5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'Teamwork', '2025-05-13 10:29:46.198', '2025-05-13 10:29:46.198', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('af9e14b1-af0c-4810-aadb-49a9d2d2b33b', '6bf0136f-1f8f-4916-969a-0014607c6bbb', 'Microsoft Office', '2025-05-25 12:14:43.840', '2025-05-25 12:14:43.840', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('afdd402d-7fdf-4d5c-a5af-5bae26914649', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Zapier', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('afdf51a8-ad71-4d65-8335-14fced273775', '7d93b9a5-45d2-412e-a8c1-626e4996eb32', 'Data Visualization', '2025-03-12 14:26:10.506', '2025-03-12 14:26:10.506', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('b0de288e-1c10-4cb7-b9ef-8ccb40741cbf', '2223856d-5427-43ab-985b-d3917b5fad3d', 'SDLC', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('b1411624-0d68-412a-b661-c879712edf2c', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'HR end-to-end', '2025-05-13 10:11:51.537', '2025-05-13 10:11:51.537', '0e57d284-21c7-4958-9f41-efc488823c93'),
('b1d602de-33ea-4281-b68e-32e4c40efc86', '790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', 'Retail', '2025-05-25 11:22:32.283', '2025-05-25 11:22:32.283', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('b34e8fc5-7014-415d-b6a7-eaaf7ab4d393', '8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', 'Java', '2025-03-12 14:16:22.903', '2025-03-12 14:16:22.903', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('b3711fc3-e973-4403-816d-77f816dc2fe4', 'c43deb87-cb22-48f1-99da-ce578d95dc5c', 'Marketing', '2025-05-25 11:21:14.298', '2025-05-25 11:21:14.298', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('b48e8d7a-565f-46b8-8ef8-2b8f6f7dbd00', '6bf0136f-1f8f-4916-969a-0014607c6bbb', 'Corporate Law', '2025-05-25 12:14:43.840', '2025-05-25 12:14:43.840', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('b6334a86-146b-4c90-8fcc-4f472b2af0ee', 'ba13fc34-4ac8-45ba-94c7-c0fde001e419', 'Retail', '2025-05-25 11:17:14.853', '2025-05-25 11:17:14.853', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('b7355ec2-670c-43b7-98ab-5d6e5a64d216', 'f256f35b-7f50-47e7-a217-4d526e09ecf3', 'Critical Thinking', '2025-03-12 14:22:07.528', '2025-03-12 14:22:07.528', '9459629e-7d9a-42be-aba8-3998b7444110'),
('b8d24f4a-045e-4de5-b30e-feb30e8b67ba', '9fc93fa5-3565-4f60-b94d-b30d5bab8d27', 'Communication Skills', '2025-05-13 10:11:51.537', '2025-05-13 10:11:51.537', '0e57d284-21c7-4958-9f41-efc488823c93'),
('b99de87d-6859-4d07-86d6-348f3fe3f5a1', 'd76ced3a-d02a-4924-bc26-400870ba7093', 'Content Marketing', '2025-05-25 12:26:14.821', '2025-05-25 12:26:14.821', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('b9cd0d63-4fc6-48d6-968d-3f4da74df951', '36b544f0-34bb-44f0-af09-8c1728167477', 'Konten Visual', '2025-05-25 10:47:45.505', '2025-05-25 10:47:45.505', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('ba8866a2-36d8-4858-a0f5-f6b5e9d53c63', '9f774803-bb84-40c1-a73b-2ec9c2521b2e', 'SQL', '2025-03-12 14:19:39.724', '2025-03-12 14:19:39.724', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('bac88463-30b8-49da-87d0-d06b36612373', '790abb17-f6ee-4333-9c9d-bd9a70ff5ffa', 'Marketing', '2025-05-25 11:22:32.283', '2025-05-25 11:22:32.283', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('bc32d459-4cba-4ad4-9b1c-fb7accd4c534', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'Typescript', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('bc334ea0-005e-4abc-9ffe-4b400449adae', '714aca3f-3d15-4086-8f3f-461529b14812', 'Negotiation', '2025-06-01 15:17:22.484', '2025-06-01 15:17:22.484', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('c07d6fa3-f438-4048-abdf-7b6ec671fbfc', '3bb94b9c-265a-4ea3-b238-9e3c1a0c69f5', 'Problem Solving', '2025-02-25 07:21:04.572', '2025-02-25 07:21:04.572', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('c17b3297-b083-433f-a9de-dc240e9e6189', 'ae0f4a4f-b980-44df-b172-d626e213ceba', 'Ilustrator & InDEsign', '2025-04-29 10:58:22.694', '2025-04-29 10:58:22.694', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('c253a3db-a46c-4432-ae09-bd61f80fa93b', 'aee1fb58-a6ca-4e61-b6dc-624f535485b3', 'Slack', '2025-05-13 10:50:55.371', '2025-05-13 10:50:55.371', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('c3231390-7343-4a12-8c92-5b2d85183795', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'Redis', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('c38f9c0f-4083-4158-8257-a93b6136d19d', '714aca3f-3d15-4086-8f3f-461529b14812', 'Data REporting', '2025-06-01 15:17:22.484', '2025-06-01 15:17:22.484', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('c49edeb8-9e3e-4013-add8-79b9ef7b8275', '9d731152-4c5b-41e6-9781-aef7cb3adb7f', 'Problem Solving', '2025-05-25 12:30:32.583', '2025-05-25 12:30:32.583', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('c4a16c9b-6d98-4dee-83d9-85d8dbacb5ba', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'PostgreSQL', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('c68dc015-38ed-4469-9ec6-ec848e1fb270', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Campaign', '2025-05-13 11:42:53.731', '2025-05-13 11:42:53.731', 'f8a51df4-199b-46a5-ba08-528d35427b29'),
('c8efd61b-4c3f-4cad-b11f-820c782970f5', 'bd319feb-c7f8-4628-91c8-c006c2b57129', 'Microsoft Excel', '2025-05-25 12:56:38.316', '2025-05-25 12:56:38.316', '0e57d284-21c7-4958-9f41-efc488823c93'),
('c90e5ee4-02a1-471d-8ca1-92b067a42cb3', '2223856d-5427-43ab-985b-d3917b5fad3d', 'MS. Project', '2025-05-13 11:11:29.906', '2025-05-13 11:11:29.906', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('c9231365-989b-4966-9034-e621bae565f2', 'c43deb87-cb22-48f1-99da-ce578d95dc5c', 'Communication', '2025-05-25 11:21:14.298', '2025-05-25 11:21:14.298', 'cbf61711-f296-402c-b939-5d8be5cbd32d'),
('c984e30d-2180-4648-96df-0fc2979242f2', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'NoSQL', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('ca66a74a-2994-4895-9924-dff6550eb4f9', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Predictive Analytics', '2025-05-13 11:06:04.782', '2025-05-13 11:06:04.782', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('cb4d8ed2-1a6d-46dd-a54f-642832bcf574', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Jmeter', '2025-05-25 12:54:59.778', '2025-05-25 12:54:59.778', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('cc93ded8-3ac7-4e35-9568-28dba4c1ae26', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'iOS SDK', '2025-03-12 14:37:56.168', '2025-03-12 14:37:56.168', '02cba157-3907-49c8-a64f-b98804265c72'),
('cdc29f74-c691-49ff-aa68-432b7c39b94d', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'Google Ads', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('cee64653-91be-4039-857f-991feaacb2b8', '5b8ca058-d0c2-467c-8638-cc389c34944a', 'Content Marketing', '2025-05-13 11:42:53.731', '2025-05-13 11:42:53.731', 'f8a51df4-199b-46a5-ba08-528d35427b29'),
('cfacb8d5-d79f-4aac-9a40-14affafbed19', '67bcedad-17b7-4e7f-8f72-2a4b66b2db48', 'SQL', '2025-03-12 14:06:43.980', '2025-03-12 14:06:43.980', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('d04a4458-bdbf-44e0-abc7-cb616348a2be', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'Teamwork', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('d3e2de2a-c2c1-435d-ad8f-bc3caed1d94b', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'Analytical', '2025-04-29 12:26:11.112', '2025-04-29 12:26:11.112', '9459629e-7d9a-42be-aba8-3998b7444110'),
('d436c95d-0db8-4fab-9028-06f37d59cd31', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'Problem Solving', '2025-03-12 14:37:56.168', '2025-03-12 14:37:56.168', '02cba157-3907-49c8-a64f-b98804265c72'),
('d4913058-3e64-4fbb-bd3f-31bea6f06c18', '43070f00-5b84-42d2-b904-9357ff2fcfe9', 'Accounting Software', '2025-04-29 11:03:01.518', '2025-04-29 11:03:01.518', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('d4f5afd0-ebdd-407d-a417-5652ff586c3b', '934b1525-7184-489f-a70f-864aaeaded5e', 'Sertifikasi Brevet A & B', '2025-05-25 12:28:43.127', '2025-05-25 12:28:43.127', 'e222b3c5-6dae-41aa-aa87-f49b33923c49'),
('d5825e21-1be0-4e38-bcd1-a88d5b352f98', '6db391e1-5f10-4531-8bb1-7867138437a4', 'Problem Solving', '2025-05-25 12:07:00.248', '2025-05-25 12:07:00.248', '90bad989-8cb1-493a-bc45-3edeb6084bd6'),
('d7d038e7-a1a9-4b70-85b9-971ef943df81', 'ad4a51a5-cb2d-46de-9c03-f7cba6a6b918', 'Katalon', '2025-05-25 12:54:59.778', '2025-05-25 12:54:59.778', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('d7d8c4fe-7ade-49de-901e-ff2a9d640c56', '8d70ec02-2be4-4b6f-9a25-ee06a2e750c5', 'Android APIs', '2025-03-12 14:16:22.903', '2025-03-12 14:16:22.903', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('d9c01f4b-9a78-482d-b8c8-9c008a344f0d', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'TikTok Ads', '2025-04-29 12:36:05.844', '2025-04-29 12:36:05.844', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('daea0747-dbfb-40db-901e-f25c322a4b7b', '4e8014d5-873c-44e3-90fd-36e403a3c284', 'SEO', '2025-04-29 12:36:05.844', '2025-04-29 12:36:05.844', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('dbcff778-0045-4151-924d-bac9983275bc', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'MongoDB', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('dc4b7be1-7648-4403-a553-e07bf0643bfa', '36b544f0-34bb-44f0-af09-8c1728167477', 'Ilustrator & InDEsign', '2025-05-25 10:47:45.505', '2025-05-25 10:47:45.505', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('dd0d9ffc-bfdd-4b0d-bc6b-3d17c0587462', '1970d06f-f892-48cc-93ef-2380cea9eaef', 'Problem Solving', '2025-02-17 13:43:30.450', '2025-02-17 13:43:30.450', '7d92d499-3756-4e8d-8d51-5ab06e6287bb'),
('dd819f69-8a86-4b7d-9314-956efefea638', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'SQL', '2025-05-13 11:06:04.782', '2025-05-13 11:06:04.782', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('df1073c9-c385-4661-8e8f-a3a12c86d2a9', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'API', '2025-03-12 14:02:07.040', '2025-03-12 14:02:07.040', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('e03e41a9-e713-4ed0-9a06-ef1ed1416a57', '0130a1ce-344f-4536-8a1e-a9a8051470da', 'Agile', '2025-05-13 11:06:04.782', '2025-05-13 11:06:04.782', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('e0459d30-2f9e-41f9-888c-369e8e0c6476', '79972b71-82b0-4e42-a3aa-371b4b2488ca', 'Communication Skills', '2025-04-29 13:28:57.479', '2025-04-29 13:28:57.479', '0e57d284-21c7-4958-9f41-efc488823c93'),
('e09003d0-9815-46d2-8dd6-2ec07f4cf020', '3808e583-44d6-41e0-83aa-b0b4d2ca53d3', 'SEO', '2025-04-29 11:17:54.193', '2025-04-29 11:17:54.193', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('e17bbe34-bf34-4e5b-b8f6-af6a7dc32c60', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Java', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('e1df6e5a-2d53-43b7-a2a5-a387163b937e', '8cd754fb-6def-4b9c-a004-f2d40c82048f', 'Negotiation', '2025-05-13 11:20:47.549', '2025-05-13 11:20:47.549', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('e2778741-cdc9-4db2-a4b4-7f579411333e', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Machine Learning', '2025-05-25 12:48:11.072', '2025-05-25 12:48:11.072', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('e3217875-36dc-4a7e-ba0d-fca97a456b7e', '7aec7881-000d-4443-ac2c-79a663ae1673', 'Critical Thinking', '2025-04-29 11:44:50.106', '2025-04-29 11:44:50.106', 'c6f2cbc0-8a89-4cc1-8853-6db398c6483a'),
('e368726d-7128-44ee-9bb9-8e3b364164ad', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'SEO', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('e413e32b-3718-4b3f-b21f-a622c47d0998', '5f04e2ab-e1fe-432a-a951-0a15a39a9a9d', 'Negotiation', '2025-05-13 10:29:46.198', '2025-05-13 10:29:46.198', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('e4c4fdf7-3a5f-45d0-8fe8-83b26f69e4d8', '1e9acf21-bdfe-4b17-98f7-b4ed0700bbc5', 'React', '2025-05-13 10:39:18.557', '2025-05-13 10:39:18.557', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('e510a74d-2868-47c1-9cd2-f4eed84f4764', '36ca9838-845c-40f2-9713-e51f64188be1', 'Public Speaking', '2025-05-25 12:51:57.295', '2025-05-25 12:51:57.295', '87164d99-8e1a-4940-bf28-d5e4dab15468'),
('e6dc307e-3810-446a-9fc4-b5a17e2d08a5', 'e0fa756a-2e09-4e0f-b288-c6ae4e70c07c', 'Cocoa', '2025-03-12 14:37:56.168', '2025-03-12 14:37:56.168', '02cba157-3907-49c8-a64f-b98804265c72'),
('e7ead820-f0d3-43c7-8a0e-847cb44b52d8', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'PostgreSQL', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('e8ce2bc3-6e0f-483c-87e1-6dab4706aef4', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'SQL', '2025-04-29 10:46:28.723', '2025-04-29 10:46:28.723', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('e954ac26-3f3f-4caf-a570-cf7a53a6ebc5', 'ceb51b93-e439-448e-a7ec-3cf2ed1f8c22', 'SEO', '2025-05-13 10:46:33.259', '2025-05-13 10:46:33.259', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('eb8934dc-09dc-46bb-9096-29d376f1851e', '8a2137e1-3964-4bca-b10a-c53a1cab86bb', 'MIcrosoft Excel', '2025-04-29 13:31:56.476', '2025-04-29 13:31:56.476', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('ec444bc6-5a28-47bd-8a59-ed50eaf52115', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Golang', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('eca83279-f115-4bc9-a614-b041f9e4a6da', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Java', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('ed3fca03-1e6b-48b1-8077-7cc91f9023dd', 'f95f72bf-7d07-4557-a211-80f647b7ad19', 'R Studio Mapple', '2025-04-29 12:26:11.112', '2025-04-29 12:26:11.112', '9459629e-7d9a-42be-aba8-3998b7444110'),
('ed995e4b-0612-4e05-9970-d60c9d3422ef', '36b544f0-34bb-44f0-af09-8c1728167477', 'Ilustrasi', '2025-05-25 10:47:45.505', '2025-05-25 10:47:45.505', '6d2c5aea-2445-4ac4-ba44-f447c022f08e'),
('ee15a798-5534-45c0-9367-1b4d189701cd', '714aca3f-3d15-4086-8f3f-461529b14812', 'Teamwork', '2025-06-01 15:17:22.484', '2025-06-01 15:17:22.484', '8adba8ad-f7c7-4c3b-aa48-fbc624df6500'),
('eead4df0-becc-473a-b13c-724846350e55', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'SEO', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('eee49334-e4f0-472b-91c5-daf927894ac0', 'e5604673-7267-4eb8-a219-b5a286e21ef2', 'Linux/Unix', '2025-05-13 11:03:34.182', '2025-05-13 11:03:34.182', '454c1abe-4ea6-4c94-b519-2933bce94e0d'),
('ef333dc6-b74f-45ca-adcc-0c8937ff22df', 'bd663b1a-dbe5-4cf9-9632-1365329d6ddf', 'Containers', '2025-03-12 14:34:01.100', '2025-03-12 14:34:01.100', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('efc8f9d6-5e73-46c3-8aaf-1cdad6b769d2', 'a92810d6-8be9-42ad-ae53-cd4082822f54', 'Data Analysis', '2025-04-29 12:58:27.916', '2025-04-29 12:58:27.916', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('efd13632-8378-4bbf-ac90-10fc3cde8dd5', 'f0f6227c-b550-4ed7-8a33-875e3a7d83ca', 'SQL', '2025-03-12 14:02:07.040', '2025-03-12 14:02:07.040', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('f38066a3-6096-4ec8-9b97-e5bc9187533a', 'a87dbe94-d95b-423d-9fcb-29eb06e5fdce', 'Ads', '2025-03-12 14:28:47.959', '2025-03-12 14:28:47.959', '9459629e-7d9a-42be-aba8-3998b7444110'),
('f3c1a830-4e30-44a0-9973-195057c67869', 'bd9ac047-8517-4160-b37a-4d89bfced1d4', 'Fluent English', '2025-05-25 12:24:13.391', '2025-05-25 12:24:13.391', '0c748f50-1089-436f-a569-e39bb45d18fd'),
('f466f43d-3be7-4dc8-ba9c-4cea779a954a', '8cc071a5-7507-437b-8eae-a886c03de4d5', 'Oracle', '2025-05-13 11:14:18.217', '2025-05-13 11:14:18.217', '154c21a0-af95-415b-9b14-ab849f08dc84'),
('f4ce0f62-24fd-433a-9ad8-5d85453cb8a6', 'd5b00756-9347-4f22-9b05-47721b9fea1c', 'Redis', '2025-03-12 14:14:56.200', '2025-03-12 14:14:56.200', '65769c61-7859-4f87-8faf-fe7c58f3f07f');
INSERT INTO `skills_requirement` (`skill_requirement_id`, `job_id`, `skill`, `created_at`, `updated_at`, `skill_category_id`) VALUES
('f4e0ea68-20a9-4110-91ea-ed837549fcd8', '01d8fa38-47fd-4e96-ae44-4ea9d08c44e4', 'TikTok Ads', '2025-05-13 11:45:54.902', '2025-05-13 11:45:54.902', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('f74e1b1c-8918-474e-8623-a2c3bc8e6767', 'bf26275c-eeba-4952-9c77-995d32bf14b3', 'SEO', '2025-05-25 12:17:16.467', '2025-05-25 12:17:16.467', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('f830f7ae-12a2-4827-ab43-154120f990d7', '8ec90dea-c6f3-4a06-8fc1-46cf76cf5564', 'Microsoft Excel', '2025-05-25 12:48:11.072', '2025-05-25 12:48:11.072', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('fa2648d6-4eec-4457-8228-bf617afc06d0', '504354c4-b842-46ed-a681-108f0a87341d', 'Videography', '2025-05-25 10:49:48.971', '2025-05-25 10:49:48.971', 'e8a6e6c2-6659-4c0a-9e34-bd3f98ec9f9f'),
('fbae5038-07ad-4825-a3f7-443f0bb86f82', '10159c92-bdba-4905-bc8e-1f74913989a3', 'Jira', '2025-06-01 15:18:56.698', '2025-06-01 15:18:56.698', 'a856c9a6-c471-4619-87d9-e4f568e796b2'),
('fc2c9580-88a6-4191-91e6-66443d1cc874', '2db43178-52ef-4414-9ac1-38a1c25d0e11', 'Data Analysis', '2025-03-12 14:31:16.285', '2025-03-12 14:31:16.285', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('fc6746cf-8d9a-437f-af33-150881c6b09d', 'bf26275c-eeba-4952-9c77-995d32bf14b3', 'Marketing Ads', '2025-05-25 12:17:16.467', '2025-05-25 12:17:16.467', '8d5e7076-7b8f-4bea-9022-42692c8d1905'),
('fc7834d6-5221-4ebb-a28a-3eaff2186e01', '33f2f3d4-aea0-4612-85df-e9b40fce27e4', 'API', '2025-04-29 10:46:28.723', '2025-04-29 10:46:28.723', '65769c61-7859-4f87-8faf-fe7c58f3f07f'),
('ffcf5bbd-4eb7-4064-afe7-5abe7c15b324', 'deb736b3-602c-47e9-94eb-b8abd554f19d', 'Data Analysis', '2025-05-13 10:42:28.724', '2025-05-13 10:42:28.724', '8d5e7076-7b8f-4bea-9022-42692c8d1905');

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE `universities` (
  `university_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otpExpires` datetime(3) DEFAULT NULL,
  `verified` enum('true','false') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'false',
  `status` enum('not_submitted','submitted','accepted','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_submitted',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`university_id`, `email`, `password`, `full_name`, `otp`, `otpExpires`, `verified`, `status`, `created_at`, `updated_at`) VALUES
('03cd3b8e-3595-4a54-bbaf-e0ea0a86392c', 'university15@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 15', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.175', '2025-02-05 07:52:06.175'),
('1397a798-a737-4030-af72-6f98abd324ac', 'university6@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 6', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.004', '2025-02-05 07:52:06.004'),
('1609f8ad-3100-4d7f-8b64-3904390126bb', 'university4@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 4', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:05.977', '2025-02-05 07:52:05.977'),
('2aaf8114-6d4c-48e3-962c-cbb88a5676f2', 'university9@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 9', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.068', '2025-02-05 07:52:06.068'),
('2b9e3e2b-0d9e-4b11-8b84-d8036409c88b', 'university8@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 8', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.026', '2025-02-05 07:52:06.026'),
('45a62e6f-1559-49f0-997b-5806fbf395d6', 'university3@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 3', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:05.931', '2025-02-05 07:52:05.931'),
('566937d9-75ff-4be3-b47b-e9f3571960d3', 'university2@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 2', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:05.920', '2025-02-05 07:52:05.920'),
('8751606c-ca5b-400d-95a6-cb4a6dd72080', 'university12@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 12', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.105', '2025-02-05 07:52:06.105'),
('8bc3ca74-c4ef-4cb9-bd60-493acfdc65fd', 'university13@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 13', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.150', '2025-02-05 07:52:06.150'),
('94d5e28b-1d0c-43a9-ad6e-ac7b9d237e40', 'university14@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 14', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.164', '2025-02-05 07:52:06.164'),
('95205bee-5b2e-4338-b357-8a75ce7730d8', 'university10@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 10', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.082', '2025-02-05 07:52:06.082'),
('a2d5dcb8-0f5c-441d-9660-ee9e51a8f506', 'university5@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 5', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:05.990', '2025-02-05 07:52:05.990'),
('a6c028fd-f9be-4a62-be84-5990691e0650', 'university1@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 1', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:05.906', '2025-02-05 07:52:05.906'),
('c8f45218-1c1e-453b-bab8-8e24321987c6', 'university7@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 7', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.015', '2025-02-05 07:52:06.015'),
('da04858b-46ea-40a9-856d-5cde6b850522', 'university11@mail.com', '$2a$10$qI7obw.T5af.4BjP/DX4q.Fqr3KtPEgi5G10vv4/Ax/S1xVni9ceC', 'University 11', NULL, NULL, 'true', 'accepted', '2025-02-05 07:52:06.093', '2025-02-05 07:52:06.093');

-- --------------------------------------------------------

--
-- Table structure for table `university_details`
--

CREATE TABLE `university_details` (
  `university_detail_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `university_details`
--

INSERT INTO `university_details` (`university_detail_id`, `university_id`, `university_name`, `logo_url`, `phone_number`, `category`, `country`, `province`, `city`, `district`, `full_address`, `postal_code`, `website`, `facebook_url`, `twitter_url`, `instagram_url`, `youtube_url`, `created_at`, `updated_at`) VALUES
('0037a576-0eb1-46c6-be0d-07ef37101c88', '03cd3b8e-3595-4a54-bbaf-e0ea0a86392c', 'University 15', 'logo/logo15.png', '01234567815', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 15', '57126', 'http://example.com/15', 'http://facebook.com/15', 'http://twitter.com/15', 'http://instagram.com/15', 'http://youtube.com/15', '2025-02-05 07:52:06.175', '2025-02-05 07:52:06.175'),
('0150011b-b485-48bb-904d-f1cf9edbd681', 'a6c028fd-f9be-4a62-be84-5990691e0650', 'University 1', 'logo/logo1.png', '0123456781', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 1', '57126', 'http://example.com/1', 'http://facebook.com/1', 'http://twitter.com/1', 'http://instagram.com/1', 'http://youtube.com/1', '2025-02-05 07:52:05.906', '2025-02-05 07:52:05.906'),
('29991ac4-3ab0-45bc-a7d5-2134537bcebf', '45a62e6f-1559-49f0-997b-5806fbf395d6', 'University 3', 'logo/logo3.png', '0123456783', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 3', '57126', 'http://example.com/3', 'http://facebook.com/3', 'http://twitter.com/3', 'http://instagram.com/3', 'http://youtube.com/3', '2025-02-05 07:52:05.931', '2025-02-05 07:52:05.931'),
('3319ddf7-8976-444f-b347-4acddb0ab856', '8751606c-ca5b-400d-95a6-cb4a6dd72080', 'University 12', 'logo/logo12.png', '01234567812', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 12', '57126', 'http://example.com/12', 'http://facebook.com/12', 'http://twitter.com/12', 'http://instagram.com/12', 'http://youtube.com/12', '2025-02-05 07:52:06.105', '2025-02-05 07:52:06.105'),
('4434ad72-ffaf-495f-b93e-f08f6516992e', '2b9e3e2b-0d9e-4b11-8b84-d8036409c88b', 'University 8', 'logo/logo8.png', '0123456788', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 8', '57126', 'http://example.com/8', 'http://facebook.com/8', 'http://twitter.com/8', 'http://instagram.com/8', 'http://youtube.com/8', '2025-02-05 07:52:06.026', '2025-02-05 07:52:06.026'),
('5c84a624-7a50-4ac1-836c-27b8213afc30', 'da04858b-46ea-40a9-856d-5cde6b850522', 'University 11', 'logo/logo11.png', '01234567811', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 11', '57126', 'http://example.com/11', 'http://facebook.com/11', 'http://twitter.com/11', 'http://instagram.com/11', 'http://youtube.com/11', '2025-02-05 07:52:06.093', '2025-02-05 07:52:06.093'),
('87c878b7-9fb3-404b-b80f-3fff4607d571', 'c8f45218-1c1e-453b-bab8-8e24321987c6', 'University 7', 'logo/logo7.png', '0123456787', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 7', '57126', 'http://example.com/7', 'http://facebook.com/7', 'http://twitter.com/7', 'http://instagram.com/7', 'http://youtube.com/7', '2025-02-05 07:52:06.015', '2025-02-05 07:52:06.015'),
('88569c0f-ae69-4a01-8314-f2062970b408', '94d5e28b-1d0c-43a9-ad6e-ac7b9d237e40', 'University 14', 'logo/logo14.png', '01234567814', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 14', '57126', 'http://example.com/14', 'http://facebook.com/14', 'http://twitter.com/14', 'http://instagram.com/14', 'http://youtube.com/14', '2025-02-05 07:52:06.164', '2025-02-05 07:52:06.164'),
('9766711e-9625-41fb-9c5c-8276979f7d8a', '1397a798-a737-4030-af72-6f98abd324ac', 'University 6', 'logo/logo6.png', '0123456786', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 6', '57126', 'http://example.com/6', 'http://facebook.com/6', 'http://twitter.com/6', 'http://instagram.com/6', 'http://youtube.com/6', '2025-02-05 07:52:06.004', '2025-02-05 07:52:06.004'),
('ae8ae4a5-331f-45b7-b0e5-c3073ffa0ee1', '2aaf8114-6d4c-48e3-962c-cbb88a5676f2', 'University 9', 'logo/logo9.png', '0123456789', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 9', '57126', 'http://example.com/9', 'http://facebook.com/9', 'http://twitter.com/9', 'http://instagram.com/9', 'http://youtube.com/9', '2025-02-05 07:52:06.068', '2025-02-05 07:52:06.068'),
('c0976585-19d7-48fe-9b73-e4dd2dbf38c5', '95205bee-5b2e-4338-b357-8a75ce7730d8', 'University 10', 'logo/logo10.png', '01234567810', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 10', '57126', 'http://example.com/10', 'http://facebook.com/10', 'http://twitter.com/10', 'http://instagram.com/10', 'http://youtube.com/10', '2025-02-05 07:52:06.082', '2025-02-05 07:52:06.082'),
('c92bfb24-2878-438a-950f-15d4d81832bc', '1609f8ad-3100-4d7f-8b64-3904390126bb', 'University 4', 'logo/logo4.png', '0123456784', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 4', '57126', 'http://example.com/4', 'http://facebook.com/4', 'http://twitter.com/4', 'http://instagram.com/4', 'http://youtube.com/4', '2025-02-05 07:52:05.977', '2025-02-05 07:52:05.977'),
('d065a2c0-b477-4de9-adc8-5e2639da6ff0', 'a2d5dcb8-0f5c-441d-9660-ee9e51a8f506', 'University 5', 'logo/logo5.png', '0123456785', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 5', '57126', 'http://example.com/5', 'http://facebook.com/5', 'http://twitter.com/5', 'http://instagram.com/5', 'http://youtube.com/5', '2025-02-05 07:52:05.990', '2025-02-05 07:52:05.990'),
('f0b9a4c6-260e-403c-b469-de2a2cb415cc', '566937d9-75ff-4be3-b47b-e9f3571960d3', 'University 2', 'logo/logo2.png', '0123456782', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 2', '57126', 'http://example.com/2', 'http://facebook.com/2', 'http://twitter.com/2', 'http://instagram.com/2', 'http://youtube.com/2', '2025-02-05 07:52:05.920', '2025-02-05 07:52:05.920'),
('f57ed1a8-a1c3-40e4-8baa-95160aed9685', '8bc3ca74-c4ef-4cb9-bd60-493acfdc65fd', 'University 13', 'logo/logo13.png', '01234567813', NULL, 'Indonesia', 'Central Java', 'Surakarta', 'Laweyan', '123 University St 13', '57126', 'http://example.com/13', 'http://facebook.com/13', 'http://twitter.com/13', 'http://instagram.com/13', 'http://youtube.com/13', '2025-02-05 07:52:06.150', '2025-02-05 07:52:06.150');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('04efc660-db2f-4eb8-ac8b-0831e92dabf4', 'bf23b00804395d52504926b0f3fefd64d8117f69acfdc4110f7f7c28ae21c285', '2025-02-05 07:51:16.983', '20240726071307_remove_cv_job_seeker_and_update_jobs', NULL, NULL, '2025-02-05 07:51:16.769', 1),
('09d268a4-8e10-4c34-b62b-1ba4903a5bb0', 'dbcb285b8893fcd3ee809fee562a47e9916c23b7e3aa3c8c295ca33677c56a18', '2025-02-05 07:51:23.385', '20240912062431_unique_languages_per_job_seeker', NULL, NULL, '2025-02-05 07:51:23.238', 1),
('1eef941b-76be-4e1b-ba30-a9673eddec46', '0567aa477a95da440f7b5c874b0bfb0afa874fb52c7c0957af42370e698e3712', '2025-02-05 07:51:18.837', '20240727122911_changed_name_table_applicants', NULL, NULL, '2025-02-05 07:51:18.170', 1),
('23a8556b-0ed9-406d-a38c-957c7c1b31e0', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:22.759', '20240827132251_fix_merge_migration', NULL, NULL, '2025-02-05 07:51:22.732', 1),
('2a1182c8-155f-4550-a083-6b23d73d5a05', '9e443222f32303d8b6e85894268286ba431696d70dd904e1acc6d874c3a030f0', '2025-02-05 07:51:19.699', '20240802100424_change_page_id', NULL, NULL, '2025-02-05 07:51:19.503', 1),
('2a2d713c-50d7-43e5-995a-f1d64a8a2075', '2972cbfbd5e351c8e7dc07d045185af3310a079f23dbfde474feb63bf6173cac', '2025-02-05 07:51:17.098', '20240727110941_update_applicants', NULL, NULL, '2025-02-05 07:51:16.989', 1),
('30a98ed6-e421-4ee0-80df-50c94373731c', 'c9c264f6ddff376e0575a17952db53b873b1200040ceef17de5d9dc3077c417b', '2025-02-05 07:51:22.698', '20240823103525_add_grade', NULL, NULL, '2025-02-05 07:51:22.611', 1),
('32c3b465-83d6-4c62-8225-4a8259065117', '895c24dfb2e4812c0ef9c372dd6a99037a16794f1df6aeecd77f99afedcaf32e', '2025-02-05 07:51:20.929', '20240805101953_remove_default_skills_category', NULL, NULL, '2025-02-05 07:51:20.852', 1),
('357b253a-46eb-4282-832f-71567b68ef17', '3ec42493400ddf2f1c900a3609ba859731079a498508dccbe08e88d03cc54537', '2025-02-05 07:51:23.113', '20240910083204_add_settings', NULL, NULL, '2025-02-05 07:51:23.004', 1),
('42be5283-38a6-4d2d-82c4-23f288454783', '80dc96db50fa086eca022686e10998e5f78ea4d9d22ddfa6303baed3d5bbcedc', '2025-02-05 07:51:19.356', '20240801150137_change_jobs_status', NULL, NULL, '2025-02-05 07:51:19.056', 1),
('4549473f-4de0-4894-86fc-951f0b60f25d', 'd82ff403914d7c048656254591ef77f9a14203abc00ec5af65b80e52e3b70f9d', '2025-06-09 04:44:03.399', '20250609044403_change_relation_match_scores', NULL, NULL, '2025-06-09 04:44:03.335', 1),
('4681f678-de83-49f9-b2ae-167effd40d77', '8d3900105d6461b00fd811f3b8fbc2884954ec0a9a0efe8ee16bad66564a040c', '2025-02-05 07:51:18.161', '20240727122132_change_type_expected_salary', NULL, NULL, '2025-02-05 07:51:17.921', 1),
('4792abf7-cda3-4f99-8002-964b5f9ec4a3', '4ceaaa9004e906a529e2fe73e618601fc0ba241792101519d851982deef16569', '2025-06-17 12:44:54.067', '20250617124453_add_table_for_lms', NULL, NULL, '2025-06-17 12:44:53.979', 1),
('4d1f1fba-e77c-4a74-b0a8-a65962c9e794', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:23.455', '20240912062527_unique_languages_per_job_seeker', NULL, NULL, '2025-02-05 07:51:23.396', 1),
('4e0c9767-263f-4126-a476-24d13836bbe3', 'b9cf2de0b29080a44cd78ede9c34e003b81ec37cd6f766700739490548d588fe', '2025-02-05 07:51:17.880', '20240727120832_changed_type', NULL, NULL, '2025-02-05 07:51:17.854', 1),
('5e6938c3-27b4-44b1-9745-32b821d58216', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:22.455', '20240823004424_rafy_changes_migration', NULL, NULL, '2025-02-05 07:51:22.431', 1),
('5f5e88be-de59-431d-a357-ee3380ce38f5', '6f00e006152cef5c5c65406c3a6ad4c2abbc01a557b8bc8f83711714562abb3d', '2025-02-05 07:51:20.537', '20240805095555_add_deleted_at_and_job_category', NULL, NULL, '2025-02-05 07:51:20.338', 1),
('683067b8-aaf0-46e4-b11b-fefea9a802f5', '93dcd875baa0d4ec819395bb4085d7af8ccd7f55acac8d3049de6b0eca6a01fd', '2025-02-05 07:51:21.560', '20240809071149_relation_skill_category', NULL, NULL, '2025-02-05 07:51:21.227', 1),
('6951da04-85f5-4417-964e-37a836c053e0', '69dfd4d37648c756a6634b05d64962697f10e317dab074a71fccb49bdb1f98f7', '2025-02-05 07:51:21.217', '20240808172442_change_status_applications', NULL, NULL, '2025-02-05 07:51:20.936', 1),
('72a5a2e7-2ce4-4ccd-becf-883a6590c838', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:23.594', '20240912062811_neww', NULL, NULL, '2025-02-05 07:51:23.537', 1),
('751975d5-af58-4a15-b258-73b2654c061d', '0badc169ba5ee1f17886a73fb45ef80e94f61854a5b5c30d85c5eeed094e3465', '2025-02-05 07:51:23.229', '20240912062144_remove_unique_languages', NULL, NULL, '2025-02-05 07:51:23.121', 1),
('75a480a4-fee2-4952-bc9c-9eba2fbf470c', '628458657c3b9430428d2fcc847b2b2e0488280a102524a8d86e5d289dcfa678', '2025-02-05 07:51:17.848', '20240727115720_update_type_data_table', NULL, NULL, '2025-02-05 07:51:17.104', 1),
('79d87dff-3772-4275-8d22-789175ab7a80', '69ce52d5db28885461b80a87170f4cd8254067131eeda86ef4bc17e1a37a22bf', '2025-02-05 07:51:23.794', '20241008024555_change_type_personal_summary', NULL, NULL, '2025-02-05 07:51:23.601', 1),
('7cdf3bb2-8bea-4cd6-bd6a-563c1acad9d0', '8e436b917c8762a1f298ca8daff7f35447fc5d916e9946af9309238b5615f690', '2025-02-05 07:51:19.956', '20240803095611_add_work_type_in_jobs', NULL, NULL, '2025-02-05 07:51:19.705', 1),
('7cdfb050-4f34-4f1e-8a58-9063e82e0f90', 'a8af196b6ef433c57b732f8fea84d0d2f8d13c6aaac5ae1029f52be87400ca81', '2025-02-05 07:51:20.726', '20240805101112_nullable_salary', NULL, NULL, '2025-02-05 07:51:20.542', 1),
('8abfed28-ceb5-4817-aafc-420e207f1f03', '3db10e942e5a292f1123184e86737d657a1a21875ee4362a4f14db7f69faac5d', '2025-02-05 07:51:21.834', '20240809072331_relation_skill_category', NULL, NULL, '2025-02-05 07:51:21.567', 1),
('90206118-323e-49e4-9cb8-f85e362afc31', '1ad09622786551c8dc8d5b178863d66cfbf0c7ad8d72fb31ed5fe554fdac54b9', '2025-06-09 04:04:02.515', '20250609040402_add_match_scores', NULL, NULL, '2025-06-09 04:04:02.437', 1),
('94907259-c724-4a3b-8f4f-6c00e94c2d4b', 'faa43e16b9d9ac55be74620d3216bdc08609c0bf5477b444cf2e8d891e634c6a', '2025-02-05 07:51:20.296', '20240803095812_change_work_type', NULL, NULL, '2025-02-05 07:51:19.963', 1),
('9717baf5-3460-4fe4-a5db-44d94389d4b3', '8a4cc0e514b518e755897672c594ebee22442f74ee9d27e107ae10e90ce94675', '2025-02-05 07:51:20.818', '20240805101815_add_skills_category_with_default', NULL, NULL, '2025-02-05 07:51:20.731', 1),
('990f1f06-dc26-4d94-ab37-86f856bf2607', '4cdf43405be9758664966900e942ed7193cbcc17dbddb120dacbc540c9e117a9', '2025-02-05 07:51:19.016', '20240727125945_change_apllication_id', NULL, NULL, '2025-02-05 07:51:18.846', 1),
('9f3f8a20-898f-4a08-aa2e-673e427f6ade', 'e96c7769b72ddb1aa63335dbd146b727db52b6e56ae76f8da7564f8dac4b70ea', '2025-06-09 04:33:19.138', '20250609043318_change_float_match_scores', NULL, NULL, '2025-06-09 04:33:18.959', 1),
('a427e732-1fae-40d8-a759-de6e92ceeb46', 'aae2bfb287953cb5d9e5500d0cc85c8f34e23669b41617df54a55a9a5f5c0dd4', '2025-06-09 03:52:44.098', '20250609035243_', NULL, NULL, '2025-06-09 03:52:43.925', 1),
('a8787dc3-a735-45a0-ad0e-7b04a7c2d639', 'ee877733d980abf9ebc8453d06b400147ce5d12260170fe896b97b9fee466bee', '2025-02-05 07:51:22.424', '20240818123512_change_description_company', NULL, NULL, '2025-02-05 07:51:22.067', 1),
('b0b96063-b08d-482d-a93f-e6fcf220118c', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:57.104', '20250205075157_testing', NULL, NULL, '2025-02-05 07:51:57.078', 1),
('bcc014ab-96c7-45e0-8013-f8daaba983a9', '26cfb58e55cb5e3f668755bd62b372a08259d22152cc7179fb6a14655f1e8b27', '2025-02-05 07:51:22.970', '20240902160205_add_experience_years', NULL, NULL, '2025-02-05 07:51:22.893', 1),
('c331ffd1-571b-49b4-9256-af8992d4d919', '278c4ae892b47eed2dbc83df033ab02a2f8a20db05855d1490aeeceeb39587d0', '2025-02-05 07:51:16.762', '20240725134952_init', NULL, NULL, '2025-02-05 07:51:13.646', 1),
('c3ba14e8-0e9c-4e5f-8639-1c36e6270d00', 'b18017a3e1b0546161f5a33ca02d019271b6ac825e59a8908699ad297e90a514', '2025-02-05 07:51:23.530', '20240912062723_new', NULL, NULL, '2025-02-05 07:51:23.462', 1),
('c6ac864d-4d6f-41a6-9651-10d4088170f0', 'fa174883a6acc4e7dc7c4a5efde93f7a1f39f0a1cc8c8d7e26d5b553e29f035a', '2025-02-05 07:51:22.606', '20240823095913_remove_unique_skill_name', NULL, NULL, '2025-02-05 07:51:22.537', 1),
('d6a80b1a-2a90-45ce-9828-fc8a9d22fb5e', '209d7c5246b51e06fb6b7dcb87b9561a2b2f0606a9b9acaa00fa60b70ed3db4a', '2025-02-05 07:51:22.060', '20240812102625_soft_delete_skills_category', NULL, NULL, '2025-02-05 07:51:21.964', 1),
('db383cc8-4347-4de5-83ac-2d24eb9843c8', '426095d1fcb7733a1d6cb42f019b1dc793b216b61f9876f95d2ca4bd18021b7b', '2025-02-05 07:51:21.957', '20240809094550_delete_position_level', NULL, NULL, '2025-02-05 07:51:21.839', 1),
('e836f5b1-eda9-44ad-801e-4321a9de0a19', '2dd1769dc976b6738146e16c5dc45868dbf90d65d8a572b5b7c679625f1b54ed', '2025-02-05 07:51:19.496', '20240802091654_add_new_table_pages', NULL, NULL, '2025-02-05 07:51:19.363', 1),
('f15351c7-5b72-49d1-a0bf-e8c80a52b4cb', '028134f6904d2964eb1cee5eb8d4cff6562a9df33193f6f6f3fac647a3a43ff6', '2025-02-05 07:51:22.887', '20240829074933_add_experience_level', NULL, NULL, '2025-02-05 07:51:22.764', 1),
('fc62c7b6-ab1c-4334-8f1f-727ff7a77826', '71ffccc53d81772d9c33b911f4ab56db7796048de7d629c00cb4b82ae0283169', '2025-02-05 07:51:22.531', '20240823090030_add_image_in_content', NULL, NULL, '2025-02-05 07:51:22.460', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admins_email_key` (`email`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `applications_job_seeker_id_fkey` (`job_seeker_id`),
  ADD KEY `applications_job_id_fkey` (`job_id`);

--
-- Indexes for table `approval`
--
ALTER TABLE `approval`
  ADD PRIMARY KEY (`approval_id`),
  ADD UNIQUE KEY `approval_company_id_key` (`company_id`),
  ADD UNIQUE KEY `approval_university_id_key` (`university_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`certification_id`),
  ADD KEY `certifications_job_seeker_detail_id_fkey` (`job_seeker_detail_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`),
  ADD UNIQUE KEY `companies_email_key` (`email`);

--
-- Indexes for table `company_details`
--
ALTER TABLE `company_details`
  ADD PRIMARY KEY (`company_detail_id`),
  ADD UNIQUE KEY `company_details_company_id_key` (`company_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`education_id`),
  ADD UNIQUE KEY `education_job_seeker_detail_id_key` (`job_seeker_detail_id`),
  ADD KEY `education_university_id_fkey` (`university_id`);

--
-- Indexes for table `experiences`
--
ALTER TABLE `experiences`
  ADD PRIMARY KEY (`experience_id`),
  ADD KEY `experiences_job_seeker_detail_id_fkey` (`job_seeker_detail_id`);

--
-- Indexes for table `experience_levels`
--
ALTER TABLE `experience_levels`
  ADD PRIMARY KEY (`experience_level_id`),
  ADD UNIQUE KEY `experience_levels_name_key` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `jobs_company_id_fkey` (`company_id`),
  ADD KEY `jobs_skills_category_id_fkey` (`skills_category_id`);

--
-- Indexes for table `job_benefits`
--
ALTER TABLE `job_benefits`
  ADD PRIMARY KEY (`job_benefit_id`),
  ADD KEY `job_benefits_job_id_fkey` (`job_id`);

--
-- Indexes for table `job_seekers`
--
ALTER TABLE `job_seekers`
  ADD PRIMARY KEY (`job_seeker_id`),
  ADD UNIQUE KEY `job_seekers_email_key` (`email`);

--
-- Indexes for table `job_seeker_details`
--
ALTER TABLE `job_seeker_details`
  ADD PRIMARY KEY (`job_seeker_detail_id`),
  ADD UNIQUE KEY `job_seeker_details_job_seeker_id_key` (`job_seeker_id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`language_id`),
  ADD UNIQUE KEY `languages_job_seeker_detail_id_language_name_key` (`job_seeker_detail_id`,`language_name`);

--
-- Indexes for table `log_activities`
--
ALTER TABLE `log_activities`
  ADD PRIMARY KEY (`log_activity_id`);

--
-- Indexes for table `match_scores`
--
ALTER TABLE `match_scores`
  ADD PRIMARY KEY (`match_score_id`),
  ADD UNIQUE KEY `match_scores_application_id_key` (`application_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`page_id`),
  ADD UNIQUE KEY `pages_slug_key` (`slug`),
  ADD KEY `pages_slug_idx` (`slug`);

--
-- Indexes for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD PRIMARY KEY (`personal_info_id`),
  ADD UNIQUE KEY `personal_info_job_seeker_detail_id_key` (`job_seeker_detail_id`);

--
-- Indexes for table `position_levels`
--
ALTER TABLE `position_levels`
  ADD PRIMARY KEY (`position_level_id`),
  ADD UNIQUE KEY `position_levels_position_name_key` (`position_name`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `projects_job_seeker_detail_id_fkey` (`job_seeker_detail_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`saved_job_id`),
  ADD UNIQUE KEY `saved_jobs_job_id_job_seeker_id_key` (`job_id`,`job_seeker_id`),
  ADD KEY `saved_jobs_job_seeker_id_fkey` (`job_seeker_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `settings_key_key` (`key`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`skill_id`),
  ADD KEY `skills_job_seeker_detail_id_fkey` (`job_seeker_detail_id`);

--
-- Indexes for table `skills_category`
--
ALTER TABLE `skills_category`
  ADD PRIMARY KEY (`skill_category_id`),
  ADD UNIQUE KEY `skills_category_category_name_key` (`category_name`);

--
-- Indexes for table `skills_requirement`
--
ALTER TABLE `skills_requirement`
  ADD PRIMARY KEY (`skill_requirement_id`),
  ADD KEY `skills_requirement_job_id_fkey` (`job_id`),
  ADD KEY `skills_requirement_skill_category_id_fkey` (`skill_category_id`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`university_id`),
  ADD UNIQUE KEY `universities_email_key` (`email`);

--
-- Indexes for table `university_details`
--
ALTER TABLE `university_details`
  ADD PRIMARY KEY (`university_detail_id`),
  ADD UNIQUE KEY `university_details_university_id_key` (`university_id`),
  ADD UNIQUE KEY `university_details_university_name_key` (`university_name`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `applications_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers` (`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `approval`
--
ALTER TABLE `approval`
  ADD CONSTRAINT `approval_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `approval_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities` (`university_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `company_details`
--
ALTER TABLE `company_details`
  ADD CONSTRAINT `company_details_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `education_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities` (`university_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `experiences`
--
ALTER TABLE `experiences`
  ADD CONSTRAINT `experiences_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `jobs_skills_category_id_fkey` FOREIGN KEY (`skills_category_id`) REFERENCES `skills_category` (`skill_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `job_benefits`
--
ALTER TABLE `job_benefits`
  ADD CONSTRAINT `job_benefits_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `job_seeker_details`
--
ALTER TABLE `job_seeker_details`
  ADD CONSTRAINT `job_seeker_details_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers` (`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `languages`
--
ALTER TABLE `languages`
  ADD CONSTRAINT `languages_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `match_scores`
--
ALTER TABLE `match_scores`
  ADD CONSTRAINT `match_scores_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD CONSTRAINT `personal_info_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `saved_jobs_job_seeker_id_fkey` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seekers` (`job_seeker_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_job_seeker_detail_id_fkey` FOREIGN KEY (`job_seeker_detail_id`) REFERENCES `job_seeker_details` (`job_seeker_detail_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `skills_requirement`
--
ALTER TABLE `skills_requirement`
  ADD CONSTRAINT `skills_requirement_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `skills_requirement_skill_category_id_fkey` FOREIGN KEY (`skill_category_id`) REFERENCES `skills_category` (`skill_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `university_details`
--
ALTER TABLE `university_details`
  ADD CONSTRAINT `university_details_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities` (`university_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
