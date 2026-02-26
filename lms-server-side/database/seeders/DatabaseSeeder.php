<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // Tambahkan ini
use Illuminate\Support\Str;
use Carbon\Carbon; // Tambahkan ini

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Seeder Users (Admin)
        $adminUserId = Str::uuid();
        DB::table('users')->insert([
            'id_user' => $adminUserId,
            'email' => 'admin@admin.com',
            'name' => 'Admin User',
            'password' => Hash::make('admin123'), 
            'role' => 'admin',
            'is_verified' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seeder Course Levels
        $courseLevelUuids = [];
        $courseLevelsData = []; 
        $courseLevels = [
            ['name' => 'Beginner', 'material' => 5, 'assignment' => 30, 'quiz' => 10, 'completion' => 60, 'certificate' => true],
            ['name' => 'Intermediate', 'material' => 10, 'assignment' => 40, 'quiz' => 20, 'completion' => 80, 'certificate' => true],
            ['name' => 'Advanced', 'material' => 15, 'assignment' => 50, 'quiz' => 30, 'completion' => 100, 'certificate' => true],
            ['name' => 'Professional', 'material' => 20, 'assignment' => 60, 'quiz' => 40, 'completion' => 120, 'certificate' => false],
            ['name' => 'Expert', 'material' => 25, 'assignment' => 70, 'quiz' => 50, 'completion' => 140, 'certificate' => false],
            ['name' => 'Certification', 'material' => 30, 'assignment' => 80, 'quiz' => 60, 'completion' => 160, 'certificate' => true],
        ];
        foreach ($courseLevels as $level) {
            $uuidObject = Str::uuid(); 
            $uuidString = $uuidObject->toString(); 

            $courseLevelUuids[] = $uuidString; 
            $courseLevelsData[$uuidString] = $level; 

            DB::table('course_levels')->insert([
                'id_course_level' => $uuidString,
                'name' => $level['name'],
                'point_course_material' => $level['material'],
                'point_assignment' => $level['assignment'],
                'point_quiz' => $level['quiz'],
                'point_course_completion' => $level['completion'],
                'certificate' => $level['certificate'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seeder Teacher Levels
        DB::table('teacher_levels')->insert([
            ['id_teacher_level' => 1, 'name' => 'Level 1', 'description' => 'Teacher level for beginner', 'max_course' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['id_teacher_level' => 2, 'name' => 'Level 2', 'description' => 'Teacher level for intermediate', 'max_course' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['id_teacher_level' => 3, 'name' => 'Level 3', 'description' => 'Teacher level for advanced', 'max_course' => 50, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Seeder Categories
        $categoryIds = [];
        $categories = ['Programming', 'Design', 'Marketing', 'Data Science', 'Business'];
        foreach ($categories as $cat) {
            $id = Str::uuid()->toString(); // Konversi ke string
            $categoryIds[] = $id;
            DB::table('categories')->insert([
                'id_category' => $id,
                'name' => $cat,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seeder Teacher User
        $teacherUserId = Str::uuid();
        DB::table('users')->insert([
            'id_user' => $teacherUserId,
            'email' => 'teacher@example.com',
            'name' => 'Teacher User',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
            'is_verified' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seeder Teachers
        $teacherId = Str::uuid();
        DB::table('teachers')->insert([
            'id_teacher' => $teacherId,
            'id_user' => $teacherUserId,
            'id_teacher_level' => 1,
            'status' => 'approved',
            'address' => '123 Teacher Street',
            'bio' => 'Experienced teacher in various fields.',
            'date_of_birth' => '1980-05-15',
            'education' => 'Master of Education',
            'phone_number' => '081234567891',
            'year_of_experience' => '10',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Ambil ID level pertama untuk course (gunakan dari $courseLevelUuids yang sekarang berisi string)
        $defaultCourseLevelId = $courseLevelUuids[0] ?? DB::table('course_levels')->first()->id_course_level;

        // Seeder Courses 
        $coursesData = [
            ['title' => 'Building Web Applications with Django', 'desc' => 'Learn the Django framework for building robust, database-driven web applications in Python, covering models, views, templates, and the admin interface.', 'duration' => 90],
            ['title' => 'Data Governance and Ethics in AI', 'desc' => 'Understand the principles of data governance, data quality management, privacy regulations (like GDPR), and ethical considerations in building and deploying AI models.', 'duration' => 60],
            ['title' => 'Introduction to SAS Programming for Analytics', 'desc' => 'Learn the basics of the SAS language for data manipulation, statistical analysis, and reporting, a common tool in finance and healthcare industries.', 'duration' => 70],
            ['title' => 'Comprehensive Web Development Bootcamp', 'desc' => 'Learn to build full-stack web applications from scratch, covering HTML, CSS, JavaScript, a backend language (e.g., Node.js or Python), databases, and deployment.', 'duration' => 120],
            ['title' => 'Backend Development with Python & Django/Flask', 'desc' => 'Master server-side logic, API development, database management, and authentication using popular Python frameworks like Django or Flask.', 'duration' => 90],
            ['title' => 'Modern Frontend Development with React/Vue/Angular', 'desc' => 'Build interactive and responsive user interfaces using modern JavaScript frameworks like React, Vue, or Angular. Covers state management, component-based architecture, and API consumption.', 'duration' => 95],
            ['title' => 'Mobile App Development (iOS & Android)', 'desc' => 'Learn to develop native or cross-platform mobile applications for iOS and Android. Covers UI/UX design, platform-specific features, and publishing to app stores.', 'duration' => 110],
            ['title' => 'Backend Development with Node.js and Express.js', 'desc' => 'Build scalable and high-performance RESTful APIs using Node.js and the Express.js framework. Covers asynchronous programming, middleware, and database integration.', 'duration' => 85],
            ['title' => 'Java Backend Development with Spring Boot', 'desc' => 'Develop robust enterprise-level applications and microservices using Spring Boot. Learn about dependency injection, Spring MVC, Spring Data, and Spring Security.', 'duration' => 100],
            ['title' => 'Full-Stack Web Development with Ruby on Rails', 'desc' => 'Master the Ruby on Rails framework to rapidly build complete web applications. Covers MVC architecture, ActiveRecord, and Rails conventions.', 'duration' => 90],
            ['title' => 'Server-Side Rendering with Next.js', 'desc' => 'Enhance your React applications with Next.js. Learn server-side rendering (SSR), static site generation (SSG), routing, and API routes for performant web apps.', 'duration' => 70],
            ['title' => 'Mobile UI/UX Design Principles', 'desc' => 'Learn the fundamentals of designing intuitive and engaging user interfaces and experiences for mobile applications. Covers wireframing, prototyping, and platform guidelines.', 'duration' => 60],
            ['title' => 'Cross-Platform Mobile Apps with React Native', 'desc' => 'Build native-like mobile applications for both iOS and Android using JavaScript and React Native. Learn about components, navigation, and accessing native device features.', 'duration' => 100],
            ['title' => 'Mobile App Development with Flutter & Dart', 'desc' => 'Create beautiful, natively compiled applications for mobile, web, and desktop from a single codebase using Google\'s Flutter framework and Dart language.', 'duration' => 105],
            ['title' => 'iOS App Development with Swift', 'desc' => 'Dive into native iOS development using Swift and Xcode. Learn to build apps for iPhone and iPad, covering UIKit/SwiftUI, Core Data, and App Store submission.', 'duration' => 110],
            ['title' => 'Android App Development with Kotlin', 'desc' => 'Develop modern Android applications using Kotlin, Google\'s preferred language for Android. Covers Android Studio, Jetpack components, and Material Design.', 'duration' => 110],
            ['title' => 'Advanced Docker and Kubernetes Orchestration', 'desc' => 'Deep dive into containerization with Docker and master Kubernetes for orchestrating, scaling, and managing containerized applications in production environments.', 'duration' => 90],
            ['title' => 'Cloud Security Fundamentals and Best Practices', 'desc' => 'Understand common cloud security threats and learn best practices for securing data, applications, and infrastructure on major cloud platforms (AWS, Azure, GCP).', 'duration' => 70],
            ['title' => 'Agile Project Management with Scrum', 'desc' => 'Learn the principles of Agile development and master the Scrum framework for managing complex software projects, including roles, events, and artifacts.', 'duration' => 50],
            ['title' => 'Software Testing and Quality Assurance Fundamentals', 'desc' => 'Understand the software testing lifecycle, different testing types (unit, integration, E2E), test automation strategies, and QA best practices.', 'duration' => 65],
            ['title' => 'Cybersecurity Fundamentals for Developers', 'desc' => 'Learn essential cybersecurity concepts, common vulnerabilities (OWASP Top 10), secure coding practices, and how to protect applications from attacks.', 'duration' => 80],
            ['title' => 'Introduction to Game Development with Unity', 'desc' => 'Begin your journey into game development using the Unity engine. Learn C# scripting, 2D/3D game creation basics, physics, and UI development.', 'duration' => 95],
            ['title' => 'Blockchain Fundamentals and Smart Contract Development', 'desc' => 'Explore the core concepts of blockchain technology, cryptocurrencies, and learn to develop and deploy smart contracts using Solidity on platforms like Ethereum.', 'duration' => 85],
            ['title' => 'UI Design and Prototyping with Figma', 'desc' => 'Master Figma for designing user interfaces, creating interactive prototypes, and collaborating with teams on web and mobile app designs.', 'duration' => 60],
            ['title' => 'Introduction to Internet of Things (IoT) Development', 'desc' => 'Learn the basics of IoT, including hardware components (e.g., Raspberry Pi, Arduino), sensor integration, network protocols, and cloud platforms for IoT data.', 'duration' => 75],
            ['title' => 'DevOps Fundamentals: Building CI/CD Pipelines', 'desc' => 'Understand DevOps principles and learn to build Continuous Integration and Continuous Deployment (CI/CD) pipelines using tools like Jenkins, GitLab CI, or GitHub Actions.', 'duration' => 80],
            ['title' => 'Dasar-Dasar Pengembangan Web Frontend', 'desc' => 'Kuasai blok bangunan inti web: HTML5 untuk struktur, CSS3 untuk styling (termasuk Flexbox dan Grid), dan JavaScript modern (ES6+) untuk interaktivitas. Sempurna untuk pemula.', 'duration' => 70],
            ['title' => 'Pembelajaran Mendalam React Development', 'desc' => 'Jadilah ahli React. Pelajari Hooks, Context API, Redux/Zustand untuk manajemen state, Next.js untuk server-side rendering, dan pengujian dengan Jest/React Testing Library.', 'duration' => 85],
            ['title' => 'CSS Lanjutan dan Desain UI untuk Pengembang', 'desc' => 'Tingkatkan UI Anda dengan teknik CSS canggih seperti animasi, transisi, Sass/SCSS, dan pola desain responsif. Termasuk pengenalan prinsip UI/UX dan sistem desain.', 'duration' => 55],
            ['title' => 'Perkakas JavaScript Modern dan Praktik Terbaik', 'desc' => 'Lebih dari sekadar dasar. Jelajahi TypeScript untuk keamanan tipe, alat build seperti Vite/Webpack, manajemen paket dengan npm/yarn, kontrol versi dengan Git, dan strategi pengujian otomatis.', 'duration' => 75],
            ['title' => 'Optimasi Kinerja Web dan Aksesibilitas (a11y)', 'desc' => 'Pelajari cara membangun situs web yang cepat dan dapat diakses. Mencakup Core Web Vitals, lazy loading, code splitting, optimasi gambar, atribut ARIA, dan pedoman WCAG untuk pengalaman web yang inklusif.', 'duration' => 45],
            
            // Courses based on Job Market Data
            ['title' => 'Account Executive & Sales Management', 'desc' => 'Pelajari strategi penjualan profesional, manajemen akun, negosiasi, dan membangun hubungan pelanggan jangka panjang. Termasuk teknik presentasi dan pencapaian target penjualan.', 'duration' => 60],
            ['title' => 'Enterprise Architecture dengan TOGAF Framework', 'desc' => 'Kuasai arsitektur enterprise menggunakan framework TOGAF ADM. Pelajari desain sistem, integrasi, dan cloud platform untuk infrastruktur IT yang efektif.', 'duration' => 80],
            ['title' => 'Digital Advertising: Meta Ads, Google Ads & TikTok Ads', 'desc' => 'Menguasai strategi periklanan digital di platform utama. Belajar membuat kampanye, analisis data, optimasi iklan, dan strategi konversi yang efektif.', 'duration' => 75],
            ['title' => 'Account Payable & Finance Management', 'desc' => 'Pelajari proses keuangan perusahaan, manajemen invoice, pembayaran, rekonsiliasi bank, dan compliance terhadap regulasi keuangan internasional.', 'duration' => 65],
            ['title' => 'Project Management: Agile, Scrum & PDCA', 'desc' => 'Kuasai metodologi manajemen proyek modern. Belajar Agile, Scrum, PDCA cycle, koordinasi tim, dan tools seperti Jira untuk pengelolaan proyek yang efisien.', 'duration' => 70],
            ['title' => 'Operations Management & Supply Chain', 'desc' => 'Pelajari manajemen operasional, monitoring performance, analisis supply-demand, dan koordinasi dengan berbagai stakeholder untuk efisiensi operasional.', 'duration' => 55],
            ['title' => 'Software Engineering Internship Program', 'desc' => 'Program magang untuk pengembangan software. Belajar automation workflow, integrasi API, JavaScript/TypeScript, dan tools development modern.', 'duration' => 90],
            ['title' => 'IT Project Management: PMBOK & SDLC', 'desc' => 'Manajemen proyek IT profesional menggunakan PMBOK dan pemahaman SDLC. Termasuk risk management, testing phases, dan dokumentasi proyek.', 'duration' => 85],
            ['title' => 'Digital Marketing Strategy & Growth', 'desc' => 'Strategi pemasaran digital komprehensif untuk brand awareness dan customer acquisition. Termasuk retargeting, SEO/SEM, dan analisis customer journey.', 'duration' => 70],
            ['title' => 'Full-Stack Development: Java, Python & API', 'desc' => 'Pengembangan aplikasi full-stack menggunakan Java dan Python. Belajar database design, API development, testing, dan deployment aplikasi skala besar.', 'duration' => 100],
            ['title' => 'Graphic Design & Visual Communication', 'desc' => 'Desain grafis profesional untuk media digital dan e-commerce. Kuasai Adobe Creative Suite, typography, branding, dan desain untuk platform sosial media.', 'duration' => 65],
            ['title' => 'Social Media Content Creation & Management', 'desc' => 'Strategi konten media sosial yang efektif. Belajar content creation, video editing, community management, dan brand communication di platform digital.', 'duration' => 50],
            ['title' => 'Health, Safety & Environment (HSE) Management', 'desc' => 'Manajemen keselamatan kerja dan lingkungan. Pelajari regulasi K3, audit SMKP, investigasi kecelakaan, dan program pelatihan safety.', 'duration' => 75],
            ['title' => 'Digital Marketing Specialist: SEM & Property', 'desc' => 'Spesialisasi digital marketing untuk industri properti. Termasuk SEM tools, targeting pelanggan B2B, dan strategi marketing untuk real estate.', 'duration' => 60],
            ['title' => 'Data Analysis & Business Intelligence', 'desc' => 'Analisis data bisnis menggunakan SQL, Python, dan tools visualisasi. Belajar descriptive & predictive analytics, clustering, dan data-driven decision making.', 'duration' => 80],
            ['title' => 'Legal Drafting & Corporate Law', 'desc' => 'Penyusunan dokumen hukum perusahaan, kontrak bisnis, compliance, dan pengurusan perizinan. Termasuk hukum perdata dan administrasi legal.', 'duration' => 70],
            ['title' => 'Warehouse Management & Logistics', 'desc' => 'Manajemen gudang dan logistik modern. Pelajari inventory management, forklift operation, supply chain optimization, dan sistem warehouse management.', 'duration' => 55],
            ['title' => 'Retail Sales & Customer Relationship', 'desc' => 'Strategi penjualan retail dan manajemen hubungan pelanggan. Termasuk product promotion, territory management, dan pencapaian target penjualan.', 'duration' => 45],
            ['title' => 'Accounting Software & Financial Reporting', 'desc' => 'Penggunaan software akuntansi profesional, financial reporting, tax compliance, dan analisis keuangan untuk pengambilan keputusan bisnis.', 'duration' => 65],
            ['title' => 'E-Commerce & Marketplace Management', 'desc' => 'Manajemen platform e-commerce dan marketplace. Belajar strategi penjualan online, campaign optimization, analytics, dan customer acquisition.', 'duration' => 60],
            ['title' => 'Photography & Videography for Content', 'desc' => 'Teknik fotografi dan videografi untuk konten digital. Termasuk editing, storytelling visual, dan produksi konten untuk media sosial dan marketing.', 'duration' => 55],
            ['title' => 'Content Creation & Brand Strategy', 'desc' => 'Pembuatan konten kreatif dan strategi brand. Belajar content planning, storytelling, visual design, dan engagement strategy untuk berbagai platform.', 'duration' => 50],
            ['title' => 'Tax Management & Compliance', 'desc' => 'Manajemen pajak perusahaan dan compliance. Pelajari tax planning, filing, audit preparation, dan optimasi efisiensi pajak sesuai regulasi.', 'duration' => 70],
            ['title' => 'Civil Engineering & Construction Management', 'desc' => 'Teknik sipil dan manajemen konstruksi. Termasuk AutoCAD, Civil 3D, estimasi biaya, pengawasan proyek, dan safety management konstruksi.', 'duration' => 90],
            ['title' => 'Software Engineering: Backend Development', 'desc' => 'Pengembangan backend scalable menggunakan Golang, Java, dan database modern. Termasuk microservices, API design, dan system architecture.', 'duration' => 95],
            ['title' => 'Mobile Development: Android & Kotlin', 'desc' => 'Pengembangan aplikasi mobile Android menggunakan Kotlin. Belajar Android APIs, UI/UX design, testing, dan deployment ke Google Play Store.', 'duration' => 85],
            ['title' => 'Data Science & Machine Learning Applications', 'desc' => 'Penerapan data science dan machine learning dalam bisnis. Termasuk Python, statistical analysis, model building, dan data visualization.', 'duration' => 100],
            ['title' => 'Quality Control & Software Testing', 'desc' => 'Quality assurance dan software testing professional. Belajar manual/automated testing, UAT, tools seperti Selenium dan Katalon, dan test management.', 'duration' => 75],
            ['title' => 'Business Development & Strategic Planning', 'desc' => 'Pengembangan bisnis dan perencanaan strategis. Termasuk market analysis, partnership development, negotiation skills, dan strategic thinking.', 'duration' => 65],
            ['title' => 'Human Resources & Payroll Management', 'desc' => 'Manajemen SDM dan sistem penggajian. Pelajari recruitment, employee relations, payroll processing, dan HR analytics menggunakan tools modern.', 'duration' => 60],
            ['title' => 'Search Engine Optimization (SEO) & SEM', 'desc' => 'Optimasi mesin pencari dan search engine marketing. Termasuk keyword research, content optimization, Google Ads, dan SEO tools professional.', 'duration' => 55],
            ['title' => 'Virtual Assistant & Remote Work Skills', 'desc' => 'Keterampilan virtual assistant dan remote work. Belajar client communication, project management tools, dan administrative skills untuk kerja jarak jauh.', 'duration' => 45],
            ['title' => 'Product Management & Development Strategy', 'desc' => 'Manajemen produk dan strategi pengembangan. Termasuk product roadmap, user research, A/B testing, dan product analytics untuk growth.', 'duration' => 80],
            ['title' => 'Network Administration & IT Infrastructure', 'desc' => 'Administrasi jaringan dan infrastruktur IT. Pelajari TCP/IP, routing protocols, network security, dan maintenance sistem jaringan enterprise.', 'duration' => 85],
            ['title' => 'Database Administration: Oracle & SQL', 'desc' => 'Administrasi database Oracle dan SQL advanced. Termasuk performance tuning, backup recovery, security management, dan high availability solutions.', 'duration' => 90],
            ['title' => 'Engineering Management & Team Leadership', 'desc' => 'Manajemen engineering dan kepemimpinan tim teknis. Belajar people management, technical leadership, delivery optimization, dan team development.', 'duration' => 75],
            ['title' => 'iOS Development with Swift & Xcode', 'desc' => 'Pengembangan aplikasi iOS menggunakan Swift dan Xcode. Termasuk UI/UX design, App Store guidelines, dan best practices mobile development.', 'duration' => 85],
        ];

        $seededCourseIds = [];
        foreach ($coursesData as $index => $course) {
            $courseId = Str::uuid()->toString();
            $seededCourseIds[] = $courseId;
            
            DB::table('courses')->insert([
                'id_course' => $courseId,
                'id_category' => $categoryIds[array_rand($categoryIds)],
                'id_teacher' => $teacherId,
                'id_course_level' => $courseLevelUuids[array_rand($courseLevelUuids)] ?? $defaultCourseLevelId,
                'title' => $course['title'],
                'description' => $course['desc'],
                'rules' => 'Complete all materials and assignments.',
                'thumbnail' => null, // Set null agar thumbnail_link yang digunakan
                'thumbnail_link' => 'https://www.youtube.com/watch?v=GQS7wPujL2k',
                'duration' => $course['duration'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seeder Course Batches
        foreach ($seededCourseIds as $courseId) {
            // Buat 2-3 batch per course
            $numberOfBatches = rand(2, 3);
            for ($batch = 1; $batch <= $numberOfBatches; $batch++) {
                $batchId = Str::uuid()->toString();
                $startDate = Carbon::now()->addDays(rand(1, 30));
                $endDate = $startDate->copy()->addDays(rand(30, 90));
                
                DB::table('course_batches')->insert([
                    'id_course_batch' => $batchId,
                    'id_course' => $courseId,
                    'capacity' => rand(20, 50),
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                    'status' => $batch == 1 ? 'open' : (rand(0, 1) ? 'open' : 'closed'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // --- MULAI PENAMBAHAN SEEDER STUDENT ---

        if (empty($seededCourseIds)) {
            $this->command->info('No courses available to enroll students. Skipping student seeder.');
            return;
        }
        if (empty($courseLevelUuids)) {
            $this->command->info('No course levels available. Skipping student seeder related to certificates.');
            return;
        }

        $numberOfStudents = 15;
        $studentProfileIds = [];

        for ($i = 1; $i <= $numberOfStudents; $i++) {
            $userStudentId = Str::uuid();
            DB::table('users')->insert([
                'id_user' => $userStudentId,
                'email' => "student{$i}@example.com",
                'name' => "Student {$i} Name",
                'password' => Hash::make('password123'),
                'role' => 'student',
                'is_verified' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $studentProfileId = Str::uuid();
            DB::table('students')->insert([
                'id_student' => $studentProfileId,
                'id_user' => $userStudentId,
                'phone' => '081100000' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'address' => "Address Student {$i}",
                'date_of_birth' => Carbon::now()->subYears(rand(18, 30))->subDays(rand(0, 365)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $studentProfileIds[] = $studentProfileId->toString();
        }

        // Enroll students in some completed courses
        foreach ($studentProfileIds as $studentIdString) {
            $numberOfCompletedCourses = rand(2, min(5, count($seededCourseIds)));
            $completedCourseKeys = (array) array_rand($seededCourseIds, $numberOfCompletedCourses);
            if (count($seededCourseIds) == 1 && !is_array($completedCourseKeys)) $completedCourseKeys = [$completedCourseKeys];


            foreach ($completedCourseKeys as $key) {
                $courseIdString = $seededCourseIds[$key];
                $courseDetails = DB::table('courses')->where('id_course', $courseIdString)->first();
                if (!$courseDetails) continue;

                $courseLevelIdString = $courseDetails->id_course_level;

                $batchId = Str::uuid();
                DB::table('course_batches')->insert([
                    'id_course_batch' => $batchId,
                    'id_course' => $courseIdString,
                    'capacity' => 50,
                    'start_date' => Carbon::now()->subMonths(3)->addDays(rand(0, 10)),
                    'end_date' => Carbon::now()->subMonths(1)->subDays(rand(0, 10)),
                    'status' => 'closed',
                    'created_at' => now()->subMonths(3),
                    'updated_at' => now()->subMonths(1),
                ]);

                $enrollmentId = Str::uuid();
                $enrollmentStartDate = Carbon::now()->subMonths(3)->addDays(rand(0, 10));
                $enrollmentCompletedAt = $enrollmentStartDate->copy()->addDays($courseDetails->duration + rand(5, 15));

                DB::table('course_enrollments')->insert([
                    'id_course_enrollment' => $enrollmentId,
                    'id_course_batch' => $batchId,
                    'id_student' => $studentIdString,
                    'start_date' => $enrollmentStartDate,
                    'end_date' => $enrollmentCompletedAt->copy()->addMonths(1),
                    'status' => 'completed',
                    'completed_at' => $enrollmentCompletedAt,
                    'created_at' => $enrollmentStartDate,
                    'updated_at' => $enrollmentCompletedAt,
                ]);

                $levelInfo = $courseLevelsData[$courseLevelIdString] ?? null;
                if ($levelInfo && $levelInfo['certificate']) {
                    DB::table('student_certificates')->insert([
                        'id_student_certificate' => Str::uuid(),
                        'id_course_enrollment' => $enrollmentId,
                        'file' => "certificate_{$studentIdString}_{$courseIdString}.pdf",
                        'created_at' => $enrollmentCompletedAt,
                        'updated_at' => $enrollmentCompletedAt,
                    ]);
                }
            }
        }
        $this->command->info('Student seeders with completed courses created successfully.');
    }
}
