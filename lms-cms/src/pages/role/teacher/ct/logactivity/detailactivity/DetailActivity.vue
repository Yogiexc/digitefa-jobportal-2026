<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activityId = route.query.id;
const activityType = route.query.type;

const isSidebarVisible = ref(true);

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})
</script>

<template>
  <div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte" class="dashboard-teacher">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="cbg-card rounded-3 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Batch/Activity Student/Detail Activity
                                Student</h5>
                            <h4 class="fs-24 mb-4">Detail Activity Student</h4>
                            <div v-if="activityType === 'assignment'" id="assigment"
                                class="card bordersa rounded-3 p-4">
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="name" class="mt-1">Name</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Abdul R</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="activitytype" class="mt-1">Activity Type</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Submitted Assignment</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="date" class="mt-1">Date</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1 fw-medium">Membangun Website Pertama Anda:
                                            Dasar-dasar HTML,
                                            CSS, dan JavaScript</label>
                                        <div class="text-justify">
                                            <span class="text-justify">Dalam assignment ini, Anda akan mempelajari
                                                bagaimana
                                                membangun sebuah
                                                website dasar menggunakan HTML, CSS, dan JavaScript. Anda akan melalui
                                                proses pembuatan halaman web yang melibatkan pembuatan struktur
                                                menggunakan
                                                HTML, mengatur gaya dan tampilan dengan CSS, serta menambahkan
                                                interaktivitas dengan JavaScript. Tugas ini juga mencakup
                                                prinsip-prinsip
                                                desain web modern dan penerapan praktik terbaik dalam pengembangan
                                                web.</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="submissionstatus" class="mt-1">Submission Status</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Submitted</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="duadate" class="mt-1">Due Date </label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Friday, October 4, 2024</label>
                                    </div>
                                </div>
                                <div class="row mb-2 da">
                                    <div class="col-md-3">
                                        <label for="answer" class="mt-1">Answer</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">
                                            <div class="col-md-6">
                                                <div class="col-md-6">
                                                    <div class="card text-center border-c p-2 mt-2 pointer hover-card"
                                                        style="width: 150px; min-height: 180px; position: relative;">
                                                        <div class="c-default">
                                                            <img src="../../../../../../assets/images/svg/pdf-file.svg"
                                                                alt="PDF Icon" class="mx-auto d-block"
                                                                style="width: 70px; height: auto;">
                                                            <div
                                                                class="d-flex flex-column align-items-center mt-3 mb-0">
                                                                <label class="fs-12 opacity-75">Dokumen.pdf</label>
                                                                <label class="fs-12 opacity-75">(300.kb)</label>
                                                            </div>
                                                        </div>
                                                        <div class="download-icon">
                                                            <i class="bi bi-download"></i>
                                                        </div>
                                                        <div
                                                            class="d-flex justify-content-end gap-2 bottom-right c-pointer fs-12 mt-3">
                                                            <div class="rounded-1"
                                                                style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                                                <i class="bi bi-trash"></i>
                                                            </div>
                                                            <div class="rounded-1"
                                                                style="padding: 2px 3px 2px 3px; border: 1px solid #ccc;">
                                                                <i class="bi bi-zoom-in"
                                                                    @click="zoomFile('portofolio')"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="activityType === 'essay'" id="essay" class="card bordersa rounded-3 p-4">
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="name" class="mt-1">Name</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Abdul R</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="activitytype" class="mt-1">Activity Type</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Submitted Assignment</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="date" class="mt-1">Date</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1 fw-medium">Membangun Website Pertama Anda:
                                            Dasar-dasar HTML,
                                            CSS, dan JavaScript</label>
                                        <div class="text-justify">
                                            <span class="text-justify">Dalam assignment ini, Anda akan mempelajari
                                                bagaimana
                                                membangun sebuah
                                                website dasar menggunakan HTML, CSS, dan JavaScript. Anda akan melalui
                                                proses pembuatan halaman web yang melibatkan pembuatan struktur
                                                menggunakan
                                                HTML, mengatur gaya dan tampilan dengan CSS, serta menambahkan
                                                interaktivitas dengan JavaScript. Tugas ini juga mencakup
                                                prinsip-prinsip
                                                desain web modern dan penerapan praktik terbaik dalam pengembangan
                                                web.</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="submissionstatus" class="mt-1">Submission Status</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Submitted</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="duadate" class="mt-1">Due Date </label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">Friday, October 4, 2024</label>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-3">
                                        <label for="answer" class="mt-1">Answer</label>
                                    </div>
                                    <div class="col-md-9">
                                        <label for="name" class="mt-1">
                                            <ButtonBiru class="h-40 fs-16"
                                                onclick="window.location.href='/course-teacher/modul'">Answer
                                            </ButtonBiru>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>Invalid Activity Type</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>