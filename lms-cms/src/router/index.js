import { createRouter, createWebHistory } from 'vue-router';
import { getFromDB } from '@/utils/indexedDB';

//Superadmin
import DashboardSA from '@/pages/role/superadmin/Dashboard.vue';
import CourseManajemen from '@/pages/role/superadmin/CourseManajemen.vue';
import Detail from '@/pages/role/superadmin/cs/detailcourse/Detail.vue';
import EditCourse from '@/pages/role/superadmin/cs/EditCourse.vue';
import Modul from '@/pages/role/superadmin/cs/detailcourse/Modul.vue';
import AddVideo from '@/pages/role/superadmin/cs/detailcourse/modulcourse/AddVideo.vue';
import AddQuiz from '@/pages/role/superadmin/cs/detailcourse/modulcourse/essaycourse/AddQuiz.vue';
import AddQuestions from '@/pages/role/superadmin/cs/detailcourse/modulcourse/essaycourse/AddQuestions.vue';
import AddAssignment from '@/pages/role/superadmin/cs/detailcourse/modulcourse/AddAssignment.vue';
import EditVideo from '@/pages/role/superadmin/cs/detailcourse/editmodulcourse/EditVideo.vue';
import EditQuiz from '@/pages/role/superadmin/cs/detailcourse/editmodulcourse/EditQuiz.vue';
import EditAssignment from '@/pages/role/superadmin/cs/detailcourse/editmodulcourse/EditAssignment.vue';
import Batch from '@/pages/role/superadmin/cs/Batch.vue';
import ActivityStudent from '@/pages/role/superadmin/cs/log-activity/ActivityStudent.vue';
import Log from '@/pages/role/superadmin/cs/log-activity/Log.vue';
import StudentLog from '@/pages/role/superadmin/cs/log-activity/Student.vue';
import DetailActivity from '@/pages/role/superadmin/cs/log-activity/detailactivity/DetailActivity.vue';
import Answer from '@/pages/role/superadmin/cs/Answer.vue';
import FaqAdmin from '@/pages/role/superadmin/Faq.vue';
import HelpDesk from '@/pages/role/superadmin/HelpDesk.vue';
import MediaPartner from '@/pages/role/superadmin/cms/MediaPartner.vue';
import SosialMedia from '@/pages/role/superadmin/cms/SosialMedia.vue';
import AboutUs from '@/pages/role/superadmin/cms/AboutUs.vue';
import MasterDataCategory from '@/pages/role/superadmin/masterdata/MasterDataCategory.vue';
import MasterDataSkill from '@/pages/role/superadmin/masterdata/MasterDataSkill.vue';
import MasterDataLevelCourse from '@/pages/role/superadmin/masterdata/MasterDataLevelCourse.vue';
import MasterDataLevelTeacher from '@/pages/role/superadmin/masterdata/MasterDataLevelTeacher.vue';
import MasterDataTools from '@/pages/role/superadmin/masterdata/MasterDataTools.vue';
import TC from '@/pages/role/superadmin/TC.vue';
import Superadmin from '@/pages/role/superadmin/usermanajemen/Superadmin.vue';
import Teacher from '@/pages/role/superadmin/usermanajemen/Teacher.vue';
import PersonalDataTeacher from '@/pages/role/superadmin/usermanajemen/teacher/PersonalData.vue';
import Request from '@/pages/role/superadmin/usermanajemen/teacher/PersonalData/Request.vue';
import Profil from '@/pages/role/superadmin/usermanajemen/teacher/PersonalData/Request/Profil.vue';
import Student from '@/pages/role/superadmin/usermanajemen/Student.vue';
import PersonalData from '@/pages/role/superadmin/usermanajemen/student/PersonalData.vue';
import Setting from '@/pages/role/superadmin/setting/Setting.vue';

