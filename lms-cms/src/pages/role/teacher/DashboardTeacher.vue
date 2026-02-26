<script setup>
import { ref, onUnmounted, onMounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ChartTeacher from '@/components/chart/ChartTeacher.vue';
import CourseTeacher from './dashboard/CourseTeacher.vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore(); 
const isSidebarVisible = ref(true);
const totalCourses = ref(0);
const courseData = ref([]);

const fetchCoursesData = async () => {
    try {
        const user = store.getters.getUser;
        const id_teacher = user.teacher?.id_teacher;

        if (!id_teacher) {
            console.error('Teacher ID not found');
            return;
        }

        const response = await axios.get(`/courses/teacher/${id_teacher}`);
        if (response.data && response.data.courses) {
            totalCourses.value = response.data.courses.length;
        } else {
            console.warn('No courses data found in the response');
        }
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};



const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(async () => {
    await store.dispatch('fetchUserData');
    checkWindowSize();
    
    const user = store.getters.getUser;
    if (user) {
        fetchCoursesData();
    } else {
        console.error('No user data found in Vuex.');
    }
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="cbg-card rounded-3 p-4">
                            <h5 class="fw-light fs-16">Digitefa/Dashboard</h5>
                            <h4 class="fs-24">Dashboard</h4>
                            <div class="row mt-4 ds">
                                <div class="col-md-4">
                                    <div class="card p-3 border-0">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <span class="fs-14">Student</span>
                                                <h5 class="fs-24 fw-semibold mt-2">1.928</h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <i class="bi bi-people fs-30"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card p-3 border-0 mt-md-0 mt-3">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <span class="fs-14">Course</span>
                                                <h5 class="fs-24 fw-semibold mt-2">{{ totalCourses }}</h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <i class="bi bi-pc-display-horizontal fs-30"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card p-3 border-0 mt-md-0 mt-3">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <span class="fs-14">Rating</span>
                                                <h5 class="fs-24 fw-semibold mt-2">
                                                    <i class="bi bi-star-fill color-start"></i> 4.8
                                                </h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <i class="bi bi-globe-asia-australia fs-30"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 mt-4">
                                    <div class="card rounded-4 p-25 border-0">
                                        <div class="d-flex justify-content-between mb-5">
                                            <div>
                                                <h5 class="fw-semibold fs-24 mb-1">Statistik</h5>
                                                <p class="opacity-50 fs-12 mb-0">course</p>
                                                <div class="d-flex align-items-center mt-0">
                                                    <div class="d-flex align-items-center me-3">
                                                        <div class="reminder-student">
                                                        </div>
                                                        <span class="fs-12">Student</span>
                                                    </div>
                                                    <div class="d-flex align-items-center">
                                                        <div class="reminder-rating">
                                                        </div>
                                                        <span class="fs-12">Rating</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="dropdown me-md-2">
                                                <button
                                                    class="btn dropdown-toggle dropdown-toggle-custom2 border-0 opacity-75 fs-12 h-40 w-130 d-flex justify-content-between align-items-center"
                                                    type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    Bulan
                                                    <i class="bi bi-chevron-down"></i>
                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <li><a class="dropdown-item fs-12" href="#">Januari</a></li>
                                                    <li><a class="dropdown-item fs-12" href="#">Februari</a></li>
                                                    <li><a class="dropdown-item fs-12" href="#">Maret</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <ChartTeacher />
                                        </div>
                                    </div>
                                </div>
                                <CourseTeacher />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>