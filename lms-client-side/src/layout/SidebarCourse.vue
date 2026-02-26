<template>
    <div id="sidebar-course">
        <ul>
            <li class="px-4">
                <span class="text fs-16 fw-medium">{{ coursesData.title }}</span>
            </li>
            <li class="ms-24 mt-4">
                <span class="text fs-16 fw-medium p-absolute mb-4">Statistik</span>
                <div class="d-flex align-items-center me-1">
                    <div class="me-5 w-200 position-relative mt-4">
                        <div class="progress mt-4 bg-progress h-8">
                            <div class="h-8 bg-progress-progress" 
                                role="progressbar" 
                                :aria-valuenow="progress || 0" 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                                :style="{ width: (progress || 0) + '%' }">
                            </div>
                        </div>
                        <span class="progress-text fs-14 fw-medium">{{ progress || 0 }}%</span>
                        <p class="fs-12 fw-normal">{{ completed || 0 }} dari {{ total || 0 }} modul telah selesai</p>
                    </div>
                </div>
            </li>
            <div v-for="section in sectionsWithProgress" :key="section.id_course_section">
                <li class="mt-2">
                    <a href="#" @click.prevent="toggleDropdown(section.id_course_section)" class="text-biru-side">
                        <span class="icon"></span>
                        <span class="mt-2 text p-absolute text-biru-side fw-medium ms-3">{{ section.title }}</span>
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
                        <li v-for="assignment in section.assignments" :key="assignment.id_course_assignment">
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { register } from 'swiper/element';

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
</script>