//Teacher
import DashboardTC from '@/pages/role/teacher/DashboardTeacher.vue';
import CourseTeacher from '@/pages/role/teacher/CourseManajemen.vue';
import AddCourseTeacher from '@/pages/role/teacher/ct/AddCourseTeacher.vue';
import DetailCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/Detail.vue';
import EditCourseTeacher from '@/pages/role/teacher/ct/EditCourse.vue';
import ModulCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/Modul.vue';
import AddVideoCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/modulcourseteacher/AddVideo.vue';
import AddQuizCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/modulcourseteacher/essaycourseteacher/AddQuiz.vue';
import AddQuestionsCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/modulcourseteacher/essaycourseteacher/AddQuestions.vue';
import AddAssignmentCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/modulcourseteacher/AddAssignment.vue';
import EditAssignmentCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/editcourse/EditAssignment.vue';
import EditQuizCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/editcourse/EditQuiz.vue';
import EditVideoCourseTeacher from '@/pages/role/teacher/ct/detailcourseteacher/editcourse/EditVideo.vue';
import BatchTC from '@/pages/role/teacher/ct/Batch.vue';
import LogTeacher from '@/pages/role/teacher/ct/logactivity/Log.vue';
import StudentTeacher from '@/pages/role/teacher/ct/logactivity/Student.vue';
import ActivityStudentTC from '@/pages/role/teacher/ct/logactivity/ActivityStudent.vue';
import DetailActivityTC from '@/pages/role/teacher/ct/logactivity/detailactivity/DetailActivity.vue';
import AnswerTC from '@/pages/role/teacher/ct/Answer.vue';
import Settings from '@/pages/role/teacher/setting/Setting.vue';
import Helpdesk from '@/pages/role/teacher/Helpdesk.vue';

//Auth
import Login from '@/pages/auth/Login.vue';
import RegistrasiTeacher from '@/pages/auth/Registrasi-teacher.vue';
import Resetpassword from '@/pages/auth/Resetpassword.vue';
import Forgetpassword from '@/pages/auth/Forgetpassword.vue';
import Verificationemail from '@/pages/auth/Verificationemail.vue';
import ProfileTeacher from '@/pages/auth/Profile-teacher.vue';
import ReveiewAccount from '@/pages/auth/Review-account.vue';

import Error from '@/pages/404/404.vue';

//TEST
import Test from '@/pages/Test.vue';

