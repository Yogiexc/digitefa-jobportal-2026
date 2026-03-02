<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\AboutUsController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseMaterialController;
use App\Http\Controllers\CourseRuleController;
use App\Http\Controllers\MediaPartnerController;
use App\Http\Controllers\SocialMediaController;
use App\Http\Controllers\GdriveController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CourseReviewController;
use App\Http\Controllers\TeacherReviewController;
use App\Http\Controllers\TestimonyController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\QuizResourceController;
use App\Http\Controllers\QuizOptionResourceController;
use App\Http\Controllers\QuizSubmissionController;
use App\Http\Controllers\QuizSubmissionAnswerController;
use App\Http\Controllers\AboutPageController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\CourseLevelController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\CourseAssignmentController;
use App\Http\Controllers\CourseAssignmentResourceController;
use App\Http\Controllers\TeacherLevelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TermConditionController;
use App\Http\Controllers\TeacherUpdateRequestController;
use App\Http\Controllers\CourseMaterialResourceController;
use App\Http\Controllers\CourseSectionController;
use App\Http\Controllers\CourseBatchController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\AssignmentSubmissionResourceController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\JobPortalController;
use App\Http\Controllers\QuizQuestionResourceController;
use App\Http\Controllers\StudentProgressController;
use App\Http\Middleware\TrackStudentProgress;
use App\Http\Middleware\CheckCourseLimit;
use App\Http\Controllers\SkillPointController;
use App\Http\Controllers\StudentCertificateController;
use App\Http\Controllers\JobRecommendationController;


//About Us
Route::get('/about-us', [AboutUsController::class, 'getAboutUs']);
Route::post('/about-us/update', [AboutUsController::class, 'updateAboutUs']);

//About Pages
Route::get('about-pages', [AboutPageController::class, 'index']);
Route::get('about-pages/{id}', [AboutPageController::class, 'show']);
Route::post('about-pages', [AboutPageController::class, 'store']);
Route::post('about-pages/{id}', [AboutPageController::class, 'update']);
Route::delete('about-pages/{id}', [AboutPageController::class, 'destroy']);

//FAQ
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/{id}', [FaqController::class, 'show']);
Route::post('/faqs', [FaqController::class, 'store']);
Route::post('/faqs/{id}', [FaqController::class, 'update']);
Route::delete('/faqs/{id}', [FaqController::class, 'destroy']);

//Media Partners
Route::get('/media-partners', [MediaPartnerController::class, 'index']);
Route::get('/media-partners/{id}', [MediaPartnerController::class, 'show']);
Route::post('/media-partners', [MediaPartnerController::class, 'store']);
Route::post('/media-partners/{id}', [MediaPartnerController::class, 'update']);
Route::delete('/media-partners/{id}', [MediaPartnerController::class, 'destroy']);

// Tools
Route::get('/tools', [ToolController::class, 'index']);
Route::get('/tools/{id}', [ToolController::class, 'show']);
Route::post('/tools', [ToolController::class, 'store']);
Route::post('/tools/{id}', [ToolController::class, 'update']);
Route::delete('/tools/{id}', [ToolController::class, 'destroy']);

//Social-Media  
Route::get('/social-media', [SocialMediaController::class, 'getSocialMedia']);
Route::post('/social-media/update', [SocialMediaController::class, 'updateSocialMedia']);

