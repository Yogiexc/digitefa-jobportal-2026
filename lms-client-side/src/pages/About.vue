<script setup>
import NavbarLayout from '@/layout/NavbarLayout.vue';
import FooterLayout from '@/layout/FooterLayout.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const title = ref('');
const content = ref('');
const imagePreview = ref(null);


const fetchAboutUsData = async () => {
    try {
        const response = await axios.get('/about-us');
        title.value = response.data.title;
        content.value = response.data.content;
        const teacherAboutUrl = process.env.VUE_APP_TEACHER_ABOUT_URL;
        if (response.data.image) {
            imagePreview.value = `${teacherAboutUrl}/${response.data.image}`;
        }
    } catch (error) {
        console.error("Error fetching About Us Data:", error);
    }
};

// const fetchAboutUsData = async () => {
//     const cachedData = localStorage.getItem('aboutUsData');
//     if (cachedData) {
//         aboutData.value = JSON.parse(cachedData);
//     } else {
//         try {
//             const response = await axios.get('/about-pages');
//             aboutData.value = response.data[0];
//             localStorage.setItem('aboutUsData', JSON.stringify(aboutData.value));
//         } catch (error) {
//             console.error('Error fetching About Us data:', error);
//         }
//     }
// };

onMounted(() => {
    fetchAboutUsData();
});
</script>

<template>
    <!-- NAVBAR START -->
    <NavbarLayout />
    <!-- NAVBAR END -->

    <!-- ABOUT START -->
    <section class="bg-about-isi fw-semibold mt-100">
        <div class="container">
            <div class="row">
                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
                    aria-label="breadcrumb">
                    <ol class="breadcrumb my-4 ms-1">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">About</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

    <section class="page-about">
        <div class="container">
            <div class="row">
                <div class="ps-3 my-3">
                    <h1 class="fs-40 fw-semibold">{{ title }}</h1>
                </div>
                <div class="d-flex justify-content-center">
                    <img v-if="imagePreview" :src="imagePreview" 
                        alt="E-Learning" class="rectangle-img rounded-4">
                </div>
                <div class="me-md-5">
                    <div class="mt-4 mt-md-5 text-justify fs-16 ms-md-1" data-aos="fade-up" data-aos-duration="2000" div v-html="content">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER START -->
    <FooterLayout />
    <!-- FOOTER END -->
</template>