const routes = [
  //Auth
  { path: '/', component: Login },
  { path: '/registrasi-teacher', component: RegistrasiTeacher },
  { path: '/reset-password', component: Resetpassword },
  { path: '/forget-password/:token', component: Forgetpassword },
  { path: '/verification-email', component: Verificationemail },
  { path: '/profil-teacher', component: ProfileTeacher },
  { path: '/checking-account', component: ReveiewAccount },

  //Superadmin
  { path: '/dashboard-superadmin', component: DashboardSA, meta: { requiresAuth: true, role: 'admin' } },

  // COURSE SUPERADMIN
  { path: '/course-manajemen', component: CourseManajemen, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/detail/:id', component: Detail, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/edit/:id', component: EditCourse, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id', component: Modul, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/add-video/:id_course_section', component: AddVideo, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/add-quiz/:id_course_section', component: AddQuiz, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/add-questions/:id_quiz/:id_course_section', component: AddQuestions, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/add-assignment/:id_course_section', component: AddAssignment, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/edit-video/:id_course_material/:id_course_section', component: EditVideo, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/edit-quiz/:id_quiz/:id_course_section', component: EditQuiz, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/course-manajemen/modul/:id/edit-assignment/:id_course_assignment/:id_course_section', component: EditAssignment, meta: { requiresAuth: true, role: 'admin' } },

  //
  { path: '/course-manajemen/batch/:id', component: Batch},
  { path: '/course-manajemen/log-activity/:id', component: Log },
  { path: '/course-manajemen/batch/student/:id', component: StudentLog },
  { path: '/course-manajemen/batch/activity-student', component: ActivityStudent },
  { path: '/course-manajemen/batch/activity-student/detail-activity', component: DetailActivity },
  { path: '/course-manajemen/answer', component: Answer },
  { path: '/help-desk', component: HelpDesk, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cms/media-partner', component: MediaPartner, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cms/sosial-media', component: SosialMedia, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cms/about-us', component: AboutUs, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cms/tc', component: TC, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/master-data/category', component: MasterDataCategory, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/cms/faq-admin', component: FaqAdmin, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/master-data/skills', component: MasterDataSkill, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/master-data/level-course', component: MasterDataLevelCourse, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/master-data/level-teacher', component: MasterDataLevelTeacher, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/master-data/tools', component: MasterDataTools, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/superadmin', component: Superadmin, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/student', component: Student, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/student/detail/:id', component: PersonalData, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/teacher', component: Teacher, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/teacher/detail-teacher/:id', component: PersonalDataTeacher, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/teacher/request/:id', component: Request, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user-manajemen/teacher/profil/:id', component: Profil, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/setting', component: Setting, meta: { requiresAuth: true, role: 'admin' } },

  //Teacher
  { path: '/dashboard-teacher', component: DashboardTC, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },

  // COURSE TEACHER
  { path: '/course-teacher', component: CourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/add-course', component: AddCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/detail/:id', component: DetailCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/edit/:id', component: EditCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id', component: ModulCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/add-video/:id_course_section', component: AddVideoCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/add-quiz/:id_course_section', component: AddQuizCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/add-questions/:id_quiz/:id_course_section', component: AddQuestionsCourseTeacher,  meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/add-assignment/:id_course_section', component: AddAssignmentCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/edit-video/:id_course_material/:id_course_section', component: EditVideoCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/edit-quiz/:id_quiz/:id_course_section', component: EditQuizCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/modul/:id/edit-assignment/:id_course_assignment/:id_course_section', component: EditAssignmentCourseTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },

    //
  { path: '/course-teacher/batch/:id', component: BatchTC, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/log-activity/:id', component: LogTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/batch/student/:id', component: StudentTeacher, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/batch/activity-student', component: ActivityStudentTC, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/batch/activity-student/detail-activity', component: DetailActivityTC, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/course-teacher/answer', component: AnswerTC, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/settings', component: Settings, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/helpdesk', component: Helpdesk, meta: { requiresAuth: true, role: 'teacher', status: 'approved' } },
  { path: '/404', component: Error },

  //TEST
  { path: '/test', component: Test },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach( async (to, from, next) => {
  try {
    // Retrieve token and user data from IndexedDB
    const tokenData = await getFromDB('settings', 'token');
    const userData = await getFromDB('users', 'id_user');

    const isAuthenticated = !!tokenData?.value;
    const user = userData || null;
    const userRole = user?.role || null;
    const userStatus = userRole === 'teacher' ? user?.teacher?.status : null;

    // Check authentication and authorization
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ path: '/' });
    } else if (to.meta.requiresAuth && isAuthenticated) {
      if (to.meta.role && to.meta.role !== userRole) {
        next({ path: '/' });
      } else {
        if (userRole === 'admin') {
          next();
        } else if (userRole === 'teacher') {
          if (userStatus === 'not_submitted') {
            next({ path: '/profil-teacher' });
          } else if (userStatus === 'submitted' || userStatus === 'rejected') {
            next({ path: '/checking-account' });
          } else if (userStatus === 'approved') {
            next();
          } else {
            next({ path: '/' });
          }
        } else {
          next({ path: '/' });
        }
      }
    } else {
      if (isAuthenticated) {
        if (to.path === '/' && userRole === 'admin') {
          next({ path: '/dashboard-superadmin' });
        } else if (to.path === '/' && userRole === 'teacher') {
          next({ path: '/dashboard-teacher' });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } catch (error) {
    console.error('Error during route guard execution:', error);
    next({ path: '/' });
  }
});

export default router;