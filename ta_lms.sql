-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 24, 2026 at 01:13 PM
-- Server version: 8.0.30
-- PHP Version: 8.4.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ta_lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id_about_us` bigint UNSIGNED NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id_assignment_submission` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_assignment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submission_resources`
--

CREATE TABLE `assignment_submission_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_assignment_submission` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id_category`, `name`, `created_at`, `updated_at`) VALUES
('49634978-2399-46af-9718-f8c76b1e51f6', 'Data Science', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5979ea51-11ba-45d7-9ffb-48a8a3ebe612', 'Design', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6ec9f9e4-c209-4161-a230-ea2a197d5b77', 'Business', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c67db6de-fc72-4f1e-9e36-9c4c20016143', 'Marketing', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f04fa0af-47e1-406c-885f-fda41f5a93ea', 'Programming', '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_level` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id_course`, `id_category`, `id_teacher`, `id_course_level`, `title`, `thumbnail`, `thumbnail_link`, `description`, `rules`, `duration`, `created_at`, `updated_at`) VALUES
('0bb88742-7a08-4b94-b716-661316b7fe90', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'IT Project Management: PMBOK & SDLC', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen proyek IT profesional menggunakan PMBOK dan pemahaman SDLC. Termasuk risk management, testing phases, dan dokumentasi proyek.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('134d9ad3-5417-4274-bcd8-523930b7b1d9', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Data Science & Machine Learning Applications', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Penerapan data science dan machine learning dalam bisnis. Termasuk Python, statistical analysis, model building, dan data visualization.', 'Complete all materials and assignments.', 100, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('16296b02-a284-4d97-9e4b-a3efb1124167', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Backend Development with Node.js and Express.js', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Build scalable and high-performance RESTful APIs using Node.js and the Express.js framework. Covers asynchronous programming, middleware, and database integration.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1d6ad670-7a16-4419-8b89-92f83bc150c1', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Digital Marketing Strategy & Growth', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Strategi pemasaran digital komprehensif untuk brand awareness dan customer acquisition. Termasuk retargeting, SEO/SEM, dan analisis customer journey.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1db835ae-fd15-4f8a-b1f0-f5bb1951c99e', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Engineering Management & Team Leadership', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen engineering dan kepemimpinan tim teknis. Belajar people management, technical leadership, delivery optimization, dan team development.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1f67afea-07a3-4588-96fb-46a709b4c618', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Warehouse Management & Logistics', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen gudang dan logistik modern. Pelajari inventory management, forklift operation, supply chain optimization, dan sistem warehouse management.', 'Complete all materials and assignments.', 55, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1fb37969-1540-4016-b6da-8d29d7c4fb64', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Mobile App Development with Flutter & Dart', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase using Google\'s Flutter framework and Dart language.', 'Complete all materials and assignments.', 105, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('21a726b2-ff08-4633-b5a1-944927af40f9', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Data Analysis & Business Intelligence', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Analisis data bisnis menggunakan SQL, Python, dan tools visualisasi. Belajar descriptive & predictive analytics, clustering, dan data-driven decision making.', 'Complete all materials and assignments.', 80, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('22fa1944-790d-4372-9efc-49cd121b2f34', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'E-Commerce & Marketplace Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen platform e-commerce dan marketplace. Belajar strategi penjualan online, campaign optimization, analytics, dan customer acquisition.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('24a17957-ad2d-4df9-a75c-117c7cae21d9', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Account Executive & Sales Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pelajari strategi penjualan profesional, manajemen akun, negosiasi, dan membangun hubungan pelanggan jangka panjang. Termasuk teknik presentasi dan pencapaian target penjualan.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('24adbaec-9cd2-4375-9d20-eb3869be4135', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Advanced Docker and Kubernetes Orchestration', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Deep dive into containerization with Docker and master Kubernetes for orchestrating, scaling, and managing containerized applications in production environments.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('28c5e670-c2cb-4ec9-bdff-a162b8014e51', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Blockchain Fundamentals and Smart Contract Development', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Explore the core concepts of blockchain technology, cryptocurrencies, and learn to develop and deploy smart contracts using Solidity on platforms like Ethereum.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('2e24efdc-e055-4c1a-8385-4993c90d54ea', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Network Administration & IT Infrastructure', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Administrasi jaringan dan infrastruktur IT. Pelajari TCP/IP, routing protocols, network security, dan maintenance sistem jaringan enterprise.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('33cf2e93-e38d-46fd-bf45-1115ff48396f', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Social Media Content Creation & Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Strategi konten media sosial yang efektif. Belajar content creation, video editing, community management, dan brand communication di platform digital.', 'Complete all materials and assignments.', 50, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('366bc58e-69f2-4dde-b2f2-b6f28c8f8620', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'Modern Frontend Development with React/Vue/Angular', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Build interactive and responsive user interfaces using modern JavaScript frameworks like React, Vue, or Angular. Covers state management, component-based architecture, and API consumption.', 'Complete all materials and assignments.', 95, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3b7aa7f0-3a86-4af9-913c-5c278b207ba3', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Graphic Design & Visual Communication', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Desain grafis profesional untuk media digital dan e-commerce. Kuasai Adobe Creative Suite, typography, branding, dan desain untuk platform sosial media.', 'Complete all materials and assignments.', 65, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3dabcc21-5bc7-461d-9390-54ed3d8fbcb9', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Business Development & Strategic Planning', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pengembangan bisnis dan perencanaan strategis. Termasuk market analysis, partnership development, negotiation skills, dan strategic thinking.', 'Complete all materials and assignments.', 65, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3ec62b63-868e-40d1-9c04-c18bd984ffdc', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'iOS Development with Swift & Xcode', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pengembangan aplikasi iOS menggunakan Swift dan Xcode. Termasuk UI/UX design, App Store guidelines, dan best practices mobile development.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('407c50a6-e4ad-4f04-9b18-e1a8a15ea9a1', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Mobile App Development (iOS & Android)', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn to develop native or cross-platform mobile applications for iOS and Android. Covers UI/UX design, platform-specific features, and publishing to app stores.', 'Complete all materials and assignments.', 110, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('407d1e48-848e-485d-a13f-61a08ca18260', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Introduction to SAS Programming for Analytics', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn the basics of the SAS language for data manipulation, statistical analysis, and reporting, a common tool in finance and healthcare industries.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4612fc91-dfe9-4687-8ada-a6cbd9be978e', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Project Management: Agile, Scrum & PDCA', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Kuasai metodologi manajemen proyek modern. Belajar Agile, Scrum, PDCA cycle, koordinasi tim, dan tools seperti Jira untuk pengelolaan proyek yang efisien.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4bf07ad3-2907-483a-9355-575a0f951633', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'Operations Management & Supply Chain', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pelajari manajemen operasional, monitoring performance, analisis supply-demand, dan koordinasi dengan berbagai stakeholder untuk efisiensi operasional.', 'Complete all materials and assignments.', 55, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('599104d9-a453-4b37-9ccf-bbb5ce23637f', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Retail Sales & Customer Relationship', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Strategi penjualan retail dan manajemen hubungan pelanggan. Termasuk product promotion, territory management, dan pencapaian target penjualan.', 'Complete all materials and assignments.', 45, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5a47cf09-2ffc-4f70-8e73-808e23138560', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'UI Design and Prototyping with Figma', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Master Figma for designing user interfaces, creating interactive prototypes, and collaborating with teams on web and mobile app designs.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('67cafd87-fd65-483a-b9af-5900a2d1868d', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'iOS App Development with Swift', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Dive into native iOS development using Swift and Xcode. Learn to build apps for iPhone and iPad, covering UIKit/SwiftUI, Core Data, and App Store submission.', 'Complete all materials and assignments.', 110, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7130d7c8-5982-4705-99c8-3e80ba22a8e7', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Database Administration: Oracle & SQL', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Administrasi database Oracle dan SQL advanced. Termasuk performance tuning, backup recovery, security management, dan high availability solutions.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7349e350-849d-437c-b24b-5b176f7eb717', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Enterprise Architecture dengan TOGAF Framework', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Kuasai arsitektur enterprise menggunakan framework TOGAF ADM. Pelajari desain sistem, integrasi, dan cloud platform untuk infrastruktur IT yang efektif.', 'Complete all materials and assignments.', 80, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('735af61a-8dd5-4e19-b9d7-c6808cf6b589', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Agile Project Management with Scrum', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn the principles of Agile development and master the Scrum framework for managing complex software projects, including roles, events, and artifacts.', 'Complete all materials and assignments.', 50, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7a3cfdcc-0a0a-4d16-8494-4f9681feb2df', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Building Web Applications with Django', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn the Django framework for building robust, database-driven web applications in Python, covering models, views, templates, and the admin interface.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7ad71870-92a1-4187-a909-c5be32df8cdf', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Photography & Videography for Content', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Teknik fotografi dan videografi untuk konten digital. Termasuk editing, storytelling visual, dan produksi konten untuk media sosial dan marketing.', 'Complete all materials and assignments.', 55, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7b015802-16a8-4f02-9daa-9f60abcb1620', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Java Backend Development with Spring Boot', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Develop robust enterprise-level applications and microservices using Spring Boot. Learn about dependency injection, Spring MVC, Spring Data, and Spring Security.', 'Complete all materials and assignments.', 100, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('80869d7e-ad10-4d07-a169-b73a7711eb5a', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Full-Stack Web Development with Ruby on Rails', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Master the Ruby on Rails framework to rapidly build complete web applications. Covers MVC architecture, ActiveRecord, and Rails conventions.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('83462653-fb17-47a9-a750-ae6058a7e15e', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Software Engineering Internship Program', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Program magang untuk pengembangan software. Belajar automation workflow, integrasi API, JavaScript/TypeScript, dan tools development modern.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('850a1859-e5e5-4766-8799-4ab6f1c502e1', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Health, Safety & Environment (HSE) Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen keselamatan kerja dan lingkungan. Pelajari regulasi K3, audit SMKP, investigasi kecelakaan, dan program pelatihan safety.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('9d3d3d73-4904-4403-bb9c-d1ee25f14c1a', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Human Resources & Payroll Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen SDM dan sistem penggajian. Pelajari recruitment, employee relations, payroll processing, dan HR analytics menggunakan tools modern.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('9e634bcf-ab28-4426-976f-1dc138325b56', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'Cloud Security Fundamentals and Best Practices', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Understand common cloud security threats and learn best practices for securing data, applications, and infrastructure on major cloud platforms (AWS, Azure, GCP).', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a8bdd81a-30fd-468a-9698-bb8f14546807', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Comprehensive Web Development Bootcamp', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn to build full-stack web applications from scratch, covering HTML, CSS, JavaScript, a backend language (e.g., Node.js or Python), databases, and deployment.', 'Complete all materials and assignments.', 120, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ab93cb20-77a9-4d8d-afa5-77caa354227c', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Server-Side Rendering with Next.js', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Enhance your React applications with Next.js. Learn server-side rendering (SSR), static site generation (SSG), routing, and API routes for performant web apps.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('aee3a7ea-8abe-486f-a24b-6d1bc53df943', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Search Engine Optimization (SEO) & SEM', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Optimasi mesin pencari dan search engine marketing. Termasuk keyword research, content optimization, Google Ads, dan SEO tools professional.', 'Complete all materials and assignments.', 55, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b13d0f3a-4d98-4e27-a2aa-02c0338c071f', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Data Governance and Ethics in AI', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Understand the principles of data governance, data quality management, privacy regulations (like GDPR), and ethical considerations in building and deploying AI models.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b263d541-d387-466a-b40b-6c129c555d84', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Mobile Development: Android & Kotlin', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pengembangan aplikasi mobile Android menggunakan Kotlin. Belajar Android APIs, UI/UX design, testing, dan deployment ke Google Play Store.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b2ac021e-a7f0-4e62-9c5c-d71f6b421ada', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Virtual Assistant & Remote Work Skills', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Keterampilan virtual assistant dan remote work. Belajar client communication, project management tools, dan administrative skills untuk kerja jarak jauh.', 'Complete all materials and assignments.', 45, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b80c4b2e-5597-4e45-9980-f0423b5f2ac7', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Account Payable & Finance Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pelajari proses keuangan perusahaan, manajemen invoice, pembayaran, rekonsiliasi bank, dan compliance terhadap regulasi keuangan internasional.', 'Complete all materials and assignments.', 65, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b9add5d3-5c4e-458c-ac5b-5314a221bd86', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Digital Marketing Specialist: SEM & Property', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Spesialisasi digital marketing untuk industri properti. Termasuk SEM tools, targeting pelanggan B2B, dan strategi marketing untuk real estate.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bced47d2-6855-4bcc-b969-3f238573ac0b', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Dasar-Dasar Pengembangan Web Frontend', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Kuasai blok bangunan inti web: HTML5 untuk struktur, CSS3 untuk styling (termasuk Flexbox dan Grid), dan JavaScript modern (ES6+) untuk interaktivitas. Sempurna untuk pemula.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bd34c364-88a1-4d92-a45d-4c1b62796cf9', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Quality Control & Software Testing', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Quality assurance dan software testing professional. Belajar manual/automated testing, UAT, tools seperti Selenium dan Katalon, dan test management.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Software Engineering: Backend Development', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pengembangan backend scalable menggunakan Golang, Java, dan database modern. Termasuk microservices, API design, dan system architecture.', 'Complete all materials and assignments.', 95, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c6fa4096-113c-4657-a974-9b250f5384d3', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Mobile UI/UX Design Principles', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn the fundamentals of designing intuitive and engaging user interfaces and experiences for mobile applications. Covers wireframing, prototyping, and platform guidelines.', 'Complete all materials and assignments.', 60, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c87576a1-b667-4f7e-9f4d-f22081d1251b', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Introduction to Internet of Things (IoT) Development', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn the basics of IoT, including hardware components (e.g., Raspberry Pi, Arduino), sensor integration, network protocols, and cloud platforms for IoT data.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'DevOps Fundamentals: Building CI/CD Pipelines', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Understand DevOps principles and learn to build Continuous Integration and Continuous Deployment (CI/CD) pipelines using tools like Jenkins, GitLab CI, or GitHub Actions.', 'Complete all materials and assignments.', 80, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('cbb920e4-71bf-4907-8f33-494b92a3f6d2', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Full-Stack Development: Java, Python & API', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pengembangan aplikasi full-stack menggunakan Java dan Python. Belajar database design, API development, testing, dan deployment aplikasi skala besar.', 'Complete all materials and assignments.', 100, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d22cb36b-bf33-488a-80ad-7df222aa65ba', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Optimasi Kinerja Web dan Aksesibilitas (a11y)', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pelajari cara membangun situs web yang cepat dan dapat diakses. Mencakup Core Web Vitals, lazy loading, code splitting, optimasi gambar, atribut ARIA, dan pedoman WCAG untuk pengalaman web yang inklusif.', 'Complete all materials and assignments.', 45, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d2fa6bdc-23a8-47bc-bc31-87e39db81a84', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Legal Drafting & Corporate Law', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Penyusunan dokumen hukum perusahaan, kontrak bisnis, compliance, dan pengurusan perizinan. Termasuk hukum perdata dan administrasi legal.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d4ec9922-c8f4-4f14-bd2b-dbbd574825df', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Introduction to Game Development with Unity', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Begin your journey into game development using the Unity engine. Learn C# scripting, 2D/3D game creation basics, physics, and UI development.', 'Complete all materials and assignments.', 95, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('db2ef114-9370-42eb-9bd8-cac04d3df248', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Android App Development with Kotlin', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Develop modern Android applications using Kotlin, Google\'s preferred language for Android. Covers Android Studio, Jetpack components, and Material Design.', 'Complete all materials and assignments.', 110, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('db332a57-41be-4995-b4a6-4486a0b4efe7', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Tax Management & Compliance', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen pajak perusahaan dan compliance. Pelajari tax planning, filing, audit preparation, dan optimasi efisiensi pajak sesuai regulasi.', 'Complete all materials and assignments.', 70, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('de50f7ca-88d6-4e3a-8c97-3a2274143fd7', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Civil Engineering & Construction Management', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Teknik sipil dan manajemen konstruksi. Termasuk AutoCAD, Civil 3D, estimasi biaya, pengawasan proyek, dan safety management konstruksi.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e0688222-bcd1-4c36-9986-97fd0918874e', 'c67db6de-fc72-4f1e-9e36-9c4c20016143', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Product Management & Development Strategy', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Manajemen produk dan strategi pengembangan. Termasuk product roadmap, user research, A/B testing, dan product analytics untuk growth.', 'Complete all materials and assignments.', 80, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e7383ec6-e432-4c0e-ba45-1bb61c281a5f', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Cybersecurity Fundamentals for Developers', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Learn essential cybersecurity concepts, common vulnerabilities (OWASP Top 10), secure coding practices, and how to protect applications from attacks.', 'Complete all materials and assignments.', 80, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e7f58ee4-46d5-4745-8b03-52f7b077a0cd', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Backend Development with Python & Django/Flask', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Master server-side logic, API development, database management, and authentication using popular Python frameworks like Django or Flask.', 'Complete all materials and assignments.', 90, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e9c3a8ea-88cb-422d-8f3a-893ac38b8f1d', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Accounting Software & Financial Reporting', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Penggunaan software akuntansi profesional, financial reporting, tax compliance, dan analisis keuangan untuk pengambilan keputusan bisnis.', 'Complete all materials and assignments.', 65, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ea74dad9-2da6-4961-a17c-39308884aaa1', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Content Creation & Brand Strategy', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Pembuatan konten kreatif dan strategi brand. Belajar content planning, storytelling, visual design, dan engagement strategy untuk berbagai platform.', 'Complete all materials and assignments.', 50, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ee1858ea-be78-407a-9368-2b7426030160', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7aee038a-8722-4a77-9d3f-afaa15477d23', 'Digital Advertising: Meta Ads, Google Ads & TikTok Ads', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Menguasai strategi periklanan digital di platform utama. Belajar membuat kampanye, analisis data, optimasi iklan, dan strategi konversi yang efektif.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f29cbefa-5b33-49da-9f45-6814b8ef8453', '49634978-2399-46af-9718-f8c76b1e51f6', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Perkakas JavaScript Modern dan Praktik Terbaik', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Lebih dari sekadar dasar. Jelajahi TypeScript untuk keamanan tipe, alat build seperti Vite/Webpack, manajemen paket dengan npm/yarn, kontrol versi dengan Git, dan strategi pengujian otomatis.', 'Complete all materials and assignments.', 75, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f511106b-eb63-446a-a909-ecae0d16d71a', '5979ea51-11ba-45d7-9ffb-48a8a3ebe612', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Software Testing and Quality Assurance Fundamentals', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Understand the software testing lifecycle, different testing types (unit, integration, E2E), test automation strategies, and QA best practices.', 'Complete all materials and assignments.', 65, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f9b6a0f6-99a8-4617-b1a5-e44d7e8b82a9', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'CSS Lanjutan dan Desain UI untuk Pengembang', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Tingkatkan UI Anda dengan teknik CSS canggih seperti animasi, transisi, Sass/SCSS, dan pola desain responsif. Termasuk pengenalan prinsip UI/UX dan sistem desain.', 'Complete all materials and assignments.', 55, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fabbc32a-55ef-4226-ac6e-b314c85555e7', 'f04fa0af-47e1-406c-885f-fda41f5a93ea', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Pembelajaran Mendalam React Development', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Jadilah ahli React. Pelajari Hooks, Context API, Redux/Zustand untuk manajemen state, Next.js untuk server-side rendering, dan pengujian dengan Jest/React Testing Library.', 'Complete all materials and assignments.', 85, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fccef230-ccb7-43e1-aeb0-c90f96859a3a', '6ec9f9e4-c209-4161-a230-ea2a197d5b77', '86bfc52c-80d3-4db0-bb1d-eb708bea2f77', 'fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Cross-Platform Mobile Apps with React Native', NULL, 'https://www.youtube.com/watch?v=GQS7wPujL2k', 'Build native-like mobile applications for both iOS and Android using JavaScript and React Native. Learn about components, navigation, and accessing native device features.', 'Complete all materials and assignments.', 100, '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `course_assignments`
--

CREATE TABLE `course_assignments` (
  `id_course_assignment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_section` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_assignment_resources`
--

CREATE TABLE `course_assignment_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_assignment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_assignment_skills`
--

CREATE TABLE `course_assignment_skills` (
  `id_course_assignment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_batches`
--

CREATE TABLE `course_batches` (
  `id_course_batch` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'closed',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_batches`
--

INSERT INTO `course_batches` (`id_course_batch`, `id_course`, `capacity`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
('001d8066-731e-49b1-adeb-b9a5583f9528', 'fccef230-ccb7-43e1-aeb0-c90f96859a3a', 24, '2025-07-09', '2025-09-23', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('003f6737-1609-4a45-b526-7431eda2141c', '5a47cf09-2ffc-4f70-8e73-808e23138560', 30, '2025-07-14', '2025-09-28', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('00eda07c-f57c-4f3e-b65e-1e81e80328b9', '3ec62b63-868e-40d1-9c04-c18bd984ffdc', 38, '2025-07-04', '2025-08-09', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('01d752ca-1f26-4f49-83e0-df8b52e79e74', 'aee3a7ea-8abe-486f-a24b-6d1bc53df943', 26, '2025-07-26', '2025-08-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('031e9a46-aeb4-41b8-b653-4e57fbb0a5d8', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 50, '2025-04-06', '2025-05-23', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('096d4d2b-5087-4400-a9d9-ee24f62faa8b', '7ad71870-92a1-4187-a909-c5be32df8cdf', 26, '2025-07-29', '2025-10-23', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0aa08d73-354f-4352-97e2-89a7fcb074be', '5a47cf09-2ffc-4f70-8e73-808e23138560', 50, '2025-04-11', '2025-05-25', 'closed', '2025-04-01 00:49:12', '2025-06-01 00:49:12'),
('0b0c4ddd-9404-4385-8beb-8c7412483f37', 'c87576a1-b667-4f7e-9f4d-f22081d1251b', 50, '2025-04-07', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('0be72606-7a1e-4185-95d6-7731879dfedf', '22fa1944-790d-4372-9efc-49cd121b2f34', 45, '2025-07-25', '2025-10-04', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0c776e00-58eb-4d72-9d2c-3709b8f159b1', '407d1e48-848e-485d-a13f-61a08ca18260', 48, '2025-07-09', '2025-09-02', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0ce9dc02-530b-422a-9fed-d304a70eddff', 'fabbc32a-55ef-4226-ac6e-b314c85555e7', 46, '2025-07-02', '2025-09-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0d4512d9-950f-4ca6-a2cf-4e25852a19dc', '7a3cfdcc-0a0a-4d16-8494-4f9681feb2df', 33, '2025-07-02', '2025-08-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0df65ebb-d982-4477-afb2-d78c6a7b0476', '83462653-fb17-47a9-a750-ae6058a7e15e', 47, '2025-07-05', '2025-08-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('0fd72adb-0a76-41a8-8c79-c71715a4f282', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 50, '2025-04-01', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('0fd94dbd-e4b1-4488-bdd4-4ec565b8c9a0', '24a17957-ad2d-4df9-a75c-117c7cae21d9', 25, '2025-07-17', '2025-10-08', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1204cfe1-1301-4be3-8b54-f79912954db9', 'f511106b-eb63-446a-a909-ecae0d16d71a', 50, '2025-04-09', '2025-05-27', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('1378ebf6-f509-40b0-b725-bd72ea108f7b', 'e9c3a8ea-88cb-422d-8f3a-893ac38b8f1d', 30, '2025-07-09', '2025-08-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('139aeeeb-3dd5-4947-8ae5-bd5b6ad6faaf', 'cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 50, '2025-04-03', '2025-05-30', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('15dd5afd-c1bb-43fc-b4d1-a6317ea29280', 'cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 50, '2025-04-03', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('168a70e1-5b8b-4a80-8937-4230916e5ecb', '28c5e670-c2cb-4ec9-bdff-a162b8014e51', 28, '2025-07-04', '2025-08-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('16b4911f-3ab6-471d-870f-b1349c55fd3d', '1f67afea-07a3-4588-96fb-46a709b4c618', 50, '2025-04-10', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('16f32aa9-23d2-4f61-b8a6-420b66f3837f', 'c6fa4096-113c-4657-a974-9b250f5384d3', 49, '2025-07-08', '2025-10-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('17745859-295e-4578-aa83-914b318e5662', '3ec62b63-868e-40d1-9c04-c18bd984ffdc', 39, '2025-07-21', '2025-09-07', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('19d85fd3-c482-4a68-a48a-1e870f8ae6ec', '407d1e48-848e-485d-a13f-61a08ca18260', 30, '2025-07-18', '2025-09-14', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('19dc8ed4-a3f4-457e-b843-9723d98d714b', 'cbb920e4-71bf-4907-8f33-494b92a3f6d2', 22, '2025-07-22', '2025-09-22', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1b27d576-0778-405e-95b7-654c9f7946d8', 'b13d0f3a-4d98-4e27-a2aa-02c0338c071f', 41, '2025-07-25', '2025-09-18', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1b86bf01-0542-4cac-aa33-4014989e9f11', 'f29cbefa-5b33-49da-9f45-6814b8ef8453', 47, '2025-07-31', '2025-08-31', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1c3f7525-241a-4b70-901d-a58e0b082add', 'db332a57-41be-4995-b4a6-4486a0b4efe7', 42, '2025-07-30', '2025-10-16', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1c71d60b-2a15-4a78-a14a-d65c48ae5553', 'bced47d2-6855-4bcc-b969-3f238573ac0b', 50, '2025-04-03', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('1cb4f871-0f44-4269-8aac-f2874c90c545', '599104d9-a453-4b37-9ccf-bbb5ce23637f', 24, '2025-07-12', '2025-08-24', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1cfcb605-edf6-4502-9d6b-e0e94f20364d', '407c50a6-e4ad-4f04-9b18-e1a8a15ea9a1', 44, '2025-07-20', '2025-09-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1e1cd2a8-44b5-44c5-8e29-8541c2f6cbc1', 'b80c4b2e-5597-4e45-9980-f0423b5f2ac7', 35, '2025-07-20', '2025-08-26', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1e726929-fb40-471c-b9d2-746f0923e831', 'cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 46, '2025-07-14', '2025-08-13', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('1f0b14e4-ac7c-4a2b-8d56-132692ec4989', 'c87576a1-b667-4f7e-9f4d-f22081d1251b', 21, '2025-07-08', '2025-09-25', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('23285248-03fa-44b7-88ee-ed8d9e20a906', '21a726b2-ff08-4633-b5a1-944927af40f9', 38, '2025-07-28', '2025-09-11', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('236d8501-b2f7-44f1-bdac-36aa269290a9', '3dabcc21-5bc7-461d-9390-54ed3d8fbcb9', 50, '2025-04-10', '2025-05-30', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('23763d10-fedd-4291-9ddc-672debb8e4d3', 'bd34c364-88a1-4d92-a45d-4c1b62796cf9', 50, '2025-04-06', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('2531da27-877f-440e-bf6d-c3502d96fb7c', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 50, '2025-04-06', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('257eaad4-936d-4633-9b82-88e2ee694707', 'cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 28, '2025-07-07', '2025-08-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('25f2a223-3dda-48f9-a5bc-a7d299d33df7', 'f511106b-eb63-446a-a909-ecae0d16d71a', 50, '2025-04-04', '2025-05-31', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('269e74c3-c6f4-4823-ab79-4599d8d3f723', '7a3cfdcc-0a0a-4d16-8494-4f9681feb2df', 50, '2025-04-02', '2025-05-23', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('2757d101-e497-48fc-abcb-0e1c5c1803d1', '9d3d3d73-4904-4403-bb9c-d1ee25f14c1a', 33, '2025-07-13', '2025-09-21', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('2804111e-1876-4c22-917d-be956930d7bf', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 39, '2025-07-21', '2025-09-26', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('29ffb035-3bc9-4f00-9b46-26d57d0af8e1', '9d3d3d73-4904-4403-bb9c-d1ee25f14c1a', 35, '2025-07-11', '2025-09-01', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('2af62496-f466-4bbe-8407-a7ccf9875142', '3b7aa7f0-3a86-4af9-913c-5c278b207ba3', 50, '2025-04-01', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('2b08b5d6-e89d-46b7-8363-7fef58c28fc7', '16296b02-a284-4d97-9e4b-a3efb1124167', 23, '2025-07-26', '2025-09-18', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('2fd45901-2f3a-47ff-8a95-8b2812bd04a6', '366bc58e-69f2-4dde-b2f2-b6f28c8f8620', 37, '2025-07-27', '2025-10-21', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3113eb2b-2cd4-4718-8026-e37a6bea10d0', '1fb37969-1540-4016-b6da-8d29d7c4fb64', 23, '2025-07-03', '2025-09-18', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('31369b02-e742-4331-bd68-1031fbb9eb12', 'e7383ec6-e432-4c0e-ba45-1bb61c281a5f', 32, '2025-07-18', '2025-09-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('316935e1-7a18-4265-b70b-3568f8f7cf6e', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 50, '2025-04-05', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('32c6c6bf-596a-4130-a2b2-a0b9d0ce22dc', '0bb88742-7a08-4b94-b716-661316b7fe90', 36, '2025-07-29', '2025-10-01', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3947fe34-8e61-41f6-99f7-634797144516', 'e7f58ee4-46d5-4745-8b03-52f7b077a0cd', 40, '2025-07-07', '2025-09-09', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('39512e0f-cdee-430c-9d97-97f0d8279352', 'bd34c364-88a1-4d92-a45d-4c1b62796cf9', 21, '2025-07-06', '2025-08-05', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3972c352-ac9d-4b48-a5d4-d033b12f4ca2', 'd2fa6bdc-23a8-47bc-bc31-87e39db81a84', 50, '2025-04-03', '2025-05-27', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('3a0cb0d1-a9ce-43bb-8509-1d83028fc868', 'b9add5d3-5c4e-458c-ac5b-5314a221bd86', 49, '2025-07-31', '2025-10-15', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3bdc7cf4-1356-4569-a445-1f7818eceb77', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 21, '2025-07-13', '2025-08-23', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('3d3c0dd7-ba27-4279-85a2-8b79644b71e1', 'de50f7ca-88d6-4e3a-8c97-3a2274143fd7', 50, '2025-04-05', '2025-05-30', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('3df0cc6e-3fb5-40ba-b107-4c47c21a3af8', 'fccef230-ccb7-43e1-aeb0-c90f96859a3a', 50, '2025-04-09', '2025-05-31', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('3fada27e-0bdb-4f81-81f4-7f1557d91316', '22fa1944-790d-4372-9efc-49cd121b2f34', 41, '2025-07-15', '2025-09-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('407a8b6a-3ad6-48f3-a194-bf37bf346d5e', 'b80c4b2e-5597-4e45-9980-f0423b5f2ac7', 24, '2025-07-05', '2025-09-22', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4114dc93-6b39-4e63-b432-bc080bfac293', '2e24efdc-e055-4c1a-8385-4993c90d54ea', 36, '2025-07-21', '2025-09-15', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('43868365-c7bd-43dd-b195-cc9c3c1b00c0', '134d9ad3-5417-4274-bcd8-523930b7b1d9', 37, '2025-07-18', '2025-08-24', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('43e5bb1b-f193-4777-92e5-00c7dddb26f2', 'cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb', 43, '2025-07-02', '2025-08-22', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('44728734-596f-4303-8043-7b0604205be7', 'd2fa6bdc-23a8-47bc-bc31-87e39db81a84', 25, '2025-07-30', '2025-09-12', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('44dfd28f-5f3f-4dd1-8071-e3dd293bfcf8', '735af61a-8dd5-4e19-b9d7-c6808cf6b589', 20, '2025-07-02', '2025-08-14', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('458b9380-da9e-41ba-b3c1-7bde4cb531fa', 'a8bdd81a-30fd-468a-9698-bb8f14546807', 26, '2025-07-28', '2025-10-15', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('467e5795-6fae-4361-bb49-0d6b275ff898', 'bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea', 50, '2025-04-03', '2025-05-31', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('47ba6b2f-9606-4b33-9d81-1225e95da03a', 'b13d0f3a-4d98-4e27-a2aa-02c0338c071f', 45, '2025-07-05', '2025-10-01', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('48aa8355-cf31-4664-8177-676d004ba75f', 'db332a57-41be-4995-b4a6-4486a0b4efe7', 50, '2025-04-04', '2025-05-23', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('48f9edb6-02d8-41b9-af0e-8319a3077bad', 'd2fa6bdc-23a8-47bc-bc31-87e39db81a84', 50, '2025-04-10', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('4953524e-0d69-407b-959e-b47dae4c48d0', '83462653-fb17-47a9-a750-ae6058a7e15e', 47, '2025-07-07', '2025-08-07', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4a51a4c5-1654-47df-af80-651956f2b64e', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 37, '2025-07-09', '2025-09-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4ad850fa-75b8-49a3-ae0e-9de7e70175b5', '735af61a-8dd5-4e19-b9d7-c6808cf6b589', 41, '2025-07-05', '2025-09-05', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4b4ae5a0-5d4d-4440-af83-a28f3d23765d', '80869d7e-ad10-4d07-a169-b73a7711eb5a', 21, '2025-07-20', '2025-10-03', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('4fdab8a4-8e24-4bfd-992b-f50c8e6213cb', '407c50a6-e4ad-4f04-9b18-e1a8a15ea9a1', 22, '2025-07-11', '2025-09-06', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5191491e-b42f-427b-8100-016e46472583', '24adbaec-9cd2-4375-9d20-eb3869be4135', 40, '2025-07-08', '2025-09-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('55394887-75d8-4d75-8d86-6176911d42ea', '16296b02-a284-4d97-9e4b-a3efb1124167', 44, '2025-07-06', '2025-10-03', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('571800b1-4115-46d1-83d9-bd0f9a6ef6af', 'de50f7ca-88d6-4e3a-8c97-3a2274143fd7', 35, '2025-07-28', '2025-09-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5a4202a9-04a0-4415-a748-2b1289a37ff2', '24a17957-ad2d-4df9-a75c-117c7cae21d9', 20, '2025-07-07', '2025-10-02', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5d5a438c-127b-4036-b090-57f15f0a890e', '22fa1944-790d-4372-9efc-49cd121b2f34', 50, '2025-04-09', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('5dd3500a-2128-46a2-bc9f-79779d5cc3a9', 'de50f7ca-88d6-4e3a-8c97-3a2274143fd7', 31, '2025-07-28', '2025-09-14', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5dfa7020-4a64-4df5-be94-c21bc2091a05', 'e9c3a8ea-88cb-422d-8f3a-893ac38b8f1d', 24, '2025-07-20', '2025-10-03', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5e0870cd-3656-4e0c-9412-a81cb7d72bd5', '850a1859-e5e5-4766-8799-4ab6f1c502e1', 26, '2025-07-03', '2025-08-12', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5e1e58b5-f078-4a13-b081-9914028ade3b', '2e24efdc-e055-4c1a-8385-4993c90d54ea', 50, '2025-04-09', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('5e3a6ed5-6e4b-4e90-99bb-da696c069964', '407d1e48-848e-485d-a13f-61a08ca18260', 50, '2025-04-07', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('5e8bfada-fbff-448d-bd94-5e0eb0439589', '2e24efdc-e055-4c1a-8385-4993c90d54ea', 26, '2025-07-08', '2025-08-14', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('5f5a770c-9a87-4e7c-ab2b-a95eb911333d', '3dabcc21-5bc7-461d-9390-54ed3d8fbcb9', 29, '2025-07-29', '2025-10-19', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('618eed40-dd66-47f6-bf6d-afe9bf2456d5', 'c87576a1-b667-4f7e-9f4d-f22081d1251b', 39, '2025-07-06', '2025-09-09', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('63728cfe-041d-442d-a291-259233680fff', 'bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea', 25, '2025-07-14', '2025-08-18', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('640f9ab7-ee6d-4f51-9d16-9b74f6a8161f', '33cf2e93-e38d-46fd-bf45-1115ff48396f', 28, '2025-07-09', '2025-08-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('64377562-7af2-4921-8a34-d48d08b7dc67', '1f67afea-07a3-4588-96fb-46a709b4c618', 48, '2025-07-20', '2025-08-23', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6489beae-da3c-4c67-b7c6-67d7a7bb28b1', 'b9add5d3-5c4e-458c-ac5b-5314a221bd86', 36, '2025-07-27', '2025-10-07', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('69110e42-e3c6-4e3a-bbc3-51d3a934c259', 'fccef230-ccb7-43e1-aeb0-c90f96859a3a', 38, '2025-07-17', '2025-10-06', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6916f9eb-d57e-43ea-b4d2-c3f3efad0b22', 'd2fa6bdc-23a8-47bc-bc31-87e39db81a84', 24, '2025-07-17', '2025-09-28', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('69b2037b-1bc1-4272-923e-c6940f450b0b', 'db332a57-41be-4995-b4a6-4486a0b4efe7', 48, '2025-07-28', '2025-10-16', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6b8fd505-d326-4b36-bb74-6fd73a032394', 'a8bdd81a-30fd-468a-9698-bb8f14546807', 33, '2025-07-07', '2025-09-18', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6c7c91b1-6cef-49f3-b201-14be9469f87f', '7130d7c8-5982-4705-99c8-3e80ba22a8e7', 25, '2025-07-31', '2025-09-10', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6e38a5df-caf2-4f6d-880e-87b179d5798d', '7b015802-16a8-4f02-9daa-9f60abcb1620', 32, '2025-07-10', '2025-09-06', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6ef3bd81-b282-4c34-8f65-a2dff11e3364', 'e7383ec6-e432-4c0e-ba45-1bb61c281a5f', 40, '2025-07-03', '2025-08-08', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('6ff21100-7aa4-4e43-ba99-ffb7ec032524', 'f511106b-eb63-446a-a909-ecae0d16d71a', 36, '2025-07-30', '2025-10-22', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7052b693-57b5-46e8-a3f0-d023d61c5342', 'bd34c364-88a1-4d92-a45d-4c1b62796cf9', 50, '2025-04-09', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('7066b127-03ee-491f-9a6a-13d0b34d8aee', '7130d7c8-5982-4705-99c8-3e80ba22a8e7', 24, '2025-07-31', '2025-09-20', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('70d2d9ff-2df7-4d92-95c3-506a06e8d953', 'f29cbefa-5b33-49da-9f45-6814b8ef8453', 49, '2025-07-03', '2025-08-11', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7170eadd-8b14-4c16-b1c7-1f6b8ceaf03d', 'e7f58ee4-46d5-4745-8b03-52f7b077a0cd', 33, '2025-07-16', '2025-09-24', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('72162139-f522-4518-af8e-222813eb056e', '4612fc91-dfe9-4687-8ada-a6cbd9be978e', 45, '2025-07-18', '2025-09-05', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('73a12a25-67e7-45cd-bcc4-4a2381781557', 'de50f7ca-88d6-4e3a-8c97-3a2274143fd7', 50, '2025-04-09', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('7447a5d8-ecb4-4f31-97a7-b1ff9c18d724', '1fb37969-1540-4016-b6da-8d29d7c4fb64', 44, '2025-07-24', '2025-08-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('74befb94-f407-45cc-956c-d9085b444844', 'bced47d2-6855-4bcc-b969-3f238573ac0b', 20, '2025-07-09', '2025-09-25', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('74eacb7e-3dec-424e-b16c-1a94019c4c81', '3ec62b63-868e-40d1-9c04-c18bd984ffdc', 50, '2025-04-08', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('75fbaf5f-102a-4d8f-9a1c-5e827bfc662b', 'cbb920e4-71bf-4907-8f33-494b92a3f6d2', 30, '2025-07-02', '2025-09-03', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('77ecffbb-569a-4ce1-83f5-ef339f38273c', '407d1e48-848e-485d-a13f-61a08ca18260', 27, '2025-07-02', '2025-09-13', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('783b4045-b106-45e9-8a5f-59e128a1997a', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 29, '2025-07-25', '2025-10-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('79a0caa7-de99-4fa8-974b-8cc2e235bddb', 'db332a57-41be-4995-b4a6-4486a0b4efe7', 50, '2025-04-05', '2025-05-30', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('79a51577-82c8-45a2-b3a3-f56c4e62f5fe', '735af61a-8dd5-4e19-b9d7-c6808cf6b589', 50, '2025-04-05', '2025-05-27', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('7cec2bf2-7aa5-483c-b105-9b6e2a8ca71a', '7349e350-849d-437c-b24b-5b176f7eb717', 50, '2025-04-08', '2025-05-29', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('7d04cd5d-27c9-4c80-b57b-b6fd5215eef2', 'b2ac021e-a7f0-4e62-9c5c-d71f6b421ada', 38, '2025-07-26', '2025-09-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7f2f0180-69c0-4040-8844-1f226b553d33', 'aee3a7ea-8abe-486f-a24b-6d1bc53df943', 47, '2025-07-30', '2025-10-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7f4a9936-f215-460e-94a2-93dd5e475505', 'bd34c364-88a1-4d92-a45d-4c1b62796cf9', 25, '2025-07-26', '2025-10-18', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('80374510-b87c-435d-87da-006d8135fb3d', 'b263d541-d387-466a-b40b-6c129c555d84', 46, '2025-07-31', '2025-10-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('8195a1fa-b5f3-46e2-8490-9db5f470f50f', '9e634bcf-ab28-4426-976f-1dc138325b56', 26, '2025-07-13', '2025-09-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('882f4d8e-e79e-4f6b-b84b-64974fe8902a', 'f9b6a0f6-99a8-4617-b1a5-e44d7e8b82a9', 21, '2025-07-04', '2025-10-02', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('896450a5-8dbb-46ed-a74f-46dd5cb3e974', '366bc58e-69f2-4dde-b2f2-b6f28c8f8620', 50, '2025-04-09', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('8a24e7bb-5028-4007-a9b0-dbbb6f53fe05', 'de50f7ca-88d6-4e3a-8c97-3a2274143fd7', 50, '2025-04-03', '2025-06-01', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('8ad7c1a9-ecf0-4d7e-9cbe-2912a04c9751', '7ad71870-92a1-4187-a909-c5be32df8cdf', 37, '2025-07-26', '2025-09-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('8d7b387e-4dea-4c0e-8d1f-859974c784b8', 'b9add5d3-5c4e-458c-ac5b-5314a221bd86', 31, '2025-07-30', '2025-10-25', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('8dc908b6-37ca-48a6-9b2a-c4d9ad57bf4e', 'b80c4b2e-5597-4e45-9980-f0423b5f2ac7', 47, '2025-07-19', '2025-08-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('8f10d247-40b8-4487-8461-86e92b430166', '7349e350-849d-437c-b24b-5b176f7eb717', 46, '2025-07-24', '2025-10-14', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('92d1839d-29a6-411e-b791-e2617ee946b0', 'f511106b-eb63-446a-a909-ecae0d16d71a', 31, '2025-07-09', '2025-09-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('932bdc0e-da91-4b28-bbda-495df823092f', '599104d9-a453-4b37-9ccf-bbb5ce23637f', 24, '2025-07-11', '2025-09-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('93c1e899-a439-48fc-b5fa-341a2e7f618d', '4bf07ad3-2907-483a-9355-575a0f951633', 25, '2025-07-23', '2025-10-20', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('94411167-4c4c-40f9-9c51-a0835b2addc3', '28c5e670-c2cb-4ec9-bdff-a162b8014e51', 27, '2025-07-18', '2025-10-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('950a7cca-366a-478e-aeed-a4ec23aebc84', '5a47cf09-2ffc-4f70-8e73-808e23138560', 50, '2025-04-06', '2025-05-24', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('9671ee97-07de-48cf-a08a-1c65e4fbac84', 'f29cbefa-5b33-49da-9f45-6814b8ef8453', 40, '2025-07-25', '2025-09-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('97919f88-abdf-4950-b68e-61d969eb1957', 'c87576a1-b667-4f7e-9f4d-f22081d1251b', 42, '2025-07-26', '2025-10-20', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('98c28d1a-9257-46cb-91ca-a0e5a5778c63', '407d1e48-848e-485d-a13f-61a08ca18260', 50, '2025-04-10', '2025-05-23', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('99d4afe4-301c-4f53-8a1e-ce882091419f', 'c6fa4096-113c-4657-a974-9b250f5384d3', 31, '2025-07-31', '2025-09-14', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('9b60b4b9-72c8-4228-bf5a-055f33f775cf', '22fa1944-790d-4372-9efc-49cd121b2f34', 21, '2025-07-27', '2025-10-07', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('9d07deeb-eebb-4a57-9413-fcbb273a3627', '5a47cf09-2ffc-4f70-8e73-808e23138560', 31, '2025-07-30', '2025-10-21', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a06121c1-7139-47cf-8098-b6421030d840', '9e634bcf-ab28-4426-976f-1dc138325b56', 41, '2025-07-05', '2025-09-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a0844148-07ce-4c21-90ff-f45a74f30ba6', 'db332a57-41be-4995-b4a6-4486a0b4efe7', 24, '2025-07-09', '2025-10-05', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a1111a08-3be5-4409-9505-f002f99a844f', '1f67afea-07a3-4588-96fb-46a709b4c618', 36, '2025-07-03', '2025-08-26', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a1304869-a4d0-4e5d-9b4c-01fb6c300bf1', '4bf07ad3-2907-483a-9355-575a0f951633', 46, '2025-07-10', '2025-10-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a1a39e16-cd09-4668-9f3a-1edcb385b081', '2e24efdc-e055-4c1a-8385-4993c90d54ea', 50, '2025-04-07', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('a30df2ef-a12d-4980-988c-6351541feb01', 'b263d541-d387-466a-b40b-6c129c555d84', 26, '2025-07-15', '2025-08-14', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a323ff1c-5729-4483-a08f-574843995026', '1db835ae-fd15-4f8a-b1f0-f5bb1951c99e', 44, '2025-07-10', '2025-09-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a34e9919-1c9c-4204-be97-ed9d3f175572', '850a1859-e5e5-4766-8799-4ab6f1c502e1', 38, '2025-07-05', '2025-08-22', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a6c8c445-4a81-4683-90c5-72d6cdfefbb6', '7a3cfdcc-0a0a-4d16-8494-4f9681feb2df', 32, '2025-07-20', '2025-10-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a6f3ad03-2033-4827-ab8b-b3deacdbe090', 'fabbc32a-55ef-4226-ac6e-b314c85555e7', 43, '2025-07-17', '2025-09-19', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a7039717-408a-4244-968c-11e2a6130efd', '1d6ad670-7a16-4419-8b89-92f83bc150c1', 38, '2025-07-07', '2025-09-02', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('a9b7439d-e94f-4522-9037-0f693f203b6c', 'ab93cb20-77a9-4d8d-afa5-77caa354227c', 50, '2025-04-09', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('aa6cbdab-db4c-4f62-8eb5-64ff3d50fac3', 'b2ac021e-a7f0-4e62-9c5c-d71f6b421ada', 33, '2025-07-27', '2025-10-17', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ab38a3a9-74d2-40cb-afd9-12e59de22c0d', '9d3d3d73-4904-4403-bb9c-d1ee25f14c1a', 31, '2025-07-31', '2025-09-26', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('adba715c-4c36-4e5b-a553-469d46681def', 'd4ec9922-c8f4-4f14-bd2b-dbbd574825df', 50, '2025-04-05', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('ae40f48f-9d8c-46a0-b7b7-5413227a7e92', '21a726b2-ff08-4633-b5a1-944927af40f9', 50, '2025-04-11', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('b0f4e569-e7a4-4426-8a68-1a6c74116c51', '21a726b2-ff08-4633-b5a1-944927af40f9', 30, '2025-07-31', '2025-09-16', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b1d2f950-d8e1-4a35-83e3-01f55a49505f', '407d1e48-848e-485d-a13f-61a08ca18260', 50, '2025-04-09', '2025-05-27', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('b23efaac-25ce-4445-bfbd-c901d26212f6', '24adbaec-9cd2-4375-9d20-eb3869be4135', 37, '2025-07-13', '2025-08-29', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b25c3c87-2744-4cba-b4b1-a0ef515368bc', '28c5e670-c2cb-4ec9-bdff-a162b8014e51', 44, '2025-07-20', '2025-08-19', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b3b0b6ab-3233-4ec6-9a7d-f82a7d2ba41c', '24a17957-ad2d-4df9-a75c-117c7cae21d9', 50, '2025-04-05', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('b608e8a8-1553-46c1-96e8-814263b3ab2e', '7a3cfdcc-0a0a-4d16-8494-4f9681feb2df', 28, '2025-07-11', '2025-08-26', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('b989ec3b-9561-4a16-a647-6ce39e73297f', '4612fc91-dfe9-4687-8ada-a6cbd9be978e', 50, '2025-04-06', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('bb5c76ab-0864-4a1d-abb3-47267982f194', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 50, '2025-04-01', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('bb772977-60dc-4063-8239-413b81fef97e', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 45, '2025-07-03', '2025-09-08', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bbab85c1-b144-4107-805d-ae67d6e46b5d', '4612fc91-dfe9-4687-8ada-a6cbd9be978e', 33, '2025-07-31', '2025-09-04', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bc9753f3-f2b7-4daf-97db-7bf115aeff95', 'd4ec9922-c8f4-4f14-bd2b-dbbd574825df', 39, '2025-07-22', '2025-09-27', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bd04a516-01c6-474e-a569-a09f4da89c2c', 'e0688222-bcd1-4c36-9986-97fd0918874e', 40, '2025-07-18', '2025-09-06', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bd52b04d-a20c-4e04-9ace-5bea07698dd3', 'bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea', 20, '2025-07-29', '2025-10-01', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bd6c260f-7d90-4302-a7df-593c9190a331', '366bc58e-69f2-4dde-b2f2-b6f28c8f8620', 22, '2025-07-16', '2025-08-18', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('bf4d9de3-13d4-4fc7-a686-fcd6f540bc29', '24adbaec-9cd2-4375-9d20-eb3869be4135', 40, '2025-07-27', '2025-09-29', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c1a6e5d5-134c-41ca-9a76-e1727c3c5283', '407c50a6-e4ad-4f04-9b18-e1a8a15ea9a1', 50, '2025-04-02', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('c38e8fad-0841-436c-b205-41872efbd2b0', '1d6ad670-7a16-4419-8b89-92f83bc150c1', 21, '2025-07-23', '2025-09-07', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c42bfce7-91b4-4ed6-93e7-b20c6222682f', 'f511106b-eb63-446a-a909-ecae0d16d71a', 26, '2025-07-23', '2025-09-20', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c4d90c06-80ab-452a-be4b-58d6581d511f', 'aee3a7ea-8abe-486f-a24b-6d1bc53df943', 39, '2025-07-31', '2025-10-02', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('c8213df8-7151-4dd4-8029-f144a8b01de3', '1d6ad670-7a16-4419-8b89-92f83bc150c1', 38, '2025-07-13', '2025-09-14', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ca0ed3d3-2ad5-4a81-b39c-12ae322d2490', '3b7aa7f0-3a86-4af9-913c-5c278b207ba3', 50, '2025-04-08', '2025-05-29', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('cb0efeb6-30d3-497c-815b-4ed9f650e092', 'db2ef114-9370-42eb-9bd8-cac04d3df248', 50, '2025-04-05', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('cb451d58-364c-4280-8fac-6d6994412583', '366bc58e-69f2-4dde-b2f2-b6f28c8f8620', 50, '2025-04-09', '2025-05-29', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('cbfbf81d-8922-4463-9583-79fad41cea6e', 'ea74dad9-2da6-4961-a17c-39308884aaa1', 43, '2025-07-05', '2025-08-10', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('cd78805a-4abf-49a7-8547-62674ac1fb3f', 'aee3a7ea-8abe-486f-a24b-6d1bc53df943', 50, '2025-04-11', '2025-05-29', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('cf544a46-9fdd-4229-be12-8e935bd2a0b7', '3dabcc21-5bc7-461d-9390-54ed3d8fbcb9', 33, '2025-07-31', '2025-08-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d05bb139-505a-488d-a2a3-8807091f99fa', 'e0688222-bcd1-4c36-9986-97fd0918874e', 29, '2025-07-23', '2025-10-13', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d0faa1b3-ad81-40fc-8d55-c4d11273c032', '4bf07ad3-2907-483a-9355-575a0f951633', 40, '2025-07-04', '2025-08-12', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d1434dbb-9d7a-44c6-9d5a-641bafdd8f48', 'b13d0f3a-4d98-4e27-a2aa-02c0338c071f', 25, '2025-07-23', '2025-08-25', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d24251cd-fa50-45a4-9682-5822dcb07dcc', 'c6fa4096-113c-4657-a974-9b250f5384d3', 50, '2025-04-05', '2025-05-24', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('d345ab10-f79f-459b-9ec6-c7c56dae1fb8', 'fabbc32a-55ef-4226-ac6e-b314c85555e7', 50, '2025-04-10', '2025-05-26', 'closed', '2025-04-01 00:49:12', '2025-06-01 00:49:12'),
('d3815fa9-c4c8-46d2-9534-155ddd460004', '4612fc91-dfe9-4687-8ada-a6cbd9be978e', 34, '2025-07-03', '2025-08-13', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d424b3e9-ced8-4575-ad6e-113f8cf96f47', '67cafd87-fd65-483a-b9af-5900a2d1868d', 25, '2025-07-12', '2025-09-12', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d4e42805-96d0-404a-b16c-8223a1c3721d', '7349e350-849d-437c-b24b-5b176f7eb717', 44, '2025-07-17', '2025-10-03', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d647dda4-2da1-47e0-9bf0-344227b0c882', 'e7383ec6-e432-4c0e-ba45-1bb61c281a5f', 50, '2025-07-10', '2025-10-07', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d7300dda-ef49-48d7-b739-8cd46175cb7b', '24a17957-ad2d-4df9-a75c-117c7cae21d9', 40, '2025-07-26', '2025-10-09', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d7ef6918-037d-4ee7-b149-a0f78243d566', '67cafd87-fd65-483a-b9af-5900a2d1868d', 26, '2025-07-09', '2025-08-10', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('d961ad23-2fcc-48a7-9103-53ead5303762', '80869d7e-ad10-4d07-a169-b73a7711eb5a', 49, '2025-07-03', '2025-08-15', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('db057471-c410-417f-bc8b-bceebdcd777d', '7ad71870-92a1-4187-a909-c5be32df8cdf', 50, '2025-04-07', '2025-05-31', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('ddd2feb8-d6c7-436c-9a62-fd034fd9691b', '0bb88742-7a08-4b94-b716-661316b7fe90', 21, '2025-07-29', '2025-10-15', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e07b039b-9504-47da-ae0c-a8b7d41bf5a2', '33cf2e93-e38d-46fd-bf45-1115ff48396f', 34, '2025-07-31', '2025-10-02', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e172f5f0-214f-46d1-a7a7-b653eace9556', 'd2fa6bdc-23a8-47bc-bc31-87e39db81a84', 24, '2025-07-21', '2025-10-18', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e2513e8e-5a75-4031-adfd-eaf86556a4bb', 'd4ec9922-c8f4-4f14-bd2b-dbbd574825df', 24, '2025-07-09', '2025-09-22', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e3e024ef-003b-4cf0-ae97-3fea5af4b50c', 'cbb920e4-71bf-4907-8f33-494b92a3f6d2', 50, '2025-04-10', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('e4555260-3376-4203-9e4f-d8e10216772d', 'ee1858ea-be78-407a-9368-2b7426030160', 23, '2025-07-12', '2025-09-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e5bb1e31-bf24-452b-890c-babed9ffae88', 'a8bdd81a-30fd-468a-9698-bb8f14546807', 39, '2025-07-26', '2025-10-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e69f5497-ee2b-439f-b11a-5a3e4c285e12', 'ee1858ea-be78-407a-9368-2b7426030160', 40, '2025-07-30', '2025-09-12', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e6d2c971-55bf-4822-82d8-868069414f4d', '407c50a6-e4ad-4f04-9b18-e1a8a15ea9a1', 23, '2025-07-13', '2025-10-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e9889da6-3705-4977-afe1-78e69942fa62', 'bd34c364-88a1-4d92-a45d-4c1b62796cf9', 42, '2025-07-10', '2025-08-12', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ea21a993-017f-473f-af4b-5ed4e7d24e60', 'ea74dad9-2da6-4961-a17c-39308884aaa1', 36, '2025-07-29', '2025-09-17', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('eb1bc351-a239-480a-be7e-3f910ea3327a', '7130d7c8-5982-4705-99c8-3e80ba22a8e7', 33, '2025-07-07', '2025-08-21', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('eb929e35-9ac3-43ff-a31e-aeba0d7170ed', 'f9b6a0f6-99a8-4617-b1a5-e44d7e8b82a9', 48, '2025-07-12', '2025-10-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('eb9a5482-5a00-4fb0-9192-5a8249fa833e', '3dabcc21-5bc7-461d-9390-54ed3d8fbcb9', 44, '2025-07-13', '2025-08-23', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('ecc0b5c1-3744-49d3-b582-4d518f099e63', 'd4ec9922-c8f4-4f14-bd2b-dbbd574825df', 50, '2025-04-09', '2025-05-30', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('ee5258a3-2bfa-4166-abc5-c91fed639fbd', 'e0688222-bcd1-4c36-9986-97fd0918874e', 50, '2025-04-07', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('efc3e6c6-0c5c-4383-893f-c8d808da357d', '2e24efdc-e055-4c1a-8385-4993c90d54ea', 50, '2025-04-06', '2025-05-28', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f07493a3-c53f-4b10-93a9-71f5756435a9', '3b7aa7f0-3a86-4af9-913c-5c278b207ba3', 46, '2025-07-03', '2025-09-01', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f291dcb7-539d-4be5-9285-d65bffaf03f1', 'f511106b-eb63-446a-a909-ecae0d16d71a', 50, '2025-04-04', '2025-05-24', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f445a14e-7359-41d1-baf5-bd5f89be030b', '1db835ae-fd15-4f8a-b1f0-f5bb1951c99e', 50, '2025-07-14', '2025-09-18', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f4d29da2-ed1a-451e-b8c8-d21d61184d8e', 'ea74dad9-2da6-4961-a17c-39308884aaa1', 21, '2025-07-17', '2025-09-30', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f513b89a-d7cf-4a68-a491-7765f3fe47e8', '7b015802-16a8-4f02-9daa-9f60abcb1620', 26, '2025-07-11', '2025-08-16', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f59a8843-a8be-484a-8069-2a940503dc69', '22fa1944-790d-4372-9efc-49cd121b2f34', 50, '2025-04-11', '2025-05-25', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f5b4abb6-cab6-4352-9523-b20849070bbc', '134d9ad3-5417-4274-bcd8-523930b7b1d9', 32, '2025-07-09', '2025-09-16', 'closed', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f63a9955-e8c0-49b2-bf94-3744d165fd5d', 'd22cb36b-bf33-488a-80ad-7df222aa65ba', 50, '2025-04-02', '2025-05-26', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f68eaf2e-0cd4-4ec7-b6fd-2ccf3abf1180', '3b7aa7f0-3a86-4af9-913c-5c278b207ba3', 21, '2025-07-18', '2025-08-24', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('f84491a1-048f-485b-b8af-00a3b0370747', 'e0688222-bcd1-4c36-9986-97fd0918874e', 50, '2025-04-09', '2025-05-23', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f94d9dd4-b526-4323-8f65-90a6fe673e5d', '83462653-fb17-47a9-a750-ae6058a7e15e', 50, '2025-04-09', '2025-05-22', 'closed', '2025-04-01 00:49:13', '2025-06-01 00:49:13'),
('f9c4f5d0-5abd-479d-b05f-cec99eed6e50', 'd22cb36b-bf33-488a-80ad-7df222aa65ba', 22, '2025-07-16', '2025-08-24', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fab181dd-5f7f-4d6e-89be-87e4a0fa94a1', 'd22cb36b-bf33-488a-80ad-7df222aa65ba', 24, '2025-07-25', '2025-09-20', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fb389f1a-5444-4e93-b587-ab6c9ba71864', 'bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea', 26, '2025-07-08', '2025-09-25', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fb797cb7-d958-4988-80e7-d5e0cae1bbc6', 'bced47d2-6855-4bcc-b969-3f238573ac0b', 21, '2025-07-19', '2025-09-22', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fc9f9d5f-9164-45e1-bcc5-68307325fd01', 'bced47d2-6855-4bcc-b969-3f238573ac0b', 38, '2025-07-17', '2025-08-27', 'open', '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollments`
--

CREATE TABLE `course_enrollments` (
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_batch` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('enrolled','completed','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `completed_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_enrollments`
--

INSERT INTO `course_enrollments` (`id_course_enrollment`, `id_course_batch`, `id_student`, `start_date`, `end_date`, `status`, `completed_at`, `created_at`, `updated_at`) VALUES
('02149b56-09dc-4bb4-9f4f-8ac5980baee5', '2531da27-877f-440e-bf6d-c3502d96fb7c', 'ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '2025-04-02', '2025-09-01', 'completed', '2025-08-01', '2025-04-02 00:49:13', '2025-08-01 00:49:13'),
('029c9cad-4b90-4d24-9616-09a62e8baf6e', '74eacb7e-3dec-424e-b16c-1a94019c4c81', '3050c23f-2d18-4506-ab97-426d80bdca47', '2025-04-10', '2025-08-13', 'completed', '2025-07-13', '2025-04-10 00:49:13', '2025-07-13 00:49:13'),
('02fba3a0-d0cb-461d-a634-a39c4fefc689', 'e3e024ef-003b-4cf0-ae97-3fea5af4b50c', 'e03cc1c1-e72c-40bd-b1c7-723010f54bea', '2025-04-05', '2025-08-24', 'completed', '2025-07-24', '2025-04-05 00:49:13', '2025-07-24 00:49:13'),
('065f77eb-c19d-4de7-8055-e78406e07149', '5e3a6ed5-6e4b-4e90-99bb-da696c069964', 'ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '2025-04-08', '2025-07-26', 'completed', '2025-06-26', '2025-04-08 00:49:13', '2025-06-26 00:49:13'),
('08e5fdd7-9e15-40ba-81e1-5a9480ef7492', '8a24e7bb-5028-4007-a9b0-dbbb6f53fe05', '5c335033-a9a4-42e8-8615-04bcaaf03fd9', '2025-04-04', '2025-08-15', 'completed', '2025-07-15', '2025-04-04 00:49:13', '2025-07-15 00:49:13'),
('0e6d78be-483d-45eb-940b-63995688b561', '316935e1-7a18-4265-b70b-3568f8f7cf6e', 'ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '2025-04-03', '2025-07-18', 'completed', '2025-06-18', '2025-04-03 00:49:13', '2025-06-18 00:49:13'),
('143abf51-81df-4eae-b1b8-36a534235849', '7cec2bf2-7aa5-483c-b105-9b6e2a8ca71a', '699207ed-8438-45be-81ac-132bd193b023', '2025-04-03', '2025-08-02', 'completed', '2025-07-02', '2025-04-03 00:49:13', '2025-07-02 00:49:13'),
('163cfdab-27ff-42cd-9819-83b33da3be10', '79a0caa7-de99-4fa8-974b-8cc2e235bddb', '148385e6-034e-4739-b30e-6bfeec3dab15', '2025-04-05', '2025-07-23', 'completed', '2025-06-23', '2025-04-05 00:49:13', '2025-06-23 00:49:13'),
('1fce6052-19e3-4c81-85fa-5240363fdb96', '2af62496-f466-4bbe-8407-a7ccf9875142', '8ec796ee-27c9-47a6-8b99-8418e1026f3a', '2025-04-02', '2025-07-12', 'completed', '2025-06-12', '2025-04-02 00:49:13', '2025-06-12 00:49:13'),
('23500a18-e606-46e4-a481-d14c1c3a4cb1', 'f291dcb7-539d-4be5-9285-d65bffaf03f1', '6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '2025-04-02', '2025-07-17', 'completed', '2025-06-17', '2025-04-02 00:49:13', '2025-06-17 00:49:13'),
('282a6274-9a57-4185-bfc6-624c7d5f68f4', 'ae40f48f-9d8c-46a0-b7b7-5413227a7e92', 'd6c44156-2938-4ac7-982a-ee06ac83eda9', '2025-04-03', '2025-07-29', 'completed', '2025-06-29', '2025-04-03 00:49:13', '2025-06-29 00:49:13'),
('35a7bed6-cb71-452a-b055-55c3c9481b10', '48aa8355-cf31-4664-8177-676d004ba75f', 'd6c44156-2938-4ac7-982a-ee06ac83eda9', '2025-04-04', '2025-07-20', 'completed', '2025-06-20', '2025-04-04 00:49:13', '2025-06-20 00:49:13'),
('36c71589-71f0-422d-8172-e70d16527399', '25f2a223-3dda-48f9-a5bc-a7d299d33df7', '5c335033-a9a4-42e8-8615-04bcaaf03fd9', '2025-04-06', '2025-07-23', 'completed', '2025-06-23', '2025-04-06 00:49:13', '2025-06-23 00:49:13'),
('370cc54f-8357-4309-b870-d88b27081c4a', '5e1e58b5-f078-4a13-b081-9914028ade3b', '5dc656b7-8b04-4c45-ad0f-d9ff58145cb2', '2025-04-02', '2025-08-09', 'completed', '2025-07-09', '2025-04-02 00:49:13', '2025-07-09 00:49:13'),
('37a4282f-7985-4559-bdb7-20837df61a18', 'cb0efeb6-30d3-497c-815b-4ed9f650e092', '8ce9ec62-f9af-4182-9a2a-ec5343356aec', '2025-04-03', '2025-09-06', 'completed', '2025-08-06', '2025-04-03 00:49:13', '2025-08-06 00:49:13'),
('384dadfd-0a87-4df2-842b-3e8ad2bd4801', '16b4911f-3ab6-471d-870f-b1349c55fd3d', '42c6ecc1-152f-493e-9d7d-93cb5c70cb35', '2025-04-02', '2025-07-03', 'completed', '2025-06-03', '2025-04-02 00:49:13', '2025-06-03 00:49:13'),
('3a4c2ac7-b40d-42e4-adec-f7c2f7400c24', 'efc3e6c6-0c5c-4383-893f-c8d808da357d', 'e2d0bd67-762c-4526-a0d0-0ca2d8b28e72', '2025-04-08', '2025-08-07', 'completed', '2025-07-07', '2025-04-08 00:49:13', '2025-07-07 00:49:13'),
('3c12768e-794d-4160-98ea-09b8f4c41e21', 'db057471-c410-417f-bc8b-bceebdcd777d', 'ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '2025-04-03', '2025-07-05', 'completed', '2025-06-05', '2025-04-03 00:49:13', '2025-06-05 00:49:13'),
('3c1f6dad-a272-428f-a7e5-1e8274f9253e', 'f84491a1-048f-485b-b8af-00a3b0370747', '3050c23f-2d18-4506-ab97-426d80bdca47', '2025-04-01', '2025-07-25', 'completed', '2025-06-25', '2025-04-01 00:49:13', '2025-06-25 00:49:13'),
('3ff22d97-d068-4517-aa82-363090b959f3', 'f94d9dd4-b526-4323-8f65-90a6fe673e5d', '6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '2025-04-04', '2025-08-18', 'completed', '2025-07-18', '2025-04-04 00:49:13', '2025-07-18 00:49:13'),
('40badfb5-a3e3-4294-a18d-90d7fea8cd48', '950a7cca-366a-478e-aeed-a4ec23aebc84', '8ec796ee-27c9-47a6-8b99-8418e1026f3a', '2025-04-02', '2025-07-06', 'completed', '2025-06-06', '2025-04-02 00:49:13', '2025-06-06 00:49:13'),
('41542261-262b-461b-bce3-48be68688370', 'b3b0b6ab-3233-4ec6-9a7d-f82a7d2ba41c', '6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '2025-04-01', '2025-07-14', 'completed', '2025-06-14', '2025-04-01 00:49:13', '2025-06-14 00:49:13'),
('41c34783-ebe0-4a69-8474-bc0d900840d1', '0aa08d73-354f-4352-97e2-89a7fcb074be', '3050c23f-2d18-4506-ab97-426d80bdca47', '2025-04-05', '2025-07-17', 'completed', '2025-06-17', '2025-04-05 00:49:12', '2025-06-17 00:49:12'),
('4c162c69-bc48-457a-9e28-f7ab5334053b', 'ca0ed3d3-2ad5-4a81-b39c-12ae322d2490', '5c335033-a9a4-42e8-8615-04bcaaf03fd9', '2025-04-08', '2025-07-17', 'completed', '2025-06-17', '2025-04-08 00:49:13', '2025-06-17 00:49:13'),
('4c2b05ae-59ec-4e9d-8ed6-bd7f6ba3fb42', '467e5795-6fae-4361-bb49-0d6b275ff898', '22571f0d-cde3-4e73-839d-d1fb1fe0a7bd', '2025-04-02', '2025-08-18', 'completed', '2025-07-18', '2025-04-02 00:49:13', '2025-07-18 00:49:13'),
('4ed6e1d1-55d8-4876-a96a-3dca5581962b', '0b0c4ddd-9404-4385-8beb-8c7412483f37', '8ce9ec62-f9af-4182-9a2a-ec5343356aec', '2025-04-04', '2025-07-29', 'completed', '2025-06-29', '2025-04-04 00:49:13', '2025-06-29 00:49:13'),
('50c30944-be20-470d-b989-96520f5c743f', '3d3c0dd7-ba27-4279-85a2-8b79644b71e1', '699207ed-8438-45be-81ac-132bd193b023', '2025-04-05', '2025-08-15', 'completed', '2025-07-15', '2025-04-05 00:49:13', '2025-07-15 00:49:13'),
('52709749-2283-40e9-bba8-d3201e405eb2', '5d5a438c-127b-4036-b090-57f15f0a890e', '22571f0d-cde3-4e73-839d-d1fb1fe0a7bd', '2025-04-02', '2025-07-15', 'completed', '2025-06-15', '2025-04-02 00:49:13', '2025-06-15 00:49:13'),
('5c11c05a-7b06-484b-b1b4-96bb42006ac1', '48f9edb6-02d8-41b9-af0e-8319a3077bad', '22571f0d-cde3-4e73-839d-d1fb1fe0a7bd', '2025-04-04', '2025-07-20', 'completed', '2025-06-20', '2025-04-04 00:49:13', '2025-06-20 00:49:13'),
('5db219f2-1647-4b70-bec8-c9ffcb096006', '1204cfe1-1301-4be3-8b54-f79912954db9', '699207ed-8438-45be-81ac-132bd193b023', '2025-04-01', '2025-07-20', 'completed', '2025-06-20', '2025-04-01 00:49:13', '2025-06-20 00:49:13'),
('65b3fd39-18a5-49e3-be7c-f72d6cb6a03f', '3df0cc6e-3fb5-40ba-b107-4c47c21a3af8', '699207ed-8438-45be-81ac-132bd193b023', '2025-04-11', '2025-08-31', 'completed', '2025-07-31', '2025-04-11 00:49:13', '2025-07-31 00:49:13'),
('6e029e24-e25b-4e5c-a3c9-0d61b240d798', '269e74c3-c6f4-4823-ab79-4599d8d3f723', 'd6c44156-2938-4ac7-982a-ee06ac83eda9', '2025-04-07', '2025-08-17', 'completed', '2025-07-17', '2025-04-07 00:49:13', '2025-07-17 00:49:13'),
('75677570-608f-4fe9-8c94-0085fa1493aa', '896450a5-8dbb-46ed-a74f-46dd5cb3e974', '8ec796ee-27c9-47a6-8b99-8418e1026f3a', '2025-04-09', '2025-08-26', 'completed', '2025-07-26', '2025-04-09 00:49:13', '2025-07-26 00:49:13'),
('7e4fb947-7042-4c3a-b460-2fc88051e7cc', '3972c352-ac9d-4b48-a5d4-d033b12f4ca2', 'e03cc1c1-e72c-40bd-b1c7-723010f54bea', '2025-04-10', '2025-08-01', 'completed', '2025-07-01', '2025-04-10 00:49:13', '2025-07-01 00:49:13'),
('808193f9-5bed-4c5e-b036-18d7ef187cf7', 'bb5c76ab-0864-4a1d-abb3-47267982f194', '8ec796ee-27c9-47a6-8b99-8418e1026f3a', '2025-04-01', '2025-08-27', 'completed', '2025-07-27', '2025-04-01 00:49:13', '2025-07-27 00:49:13'),
('81247ea8-04ad-4699-af79-b1e7774ab0c2', 'ecc0b5c1-3744-49d3-b582-4d518f099e63', '93c66be5-6bb0-4bba-8c73-96e3568e062c', '2025-04-03', '2025-08-12', 'completed', '2025-07-12', '2025-04-03 00:49:13', '2025-07-12 00:49:13'),
('85f1beb1-63fc-4806-abee-1779eb4731a6', '139aeeeb-3dd5-4947-8ae5-bd5b6ad6faaf', '699207ed-8438-45be-81ac-132bd193b023', '2025-04-09', '2025-08-05', 'completed', '2025-07-05', '2025-04-09 00:49:13', '2025-07-05 00:49:13'),
('87cc793f-eca3-4bc0-ad1b-870d3f20c4c4', 'b989ec3b-9561-4a16-a647-6ce39e73297f', '42c6ecc1-152f-493e-9d7d-93cb5c70cb35', '2025-04-05', '2025-07-27', 'completed', '2025-06-27', '2025-04-05 00:49:13', '2025-06-27 00:49:13'),
('8dd1d562-ac16-4436-9a4f-1654c2ce6a6f', 'd345ab10-f79f-459b-9ec6-c7c56dae1fb8', '3050c23f-2d18-4506-ab97-426d80bdca47', '2025-04-05', '2025-08-11', 'completed', '2025-07-11', '2025-04-05 00:49:12', '2025-07-11 00:49:12'),
('8e793982-8a29-42e2-8ba2-22c828ac3bf7', 'a1a39e16-cd09-4668-9f3a-1edcb385b081', 'e03cc1c1-e72c-40bd-b1c7-723010f54bea', '2025-04-04', '2025-08-11', 'completed', '2025-07-11', '2025-04-04 00:49:13', '2025-07-11 00:49:13'),
('95d38596-13e3-4d23-86a9-b8080af0c741', '1c71d60b-2a15-4a78-a14a-d65c48ae5553', '5c335033-a9a4-42e8-8615-04bcaaf03fd9', '2025-04-10', '2025-07-25', 'completed', '2025-06-25', '2025-04-10 00:49:13', '2025-06-25 00:49:13'),
('99d63b43-8628-472c-add8-e78967e19e80', '7052b693-57b5-46e8-a3f0-d023d61c5342', 'e2d0bd67-762c-4526-a0d0-0ca2d8b28e72', '2025-04-07', '2025-08-05', 'completed', '2025-07-05', '2025-04-07 00:49:13', '2025-07-05 00:49:13'),
('9f33dfe5-f521-4752-ac69-96ff0994a1e4', 'd24251cd-fa50-45a4-9682-5822dcb07dcc', '5dc656b7-8b04-4c45-ad0f-d9ff58145cb2', '2025-04-11', '2025-07-15', 'completed', '2025-06-15', '2025-04-11 00:49:13', '2025-06-15 00:49:13'),
('a5ec5354-1d04-463d-bb71-cd2259d621ff', 'cb451d58-364c-4280-8fac-6d6994412583', '148385e6-034e-4739-b30e-6bfeec3dab15', '2025-04-02', '2025-08-15', 'completed', '2025-07-15', '2025-04-02 00:49:13', '2025-07-15 00:49:13'),
('a60c50c8-a7ac-4751-94d9-cb7fd2c75902', 'c1a6e5d5-134c-41ca-9a76-e1727c3c5283', 'e2d0bd67-762c-4526-a0d0-0ca2d8b28e72', '2025-04-08', '2025-09-02', 'completed', '2025-08-02', '2025-04-08 00:49:13', '2025-08-02 00:49:13'),
('accf1e74-e2e1-4de2-9777-a77f682c110d', '15dd5afd-c1bb-43fc-b4d1-a6317ea29280', '93c66be5-6bb0-4bba-8c73-96e3568e062c', '2025-04-05', '2025-08-08', 'completed', '2025-07-08', '2025-04-05 00:49:13', '2025-07-08 00:49:13'),
('ad132479-7809-49ed-93fe-3e6ca2da79b2', '031e9a46-aeb4-41b8-b653-4e57fbb0a5d8', '6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '2025-04-01', '2025-07-19', 'completed', '2025-06-19', '2025-04-01 00:49:13', '2025-06-19 00:49:13'),
('ad81947c-19f6-49db-a17d-6c1184e5d3b9', '79a51577-82c8-45a2-b3a3-f56c4e62f5fe', 'd6c44156-2938-4ac7-982a-ee06ac83eda9', '2025-04-11', '2025-07-08', 'completed', '2025-06-08', '2025-04-11 00:49:13', '2025-06-08 00:49:13'),
('b021e400-ece4-4350-a047-3a38a28853a4', '0fd72adb-0a76-41a8-8c79-c71715a4f282', '5dc656b7-8b04-4c45-ad0f-d9ff58145cb2', '2025-04-03', '2025-07-18', 'completed', '2025-06-18', '2025-04-03 00:49:13', '2025-06-18 00:49:13'),
('be83710a-23e9-4a90-94d1-fcbec12e6aef', 'a9b7439d-e94f-4522-9037-0f693f203b6c', '22571f0d-cde3-4e73-839d-d1fb1fe0a7bd', '2025-04-02', '2025-07-18', 'completed', '2025-06-18', '2025-04-02 00:49:13', '2025-06-18 00:49:13'),
('c7cacbc0-8123-4110-a8af-5060dd705cd8', '73a12a25-67e7-45cd-bcc4-4a2381781557', '8ce9ec62-f9af-4182-9a2a-ec5343356aec', '2025-04-11', '2025-08-25', 'completed', '2025-07-25', '2025-04-11 00:49:13', '2025-07-25 00:49:13'),
('c9be287d-192c-4ce2-9d13-00f4fe6e53a1', 'f59a8843-a8be-484a-8069-2a940503dc69', '8ce9ec62-f9af-4182-9a2a-ec5343356aec', '2025-04-04', '2025-07-14', 'completed', '2025-06-14', '2025-04-04 00:49:13', '2025-06-14 00:49:13'),
('ce5b16af-5fd5-47a8-9a8a-a0792030283c', 'ee5258a3-2bfa-4166-abc5-c91fed639fbd', '93c66be5-6bb0-4bba-8c73-96e3568e062c', '2025-04-02', '2025-07-26', 'completed', '2025-06-26', '2025-04-02 00:49:13', '2025-06-26 00:49:13'),
('d3534428-052d-4559-82a2-fb3793d4a67b', 'f63a9955-e8c0-49b2-bf94-3744d165fd5d', '3050c23f-2d18-4506-ab97-426d80bdca47', '2025-04-03', '2025-06-25', 'completed', '2025-05-25', '2025-04-03 00:49:13', '2025-05-25 00:49:13'),
('dd95230c-b98d-4b64-b1e5-5c051d065b30', '98c28d1a-9257-46cb-91ca-a0e5a5778c63', '5dc656b7-8b04-4c45-ad0f-d9ff58145cb2', '2025-04-05', '2025-07-23', 'completed', '2025-06-23', '2025-04-05 00:49:13', '2025-06-23 00:49:13'),
('ddd6f339-918b-4e24-8b89-78ded10f62bb', 'adba715c-4c36-4e5b-a553-469d46681def', '6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '2025-04-06', '2025-08-15', 'completed', '2025-07-15', '2025-04-06 00:49:13', '2025-07-15 00:49:13'),
('e7853a00-b779-42ca-97c3-78ecdfa4f3c6', '236d8501-b2f7-44f1-bdac-36aa269290a9', 'ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '2025-04-03', '2025-07-14', 'completed', '2025-06-14', '2025-04-03 00:49:13', '2025-06-14 00:49:13'),
('eca96358-d1ed-4ae4-bc43-a6c8be402b8d', 'cd78805a-4abf-49a7-8547-62674ac1fb3f', 'd6c44156-2938-4ac7-982a-ee06ac83eda9', '2025-04-02', '2025-07-03', 'completed', '2025-06-03', '2025-04-02 00:49:13', '2025-06-03 00:49:13'),
('f3523601-857e-4fb7-9737-b50cdeacf451', 'b1d2f950-d8e1-4a35-83e3-01f55a49505f', '148385e6-034e-4739-b30e-6bfeec3dab15', '2025-04-09', '2025-08-03', 'completed', '2025-07-03', '2025-04-09 00:49:13', '2025-07-03 00:49:13'),
('f35b04ff-cdaf-443a-a635-2882841ab8cb', '23763d10-fedd-4291-9ddc-672debb8e4d3', '93c66be5-6bb0-4bba-8c73-96e3568e062c', '2025-04-04', '2025-07-27', 'completed', '2025-06-27', '2025-04-04 00:49:13', '2025-06-27 00:49:13');

-- --------------------------------------------------------

--
-- Table structure for table `course_levels`
--

CREATE TABLE `course_levels` (
  `id_course_level` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `point_course_material` int NOT NULL,
  `point_assignment` int NOT NULL,
  `point_quiz` int NOT NULL,
  `point_course_completion` int NOT NULL,
  `certificate` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_levels`
--

INSERT INTO `course_levels` (`id_course_level`, `name`, `point_course_material`, `point_assignment`, `point_quiz`, `point_course_completion`, `certificate`, `created_at`, `updated_at`) VALUES
('486eec6c-a9b9-4631-8ec5-f9adc23ba627', 'Intermediate', 10, 40, 20, 80, 1, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('51b7f2a6-0947-4027-9259-dd078e9fc7a0', 'Advanced', 15, 50, 30, 100, 1, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('7aee038a-8722-4a77-9d3f-afaa15477d23', 'Certification', 30, 80, 60, 160, 1, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e8dbad79-d1a0-48a9-a842-51b08cf07ff9', 'Professional', 20, 60, 40, 120, 0, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e9a2c2a5-d14f-4d46-828b-09f2c0b92cf9', 'Expert', 25, 70, 50, 140, 0, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('fc8b607b-c5d2-44ff-86e2-400103cb4dcb', 'Beginner', 5, 30, 10, 60, 1, '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `course_materials`
--

CREATE TABLE `course_materials` (
  `id_course_material` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_section` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `video_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_material_resources`
--

CREATE TABLE `course_material_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_material` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_material_skills`
--

CREATE TABLE `course_material_skills` (
  `id_course_material` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_reviews`
--

CREATE TABLE `course_reviews` (
  `id_course_review` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_rules`
--

CREATE TABLE `course_rules` (
  `id_course_rule` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_sections`
--

CREATE TABLE `course_sections` (
  `id_course_section` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_tools`
--

CREATE TABLE `course_tools` (
  `id_course` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_tool` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `verification_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id_faq` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_partners`
--

CREATE TABLE `media_partners` (
  `id_media_partner` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(6, '0001_01_01_000000_create_users_table', 1),
(7, '0001_01_01_000001_create_cache_table', 1),
(8, '0001_01_01_000002_create_jobs_table', 1),
(9, '2024_09_08_125214_create_personal_access_tokens_table', 1),
(10, '2024_09_17_090450_create_app_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', '52c21eb4-260b-4df3-aada-443ffba308db', 'AuthToken', 'ed345f9a2fa2e001e0004237d55b2e58795308bd5351d9f09e94d536bb87ef8c', '[\"*\"]', '2025-07-01 01:09:09', '2025-07-03 01:09:08', '2025-07-01 01:09:09', '2025-07-01 01:09:09'),
(2, 'App\\Models\\User', '52c21eb4-260b-4df3-aada-443ffba308db', 'AuthToken', 'a168ccbb84668bb3794028b2ce2682fc4d984074300920a6bd3109e64c3eb6e7', '[\"*\"]', '2025-07-01 01:17:43', '2025-07-03 01:09:10', '2025-07-01 01:09:10', '2025-07-01 01:17:43'),
(3, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', 'df9a124e8739975789d39d494a5b84f85ee9a3ee4bbe4d7ce40c41f6bec546b5', '[\"*\"]', '2026-03-04 23:38:44', '2026-03-05 23:38:37', '2026-03-04 23:38:38', '2026-03-04 23:38:44'),
(4, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', '2946fad25c27e10d937552b9703d1f6e860051ca1118f12a8af30f4383d8fa8d', '[\"*\"]', '2026-03-04 23:38:47', '2026-03-05 23:38:40', '2026-03-04 23:38:40', '2026-03-04 23:38:47'),
(5, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', 'f9a6b292d9306ccf2d000517581afaf9474c38ef746bc998f54ce14fc5566d0c', '[\"*\"]', '2026-03-04 23:38:48', '2026-03-05 23:38:41', '2026-03-04 23:38:41', '2026-03-04 23:38:48'),
(6, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', '139bf855348fa002fba054dfbe5a2553d6b730fadfa68deb08fb3ea9bb9267ac', '[\"*\"]', '2026-03-04 23:38:49', '2026-03-05 23:38:42', '2026-03-04 23:38:42', '2026-03-04 23:38:49'),
(7, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', '03ea28c3bef75eb5bc31338b7bc82c5d00b3c70de324107cb87b12077eba3360', '[\"*\"]', '2026-03-05 01:33:53', '2026-03-05 23:38:43', '2026-03-04 23:38:43', '2026-03-05 01:33:53'),
(8, 'App\\Models\\User', '52f74433-89b5-442a-852d-81e8c83c16fd', 'AuthToken', '71163ab51fee79ac2dd20e96d2f97379daa28a1fd766ddb2b175389b70078bd0', '[\"*\"]', '2026-03-04 23:41:12', '2026-03-05 23:41:12', '2026-03-04 23:41:12', '2026-03-04 23:41:12'),
(9, 'App\\Models\\User', '52f74433-89b5-442a-852d-81e8c83c16fd', 'AuthToken', '8028641c1bce7e43df25c05aee0775ebc67017ea90f3484a34347351451d4fce', '[\"*\"]', '2026-03-07 07:29:04', '2026-03-08 07:29:01', '2026-03-07 07:29:02', '2026-03-07 07:29:04'),
(10, 'App\\Models\\User', '52f74433-89b5-442a-852d-81e8c83c16fd', 'AuthToken', '6c73790d8e8a0111a56058dc989c7694ee6ddf271c62ce3644c3c44725ac25e1', '[\"*\"]', '2026-03-07 23:18:03', '2026-03-08 07:29:03', '2026-03-07 07:29:03', '2026-03-07 23:18:03'),
(11, 'App\\Models\\User', 'e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'AuthToken', 'f6932cc1543308defb606c81c0880bf1c693c6a5624b6ccd62f2fe7f3b2acdee', '[\"*\"]', NULL, '2026-04-29 22:56:33', '2026-04-28 22:56:35', '2026-04-28 22:56:35'),
(12, 'App\\Models\\User', '7c75f8d7-7907-4d37-be9e-1fc3b99dc8a8', 'AuthToken', 'a2aaa288c62fe7266dfeafc29984122294dcf0db8746240b7c37bc14a674dcf7', '[\"*\"]', NULL, '2026-04-29 22:56:49', '2026-04-28 22:56:49', '2026-04-28 22:56:49'),
(13, 'App\\Models\\User', '52f74433-89b5-442a-852d-81e8c83c16fd', 'AuthToken', 'ace278b1556e302db16a6094ee31560f411531c6b256101d1bd06a160a3ac43d', '[\"*\"]', NULL, '2026-04-29 22:57:15', '2026-04-28 22:57:15', '2026-04-28 22:57:15'),
(14, 'App\\Models\\User', '52f74433-89b5-442a-852d-81e8c83c16fd', 'AuthToken', '1fec931c415d5dc534bf342840049a14738c81602d8707c34de09c39308fadfa', '[\"*\"]', '2026-04-28 23:08:59', '2026-04-29 23:08:55', '2026-04-28 23:08:55', '2026-04-28 23:08:59'),
(15, 'App\\Models\\User', '52c21eb4-260b-4df3-aada-443ffba308db', 'AuthToken', 'e0ecd618ba0c5dd9c87e8b208b7000ebb59f3b73575b13e7d220ff4fab9f7b32', '[\"*\"]', '2026-04-28 23:09:59', '2026-04-29 23:09:57', '2026-04-28 23:09:57', '2026-04-28 23:09:59');

-- --------------------------------------------------------

--
-- Table structure for table `point_histories`
--

CREATE TABLE `point_histories` (
  `id_point_history` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` enum('course_material','course_assignment','quiz','course_completion','skill_point','assignment_submission','quiz_submission') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `point` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id_question` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `questions` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id_quiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_section` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `duration` int NOT NULL,
  `max_attempt` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_options`
--

CREATE TABLE `quiz_options` (
  `id_quiz_option` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_question` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `reference_answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_option_resources`
--

CREATE TABLE `quiz_option_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_option` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id_quiz_question` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('single_choice','multiple_choice','essay') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_question_resources`
--

CREATE TABLE `quiz_question_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_question` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_resources`
--

CREATE TABLE `quiz_resources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_skills`
--

CREATE TABLE `quiz_skills` (
  `id_quiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submissions`
--

CREATE TABLE `quiz_submissions` (
  `id_quiz_submission` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `status` enum('started','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'started',
  `attempt_number` int NOT NULL,
  `grade` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submission_answers`
--

CREATE TABLE `quiz_submission_answers` (
  `id_quiz_submission_answer` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_submission` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_question` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_quiz_option` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_correct` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id_social_link` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id_social_media` bigint UNSIGNED NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `x` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtube` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id_student`, `id_user`, `phone`, `address`, `date_of_birth`, `image`, `created_at`, `updated_at`) VALUES
('148385e6-034e-4739-b30e-6bfeec3dab15', '3f6c6f7e-86fc-4da7-a115-f2487b3149de', '081100000008', 'Address Student 8', '1999-04-14', NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('22571f0d-cde3-4e73-839d-d1fb1fe0a7bd', '5ddd3e70-5a96-4f1e-bcbf-bffce970cc09', '081100000013', 'Address Student 13', '2002-01-16', NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('3050c23f-2d18-4506-ab97-426d80bdca47', '52f74433-89b5-442a-852d-81e8c83c16fd', '081100000001', 'Address Student 1', '1995-02-16', NULL, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('42c6ecc1-152f-493e-9d7d-93cb5c70cb35', '80d250a4-05ee-46b2-9fcd-1a59182d20e8', '081100000003', 'Address Student 3', '2002-11-21', NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('5c335033-a9a4-42e8-8615-04bcaaf03fd9', 'b6ccaad5-5ce3-4049-a813-6095f2cc6167', '081100000007', 'Address Student 7', '1996-04-28', NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('5dc656b7-8b04-4c45-ad0f-d9ff58145cb2', 'c052ffeb-6b44-4776-baee-a89d7062c9f8', '081100000005', 'Address Student 5', '1994-12-01', NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('699207ed-8438-45be-81ac-132bd193b023', '71d55b9f-3d9c-480e-bcec-3638a7c6ba53', '081100000011', 'Address Student 11', '1998-01-15', NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('6f779939-8f9a-4dde-bcfe-8f5a28770ee0', '52c21eb4-260b-4df3-aada-443ffba308db', '081100000002', 'Address Student 2', '2001-10-22', NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('8ce9ec62-f9af-4182-9a2a-ec5343356aec', '1cac6832-f582-4877-9f46-5c6fa0cb2c4a', '081100000015', 'Address Student 15', '2005-05-30', NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('8ec796ee-27c9-47a6-8b99-8418e1026f3a', '0ca6581a-80cc-429b-97f4-8881ae2aed5c', '081100000009', 'Address Student 9', '2001-02-01', NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('93c66be5-6bb0-4bba-8c73-96e3568e062c', 'db43faaa-aba7-4f54-8a26-b9a0f5df003a', '081100000004', 'Address Student 4', '1994-09-16', NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('d6c44156-2938-4ac7-982a-ee06ac83eda9', 'b0a6d15d-3405-4c8f-868e-213bd0fb1ddf', '081100000012', 'Address Student 12', '1995-05-31', NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('e03cc1c1-e72c-40bd-b1c7-723010f54bea', 'e9f9b51b-d998-418c-a49d-5e1c81160ddc', '081100000010', 'Address Student 10', '1998-03-01', NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('e2d0bd67-762c-4526-a0d0-0ca2d8b28e72', 'fb53f0fd-ce23-457d-9b9a-677142ab5503', '081100000014', 'Address Student 14', '2002-11-04', NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('ec2a7ae0-0a47-4b61-944d-8e20125ecdc6', '0ad57273-10b7-468e-88eb-2f9f416c15b5', '081100000006', 'Address Student 6', '2000-08-12', NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `student_certificates`
--

CREATE TABLE `student_certificates` (
  `id_student_certificate` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_certificates`
--

INSERT INTO `student_certificates` (`id_student_certificate`, `id_course_enrollment`, `file`, `created_at`, `updated_at`) VALUES
('028c3280-8f60-4cd2-9a79-26d2ad6d9b4c', 'b021e400-ece4-4350-a047-3a38a28853a4', 'certificate_5dc656b7-8b04-4c45-ad0f-d9ff58145cb2_ab93cb20-77a9-4d8d-afa5-77caa354227c.pdf', '2025-06-18 00:49:13', '2025-06-18 00:49:13'),
('0b37532b-faf0-4fd9-bd88-01299c7b96fa', 'f35b04ff-cdaf-443a-a635-2882841ab8cb', 'certificate_93c66be5-6bb0-4bba-8c73-96e3568e062c_bd34c364-88a1-4d92-a45d-4c1b62796cf9.pdf', '2025-06-27 00:49:13', '2025-06-27 00:49:13'),
('0eae9a0e-cf1f-42a2-8479-e2ee6938abb4', 'ad132479-7809-49ed-93fe-3e6ca2da79b2', 'certificate_6f779939-8f9a-4dde-bcfe-8f5a28770ee0_ab93cb20-77a9-4d8d-afa5-77caa354227c.pdf', '2025-06-19 00:49:13', '2025-06-19 00:49:13'),
('133d490f-b167-44c0-8774-9e62e99ae142', '3c12768e-794d-4160-98ea-09b8f4c41e21', 'certificate_ec2a7ae0-0a47-4b61-944d-8e20125ecdc6_7ad71870-92a1-4187-a909-c5be32df8cdf.pdf', '2025-06-05 00:49:13', '2025-06-05 00:49:13'),
('15d27cdc-602e-42fa-9128-7ac93ca8baf6', '8e793982-8a29-42e2-8ba2-22c828ac3bf7', 'certificate_e03cc1c1-e72c-40bd-b1c7-723010f54bea_2e24efdc-e055-4c1a-8385-4993c90d54ea.pdf', '2025-07-11 00:49:13', '2025-07-11 00:49:13'),
('1a513cf1-bae7-46b8-8d2c-3f5cd562e75d', '52709749-2283-40e9-bba8-d3201e405eb2', 'certificate_22571f0d-cde3-4e73-839d-d1fb1fe0a7bd_22fa1944-790d-4372-9efc-49cd121b2f34.pdf', '2025-06-15 00:49:13', '2025-06-15 00:49:13'),
('1eab3ede-d003-4a65-bf9a-696acacc4e39', 'accf1e74-e2e1-4de2-9777-a77f682c110d', 'certificate_93c66be5-6bb0-4bba-8c73-96e3568e062c_cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb.pdf', '2025-07-08 00:49:13', '2025-07-08 00:49:13'),
('290d4b59-9444-47ae-adf4-e5e70addc3c7', '36c71589-71f0-422d-8172-e70d16527399', 'certificate_5c335033-a9a4-42e8-8615-04bcaaf03fd9_f511106b-eb63-446a-a909-ecae0d16d71a.pdf', '2025-06-23 00:49:13', '2025-06-23 00:49:13'),
('29d37e15-ff1c-450b-bf90-a3b60fcb56be', '02149b56-09dc-4bb4-9f4f-8ac5980baee5', 'certificate_ec2a7ae0-0a47-4b61-944d-8e20125ecdc6_db2ef114-9370-42eb-9bd8-cac04d3df248.pdf', '2025-08-01 00:49:13', '2025-08-01 00:49:13'),
('401cff94-c154-4263-adf6-df2097bbfa52', '4c162c69-bc48-457a-9e28-f7ab5334053b', 'certificate_5c335033-a9a4-42e8-8615-04bcaaf03fd9_3b7aa7f0-3a86-4af9-913c-5c278b207ba3.pdf', '2025-06-17 00:49:13', '2025-06-17 00:49:13'),
('406f73a6-dc3c-468f-8f21-de6debf70d6b', '163cfdab-27ff-42cd-9819-83b33da3be10', 'certificate_148385e6-034e-4739-b30e-6bfeec3dab15_db332a57-41be-4995-b4a6-4486a0b4efe7.pdf', '2025-06-23 00:49:13', '2025-06-23 00:49:13'),
('4aa6d855-1665-47d8-8f26-487723efa705', '99d63b43-8628-472c-add8-e78967e19e80', 'certificate_e2d0bd67-762c-4526-a0d0-0ca2d8b28e72_bd34c364-88a1-4d92-a45d-4c1b62796cf9.pdf', '2025-07-05 00:49:13', '2025-07-05 00:49:13'),
('4aef4748-182c-4158-acdc-2ae82b0497ab', '02fba3a0-d0cb-461d-a634-a39c4fefc689', 'certificate_e03cc1c1-e72c-40bd-b1c7-723010f54bea_cbb920e4-71bf-4907-8f33-494b92a3f6d2.pdf', '2025-07-24 00:49:13', '2025-07-24 00:49:13'),
('4d0bb685-a049-4fad-afdd-6ba5d5fe0764', 'ce5b16af-5fd5-47a8-9a8a-a0792030283c', 'certificate_93c66be5-6bb0-4bba-8c73-96e3568e062c_e0688222-bcd1-4c36-9986-97fd0918874e.pdf', '2025-06-26 00:49:13', '2025-06-26 00:49:13'),
('5675a9cc-39dd-4304-a7ec-ad56ebd96bb5', '3a4c2ac7-b40d-42e4-adec-f7c2f7400c24', 'certificate_e2d0bd67-762c-4526-a0d0-0ca2d8b28e72_2e24efdc-e055-4c1a-8385-4993c90d54ea.pdf', '2025-07-07 00:49:13', '2025-07-07 00:49:13'),
('63e30a9e-0eee-4334-b3f9-32743972e251', '9f33dfe5-f521-4752-ac69-96ff0994a1e4', 'certificate_5dc656b7-8b04-4c45-ad0f-d9ff58145cb2_c6fa4096-113c-4657-a974-9b250f5384d3.pdf', '2025-06-15 00:49:13', '2025-06-15 00:49:13'),
('678db74f-f8cd-4dd8-97ef-1d622f96bc79', '87cc793f-eca3-4bc0-ad1b-870d3f20c4c4', 'certificate_42c6ecc1-152f-493e-9d7d-93cb5c70cb35_4612fc91-dfe9-4687-8ada-a6cbd9be978e.pdf', '2025-06-27 00:49:13', '2025-06-27 00:49:13'),
('6c3202d0-7472-4d56-9dd5-4bd2324baa9f', '37a4282f-7985-4559-bdb7-20837df61a18', 'certificate_8ce9ec62-f9af-4182-9a2a-ec5343356aec_db2ef114-9370-42eb-9bd8-cac04d3df248.pdf', '2025-08-06 00:49:13', '2025-08-06 00:49:13'),
('7cb10b6a-cce1-4b6b-9767-ef0ef2fa6e00', 'dd95230c-b98d-4b64-b1e5-5c051d065b30', 'certificate_5dc656b7-8b04-4c45-ad0f-d9ff58145cb2_407d1e48-848e-485d-a13f-61a08ca18260.pdf', '2025-06-23 00:49:13', '2025-06-23 00:49:13'),
('93dd3446-5727-4034-b7f2-69ab03d33c9f', '282a6274-9a57-4185-bfc6-624c7d5f68f4', 'certificate_d6c44156-2938-4ac7-982a-ee06ac83eda9_21a726b2-ff08-4633-b5a1-944927af40f9.pdf', '2025-06-29 00:49:13', '2025-06-29 00:49:13'),
('96e7eb35-e275-4153-910c-ca0ce5aa682e', '75677570-608f-4fe9-8c94-0085fa1493aa', 'certificate_8ec796ee-27c9-47a6-8b99-8418e1026f3a_366bc58e-69f2-4dde-b2f2-b6f28c8f8620.pdf', '2025-07-26 00:49:13', '2025-07-26 00:49:13'),
('98666479-e6fe-4e09-b55b-0fd96a6cebc1', '370cc54f-8357-4309-b870-d88b27081c4a', 'certificate_5dc656b7-8b04-4c45-ad0f-d9ff58145cb2_2e24efdc-e055-4c1a-8385-4993c90d54ea.pdf', '2025-07-09 00:49:13', '2025-07-09 00:49:13'),
('9c066485-7848-4058-9976-7b7964ac9cd7', '3c1f6dad-a272-428f-a7e5-1e8274f9253e', 'certificate_3050c23f-2d18-4506-ab97-426d80bdca47_e0688222-bcd1-4c36-9986-97fd0918874e.pdf', '2025-06-25 00:49:13', '2025-06-25 00:49:13'),
('a6421e56-1765-45ce-8bff-c87669df9dcf', '065f77eb-c19d-4de7-8055-e78406e07149', 'certificate_ec2a7ae0-0a47-4b61-944d-8e20125ecdc6_407d1e48-848e-485d-a13f-61a08ca18260.pdf', '2025-06-26 00:49:13', '2025-06-26 00:49:13'),
('a7468489-64cf-4d06-84e0-119e5dee7d87', 'a5ec5354-1d04-463d-bb71-cd2259d621ff', 'certificate_148385e6-034e-4739-b30e-6bfeec3dab15_366bc58e-69f2-4dde-b2f2-b6f28c8f8620.pdf', '2025-07-15 00:49:13', '2025-07-15 00:49:13'),
('ab8b7660-66f2-409c-b138-3d3074559d54', 'f3523601-857e-4fb7-9737-b50cdeacf451', 'certificate_148385e6-034e-4739-b30e-6bfeec3dab15_407d1e48-848e-485d-a13f-61a08ca18260.pdf', '2025-07-03 00:49:13', '2025-07-03 00:49:13'),
('b5a40fea-47ff-46da-9ae8-1ec43a400d7f', '1fce6052-19e3-4c81-85fa-5240363fdb96', 'certificate_8ec796ee-27c9-47a6-8b99-8418e1026f3a_3b7aa7f0-3a86-4af9-913c-5c278b207ba3.pdf', '2025-06-12 00:49:13', '2025-06-12 00:49:13'),
('bd6a6240-09f1-456e-a9c2-42b37a58e0a0', '65b3fd39-18a5-49e3-be7c-f72d6cb6a03f', 'certificate_699207ed-8438-45be-81ac-132bd193b023_fccef230-ccb7-43e1-aeb0-c90f96859a3a.pdf', '2025-07-31 00:49:13', '2025-07-31 00:49:13'),
('c55da667-b7fe-482f-85cf-ea6ceeac777d', '4c2b05ae-59ec-4e9d-8ed6-bd7f6ba3fb42', 'certificate_22571f0d-cde3-4e73-839d-d1fb1fe0a7bd_bdad75a7-62f5-43ca-b0fb-0d9d81e0aaea.pdf', '2025-07-18 00:49:13', '2025-07-18 00:49:13'),
('d0c4e535-9378-4570-a33e-8c54719b0304', '23500a18-e606-46e4-a481-d14c1c3a4cb1', 'certificate_6f779939-8f9a-4dde-bcfe-8f5a28770ee0_f511106b-eb63-446a-a909-ecae0d16d71a.pdf', '2025-06-17 00:49:13', '2025-06-17 00:49:13'),
('d2502824-5aca-441a-94ce-020e929b93fe', '35a7bed6-cb71-452a-b055-55c3c9481b10', 'certificate_d6c44156-2938-4ac7-982a-ee06ac83eda9_db332a57-41be-4995-b4a6-4486a0b4efe7.pdf', '2025-06-20 00:49:13', '2025-06-20 00:49:13'),
('d565c9d1-e184-45e8-abd3-7ee3cb778d8b', 'd3534428-052d-4559-82a2-fb3793d4a67b', 'certificate_3050c23f-2d18-4506-ab97-426d80bdca47_d22cb36b-bf33-488a-80ad-7df222aa65ba.pdf', '2025-05-25 00:49:13', '2025-05-25 00:49:13'),
('d605f5ec-88f2-4a19-9566-a6a6a5e7bbb8', '5db219f2-1647-4b70-bec8-c9ffcb096006', 'certificate_699207ed-8438-45be-81ac-132bd193b023_f511106b-eb63-446a-a909-ecae0d16d71a.pdf', '2025-06-20 00:49:13', '2025-06-20 00:49:13'),
('d7ed9f47-acff-4e76-bd93-149196fc9870', '143abf51-81df-4eae-b1b8-36a534235849', 'certificate_699207ed-8438-45be-81ac-132bd193b023_7349e350-849d-437c-b24b-5b176f7eb717.pdf', '2025-07-02 00:49:13', '2025-07-02 00:49:13'),
('dca96ab5-31c5-4a44-a9fd-8e5fe2f74f7a', '85f1beb1-63fc-4806-abee-1779eb4731a6', 'certificate_699207ed-8438-45be-81ac-132bd193b023_cacf1a99-6a1f-459f-b3f4-14e9bb82c5cb.pdf', '2025-07-05 00:49:13', '2025-07-05 00:49:13'),
('eb51769d-ff50-4625-ad3a-701229af48d7', '0e6d78be-483d-45eb-940b-63995688b561', 'certificate_ec2a7ae0-0a47-4b61-944d-8e20125ecdc6_ab93cb20-77a9-4d8d-afa5-77caa354227c.pdf', '2025-06-18 00:49:13', '2025-06-18 00:49:13'),
('ee2db5d3-0447-4a04-ac36-35c0d33d913d', '808193f9-5bed-4c5e-b036-18d7ef187cf7', 'certificate_8ec796ee-27c9-47a6-8b99-8418e1026f3a_db2ef114-9370-42eb-9bd8-cac04d3df248.pdf', '2025-07-27 00:49:13', '2025-07-27 00:49:13'),
('fa319677-372c-475e-bba9-1e1b5bdd704a', 'ad81947c-19f6-49db-a17d-6c1184e5d3b9', 'certificate_d6c44156-2938-4ac7-982a-ee06ac83eda9_735af61a-8dd5-4e19-b9d7-c6808cf6b589.pdf', '2025-06-08 00:49:13', '2025-06-08 00:49:13'),
('fa7065fe-4e97-45b2-98c2-ae12c7b60470', 'eca96358-d1ed-4ae4-bc43-a6c8be402b8d', 'certificate_d6c44156-2938-4ac7-982a-ee06ac83eda9_aee3a7ea-8abe-486f-a24b-6d1bc53df943.pdf', '2025-06-03 00:49:13', '2025-06-03 00:49:13'),
('faf2d4ec-f3b3-4c35-92c6-ab10a1aeae05', 'c9be287d-192c-4ce2-9d13-00f4fe6e53a1', 'certificate_8ce9ec62-f9af-4182-9a2a-ec5343356aec_22fa1944-790d-4372-9efc-49cd121b2f34.pdf', '2025-06-14 00:49:13', '2025-06-14 00:49:13'),
('fe294270-2429-4f86-8a49-7aa9a1d59984', '029c9cad-4b90-4d24-9616-09a62e8baf6e', 'certificate_3050c23f-2d18-4506-ab97-426d80bdca47_3ec62b63-868e-40d1-9c04-c18bd984ffdc.pdf', '2025-07-13 00:49:13', '2025-07-13 00:49:13'),
('ff2f20d1-5a5a-49fc-9973-e713eba56005', 'be83710a-23e9-4a90-94d1-fcbec12e6aef', 'certificate_22571f0d-cde3-4e73-839d-d1fb1fe0a7bd_ab93cb20-77a9-4d8d-afa5-77caa354227c.pdf', '2025-06-18 00:49:13', '2025-06-18 00:49:13');

-- --------------------------------------------------------

--
-- Table structure for table `student_progress`
--

CREATE TABLE `student_progress` (
  `id_student_progress` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_enrollment` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_course_material` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_skill_points`
--

CREATE TABLE `student_skill_points` (
  `id_student_skill_point` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_skill` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `point` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher_level` bigint UNSIGNED DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date_of_birth` date DEFAULT NULL,
  `education` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_of_experience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portofolio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('not_submitted','submitted','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_submitted',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `affiliation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id_teacher`, `id_user`, `id_teacher_level`, `address`, `bio`, `date_of_birth`, `education`, `phone_number`, `year_of_experience`, `photo_profile`, `portofolio`, `identity`, `status`, `note`, `affiliation`, `created_at`, `updated_at`) VALUES
('86bfc52c-80d3-4db0-bb1d-eb708bea2f77', '7c75f8d7-7907-4d37-be9e-1fc3b99dc8a8', 1, '123 Teacher Street', 'Experienced teacher in various fields.', '1980-05-15', 'Master of Education', '081234567891', '10', NULL, NULL, NULL, 'approved', NULL, NULL, '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `teachers_categories`
--

CREATE TABLE `teachers_categories` (
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teachers_certificates`
--

CREATE TABLE `teachers_certificates` (
  `id_teacher_certificate` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_levels`
--

CREATE TABLE `teacher_levels` (
  `id_teacher_level` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_course` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_levels`
--

INSERT INTO `teacher_levels` (`id_teacher_level`, `name`, `description`, `max_course`, `created_at`, `updated_at`) VALUES
(1, 'Level 1', 'Teacher level for beginner', 10, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
(2, 'Level 2', 'Teacher level for intermediate', 20, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
(3, 'Level 3', 'Teacher level for advanced', 50, '2025-07-01 00:49:09', '2025-07-01 00:49:09');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_level_course_level`
--

CREATE TABLE `teacher_level_course_level` (
  `id_teacher_level` bigint UNSIGNED NOT NULL,
  `id_course_level` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_reviews`
--

CREATE TABLE `teacher_reviews` (
  `id_teacher_review` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_update_categories`
--

CREATE TABLE `teacher_update_categories` (
  `id_teacher_update_request` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_update_certificates`
--

CREATE TABLE `teacher_update_certificates` (
  `id_request_certificate` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher_update_request` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_update_requests`
--

CREATE TABLE `teacher_update_requests` (
  `id_teacher_update_request` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('profile','level') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_teacher` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date_of_birth` date DEFAULT NULL,
  `education` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_of_experience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_profile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portofolio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('submitted','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'submitted',
  `affiliation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `terms_conditions`
--

CREATE TABLE `terms_conditions` (
  `id_term_condition` bigint UNSIGNED NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `testimonies`
--

CREATE TABLE `testimonies` (
  `id_testimony` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_student` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id_tool` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('student','teacher','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `job_portal_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_portal_linked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `name`, `password`, `role`, `is_verified`, `job_portal_id`, `job_portal_linked_at`, `created_at`, `updated_at`) VALUES
('0ad57273-10b7-468e-88eb-2f9f416c15b5', 'student6@example.com', 'Student 6 Name', '$2y$12$q7MQK5OELhWL9t2Cw5KqjermBGdJx1vloJ6vi4R4AmIDh3NUqC.9y', 'student', 1, NULL, NULL, '2025-07-01 00:49:11', '2026-03-07 07:30:15'),
('0ca6581a-80cc-429b-97f4-8881ae2aed5c', 'student9@example.com', 'Student 9 Name', '$2y$12$uJu.se.emPITll6XxspEy.Ota2dhKapXIrS.5W4BWkig9ccRDq/5G', 'student', 1, NULL, NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('1cac6832-f582-4877-9f46-5c6fa0cb2c4a', 'student15@example.com', 'Student 15 Name', '$2y$12$asFnqHSaQRg5.n4Bv443/u3XKjC3Jhae8f58lzRGYS4GPILP.vWXS', 'student', 1, '45a4fda3-751d-40e0-a036-82b1eb2e1860', '2026-04-27 06:56:10', '2025-07-01 00:49:12', '2026-04-27 06:56:10'),
('3f6c6f7e-86fc-4da7-a115-f2487b3149de', 'student8@example.com', 'Student 8 Name', '$2y$12$gFOlo5tCpuxHYuhJe2W0OejoXzQvbpnhJPL1IcqDrdQo4jjxSrIxK', 'student', 1, NULL, NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('52c21eb4-260b-4df3-aada-443ffba308db', 'student2@example.com', 'Student 2 Name', '$2y$12$7pCiNpjZjCx11K9UUfP0yulp9pNhbI3LAbTHjbLpdTIt0Hx5Kpaym', 'student', 1, NULL, NULL, '2025-07-01 00:49:10', '2025-07-01 01:17:41'),
('52f74433-89b5-442a-852d-81e8c83c16fd', 'student1@example.com', 'Student 1 Name', '$2y$12$eknjhq9ifJMmNwVEBNzYLOmfWlkzH6Z4Q7FP7WlfS/3vdvV7DI7Y2', 'student', 1, '97b950b7-b0ef-4ed0-8270-06accde8e340', '2026-03-07 23:11:54', '2025-07-01 00:49:09', '2026-03-07 23:11:54'),
('5ddd3e70-5a96-4f1e-bcbf-bffce970cc09', 'student13@example.com', 'Student 13 Name', '$2y$12$to/pcnoqTjmlukYYYADayO/c1NlxYRPFzCmXiF4HCBIMLGXqJ79w2', 'student', 1, NULL, NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('71d55b9f-3d9c-480e-bcec-3638a7c6ba53', 'student11@example.com', 'Student 11 Name', '$2y$12$i4SW7DsyPjE5G2eRp5khteQmEN707yoR6rSZbRqUvK44QeNIkNW1u', 'student', 1, NULL, NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('7c75f8d7-7907-4d37-be9e-1fc3b99dc8a8', 'teacher@example.com', 'Teacher User', '$2y$12$5xrBEnHWL1w3EiUkXHAdAuJrmibe.o/H7P68q8ppWHvaRLIiDldx6', 'teacher', 1, NULL, NULL, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('80d250a4-05ee-46b2-9fcd-1a59182d20e8', 'student3@example.com', 'Student 3 Name', '$2y$12$XuuV91wXVqE4hr3xzqD2Re654f018xTlp8YSK1nafHBG67.KyQM26', 'student', 1, NULL, NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('b0a6d15d-3405-4c8f-868e-213bd0fb1ddf', 'student12@example.com', 'Student 12 Name', '$2y$12$80fMK4E5vt6TPqoMWmLgU...RRyIkJ6rVqJGsNEbnLR7esBe51JlC', 'student', 1, NULL, NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12'),
('b6ccaad5-5ce3-4049-a813-6095f2cc6167', 'student7@example.com', 'Student 7 Name', '$2y$12$Etn4TYlMqT0LmEjBJNF29uQ2C2cLyxsVJXi3bDtnB.EBtwa6Z5ZS.', 'student', 1, NULL, NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('c052ffeb-6b44-4776-baee-a89d7062c9f8', 'student5@example.com', 'Student 5 Name', '$2y$12$mEy0e1ym6AMtqGtd3CJQFuPUyp1fmT6kaJdeU8cSbczDyNjQ1Ulom', 'student', 1, NULL, NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('db43faaa-aba7-4f54-8a26-b9a0f5df003a', 'student4@example.com', 'Student 4 Name', '$2y$12$dlYitxyxvT2feS3nyYsJAuSw8vJ3ZUJwQKuFDJOV4jt0N4bKnawjO', 'student', 1, NULL, NULL, '2025-07-01 00:49:10', '2025-07-01 00:49:10'),
('e6c1bcb2-306a-43e8-8d77-d6ab203b7e1e', 'admin@admin.com', 'Admin User', '$2y$12$4Q.85W813QLumBX6AaoqkuCJ3nIluxOUVpQxLtgjO0Mn47Fq0urPa', 'admin', 1, NULL, NULL, '2025-07-01 00:49:09', '2025-07-01 00:49:09'),
('e9f9b51b-d998-418c-a49d-5e1c81160ddc', 'student10@example.com', 'Student 10 Name', '$2y$12$kzVfzLB..rg4ZcPJ.xNY9Omhm4RXqRwzgpsl4j86b0VUkJd6c4hBe', 'student', 1, NULL, NULL, '2025-07-01 00:49:11', '2025-07-01 00:49:11'),
('fb53f0fd-ce23-457d-9b9a-677142ab5503', 'student14@example.com', 'Student 14 Name', '$2y$12$zw44atCExHLa6C13A7Yfs.vAJbMVdw690KfLRMWNE2UW5yLJ1sMcK', 'student', 1, NULL, NULL, '2025-07-01 00:49:12', '2025-07-01 00:49:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us`
  ADD PRIMARY KEY (`id_about_us`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id_assignment_submission`),
  ADD KEY `assignment_submissions_id_course_enrollment_foreign` (`id_course_enrollment`),
  ADD KEY `assignment_submissions_id_course_assignment_foreign` (`id_course_assignment`);

--
-- Indexes for table `assignment_submission_resources`
--
ALTER TABLE `assignment_submission_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_submission_resources_id_assignment_submission_foreign` (`id_assignment_submission`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id_course`),
  ADD KEY `courses_id_category_foreign` (`id_category`),
  ADD KEY `courses_id_teacher_foreign` (`id_teacher`),
  ADD KEY `courses_id_course_level_foreign` (`id_course_level`);

--
-- Indexes for table `course_assignments`
--
ALTER TABLE `course_assignments`
  ADD PRIMARY KEY (`id_course_assignment`),
  ADD KEY `course_assignments_id_course_section_foreign` (`id_course_section`);

--
-- Indexes for table `course_assignment_resources`
--
ALTER TABLE `course_assignment_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_assignment_resources_id_course_assignment_foreign` (`id_course_assignment`);

--
-- Indexes for table `course_assignment_skills`
--
ALTER TABLE `course_assignment_skills`
  ADD PRIMARY KEY (`id_course_assignment`,`id_skill`),
  ADD KEY `course_assignment_skills_id_skill_foreign` (`id_skill`);

--
-- Indexes for table `course_batches`
--
ALTER TABLE `course_batches`
  ADD PRIMARY KEY (`id_course_batch`),
  ADD KEY `course_batches_id_course_foreign` (`id_course`);

--
-- Indexes for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD PRIMARY KEY (`id_course_enrollment`),
  ADD KEY `course_enrollments_id_course_batch_foreign` (`id_course_batch`),
  ADD KEY `course_enrollments_id_student_foreign` (`id_student`);

--
-- Indexes for table `course_levels`
--
ALTER TABLE `course_levels`
  ADD PRIMARY KEY (`id_course_level`);

--
-- Indexes for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD PRIMARY KEY (`id_course_material`),
  ADD KEY `course_materials_id_course_section_foreign` (`id_course_section`);

--
-- Indexes for table `course_material_resources`
--
ALTER TABLE `course_material_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_material_resources_id_course_material_foreign` (`id_course_material`);

--
-- Indexes for table `course_material_skills`
--
ALTER TABLE `course_material_skills`
  ADD PRIMARY KEY (`id_course_material`,`id_skill`),
  ADD KEY `course_material_skills_id_skill_foreign` (`id_skill`);

--
-- Indexes for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD PRIMARY KEY (`id_course_review`),
  ADD KEY `course_reviews_id_student_foreign` (`id_student`),
  ADD KEY `course_reviews_id_course_foreign` (`id_course`);

--
-- Indexes for table `course_rules`
--
ALTER TABLE `course_rules`
  ADD PRIMARY KEY (`id_course_rule`),
  ADD KEY `course_rules_id_course_foreign` (`id_course`);

--
-- Indexes for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD PRIMARY KEY (`id_course_section`),
  ADD KEY `course_sections_id_course_foreign` (`id_course`);

--
-- Indexes for table `course_tools`
--
ALTER TABLE `course_tools`
  ADD PRIMARY KEY (`id_course`,`id_tool`),
  ADD KEY `course_tools_id_tool_foreign` (`id_tool`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_verifications_email_unique` (`email`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id_faq`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_partners`
--
ALTER TABLE `media_partners`
  ADD PRIMARY KEY (`id_media_partner`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `point_histories`
--
ALTER TABLE `point_histories`
  ADD PRIMARY KEY (`id_point_history`),
  ADD KEY `point_histories_id_skill_foreign` (`id_skill`),
  ADD KEY `point_histories_id_student_foreign` (`id_student`),
  ADD KEY `point_histories_id_course_enrollment_foreign` (`id_course_enrollment`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id_question`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id_quiz`),
  ADD KEY `quizzes_id_course_section_foreign` (`id_course_section`);

--
-- Indexes for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD PRIMARY KEY (`id_quiz_option`),
  ADD KEY `quiz_options_id_quiz_question_foreign` (`id_quiz_question`);

--
-- Indexes for table `quiz_option_resources`
--
ALTER TABLE `quiz_option_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_option_resources_id_quiz_option_foreign` (`id_quiz_option`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id_quiz_question`),
  ADD KEY `quiz_questions_id_quiz_foreign` (`id_quiz`);

--
-- Indexes for table `quiz_question_resources`
--
ALTER TABLE `quiz_question_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_question_resources_id_quiz_question_foreign` (`id_quiz_question`);

--
-- Indexes for table `quiz_resources`
--
ALTER TABLE `quiz_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_resources_id_quiz_foreign` (`id_quiz`);

--
-- Indexes for table `quiz_skills`
--
ALTER TABLE `quiz_skills`
  ADD PRIMARY KEY (`id_quiz`,`id_skill`),
  ADD KEY `quiz_skills_id_skill_foreign` (`id_skill`);

--
-- Indexes for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD PRIMARY KEY (`id_quiz_submission`),
  ADD KEY `quiz_submissions_id_course_enrollment_foreign` (`id_course_enrollment`),
  ADD KEY `quiz_submissions_id_quiz_foreign` (`id_quiz`);

--
-- Indexes for table `quiz_submission_answers`
--
ALTER TABLE `quiz_submission_answers`
  ADD PRIMARY KEY (`id_quiz_submission_answer`),
  ADD KEY `quiz_submission_answers_id_quiz_submission_foreign` (`id_quiz_submission`),
  ADD KEY `quiz_submission_answers_id_quiz_question_foreign` (`id_quiz_question`),
  ADD KEY `quiz_submission_answers_id_quiz_option_foreign` (`id_quiz_option`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id_skill`),
  ADD KEY `skills_id_category_foreign` (`id_category`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id_social_link`),
  ADD KEY `social_links_id_teacher_foreign` (`id_teacher`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id_social_media`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id_student`),
  ADD KEY `students_id_user_foreign` (`id_user`);

--
-- Indexes for table `student_certificates`
--
ALTER TABLE `student_certificates`
  ADD PRIMARY KEY (`id_student_certificate`),
  ADD KEY `student_certificates_id_course_enrollment_foreign` (`id_course_enrollment`);

--
-- Indexes for table `student_progress`
--
ALTER TABLE `student_progress`
  ADD PRIMARY KEY (`id_student_progress`),
  ADD KEY `student_progress_id_course_enrollment_foreign` (`id_course_enrollment`),
  ADD KEY `student_progress_id_course_material_foreign` (`id_course_material`);

--
-- Indexes for table `student_skill_points`
--
ALTER TABLE `student_skill_points`
  ADD PRIMARY KEY (`id_student_skill_point`),
  ADD UNIQUE KEY `student_skill_points_id_student_id_skill_unique` (`id_student`,`id_skill`),
  ADD KEY `student_skill_points_id_skill_foreign` (`id_skill`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id_teacher`),
  ADD KEY `teachers_id_user_foreign` (`id_user`),
  ADD KEY `teachers_id_teacher_level_foreign` (`id_teacher_level`);

--
-- Indexes for table `teachers_categories`
--
ALTER TABLE `teachers_categories`
  ADD PRIMARY KEY (`id_teacher`,`id_category`),
  ADD KEY `teachers_categories_id_category_foreign` (`id_category`);

--
-- Indexes for table `teachers_certificates`
--
ALTER TABLE `teachers_certificates`
  ADD PRIMARY KEY (`id_teacher_certificate`),
  ADD KEY `teachers_certificates_id_teacher_foreign` (`id_teacher`);

--
-- Indexes for table `teacher_levels`
--
ALTER TABLE `teacher_levels`
  ADD PRIMARY KEY (`id_teacher_level`);

--
-- Indexes for table `teacher_level_course_level`
--
ALTER TABLE `teacher_level_course_level`
  ADD PRIMARY KEY (`id_teacher_level`,`id_course_level`),
  ADD KEY `teacher_level_course_level_id_course_level_foreign` (`id_course_level`);

--
-- Indexes for table `teacher_reviews`
--
ALTER TABLE `teacher_reviews`
  ADD PRIMARY KEY (`id_teacher_review`),
  ADD KEY `teacher_reviews_id_student_foreign` (`id_student`),
  ADD KEY `teacher_reviews_id_teacher_foreign` (`id_teacher`);

--
-- Indexes for table `teacher_update_categories`
--
ALTER TABLE `teacher_update_categories`
  ADD PRIMARY KEY (`id_teacher_update_request`,`id_category`),
  ADD KEY `teacher_update_categories_id_category_foreign` (`id_category`);

--
-- Indexes for table `teacher_update_certificates`
--
ALTER TABLE `teacher_update_certificates`
  ADD PRIMARY KEY (`id_request_certificate`),
  ADD KEY `teacher_update_certificates_id_teacher_update_request_foreign` (`id_teacher_update_request`);

--
-- Indexes for table `teacher_update_requests`
--
ALTER TABLE `teacher_update_requests`
  ADD PRIMARY KEY (`id_teacher_update_request`),
  ADD KEY `teacher_update_requests_id_teacher_foreign` (`id_teacher`);

--
-- Indexes for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  ADD PRIMARY KEY (`id_term_condition`);

--
-- Indexes for table `testimonies`
--
ALTER TABLE `testimonies`
  ADD PRIMARY KEY (`id_testimony`),
  ADD KEY `testimonies_id_student_foreign` (`id_student`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id_tool`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us`
  MODIFY `id_about_us` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `social_media`
--
ALTER TABLE `social_media`
  MODIFY `id_social_media` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_levels`
--
ALTER TABLE `teacher_levels`
  MODIFY `id_teacher_level` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teacher_level_course_level`
--
ALTER TABLE `teacher_level_course_level`
  MODIFY `id_teacher_level` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `terms_conditions`
--
ALTER TABLE `terms_conditions`
  MODIFY `id_term_condition` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_id_course_assignment_foreign` FOREIGN KEY (`id_course_assignment`) REFERENCES `course_assignments` (`id_course_assignment`),
  ADD CONSTRAINT `assignment_submissions_id_course_enrollment_foreign` FOREIGN KEY (`id_course_enrollment`) REFERENCES `course_enrollments` (`id_course_enrollment`);

--
-- Constraints for table `assignment_submission_resources`
--
ALTER TABLE `assignment_submission_resources`
  ADD CONSTRAINT `assignment_submission_resources_id_assignment_submission_foreign` FOREIGN KEY (`id_assignment_submission`) REFERENCES `assignment_submissions` (`id_assignment_submission`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_id_category_foreign` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  ADD CONSTRAINT `courses_id_course_level_foreign` FOREIGN KEY (`id_course_level`) REFERENCES `course_levels` (`id_course_level`),
  ADD CONSTRAINT `courses_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`);

--
-- Constraints for table `course_assignments`
--
ALTER TABLE `course_assignments`
  ADD CONSTRAINT `course_assignments_id_course_section_foreign` FOREIGN KEY (`id_course_section`) REFERENCES `course_sections` (`id_course_section`) ON DELETE CASCADE;

--
-- Constraints for table `course_assignment_resources`
--
ALTER TABLE `course_assignment_resources`
  ADD CONSTRAINT `course_assignment_resources_id_course_assignment_foreign` FOREIGN KEY (`id_course_assignment`) REFERENCES `course_assignments` (`id_course_assignment`) ON DELETE CASCADE;

--
-- Constraints for table `course_assignment_skills`
--
ALTER TABLE `course_assignment_skills`
  ADD CONSTRAINT `course_assignment_skills_id_course_assignment_foreign` FOREIGN KEY (`id_course_assignment`) REFERENCES `course_assignments` (`id_course_assignment`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_assignment_skills_id_skill_foreign` FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id_skill`) ON DELETE CASCADE;

--
-- Constraints for table `course_batches`
--
ALTER TABLE `course_batches`
  ADD CONSTRAINT `course_batches_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`) ON DELETE CASCADE;

--
-- Constraints for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD CONSTRAINT `course_enrollments_id_course_batch_foreign` FOREIGN KEY (`id_course_batch`) REFERENCES `course_batches` (`id_course_batch`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_enrollments_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD CONSTRAINT `course_materials_id_course_section_foreign` FOREIGN KEY (`id_course_section`) REFERENCES `course_sections` (`id_course_section`) ON DELETE CASCADE;

--
-- Constraints for table `course_material_resources`
--
ALTER TABLE `course_material_resources`
  ADD CONSTRAINT `course_material_resources_id_course_material_foreign` FOREIGN KEY (`id_course_material`) REFERENCES `course_materials` (`id_course_material`) ON DELETE CASCADE;

--
-- Constraints for table `course_material_skills`
--
ALTER TABLE `course_material_skills`
  ADD CONSTRAINT `course_material_skills_id_course_material_foreign` FOREIGN KEY (`id_course_material`) REFERENCES `course_materials` (`id_course_material`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_material_skills_id_skill_foreign` FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id_skill`) ON DELETE CASCADE;

--
-- Constraints for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD CONSTRAINT `course_reviews_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`),
  ADD CONSTRAINT `course_reviews_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`);

--
-- Constraints for table `course_rules`
--
ALTER TABLE `course_rules`
  ADD CONSTRAINT `course_rules_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`);

--
-- Constraints for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD CONSTRAINT `course_sections_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`);

--
-- Constraints for table `course_tools`
--
ALTER TABLE `course_tools`
  ADD CONSTRAINT `course_tools_id_course_foreign` FOREIGN KEY (`id_course`) REFERENCES `courses` (`id_course`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_tools_id_tool_foreign` FOREIGN KEY (`id_tool`) REFERENCES `tools` (`id_tool`) ON DELETE CASCADE;

--
-- Constraints for table `point_histories`
--
ALTER TABLE `point_histories`
  ADD CONSTRAINT `point_histories_id_course_enrollment_foreign` FOREIGN KEY (`id_course_enrollment`) REFERENCES `course_enrollments` (`id_course_enrollment`) ON DELETE CASCADE,
  ADD CONSTRAINT `point_histories_id_skill_foreign` FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id_skill`) ON DELETE CASCADE,
  ADD CONSTRAINT `point_histories_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_id_course_section_foreign` FOREIGN KEY (`id_course_section`) REFERENCES `course_sections` (`id_course_section`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD CONSTRAINT `quiz_options_id_quiz_question_foreign` FOREIGN KEY (`id_quiz_question`) REFERENCES `quiz_questions` (`id_quiz_question`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_option_resources`
--
ALTER TABLE `quiz_option_resources`
  ADD CONSTRAINT `quiz_option_resources_id_quiz_option_foreign` FOREIGN KEY (`id_quiz_option`) REFERENCES `quiz_options` (`id_quiz_option`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_id_quiz_foreign` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_question_resources`
--
ALTER TABLE `quiz_question_resources`
  ADD CONSTRAINT `quiz_question_resources_id_quiz_question_foreign` FOREIGN KEY (`id_quiz_question`) REFERENCES `quiz_questions` (`id_quiz_question`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_resources`
--
ALTER TABLE `quiz_resources`
  ADD CONSTRAINT `quiz_resources_id_quiz_foreign` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_skills`
--
ALTER TABLE `quiz_skills`
  ADD CONSTRAINT `quiz_skills_id_quiz_foreign` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_skills_id_skill_foreign` FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id_skill`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD CONSTRAINT `quiz_submissions_id_course_enrollment_foreign` FOREIGN KEY (`id_course_enrollment`) REFERENCES `course_enrollments` (`id_course_enrollment`),
  ADD CONSTRAINT `quiz_submissions_id_quiz_foreign` FOREIGN KEY (`id_quiz`) REFERENCES `quizzes` (`id_quiz`);

--
-- Constraints for table `quiz_submission_answers`
--
ALTER TABLE `quiz_submission_answers`
  ADD CONSTRAINT `quiz_submission_answers_id_quiz_option_foreign` FOREIGN KEY (`id_quiz_option`) REFERENCES `quiz_options` (`id_quiz_option`),
  ADD CONSTRAINT `quiz_submission_answers_id_quiz_question_foreign` FOREIGN KEY (`id_quiz_question`) REFERENCES `quiz_questions` (`id_quiz_question`),
  ADD CONSTRAINT `quiz_submission_answers_id_quiz_submission_foreign` FOREIGN KEY (`id_quiz_submission`) REFERENCES `quiz_submissions` (`id_quiz_submission`) ON DELETE CASCADE;

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_id_category_foreign` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE;

--
-- Constraints for table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `student_certificates`
--
ALTER TABLE `student_certificates`
  ADD CONSTRAINT `student_certificates_id_course_enrollment_foreign` FOREIGN KEY (`id_course_enrollment`) REFERENCES `course_enrollments` (`id_course_enrollment`) ON DELETE CASCADE;

--
-- Constraints for table `student_progress`
--
ALTER TABLE `student_progress`
  ADD CONSTRAINT `student_progress_id_course_enrollment_foreign` FOREIGN KEY (`id_course_enrollment`) REFERENCES `course_enrollments` (`id_course_enrollment`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_progress_id_course_material_foreign` FOREIGN KEY (`id_course_material`) REFERENCES `course_materials` (`id_course_material`) ON DELETE CASCADE;

--
-- Constraints for table `student_skill_points`
--
ALTER TABLE `student_skill_points`
  ADD CONSTRAINT `student_skill_points_id_skill_foreign` FOREIGN KEY (`id_skill`) REFERENCES `skills` (`id_skill`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_skill_points_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`) ON DELETE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_id_teacher_level_foreign` FOREIGN KEY (`id_teacher_level`) REFERENCES `teacher_levels` (`id_teacher_level`) ON DELETE CASCADE,
  ADD CONSTRAINT `teachers_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `teachers_categories`
--
ALTER TABLE `teachers_categories`
  ADD CONSTRAINT `teachers_categories_id_category_foreign` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE,
  ADD CONSTRAINT `teachers_categories_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`) ON DELETE CASCADE;

--
-- Constraints for table `teachers_certificates`
--
ALTER TABLE `teachers_certificates`
  ADD CONSTRAINT `teachers_certificates_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_level_course_level`
--
ALTER TABLE `teacher_level_course_level`
  ADD CONSTRAINT `teacher_level_course_level_id_course_level_foreign` FOREIGN KEY (`id_course_level`) REFERENCES `course_levels` (`id_course_level`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_level_course_level_id_teacher_level_foreign` FOREIGN KEY (`id_teacher_level`) REFERENCES `teacher_levels` (`id_teacher_level`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_reviews`
--
ALTER TABLE `teacher_reviews`
  ADD CONSTRAINT `teacher_reviews_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`),
  ADD CONSTRAINT `teacher_reviews_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`);

--
-- Constraints for table `teacher_update_categories`
--
ALTER TABLE `teacher_update_categories`
  ADD CONSTRAINT `teacher_update_categories_id_category_foreign` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_update_categories_id_teacher_update_request_foreign` FOREIGN KEY (`id_teacher_update_request`) REFERENCES `teacher_update_requests` (`id_teacher_update_request`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_update_certificates`
--
ALTER TABLE `teacher_update_certificates`
  ADD CONSTRAINT `teacher_update_certificates_id_teacher_update_request_foreign` FOREIGN KEY (`id_teacher_update_request`) REFERENCES `teacher_update_requests` (`id_teacher_update_request`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_update_requests`
--
ALTER TABLE `teacher_update_requests`
  ADD CONSTRAINT `teacher_update_requests_id_teacher_foreign` FOREIGN KEY (`id_teacher`) REFERENCES `teachers` (`id_teacher`) ON DELETE CASCADE;

--
-- Constraints for table `testimonies`
--
ALTER TABLE `testimonies`
  ADD CONSTRAINT `testimonies_id_student_foreign` FOREIGN KEY (`id_student`) REFERENCES `students` (`id_student`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