//Category
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::post('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

//Skill
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/skills/{id}', [SkillController::class, 'show']);
Route::post('/skills', [SkillController::class, 'store']);
Route::post('/skills/{id}', [SkillController::class, 'update']);
Route::delete('/skills/{id}', [SkillController::class, 'destroy']);

//Course Level
Route::get('/course-levels', [CourseLevelController::class, 'index']);
Route::get('/course-levels/{id}', [CourseLevelController::class, 'show']);
Route::post('/course-levels', [CourseLevelController::class, 'store']);
Route::post('/course-levels/{id}', [CourseLevelController::class, 'update']);
Route::delete('/course-levels/{id}', [CourseLevelController::class, 'destroy']);

//Course
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::post('/courses', [CourseController::class, 'store'])->middleware(['auth:sanctum', CheckCourseLimit::class]);
Route::post('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
Route::get('/courses/teacher/{id}', [CourseController::class, 'getTeacherCourses']);
Route::get('/courses-status', [CourseController::class, 'CourseById']);
Route::get('/courses-all', [CourseController::class, 'allCourse']);
Route::post('/courses-recommendations', [CourseController::class, 'getCourseRecommendations']);

//Course Section
Route::get('/course-sections', [CourseSectionController::class, 'index']);
Route::get('/course-sections/{id}', [CourseSectionController::class, 'show']);
Route::post('/course-sections', [CourseSectionController::class, 'store']);
Route::post('/course-sections/{id}', [CourseSectionController::class, 'update']);
Route::delete('/course-sections/{id}', [CourseSectionController::class, 'destroy']);
Route::get('/course-sections-student', [CourseSectionController::class, 'getSectionsWithProgress']);

//Course Material
Route::get('/course-materials', [CourseMaterialController::class, 'index']);
Route::get('/course-materials/{id}', [CourseMaterialController::class, 'show']);
Route::post('/course-materials', [CourseMaterialController::class, 'store']);
Route::post('/course-materials/{id}', [CourseMaterialController::class, 'update']);
Route::delete('/course-materials/{id}', [CourseMaterialController::class, 'destroy']);
Route::get('/course-materials/download/{id}', [CourseMaterialController::class, 'downloadAllResources']);
Route::get('/course-student-materials/{id}', [CourseMaterialController::class, 'show'])->middleware(['auth:sanctum', TrackStudentProgress::class]);

//Course Material Resources
Route::post('/gdrive/materials', [CourseMaterialResourceController::class, 'store']);
Route::get('/gdrive/materials/{id}', [CourseMaterialResourceController::class, 'download']);
Route::delete('/gdrive/materials/{id}', [CourseMaterialResourceController::class, 'destroy']);
Route::get('/gdrive/materials/preview/{id}', [CourseMaterialResourceController::class, 'preview']);

//Course Assignment
Route::get('/course-assignments', [CourseAssignmentController::class, 'index']);
Route::get('/course-assignments/{id}', [CourseAssignmentController::class, 'show']);
Route::post('/course-assignments', [CourseAssignmentController::class, 'store']);
Route::post('/course-assignments/{id}', [CourseAssignmentController::class, 'update']);
Route::delete('/course-assignments/{id}', [CourseAssignmentController::class, 'destroy']);
Route::get('/course-assignments/download/{id}', [CourseAssignmentController::class, 'downloadAllResources']);

//Course Assignment Resources
Route::post('/gdrive/assignments', [CourseAssignmentResourceController::class, 'store']);
Route::get('/gdrive/assignments/{id}', [CourseAssignmentResourceController::class, 'download']);
Route::delete('/gdrive/assignments/{id}', [CourseAssignmentResourceController::class, 'destroy']);
Route::get('/gdrive/assignments/preview/{id}', [CourseAssignmentResourceController::class, 'preview']);

//Rule
Route::get('/course-rules', [CourseRuleController::class, 'index']);
Route::get('/course-rules/{id}', [CourseRuleController::class, 'show']);
Route::post('/course-rules', [CourseRuleController::class, 'store']);
Route::post('/course-rules/{id}', [CourseRuleController::class, 'update']);
Route::delete('/course-rules/{id}', [CourseRuleController::class, 'destroy']);

//Certificate
Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/certificates/{id}', [CertificateController::class, 'show']);
Route::post('/certificates', [CertificateController::class, 'store']);
Route::post('/certificates/{id}', [CertificateController::class, 'update']);
Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);

//Course Review
Route::get('/course-reviews', [CourseReviewController::class, 'index']);
Route::get('/course-reviews/{id}', [CourseReviewController::class, 'show']);
Route::post('/course-reviews', [CourseReviewController::class, 'store']);
Route::post('/course-reviews/{id}', [CourseReviewController::class, 'update']);
Route::delete('/course-reviews/{id}', [CourseReviewController::class, 'destroy']);

//Teacher Review
Route::get('/teacher-reviews', [TeacherReviewController::class, 'index']);
Route::get('/teacher-reviews/{id}', [TeacherReviewController::class, 'show']);
Route::post('/teacher-reviews', [TeacherReviewController::class, 'store']);
Route::post('/teacher-reviews/{id}', [TeacherReviewController::class, 'update']);
Route::delete('/teacher-reviews/{id}', [TeacherReviewController::class, 'destroy']);

//Question
Route::get('/questions', [QuestionController::class, 'index']);
Route::get('/questions/{id}', [QuestionController::class, 'show']);
Route::post('/questions', [QuestionController::class, 'store']);
Route::post('/questions/{id}', [QuestionController::class, 'update']);
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);

