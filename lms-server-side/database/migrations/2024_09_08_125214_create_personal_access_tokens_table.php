<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuidMorphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_histories');
        Schema::dropIfExists('student_skill_points');
        Schema::dropIfExists('student_progress');
        Schema::dropIfExists('student_certificates');
        Schema::dropIfExists('quiz_option_resources');
        Schema::dropIfExists('quiz_submission_answers');
        Schema::dropIfExists('quiz_submissions');
        Schema::dropIfExists('assignment_submission_resources');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('course_enrollments');
        Schema::dropIfExists('course_batches');
        Schema::dropIfExists('quiz_question_resources');
        Schema::dropIfExists('quiz_resources');
        Schema::dropIfExists('course_tools');
        Schema::dropIfExists('course_assignment_skills');
        Schema::dropIfExists('course_material_skills');
        Schema::dropIfExists('quiz_skills');
        Schema::dropIfExists('course_assignment_resources');
        Schema::dropIfExists('course_material_resources');
        Schema::dropIfExists('courses_materials_tools');
        Schema::dropIfExists('teacher_update_certificates');
        Schema::dropIfExists('teacher_update_categories');
        Schema::dropIfExists('teacher_update_requests');
        Schema::dropIfExists('teachers_certificates');
        Schema::dropIfExists('teachers_categories');
        Schema::dropIfExists('files');
        Schema::dropIfExists('rules');
        Schema::dropIfExists('course_skill');
        Schema::dropIfExists('contents_skills');
        Schema::dropIfExists('course_materials');
        Schema::dropIfExists('terms_conditions');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('social_media');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('about_page_subsections');
        Schema::dropIfExists('about_pages');
        Schema::dropIfExists('quiz_submissions');
        Schema::dropIfExists('quiz_options');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('email_verifications');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('about_us');
        Schema::dropIfExists('media_partners');
        Schema::dropIfExists('tools');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('course_rules');
        Schema::dropIfExists('testimonies');
        Schema::dropIfExists('course_reviews');
        Schema::dropIfExists('teacher_reviews');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('course_assignments');
        Schema::dropIfExists('course_contents');
        Schema::dropIfExists('course_sections');
        Schema::dropIfExists('teacher_level_course_level');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('course_levels');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('teacher_levels');
        Schema::dropIfExists('students');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');
        Schema::dropIfExists('questions');
    }
};
