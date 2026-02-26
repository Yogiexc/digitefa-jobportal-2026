<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const activeTab = ref('about');
const isSidebarVisible = ref(true);

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 768;
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div class="bg-room">
        <!-- NAVBAR START -->
        <NavbarCourses />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarCourse v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="room" class="essay">
            <div class="container mt-md-2 pe-md-4">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0 ey">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Installasi</h5>
                            <h4 class="fs-24">Essay</h4>
                            <div class="card p-4 bordersa mt-2">
                                <div class="d-flex justify-content-start mt-11 gap-4">
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'about' }"
                                        @click="setActiveTab('about')">
                                        About
                                    </label>
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'resources' }"
                                        @click="setActiveTab('resources')">
                                        Resources
                                    </label>
                                </div>
                                <hr />
                                <div v-show="activeTab === 'about'">
                                    <div>
                                        <h4 class="card-title fs-16 fw-semibold">Pengantar Pembuatan Dasar Website:
                                            Struktur, Desain, dan Fungsionalitas</h4>
                                        <p class="card-text fs-16 fw-normal text-justify mb-4">Esai ini mengulas
                                            langkah-langkah dasar
                                            dalam pembuatan website, mulai dari struktur HTML, penggunaan CSS untuk tata
                                            letak dan desain, hingga integrasi
                                            JavaScript untuk fungsionalitas dasar. Fokus utama dari tugas ini adalah
                                            memahami elemen-elemen inti yang diperlukan untuk membangun sebuah website
                                            yang
                                            responsif dan berfungsi dengan baik.</p>
                                        <div class="ul">
                                            <h4 class="card-title fs-16 fw-semibold">Submission Status</h4>
                                            <ul class="card-text fs-16 fw-light">
                                                <li>
                                                    <span class="platform">Submission Status</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">Not submitted</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Grading Status</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">0/100</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Due Date</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">Friday, October 4, 2024, 11:59
                                                        PM</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Time Remaining</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">Assignment is due in 2
                                                        weeks</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Completion Time</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">2 hours to complete the
                                                        task</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="text-center mb-3">
                                            <ButtonSuccess class="mt-md-5 mt-4 h-38 w-20 fs-16"
                                                onclick="window.location.href='/room/questions'">Start</ButtonSuccess>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="activeTab === 'resources'">
                                    <div>
                                        <h4 class="card-title fs-16 fw-semibold">Pengantar Pembuatan Dasar Website:
                                            Struktur, Desain, dan Fungsionalitas</h4>
                                        <p class="card-text fs-16 fw-normal text-justify mb-4">Esai ini mengulas
                                            langkah-langkah dasar dalam pembuatan website, mulai dari struktur HTML,
                                            penggunaan CSS untuk tata letak dan desain, hingga integrasi JavaScript
                                            untuk
                                            fungsionalitas dasar. Fokus utama dari tugas ini adalah memahami
                                            elemen-elemen
                                            inti yang diperlukan untuk membangun sebuah website yang responsif dan
                                            berfungsi
                                            dengan baik.</p>
                                        <h4 class="card-title fs-16 fw-semibold">Download the required assets </h4>
                                        <div class="text-center mb-3">
                                            <ButtonTransparanComponen
                                                class="mt-4 my-0 h-45 px-3 rounded-3 c-border bg-white fs-16"> <i
                                                    class="bi bi-download me-2"></i>Download
                                            </ButtonTransparanComponen>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