//Testimony
Route::get('/testimonies', [TestimonyController::class, 'index']);
Route::get('/testimonies/{id}', [TestimonyController::class, 'show']);
Route::post('/testimonies', [TestimonyController::class, 'store']);
Route::post('/testimonies/{id}', [TestimonyController::class, 'update']);
Route::delete('/testimonies/{id}', [TestimonyController::class, 'destroy']);

//Student
Route::post('/students/{id}', [StudentController::class, 'update']);

// Teacher
Route::post('/teachers/{id}', [TeacherController::class, 'update']);
Route::post('/teacher-status/{id}', [TeacherController::class, 'updateStatus']);
route::get('/teachers/{id}', [TeacherController::class, 'getAllowedCourses']);

// Teacher Update Request
Route::get('/teacher-update-request', [TeacherUpdateRequestController::class, 'listUpdateRequests']);
Route::get('/teacher-update-request/{id}', [TeacherUpdateRequestController::class, 'getUpdateRequestDetail']);
Route::post('/teacher-updateProfile-request/{id}', [TeacherUpdateRequestController::class, 'updateProfile']);
Route::post('/teacher-updateLevel-request/{id}', [TeacherUpdateRequestController::class, 'updateLevel']);
Route::post('/teacher-update-status/{id}', [TeacherUpdateRequestController::class, 'updateStatus']);

//Teacher Level
Route::get('/teacher-levels', [TeacherLevelController::class, 'index']);
Route::get('/teacher-levels/{id}', [TeacherLevelController::class, 'show']);
Route::post('/teacher-levels', [TeacherLevelController::class, 'store']);
Route::post('/teacher-levels/{id}', [TeacherLevelController::class, 'update']);
Route::delete('/teacher-levels/{id}', [TeacherLevelController::class, 'destroy']);

//Terms and Conditions 
Route::get('/term-condition', [TermConditionController::class, 'getTermCondition']);
Route::post('/term-condition/update', [TermConditionController::class, 'updateTermCondition']);

// Quiz
Route::get('/quizzes', [QuizController::class, 'index']);
Route::get('/quizzes/{id}', [QuizController::class, 'show'])->middleware(['auth:sanctum']);
Route::post('/quizzes', [QuizController::class, 'store']);
Route::post('/quizzes/{id}', [QuizController::class, 'update']);
Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']);
Route::get('/quizzes/download/{id}', [QuizController::class, 'downloadAllResources']);

// Quiz Resources
Route::post('/gdrive/quizzes', [QuizResourceController::class, 'store']);
Route::get('/gdrive/quizzes/{id}', [QuizResourceController::class, 'download']);
Route::delete('/gdrive/quizzes/{id}', [QuizResourceController::class, 'destroy']);
Route::get('/gdrive/quizzes/preview/{id}', [QuizResourceController::class, 'preview']);

// Quiz Questions
Route::post('/quiz-questions', [QuizQuestionController::class, 'store']);
Route::post('/quiz-questions/{id_question}', [QuizQuestionController::class, 'update']);
Route::delete('/quiz-questions/{id_question}', [QuizQuestionController::class, 'destroy']);

// Quiz Question Resources
Route::post('/gdrive/quiz-questions', [QuizQuestionResourceController::class, 'store']);
Route::get('/gdrive/quiz-questions/{id}', [QuizQuestionResourceController::class, 'download']);
Route::delete('/gdrive/quiz-questions/{id}', [QuizQuestionResourceController::class, 'destroy']);
Route::get('/gdrive/quiz-questions/preview/{id}', [QuizQuestionResourceController::class, 'preview']);

