import { createRouter, createWebHistory } from 'vue-router';

//Homepage
import Index from '@/pages/Index.vue';
import About from '@/pages/About.vue';
import Courses from '@/pages/Courses.vue';
import DetailCourses from '@/pages/homepage/courses/DetailCourses.vue';
import DetailTeacher from '@/pages/homepage/teacher/Detailteacher.vue';
import Faq from '@/pages/Faq.vue';
import JobPortal from '@/pages/JobPortal.vue';

//Student
import Overview from '@/pages/role/student/dashboard/Overview.vue';
import Statistika from '@/pages/role/student/dashboard/Statistika.vue';
import Setting from '@/pages/role/student/dashboard/settings/Setting.vue';
import Active from '@/pages/role/student/dashboard/mycourse/Active.vue';
import History from '@/pages/role/student/dashboard/mycourse/History.vue';
import Helpdesk from '@/pages/role/student/dashboard/Helpdesk.vue';

import Installasitools from '@/pages/role/student/course/Installasitools.vue';
import StudyCourse from '@/pages/role/student/course/StudyCourse.vue';
import CourseMaterial from '@/pages/role/student/course/CourseMaterial.vue';
import Quiz from '@/pages/role/student/course/Quiz.vue';
import Essay from '@/pages/role/student/course/Essay.vue';
import Questions from '@/pages/role/student/course/Questions.vue';
import Assignment from '@/pages/role/student/course/Assignment.vue';
import Tag from '@/pages/role/student/course/Tag.vue';

//Auth Student
import Chooserole from '@/pages/auth/Choose-role.vue';
import Login from '@/pages/auth/Login.vue';
import Registrasi from '@/pages/auth/Registrasi.vue';
import Forgetpassword from '@/pages/auth/Forgetpassword.vue';
import Verificationemail from '@/pages/auth/Verificationemail.vue';
import Resetpassword from '@/pages/auth/Resetpassword.vue';

import Error from '@/pages/404/404.vue';

//TEST
import Test from '@/pages/Test.vue';

const routes = [

  //Homepage
  { path: '/', component: Index },
  { path: '/about', component: About },
  { path: '/courses', component: Courses },
  { path: '/detail-courses/:id', component: DetailCourses },
  { path: '/detail-teacher', component: DetailTeacher },
  { path: '/faq', component: Faq },
  { path: '/job-portal', component: JobPortal },

  //Student
  { path: '/overview', component: Overview, meta: { requiresAuth: true, role: 'student' } },
  { path: '/statistics', component: Statistika, meta: { requiresAuth: true, role: 'student' } },
  { path: '/settings', component: Setting, meta: { requiresAuth: true, role: 'student' } },
  { path: '/my-course/active', component: Active, meta: { requiresAuth: true, role: 'student' } },
  { path: '/my-course/history', component: History, meta: { requiresAuth: true, role: 'student' } },
  { path: '/help-desk', component: Helpdesk, meta: { requiresAuth: true, role: 'student' } },

  { path: '/room/study-course/:id_course/:id_course_enrollment', component: StudyCourse, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/course-material/:id_course/:id_course_enrollment/:id_course_material', component: CourseMaterial, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/course-assignment/:id_course/:id_course_enrollment/:id_course_assignment', component: Assignment, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/course-quiz/:id_course/:id_quiz/:id_course_enrollment', component: Quiz, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/quiz-question/:id_course/:id_quiz/:id_course_enrollment/:id_quiz_submission', component: Questions, meta: { requiresAuth: true, role: 'student' } },

  { path: '/room/installasi-tools', component: Installasitools, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/essay', component: Essay, meta: { requiresAuth: true, role: 'student' } },
  // { path: '/room/questions', component: Question, meta: { requiresAuth: true, role: 'student' } },
  { path: '/room/assignment', component: Assignment, },
  { path: '/room/tag', component: Tag, meta: { requiresAuth: true, role: 'student' } },

  //Auth Student
  { path: '/choose-role', component: Chooserole },
  { path: '/login', component: Login },
  { path: '/registrasi', component: Registrasi },
  { path: '/forget-password/:token', component: Forgetpassword },
  { path: '/verification-email', component: Verificationemail },
  { path: '/reset-password', component: Resetpassword },

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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : null;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login' });
  } else if (to.meta.requiresAuth && isAuthenticated) {
    if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === 'student') {
        next({ path: '/overview' });
      } else if (userRole === 'teacher') {
        next({ path: '/dashboard' });
      }
    } else {
      next();
    }
  } else if ((to.path === '/login' && isAuthenticated) || (to.path === '/registrasi' && isAuthenticated) || (to.path === '/verification-code' && isAuthenticated) || (to.path === '/choose-role' && isAuthenticated)) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router;
