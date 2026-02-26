<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavbarLayout from '@/layout/NavbarLayout.vue';
import FooterLayout from '@/layout/FooterLayout.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import axios from 'axios';

import { reviewCourse } from '@/data/index.js';

const router = useRouter();
const route = useRoute();
const usersData = ref([]);
const batchData = ref([]);
const courseData = ref([]);
const user = ref({});
const reviewData = ref(reviewCourse);
const itemsPerPage = 4;
const currentPage = ref(1);
const isCheckboxChecked = ref(false);
const errorMessage = ref('');
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const form = ref({
    id_course_batch: '',
    id_student: '',
});

const fetchBatchData = async () => {
    try {
        const response = await axios.get('/courses-status');
        batchData.value = response.data;

        if (batchData.value.length > 0 && batchData.value[0]?.batches?.length > 0) {
            form.value.id_course_batch = batchData.value[0].batches[0].id_course_batch;
        }
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const fetchCourseData = async () => {
    try {
        const courseId = route.params.id;
        const response = await axios.get(`/courses/${courseId}`);
        courseData.value = response.data;

        console.log('Full API Response:', response.data); // Added for debugging

        
        const thumbnail = response.data.thumbnail;
        courseData.value.thumbnailUrl = `${process.env.VUE_APP_COURSE_THUMBNAIL_URL}/${thumbnail}`;

        const profilePhoto = response.data.teacher.photo_profile;
        courseData.value.teacherProfilePhotoUrl = `${process.env.VUE_APP_TEACHER_PROFILE_URL}/${profilePhoto}`;

        const youtubeLink = response.data.thumbnail_link;
        if (youtubeLink) {
            const videoId = youtubeLink.split("v=")[1]?.split("&")[0];
            courseData.value.embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        }
    } catch (error) {
        console.error('Failed to fetch course:', error);
    }
};


const RegisterCourse = async () => {
    if (!isCheckboxChecked.value) {
        errorMessage.value = 'You must agree to the Course Terms and Data Policy.';
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const studentId = storedUser?.student?.id_student;

    if (!studentId) {
        showToast('ID Student tidak ditemukan.', 'error');
        return;
    }

    try {
        const response = await axios.post('/course-enrollments', {
            id_course_batch: form.value.id_course_batch,
            id_student: studentId,
        });

        showToast('Anda Berhasil mendaftar Course!', 'success');
        setTimeout(() => {
            router.push(`/courses`);
        }, 800);
    } catch (error) {
        showToast('Anda gagal mendaftar Course.', 'error');
    }
};

const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    isToastVisible.value = true;
    toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

const totalPages = computed(() => Math.ceil(reviewData.value.length / itemsPerPage));

const paginatedReviews = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return reviewData.value.slice(start, end);
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const handleNavigation = () => {
    const pointers = document.querySelectorAll('.pointer');
    const sections = document.querySelectorAll('.section');
    pointers.forEach(pointer => {
        pointer.addEventListener('click', () => {
            pointers.forEach(p => p.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            pointer.classList.add('active');
            const targetId = pointer.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
};

onMounted(() => {
    fetchBatchData();
    fetchCourseData();
    handleNavigation();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        user.value = storedUser;
        form.value.id_student = storedUser.student?.id_student || ''; 
    } else {
        console.error('No user data found in localStorage.');
    }
    router.afterEach(() => {
        handleNavigation();
    });
});

onUnmounted(() => {
    const pointers = document.querySelectorAll('.pointer');
    pointers.forEach(pointer => {
        pointer.removeEventListener('click', handleNavigation);
    });
});

</script>

<template>
    <!-- NAVBAR START -->
    <NavbarLayout />
    <!-- NAVBAR END -->

    <!-- DETAIL COURSES START -->
    <section class="bg-about-isi fw-semibold mt-100">
        <div class="container">
            <div class="row">
                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
                    aria-label="breadcrumb">
                    <ol class="breadcrumb my-4 ms-1">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Course</li>
                        <li class="breadcrumb-item active" aria-current="page">Detail Course</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

    <section>
        <div class="container">
            <div class="row dc">
                <h5 class="mb-3 mt-4 fs-20 opacity-75 fw-medium">{{ courseData.category?.name }}</h5>
                <h1 class="mb-3 fw-semibold fs-40 mb-5">{{ courseData.title }}</h1>
                <div class="col-md-12">
                    <div class="card border-0 rounded-4">
                        <div class="ratio ratio-16x9">
                            <iframe :src="courseData.embedUrl" title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-start h4 my-4 border-bottom border-dark sub-nav">
                <h5 class="me-3 pointer fs-16 active" data-target="deskripsi">Description</h5>
                <h5 class="me-3 pointer fs-16" data-target="teacher">Teacher</h5>
                <h5 class="me-3 pointer fs-16" data-target="rules">Rules & Conditions</h5>
                <h5 class="me-3 pointer fs-16" data-target="review">Review Course</h5>
            </div>
            <div id="deskripsi" class="section active dc-isi">
                <h3 class="fs-20 mb-3 fw-semibold">Course Overview</h3>
                <p class="fs-16 fw-normal text-justify">{{ courseData.description }}</p>
                <p class="mb-sm-4 fs-16 fw-semibold mt-md-4">Duration :August 10, 2024 to September 30, 2024</p>    
                <p class="fs-20 fw-semibold">Tags</p>
                <div class="d-flex justify-content-start mb-5">
                    <button v-for="tool in courseData.tools" :key="tool.id_tool" class="mx-3 rounded-3 c-border bg-white w-120 h-43 fs-16 fw-normal" >
                        {{ tool.name }}
                    </button>
                </div>
                <div class="bg-about2">
                    <div class="row">
                        <div class="text-center">
                            <h1 class="fs-20 fw-semibold mb-3 mt-5">Explore Your Passion – Enroll in Our
                                Exclusive Courses Now!
                            </h1>
                            <p class="fs-16 mb-3">Dive into learning at no cost by clicking the button below.
                            </p>
                            <div class="d-flex justify-content-center">
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="agreeCheckbox"
                                        v-model="isCheckboxChecked" />
                                    <label class="form-check-label fs-16 fw-light opacity-75" for="agreeCheckbox">
                                        "I agree to the Course Terms and Data Policy"
                                    </label>
                                    <p v-if="!isCheckboxChecked && errorMessage" class="text-danger fs-14 mt-1">
                                        {{ errorMessage }}
                                    </p>
                                </div>
                            </div>
                            <ButtonSuccess @click="RegisterCourse" :disabled="!isCheckboxChecked"
                                class="btn btn-hijau mb-5 h-45 col-6 col-md-2 rounded-4 fs-16 fw-normal">
                                START LEARNING
                            </ButtonSuccess>
                        </div>
                    </div>
                </div>
            </div>
            <div id="teacher" class="section dc-teacher">
                <div class="row">
                    <div class="col-md-2">
                        <img :src="courseData.teacherProfilePhotoUrl" class="rounded-circle me-3" alt="Teacher Profile Photo" height="160px" >
                    </div>

                    <div class="col-md-10">
                        <div class="p-absolute name">
                            <p class="fw-semibold fs-16 mb-1 mt-3">{{ courseData.teacher?.user?.name || 'Unknown Teacher' }}</p>
                            <p class="fs-16 mb-4 fw-medium">{{ courseData.teacher?.affiliation }}</p>
                        </div>
                        <p class="text-justify mb-5 fs-16 fw-light opacity-75 mt-95">Wina Salim adalah seorang Fullstack
                            Programmer
                            dengan pengalaman
                            lebih dari 7 tahun di dunia teknologi. Ia berfokus pada pengembangan aplikasi web dengan
                            menggunakan teknologi terbaru seperti React.js dan Node.js. Wina memiliki passion besar
                            dalam mengajar pemula dan membimbing mereka melalui proses belajar pemrograman. Dengan
                            pengalaman bekerja di beberapa proyek besar, ia juga sering menjadi pembicara di berbagai
                            acara teknologi.</p>
                    </div>
                </div>
            </div>
            <div id="rules" class="section dc-rules">
                <h3 class="fs-20 mb-3 fw-semibold">Course Terms & Conditions</h3>
                <ul class="no-bullets" v-if="courseData.rules">
                    <li v-for="(rule, index) in courseData.rules.split('\n')" :key="index" class="fs-16 fw-normal mb-2">
                        {{ rule }}
                    </li>
                </ul>
                <p v-else class="fs-16 fw-normal">No rules available for this course.</p>
            </div>
            <div id="review" class="section dc-review">
                <div v-for="review in paginatedReviews" :key="review.id"
                    class="card bg-review-course mb-3 border-0 rounded-4">
                    <div class="d-flex justify-content-start">
                        <div class="col-md-1">
                            <img :src="review.profil" class="rounded-circle mx-3 my-3" alt="Profile" height="70px">
                        </div>
                        <div class="col-3 col-md-1 mt-4 ms-md-2">
                            <p class="fw-bold mb-0 fs-16">{{ review.nama }}</p>
                            <div class="d-flex justify-content-start">
                                <i v-for="star in review.stars" :key="star" class="bi bi-star-fill color-start"></i>
                            </div>
                        </div>
                        <div class="col-md-9 ms-md-5 ms-0">
                            <p class="mx-3 mx-md-0 my-4 text-justify fs-16">{{ review.review }}</p>
                        </div>
                    </div>
                </div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination d-flex justify-content-center">
                        <li v-for="page in totalPages" :key="page"
                            :class="['page-item', { active: currentPage === page }]">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">
                                {{ page }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
            <div v-if="isToastVisible"
                :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toastMessage }}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                        aria-label="Close"></button>
                </div>
            </div>
        </div>
    </section>
    <!-- DETAIL COURSES END -->

    <!-- FOOTER START -->
    <FooterLayout />
    <!-- FOOTER END -->
</template>

<style scoped>
.no-bullets {
    list-style-type: none;
    padding: 0;
    margin: 0;
}
</style>