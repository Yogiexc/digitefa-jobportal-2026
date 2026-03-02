<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import LineChartCourse from '@/components/chart/LineChartCourse.vue';
import CourseSuperadmin from './dashboard/CourseSuperadmin.vue';
import axios from 'axios';

const isSidebarVisible = ref(true);
const selectedChart = ref('course');
const selectedYear = ref(new Date().getFullYear());
const totalCourses = ref(0);
const totalTeachers = ref(0);
const totalStudents = ref(0);

const fetchCoursesData = async () => {
    try {
        const response = await axios.get('/courses');
        const totalCourses = response.data.length;
        document.getElementById('totalCourses').innerText = totalCourses;
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const fetchUsersData = async () => {
    try {
        const response = await axios.get('/users');
        const users = response.data;

        const teachers = users.filter(user => user.role === 'teacher');
        const students = users.filter(user => user.role === 'student');

        document.getElementById('totalTeachers').innerText = teachers.length;
        document.getElementById('totalStudents').innerText = students.length;
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
};

const fetchStatistics = async () => {
    try {
        const response = await axios.get('/statistics-admin-page');
        const { data } = response.data;

        totalCourses.value = data.total_courses;
        totalTeachers.value = data.total_teachers;
        totalStudents.value = data.total_students;

        if (data.monthly_data) {
            courseData.value = {
                ...courseData.value,
                datasets: [{
                    ...courseData.value.datasets[0],
                    data: data.monthly_data.courses
                }]
            };

            userData.value = {
                ...userData.value,
                datasets: [
                    {
                        ...userData.value.datasets[0],
                        data: data.monthly_data.students
                    },
                    {
                        ...userData.value.datasets[1],
                        data: data.monthly_data.teachers
                    }
                ]
            };
        }
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
    }
};

const monthLabels = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const availableYears = computed(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear];
});

const courseData = ref({
    labels: monthLabels,
    datasets: [{
        label: 'Course Data',
        backgroundColor: 'rgba(74, 144, 226, 1)',
        borderColor: 'rgba(74, 144, 226, 0.8)',
        borderWidth: 2,
        data: new Array(12).fill(0)
    }]
});

const userData = ref({
    labels: monthLabels,
    datasets: [
        {
            label: 'Student',
            backgroundColor: 'rgba(126, 211, 33, 1)',
            borderColor: 'rgba(126, 211, 33, 0.8)',
            borderWidth: 2,
            data: new Array(12).fill(0)
        },
        {
            label: 'Teacher',
            backgroundColor: 'rgba(245, 166, 35, 1)',
            borderColor: 'rgba(245, 166, 35, 0.8)',
            borderWidth: 2,
            data: new Array(12).fill(0)
        }
    ]
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: selectedChart.value === 'user'
        },
        tooltip: {
            enabled: true
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
        }
    }
}));

watch(selectedYear, () => {
    fetchStatistics();
  });

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchStatistics();
    fetchCoursesData();
    fetchUsersData();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})
</script>
<template>
    <div class="navbg-sa">
        <!-- NAVBAR START -->
        <NavbarSA />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarSA v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->


        <div id="contentsa" class="dashboard-sa">
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
                                                <span class="fs-14">Total Course</span>
                                                <h5 id="totalCourses" class="fs-24 fw-semibold mt-2">0</h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <img src="../../../assets/images/svg/learning.svg" alt=""
                                                    style="width: 30px; margin-top: 7px;">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card p-3 border-0 mt-md-0 mt-3">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <span class="fs-14">Total Teacher</span>
                                                <h5 id="totalTeachers" class="fs-24 fw-semibold mt-2">0</h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <!-- <i class="bi bi-pc-display-horizontal fs-30"></i> -->
                                                <img src="../../../assets/images/svg/teacher.svg" alt=""
                                                    style="width: 30px; margin-top: 7px;">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card p-3 border-0 mt-md-0 mt-3">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <span class="fs-14">Total Student</span>
                                                <h5 id="totalStudents" class="fs-24 fw-semibold mt-2">0</h5>
                                            </div>
                                            <div class="reminder-overview rounded-3 mt-2">
                                                <i class="bi bi-people fs-30"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 mt-4 ds">
                                <div class="card rounded-4 border-0">
                                    <h5 class="fw-semibold fs-24 mb-1 mt-4 mx-4">Statistik</h5>
                                    <div class="d-flex justify-content-end mb-2 mx-4">
                                        <div class="d-flex justify-content-center me-4 w-250">
                                            <select v-model="selectedChart"
                                                class="form-select fs-14 border-0 h-40 ms-2 bg-biruu opacity-75">
                                                <option value="course">Course</option>
                                                <option value="user">User</option>
                                            </select>
                                            <select
                                                class="form-select fs-14 border-0 h-40 ms-2 bg-biruu w-100 opacity-75">
                                                <option selected>2024</option>
                                                <option value="user">2023</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-if="selectedChart === 'course'" id="course" class="mx-3 my-3">
                                        <LineChartCourse :chartData="courseData" :chartOptions="chartOptions" />
                                    </div>
                                    <div v-if="selectedChart === 'user'" id="user" class="mx-3 my-3">
                                        <LineChartCourse :chartData="userData" :chartOptions="chartOptions" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                            </div>
                            <CourseSuperadmin />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>