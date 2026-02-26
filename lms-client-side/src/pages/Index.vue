<script setup>
import NavbarLayout from '@/layout/NavbarLayout.vue';
import BannerSection from './homepage/Index/BannerSection.vue';
import CourseSection from './homepage/Index/CourseSection.vue';
import AboutSection from './homepage/Index/AboutSection.vue';
import IntroductionSection from './homepage/Index/IntroductionSection.vue';
import FaqSection from './homepage/Index/FaqSection.vue';
import FooterLayout from '@/layout/FooterLayout.vue';

// const isLoading = ref(true);

// onMounted(() => {
//     setTimeout(() => {
//         isLoading.value = false;
//     }, 2000); 
// });
</script>

<template>
    <!-- <div v-if="isLoading" id="preloader"></div>
    <div v-else> -->

    <!-- LANDING PAGE START -->
    <NavbarLayout />
    <BannerSection />
    <CourseSection />
    <AboutSection />
    <IntroductionSection />
    <FaqSection />
    <FooterLayout />
    <!-- LANDING PAGE  END -->

</template>
