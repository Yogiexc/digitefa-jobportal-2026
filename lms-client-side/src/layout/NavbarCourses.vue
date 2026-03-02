<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'; // Import Vuex store
import axios from 'axios';

const profileImage = ref('');

const router = useRouter();
const store = useStore();
const isSidebarOpen = ref(false);
const isIntroDropdownOpen = ref(false);
const isInstallasiDropdownOpen = ref(false);
const isDasarHTMLDropdownOpen = ref(false);

const route = useRoute();
const idCourse = ref(route.params.id_course);
const idCourseEnrollment = ref(route.params.id_course_enrollment);

const sectionsWithProgress = ref([]);
const progress = ref(0);
const completed = ref(0);
const total = ref(0);
const activeSection = ref(null);
const coursesData = ref('');

const fetchCoursesData = async () => {
    try {
        const response = await axios.get(`/courses/${idCourse.value}`);
        coursesData.value = response.data;
        console.log('Course Response:', response.data);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const fetchProgress = async () => {
    try {
        const response = await axios.get(`/progress/${idCourseEnrollment.value}`);
        const { progress: progressData, completed: completedData, total: totalData } = response.data;

        progress.value = progressData || 0;
        completed.value = completedData || 0;
        total.value = totalData || 0;

        console.log('Progress Data:', response.data);
    } catch (error) {
        console.error('Error fetching progress data:', error);
    }
};

const fetchSectionsWithProgress = async () => {
    try {
        const response = await axios.get('/course-sections-student', {
            params: {
                id_course: idCourse.value,
                id_course_enrollment: idCourseEnrollment.value,
            },
        });
        sectionsWithProgress.value = response.data.sections;
        console.log('Sections with Progress:', sectionsWithProgress.value);
    } catch (error) {
        console.error('Error fetching sections with progress:', error);
    }
};

const isActive = (path) => route.path === path;

const toggleDropdown = (sectionId) => {
    activeSection.value = activeSection.value === sectionId ? null : sectionId;
};

onMounted(() => {
    fetchCoursesData();
    fetchProgress();
    fetchSectionsWithProgress();
});

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
};

const user = computed(() => store.getters.getUser);

const logoutStudent = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

// Dropdown toggles
const toggleIntroDropdown = () => {
    isIntroDropdownOpen.value = !isIntroDropdownOpen.value;
};

const toggleInstallasiDropdown = () => {
    isInstallasiDropdownOpen.value = !isInstallasiDropdownOpen.value;
};

const toggledasarHTMLDropdown = () => {
    isDasarHTMLDropdownOpen.value = !isDasarHTMLDropdownOpen.value;
};

onMounted(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const studentProfileUrl = process.env.VUE_APP_STUDENT_PROFILE_URL;
    if (storedUser && storedUser.student) {
        profileImage.value = storedUser.student.image
            ? `${studentProfileUrl}/${storedUser.student.image}`
            : require('@/assets/images/my-profile.png');
    } else {
        profileImage.value = require('@/assets/images/my-profile.png');
    }
});
</script>
<template>
    <header class="navdua" :class="{ 'navbar-blur': isSidebarOpen }">
        <nav class="navbar  navbar-dashboard navbar-expand-lg navbar-light fixed-top">
            <div class="toggle">
                <button class="navbar-toggler border-0" @click="toggleSidebar" type="button" aria-controls="navbarNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="container-fluid">
                <span class="navbar-brand">
                    <a href="/">
                        <img src="../assets/images/logo-navbar.png" alt="Logo" class="img-navbar" />
                    </a>
                </span>
                <div class="dropdown profile-section dropdown-toggle-custom rounded-25 p-2 me-md-2" type="button"
                    id="dropdownMenuButton" data-bs-toggle="dropdown">
                    <img :src="profileImage" alt="Profile Picture" class="rounded-circle ms-1" />
                    <span class="profile-name fs-16">{{ getFirstName(user.name) }} <br /> <small
                            class="d-block mt--3 fs-12">{{
                                user.role
                            }}</small></span>
                    <button class="btn border-0 dropdown-toggle" aria-expanded="false">
                        <i class="bi bi-chevron-down ms-0 me--8"></i>
                    </button>
                    <ul class="dropdown-menu border-0 mt--1 bg" aria-labelledby="dropdownMenuButton">
                        <li>
                            <a class="dropdown-item fs-14" @click="() => router.push('/overview')">
                                <i class="bi bi-house-door-fill me-2 fw-light"></i> Dashboard
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item fs-14" @click="() => router.push('/my-course/active')">
                                <i class="bi bi-map me-2 fw-light"></i> My Course
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item fs-14" @click="() => router.push('/settings')">
                                <i class="bi bi-gear me-2 fw-light"></i> Settings
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item fs-14" @click="() => router.push('help-desk')">
                                <i class="bi bi-exclamation-circle-fill me-2 fw-light"></i> Help Desk
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider" />
                        </li>
                        <li>
                            <button class="dropdown-item fs-14" @click="logoutStudent">
                                <i class="bi  bi-box-arrow-right me-2 fw-light"></i> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <div class="side">
        <transition name="slide">
            <div v-if="isSidebarOpen" class="sidebar">
                <div class="sidebar-content">
                    <div class="d-flex justify-content-between">
                        <h5 class="fs-16 fw-medium mt-12">Profil</h5>
                        <i @click="toggleSidebar" class="bi bi-x mt--18 mr--10"></i>
                    </div>
                    <div class="profile-section2 dropdown-toggle-custom rounded-5 p-2 ps-3 mb-3 ms--8"
                        onclick="window.location.href='/overview'">
                        <img :src="profileImage" alt="Profile Picture" class="rounded-circle profil-mobile" />
                        <div>
                            <span class="profile-name fs-18">{{ getFirstName(user.name) }}</span> <br>
                            <small class="profile-role fs-14">{{ user.role }}</small>
                        </div>
                    </div>
                    <div id="sidebar-course" class="mt-5">
                        <ul>
                            <li class="px-4">
                                <span class="text fs-16 fw-medium">{{ coursesData.title }}</span>
                            </li>
                            <li class="ms-24 mt-4">
                                <span class="text fs-16 fw-medium p-absolute mb-4">Statistik</span>
                                <div class="d-flex align-items-center me-1">
                                    <div class="me-5 w-200 position-relative mt-4">
                                        <div class="progress mt-4 bg-progress h-8">
                                            <div class="h-8 bg-progress-progress" role="progressbar"
                                                :aria-valuenow="progress || 0" aria-valuemin="0" aria-valuemax="100"
                                                :style="{ width: (progress || 0) + '%' }">
                                            </div>
                                        </div>
                                        <span class="progress-text fs-14 fw-medium">{{ progress || 0 }}%</span>
                                        <p class="fs-12 fw-normal">{{ completed || 0 }} dari {{ total || 0 }} modul
                                            telah selesai</p>
                                    </div>
                                </div>
                            </li>
                            <div v-for="section in sectionsWithProgress" :key="section.id_course_section">
                                <li class="mt-2">
                                    <a href="#" @click.prevent="toggleDropdown(section.id_course_section)"
                                        class="text-biru-side">
                                        <span class="icon"></span>
                                        <span class="mt-2 text p-absolute text-biru-side fw-medium ms-3">{{
                                            section.title }}</span>
                                        <span class="bi text mt-2 mr--25 p-absolute r-24"
                                            :class="activeSection === section.id_course_section ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                    </a>
                                    <ul v-show="activeSection === section.id_course_section" class="dropdown mt--3">
                                        <li v-for="material in section.materials" :key="material.id_course_material">
                                            <router-link :to="{
                                                path: `/room/course-material/${idCourse}/${idCourseEnrollment}/${material.id_course_material}`
                                            }" class="text-biru-side2 text-decoration-none" exact-active-class="active-sidebar">
                                                <div class="d-flex align-items-center ps-5 justify-content-start h-48"
                                                    :class="{ aktif: isActive(`/room/course-material/${idCourse}/${idCourseEnrollment}/${material.id_course_material}`) }">
                                                    <p class="bi bi-play-circle me-2 mb-0"></p>
                                                    <p class="fs-16 text mb-0">{{ material.title }}</p>
                                                </div>
                                            </router-link>
                                        </li>
                                        <li v-for="assignment in section.assignments"
                                            :key="assignment.id_course_assignment">
                                            <router-link :to="{
                                                path: `/room/course-assignment/${idCourse}/${idCourseEnrollment}/${assignment.id_course_assignment}`
                                            }" class="text-biru-side2 text-decoration-none" exact-active-class="active-sidebar">
                                                <div class="d-flex align-items-center ps-5 justify-content-start h-48"
                                                    :class="{ aktif: isActive(`/room/course-assignment/${idCourse}/${idCourseEnrollment}/${assignment.id_course_assignment}`) }">
                                                    <p class="bi bi-file-earmark me-2 mb-0"></p>
                                                    <p class="fs-16 text mb-0">{{ assignment.title }}</p>
                                                </div>
                                            </router-link>
                                        </li>
                                        <li v-for="quiz in section.quizzes" :key="quiz.id_quiz">
                                            <router-link :to="{
                                                path: `/room/course-quiz/${idCourse}/${quiz.id_quiz}/${idCourseEnrollment}`
                                            }" class="text-biru-side2 text-decoration-none" exact-active-class="active-sidebar">
                                                <div class="d-flex align-items-center ps-5 justify-content-start h-48"
                                                    :class="{ aktif: isActive(`/room/course-quiz/${idCourse}/${quiz.id_quiz}/${idCourseEnrollment}`) }">
                                                    <p class="bi bi-award me-2 mb-0"></p>
                                                    <p class="fs-16 text mb-0">{{ quiz.title }}</p>
                                                </div>
                                            </router-link>
                                        </li>
                                    </ul>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div v-if="isSidebarOpen" class="overlay-blur" @click="toggleSidebar"></div>
</template>