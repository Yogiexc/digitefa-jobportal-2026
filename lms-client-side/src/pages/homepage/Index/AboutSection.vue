<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const title = ref('');
const description = ref('');
const imagePreview = ref(null);

const fetchAboutUsData = async () => {
    try {
        const response = await axios.get('/about-us');
        const teacherAboutUrl = process.env.VUE_APP_TEACHER_ABOUT_URL;
        title.value = response.data.title;
        description.value = response.data.description;
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
//             const response = await axios.get('/about-us');
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
    <!-- ABOUT END -->
    <section class="bg-about mb-5 about-index">
        <div class="container">
            <div class="row">
                <div class="text-left pt-5">
                    <h1 class="fs-40 fw-semibold mb-3" data-aos="fade-right" data-aos-duration="1000">About Us</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6" data-aos="fade-right" data-aos-duration="1000">
                    <h3 class="fs-40 mb-3 fw-semibold">{{ title }}</h3>
                    <p class="fs-16 mt-4 mb-5 fw-light text-justify">{{ description }}</p>
                </div>
                <div class="col-md-6">
                    <div class="d-flex justify-content-end">
                        <img :src="imagePreview" class="mb-5 logo-about rounded-4" alt="foto">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- ABOUT END -->
</template>