// Quiz Option Resources
Route::post('/gdrive/quiz-options', [QuizOptionResourceController::class, 'store']);
Route::get('/gdrive/quiz-options/{id}', [QuizOptionResourceController::class, 'download']);
Route::delete('/gdrive/quiz-options/{id}', [QuizOptionResourceController::class, 'destroy']);
Route::get('/gdrive/quiz-options/preview/{id}', [QuizOptionResourceController::class, 'preview']);

// Quiz Submissions
Route::post('/quiz-start', [QuizSubmissionController::class, 'start']);
Route::post('/quiz-submit', [QuizSubmissionController::class, 'submit']);
Route::get('/quiz-get-attempts/{id_quiz}/{id_course_enrollment}', [QuizSubmissionController::class, 'getAttempts']);
Route::get('/quiz-resume/{id_quiz_submission}', [QuizSubmissionController::class, 'resumeQuiz'])->middleware(['auth:sanctum']);
Route::get('/quiz-get-submissions/{id_quiz}', [QuizSubmissionController::class, 'getSubmissions']);
Route::get('/quiz-grade/{id_quiz_submission}', [QuizSubmissionController::class, 'updateGrade']);
Route::get('/check-quiz-inprogress/{id_course_enrollment}/{id_quiz}', [QuizSubmissionController::class, 'checkStudentQuizInProgress']);
Route::get('/quiz-submission/{id_quiz_submission}', [QuizSubmissionController::class, 'viewSubmission']);

// Quiz Submisssion Answers
Route::post('/quiz-submit-answer', [QuizSubmissionAnswerController::class, 'submitAnswer']);
Route::post('/quiz-grade-essay', [QuizSubmissionAnswerController::class, 'gradeEssayAnswer']);

// Google Drive 
Route::get('/gdrive/token', [GdriveController::class, 'token']);

//Relation Teacher Levels and Course Level
Route::get('/teacher-levels/{id}/allowed-courses', [TeacherLevelController::class, 'getAllowedCourses']);
Route::get('/course-levels/{id}/allowed-teacher-levels', [CourseLevelController::class, 'getAllowedTeacherLevels']);

// Course Batch
Route::get('/course-batches', [CourseBatchController::class, 'index']);
Route::get('/course-batches/{id}', [CourseBatchController::class, 'show']);
Route::get('/course-batches/course/{id}', [CourseBatchController::class, 'getBatchesByCourse']);
Route::post('/course-batches', [CourseBatchController::class, 'store']);
Route::post('/course-batches/{id}', [CourseBatchController::class, 'update']);
Route::delete('/course-batches/{id}', [CourseBatchController::class, 'destroy']);
Route::get('/course-batches-teacher/{idTeacher}', [CourseBatchController::class, 'getCourseBatchByTeacher']);

// Course Enrollment
Route::get('/course-enrollments', [CourseEnrollmentController::class, 'index']);
Route::get('/course-enrollments/{id}', [CourseEnrollmentController::class, 'show']);
Route::post('/course-enrollments', [CourseEnrollmentController::class, 'store']);
Route::post('/course-enrollments/{id}', [CourseEnrollmentController::class, 'update']);
Route::delete('/course-enrollments/{id}', [CourseEnrollmentController::class, 'destroy']);
Route::get('/course-enrollments/course/{id_course}', [CourseEnrollmentController::class, 'showByCourse']);
Route::get('/course-enrollments/student/{id}', [CourseEnrollmentController::class, 'getStudentEnrollments']);

// Course Assignment Submission
Route::get('/assignment-submissions', [AssignmentSubmissionController::class, 'index']);
Route::get('/assignment-submissions/{id}', [AssignmentSubmissionController::class, 'show']);
Route::post('/assignment-submissions', [AssignmentSubmissionController::class, 'store']);
Route::post('/assignment-submissions/{id}', [AssignmentSubmissionController::class, 'update']);
Route::delete('/assignment-submissions/{id}', [AssignmentSubmissionController::class, 'destroy']);
Route::post('/assignment-submissions-grade/{id_assignment_submission}', [AssignmentSubmissionController::class, 'updateGrade']);
Route::get('/assignment-submissions/download/{id}', [AssignmentSubmissionController::class, 'downloadAllResources']);
Route::get('/assignment-submissions/courses/{id_course}', [AssignmentSubmissionController::class, 'showByCourse']);
Route::get('/assignment-submissions/assignments/{id_assignment}', [AssignmentSubmissionController::class, 'showByCourseAssignment']);

