<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppTable extends Migration
{
    public function up()
    {
        // Table Users
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id_user')->primary();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('password');
            $table->enum('role', ['student', 'teacher', 'admin']);
            $table->boolean('is_verified')->default(false);
            $table->string('job_portal_id')->nullable();
            $table->timestamp('job_portal_linked_at')->nullable();
            $table->timestamps();
        });

        // Table Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id_category')->primary();
            $table->string('name');
            $table->timestamps();
        });

        // Table Skills
        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id_skill')->primary();
            $table->uuid('id_category');
            $table->foreign('id_category')->references('id_category')->on('categories')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });

        // Table Tools
        Schema::create('tools', function (Blueprint $table) {
            $table->uuid('id_tool')->primary();
            $table->string('name');
            $table->string('image');
            $table->timestamps();
        });

        // Table Students
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id_student')->primary();
            $table->uuid('id_user');
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        //Table Teacher Levels
        Schema::create('teacher_levels', function (Blueprint $table) {
            $table->id('id_teacher_level')->primary();
            $table->string('name');
            $table->text('description');
            $table->integer('max_course');
            $table->timestamps();
        });

        // Table Teachers
        Schema::create('teachers', function (Blueprint $table) {
            $table->uuid('id_teacher')->primary();
            $table->uuid('id_user');
            $table->unsignedBigInteger('id_teacher_level')->nullable();
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_teacher_level')->references('id_teacher_level')->on('teacher_levels')->onDelete('cascade')->nullable();
            $table->string('address')->nullable();
            $table->text('bio')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('education')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('year_of_experience')->nullable();
            $table->string('photo_profile')->nullable();
            $table->string('portofolio')->nullable();
            $table->string('identity')->nullable();
            $table->enum('status', ['not_submitted', 'submitted', 'approved', 'rejected'])->default('not_submitted');
            $table->string('note')->nullable();
            $table->string('affiliation')->nullable();
            $table->timestamps();
        });

        // Table Teachers Cerfiticates
        Schema::create('teachers_certificates', function (Blueprint $table) {
            $table->uuid('id_teacher_certificate')->primary();
            $table->uuid('id_teacher');
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('file');
            $table->timestamps();
        });

        // Table Relation Teachers with Categories
        Schema::create('teachers_categories', function (Blueprint $table) {
            $table->uuid('id_teacher');
            $table->uuid('id_category');
            $table->primary(['id_teacher', 'id_category']);
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers')->onDelete('cascade');
            $table->foreign('id_category')->references('id_category')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // Table Teacher Update Requests
        Schema::create('teacher_update_requests', function (Blueprint $table) {
            $table->uuid('id_teacher_update_request')->primary();
            $table->enum('type', ['profile', 'level']);
            $table->uuid('id_teacher');
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->text('bio')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('education')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('year_of_experience')->nullable();
            $table->string('photo_profile')->nullable();
            $table->string('portofolio')->nullable();
            $table->string('identity')->nullable();
            $table->enum('status', ['submitted', 'approved', 'rejected'])->default('submitted');
            $table->string('affiliation')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
        });

        // Table Teacher Update Certificates
        Schema::create('teacher_update_certificates', function (Blueprint $table) {
            $table->uuid('id_request_certificate')->primary();
            $table->uuid('id_teacher_update_request');
            $table->foreign('id_teacher_update_request')->references('id_teacher_update_request')->on('teacher_update_requests')->onDelete('cascade');
            $table->string('file');
            $table->string('name');
            $table->timestamps();
        });

        // Table Teacher Update Categories
        Schema::create('teacher_update_categories', function (Blueprint $table) {
            $table->uuid('id_teacher_update_request');
            $table->uuid('id_category');
            $table->primary(['id_teacher_update_request', 'id_category']);
            $table->foreign('id_teacher_update_request')->references('id_teacher_update_request')->on('teacher_update_requests')->onDelete('cascade');
            $table->foreign('id_category')->references('id_category')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // Table Course Levels
        Schema::create('course_levels', function (Blueprint $table) {
            $table->uuid('id_course_level')->primary();
            $table->string('name');
            $table->integer('point_course_material');
            $table->integer('point_assignment');
            $table->integer('point_quiz');
            $table->integer('point_course_completion');
            $table->boolean('certificate')->default(false);
            $table->timestamps();
        });

        // Table Relation Teacher Level with Course Level
        Schema::create('teacher_level_course_level', function (Blueprint $table) {
            $table->id('id_teacher_level');
            $table->uuid('id_course_level');
            $table->primary(['id_teacher_level', 'id_course_level']);
            $table->foreign('id_teacher_level')->references('id_teacher_level')->on('teacher_levels')->onDelete('cascade');
            $table->foreign('id_course_level')->references('id_course_level')->on('course_levels')->onDelete('cascade');
        });

        // Table Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id_course')->primary();
            $table->uuid('id_category');
            $table->uuid('id_teacher');
            $table->uuid('id_course_level');
            $table->foreign('id_category')->references('id_category')->on('categories');
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers');
            $table->foreign('id_course_level')->references('id_course_level')->on('course_levels');
            $table->string('title');
            $table->string('thumbnail')->nullable();
            $table->string('thumbnail_link')->nullable();
            $table->longText('description');
            $table->longText('rules');
            $table->integer('duration');
            $table->timestamps();
        });

        // Table Relation Courses with Tools
        Schema::create('course_tools', function (Blueprint $table) {
            $table->uuid('id_course');
            $table->uuid('id_tool');
            $table->primary(['id_course', 'id_tool']);
            $table->foreign('id_course')->references('id_course')->on('courses')->onDelete('cascade');
            $table->foreign('id_tool')->references('id_tool')->on('tools')->onDelete('cascade');
        });

        // Table Course Section
        Schema::create('course_sections', function (Blueprint $table) {
            $table->uuid('id_course_section')->primary();
            $table->uuid('id_course');
            $table->foreign('id_course')->references('id_course')->on('courses');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Table Course Materials
        Schema::create('course_materials', function (Blueprint $table) {
            $table->uuid('id_course_material')->primary();
            $table->uuid('id_course_section');
            $table->foreign('id_course_section')->references('id_course_section')->on('course_sections')->onDelete('cascade');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('video_link')->nullable();
            $table->timestamps();
        });

        // Table Relation Courses Materials with Skill        
        Schema::create('course_material_skills', function (Blueprint $table) {
            $table->uuid('id_course_material');
            $table->uuid('id_skill');
            $table->primary(['id_course_material', 'id_skill']);
            $table->foreign('id_course_material')->references('id_course_material')->on('course_materials')->onDelete('cascade');
            $table->foreign('id_skill')->references('id_skill')->on('skills')->onDelete('cascade');
        });

        // Table Resources Courses Materials 
        Schema::create('course_material_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_course_material')->nullable();
            $table->foreign('id_course_material')->references('id_course_material')->on('course_materials')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        // Table Course Assignments
        Schema::create('course_assignments', function (Blueprint $table) {
            $table->uuid('id_course_assignment')->primary();
            $table->uuid('id_course_section');
            $table->foreign('id_course_section')->references('id_course_section')->on('course_sections')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
        });

        // Table Relation Assignments with Skill        
        Schema::create('course_assignment_skills', function (Blueprint $table) {
            $table->uuid('id_course_assignment');
            $table->uuid('id_skill');
            $table->primary(['id_course_assignment', 'id_skill']);
            $table->foreign('id_course_assignment')->references('id_course_assignment')->on('course_assignments')->onDelete('cascade');
            $table->foreign('id_skill')->references('id_skill')->on('skills')->onDelete('cascade');
        });

        // Table Resources Assignment
        Schema::create('course_assignment_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_course_assignment')->nullable();
            $table->foreign('id_course_assignment')->references('id_course_assignment')->on('course_assignments')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        //Table Quiz
        Schema::create('quizzes', function (Blueprint $table) {
            $table->uuid('id_quiz')->primary();
            $table->uuid('id_course_section');
            $table->foreign('id_course_section')->references('id_course_section')->on('course_sections')->onDelete('cascade');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->integer('duration');
            $table->integer('max_attempt');
            $table->timestamps();
        });

        // Table Relation Quiz with Skill        
        Schema::create('quiz_skills', function (Blueprint $table) {
            $table->uuid('id_quiz');
            $table->uuid('id_skill');
            $table->primary(['id_quiz', 'id_skill']);
            $table->foreign('id_quiz')->references('id_quiz')->on('quizzes')->onDelete('cascade');
            $table->foreign('id_skill')->references('id_skill')->on('skills')->onDelete('cascade');
        });

        // Table Resources Quiz 
        Schema::create('quiz_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_quiz')->nullable();
            $table->foreign('id_quiz')->references('id_quiz')->on('quizzes')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        // Table Quiz Questions
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->uuid('id_quiz_question')->primary();
            $table->uuid('id_quiz');
            $table->foreign('id_quiz')->references('id_quiz')->on('quizzes')->onDelete('cascade');
            $table->enum('type', ['single_choice', 'multiple_choice', 'essay']);
            $table->longText('question');
            $table->timestamps();
        });

        // Table Resources Quiz Questions 
        Schema::create('quiz_question_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_quiz_question')->nullable();
            $table->foreign('id_quiz_question')->references('id_quiz_question')->on('quiz_questions')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        //Table Quiz Options
        Schema::create('quiz_options', function (Blueprint $table) {
            $table->uuid('id_quiz_option')->primary();
            $table->uuid('id_quiz_question');
            $table->foreign('id_quiz_question')->references('id_quiz_question')->on('quiz_questions')->onDelete('cascade');
            $table->longText('answer')->nullable();
            $table->longText('reference_answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->timestamps();
        });

        // Table Resources Quiz Options 
        Schema::create('quiz_option_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_quiz_option')->nullable();
            $table->foreign('id_quiz_option')->references('id_quiz_option')->on('quiz_options')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        // Table Teacher Review
        Schema::create('teacher_reviews', function (Blueprint $table) {
            $table->uuid('id_teacher_review')->primary();
            $table->uuid('id_student');
            $table->uuid('id_teacher');
            $table->foreign('id_student')->references('id_student')->on('students');
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers');
            $table->integer('rating');
            $table->text('content')->nullable();
            $table->timestamps();
        });

        // Table Course Review
        Schema::create('course_reviews', function (Blueprint $table) {
            $table->uuid('id_course_review')->primary();
            $table->uuid('id_student');
            $table->uuid('id_course');
            $table->foreign('id_student')->references('id_student')->on('students');
            $table->foreign('id_course')->references('id_course')->on('courses');
            $table->integer('rating');
            $table->text('content')->nullable();
            $table->timestamps();
        });

        // Table Course Rules
        Schema::create('course_rules', function (Blueprint $table) {
            $table->uuid('id_course_rule')->primary();
            $table->uuid('id_course');
            $table->foreign('id_course')->references('id_course')->on('courses');
            $table->string('title');
            $table->longText('description');
            $table->timestamps();
        });

        // Table FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->uuid('id_faq')->primary();
            $table->string('title');
            $table->text('answer');
            $table->timestamps();
        });

        // Table Media Partners
        Schema::create('media_partners', function (Blueprint $table) {
            $table->uuid('id_media_partner')->primary();
            $table->string('name');
            $table->string('image');
            $table->timestamps();
        });

        // Table Social Media
        Schema::create('social_media', function (Blueprint $table) {
            $table->id('id_social_media')->primary();
            $table->string('phone_number')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('instagram')->nullable();
            $table->string('x')->nullable();
            $table->string('youtube')->nullable();
            $table->string('linkedin')->nullable();
            $table->timestamps();
        });

        // About_us
        Schema::create('about_us', function (Blueprint $table) {
            $table->id('id_about_us')->primary();
            $table->string('title')->nullable();
            $table->longText('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // Questions
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id_question')->primary();
            $table->string('name');
            $table->string('email');
            $table->text('questions');
            $table->timestamps();
        });

        // Social Links
        Schema::create('social_links', function (Blueprint $table) {
            $table->uuid('id_social_link')->primary();
            $table->uuid('id_teacher');
            $table->foreign('id_teacher')->references('id_teacher')->on('teachers');
            $table->string('name');
            $table->string('link');
            $table->timestamps();
        });

        // Email Verification
        Schema::create('email_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('verification_code');
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        // Table Terms Conditions
        Schema::create('terms_conditions', function (Blueprint $table) {
            $table->id('id_term_condition')->primary();
            $table->longText('content')->nullable();
            $table->timestamps();
        });

        // Table Course Batches
        Schema::create('course_batches', function (Blueprint $table) {
            $table->uuid('id_course_batch')->primary();
            $table->uuid('id_course');
            $table->foreign('id_course')->references('id_course')->on('courses')->onDelete('cascade');
            $table->integer('capacity');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['open', 'closed'])->default('closed');
            $table->timestamps();
        });

        // Table Course Enrollment
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->uuid('id_course_enrollment')->primary();
            $table->uuid('id_course_batch');
            $table->uuid('id_student');
            $table->foreign('id_course_batch')->references('id_course_batch')->on('course_batches')->onDelete('cascade');
            $table->foreign('id_student')->references('id_student')->on('students')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['enrolled', 'completed', 'failed'])->default('enrolled');
            $table->date('completed_at')->nullable();
            $table->timestamps();
        });

        // Table Assignment Submission
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->uuid('id_assignment_submission')->primary();
            $table->uuid('id_course_enrollment');
            $table->uuid('id_course_assignment');
            $table->foreign('id_course_enrollment')->references('id_course_enrollment')->on('course_enrollments');
            $table->foreign('id_course_assignment')->references('id_course_assignment')->on('course_assignments');
            $table->integer('grade')->nullable();
            $table->timestamps();
        });

        // Table Resources Assignment Submission
        Schema::create('assignment_submission_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_assignment_submission')->nullable();
            $table->foreign('id_assignment_submission')->references('id_assignment_submission')->on('assignment_submissions')->onDelete('cascade');
            $table->string('fileid');
            $table->string('name');
            $table->timestamps();
        });

        //Table Quiz Submission
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->uuid('id_quiz_submission')->primary();
            $table->uuid('id_course_enrollment');
            $table->uuid('id_quiz');
            $table->foreign('id_course_enrollment')->references('id_course_enrollment')->on('course_enrollments');
            $table->foreign('id_quiz')->references('id_quiz')->on('quizzes');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->enum('status', ['started', 'completed'])->default('started');
            $table->integer('attempt_number');
            $table->integer('grade')->nullable();
            $table->timestamps();
        });

        // Table Quiz Answer Submission
        Schema::create('quiz_submission_answers', function (Blueprint $table) {
            $table->uuid('id_quiz_submission_answer')->primary();
            $table->uuid('id_quiz_submission');
            $table->uuid('id_quiz_question');
            $table->uuid('id_quiz_option')->nullable();
            $table->foreign('id_quiz_submission')->references('id_quiz_submission')->on('quiz_submissions')->onDelete('cascade');
            $table->foreign('id_quiz_question')->references('id_quiz_question')->on('quiz_questions');
            $table->foreign('id_quiz_option')->references('id_quiz_option')->on('quiz_options');
            $table->longText('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->timestamps();
        });

        // Table Student Progressing
        Schema::create('student_progress', function (Blueprint $table) {
            $table->uuid('id_student_progress')->primary();
            $table->uuid('id_course_enrollment');
            $table->uuid('id_course_material');
            $table->foreign('id_course_enrollment')->references('id_course_enrollment')->on('course_enrollments')->onDelete('cascade');
            $table->foreign('id_course_material')->references('id_course_material')->on('course_materials')->onDelete('cascade');
            $table->timestamps();
        });

        // Table Student Skill Points
        Schema::create('student_skill_points', function (Blueprint $table) {
            $table->uuid('id_student_skill_point')->primary();
            $table->uuid('id_student');
            $table->uuid('id_skill');
            $table->integer('point')->default(0);
            $table->foreign('id_student')->references('id_student')->on('students')->onDelete('cascade');
            $table->foreign('id_skill')->references('id_skill')->on('skills')->onDelete('cascade');
            $table->unique(['id_student', 'id_skill']);
            $table->timestamps();
        });

        // Table Point History 
        Schema::create('point_histories', function (Blueprint $table) {
            $table->uuid('id_point_history')->primary();
            $table->uuid('id_student');
            $table->uuid('id_course_enrollment');
            $table->uuid('id_skill');
            $table->uuid('source_id');
            $table->enum('source_type', ['course_material', 'course_assignment', 'quiz', 'course_completion', 'skill_point', 'assignment_submission', 'quiz_submission']);
            $table->integer('point');
            $table->foreign('id_skill')->references('id_skill')->on('skills')->onDelete('cascade');
            $table->foreign('id_student')->references('id_student')->on('students')->onDelete('cascade');
            $table->foreign('id_course_enrollment')->references('id_course_enrollment')->on('course_enrollments')->onDelete('cascade');
            $table->timestamps();
        });

        // Student Certificates
        Schema::create('student_certificates', function (Blueprint $table) {
            $table->uuid('id_student_certificate')->primary();
            $table->uuid('id_course_enrollment');
            $table->foreign('id_course_enrollment')->references('id_course_enrollment')->on('course_enrollments')->onDelete('cascade');
            $table->string('file');
            $table->timestamps();
        });

        // Table Testimonies
        Schema::create('testimonies', function (Blueprint $table) {
            $table->uuid('id_testimony')->primary();
            $table->uuid('id_student');
            $table->foreign('id_student')->references('id_student')->on('students');
            $table->integer('rating');
            $table->text('content')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {}
}