// Course Assignment Submission Resources
Route::post('/gdrive/assignment-submissions', [AssignmentSubmissionResourceController::class, 'store']);
Route::get('/gdrive/assignment-submissions/{id}', [AssignmentSubmissionResourceController::class, 'download']);
Route::delete('/gdrive/assignment-submissions/{id}', [AssignmentSubmissionResourceController::class, 'destroy']);
Route::get('/gdrive/assignment-submissions/preview/{id}', [AssignmentSubmissionResourceController::class, 'preview']);

// Quiz Submission
Route::post('/quiz-start}', [QuizSubmissionController::class, 'start']);
Route::post('/quiz-submit', [QuizSubmissionController::class, 'submit']);
Route::post('/quiz-grade/{id_quiz_submission}', [QuizSubmissionController::class, 'updateGrade']);
Route::get('/quiz-attempts/{id_quiz}/{id_course_enrollment}', [QuizSubmissionController::class, 'getAttempts']);

// Quiz Submission Answer
Route::post('/quiz-submit-answer', [QuizSubmissionAnswerController::class, 'submitAnswer']);
Route::post('/quiz-grade-essay', [QuizSubmissionAnswerController::class, 'gradeEssayAnswer']);

// Progress Student
Route::get('/progress/{id_course_enrollment}', [StudentProgressController::class, 'getProgressStudent']);
Route::get('/latest-progress/{id_course_enrollment}', [StudentProgressController::class, 'getLatestStudentProgress']);

// Skill Points
Route::get('student/{id_user}/skill-points/history/{skillId?}', [SkillPointController::class, 'getSkillPointHistory']);
Route::get('students/{id_user}/skill-points', [SkillPointController::class, 'getStudentSkillPointsWithCategories']);

// Job Recommendation
Route::get('recommended-jobs/{id_user}', [JobPortalController::class, 'getRecommendedJobs']);

// Student Certificate
Route::get('student-certificates', [StudentCertificateController::class, 'index']);
Route::get('student-certificates/{idStudentCertificate}', [StudentCertificateController::class, 'show']);
Route::post('student-certificates', [StudentCertificateController::class, 'store']);
Route::post('student-certificates/{idStudentCertificate}', [StudentCertificateController::class, 'update']);
Route::delete('student-certificates/{idStudentCertificate}', [StudentCertificateController::class, 'destroy']);
Route::get('student-certificates/{idStudentCertificate}/download', [StudentCertificateController::class, 'download']);
Route::get('student-certificates/course-enrollment/{$idStudent}', [StudentCertificateController::class, 'getStudentCertificatesByStudents']);

// Statistics or Activities
Route::get('statistics-admin-page', [UserController::class, 'getStatisticsAdminPage']);
Route::get('course-batches-activities/{id}', [CourseBatchController::class, 'getStudentActivities']);

//Auth
Route::post('/resend-verification-code', [AuthController::class, 'resendVerificationCode']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'sendResetPasswordLink']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/change-password', [AuthController::class, 'changePassword']);

Route::middleware(['validate_api_key'])->group(function () {
    Route::post('/validate-credentials', [AuthController::class, 'validateCredentials']);
    Route::post('/unlink-from-job-portal', [AuthController::class, 'unlinkFromJobPortal']);
});

//User
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/students', [UserController::class, 'getStudents']);
Route::get('/teachers', [UserController::class, 'getTeachers']);
Route::get('/lms/students/{lmsUserId}/completed-courses', [StudentController::class, 'getStudentCompletedCoursesById']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/change-email', [AuthController::class, 'changeEmail']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);
    Route::get('/validate-token', [AuthController::class, 'validateToken']);
    Route::get('/student/completed-courses', [StudentController::class, 'getCompletedxCourses']);
    Route::post('/link-job-portal', [AuthController::class, 'linkAccount']);
    Route::post('/unlink-job-portal', [AuthController::class, 'unlinkAccount']);
});
