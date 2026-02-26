<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import { skillPage } from '@/data/index.js';
import store from '@/store';

const router = useRouter();
const skillData = ref(skillPage);

const navigateToPage = (id) => {
    if (!store.getters.isLoggedIn) {
        router.push('/login');
        return;
    }
    switch (id) {
        case 1:
            router.push('/settings');
            break;
        case 2:
            router.push('/courses');
            break;
        case 3:
            router.push('/faq');
            break;
        default:
            console.error('Invalid ID');
    }
};
</script>

<template>
    <section class="mb-5 learning-index">
        <div class="container">
            <div class="row">
                <div class="mt-2 mb-3">
                    <h1 class="fs-40 mb-4 fw-semibold" data-aos="fade-right" data-aos-duration="2000">Improve Your
                        Skills with the
                        Best
                        Courses at
                        Digitefa Introduction</h1>
                    <p class="fs-16 fw-normal" data-aos="fade-left" data-aos-duration="2000">Welcome to Digitefa, the
                        place where your learning
                        journey begins! Here, we provide a variety of
                        courses designed to help you grow and achieve your career goals. Whether you're starting out or
                        looking to upskill, Digitefa has the right course for you.<br><br>

                        Follow the steps below to start exploring courses that will open the door to a brighter future.
                        Don't miss the opportunity to learn, grow, and shine!</p>
                </div>
            </div>

            <div class="row shw" data-aos="fade-up" data-aos-duration="3000">
                <div v-for="(skill, index) in skillData" :key="index" class="col-md-4">
                    <div class="card img-thumbnail p-3 bg-biru mb-3 border-0 rounded-4">
                        <div class="card w-100 border-0">
                            <img :src="skill.image" class="rounded-4" alt="skill-1">
                        </div>
                        <h4 class="text-center mt-3 fs-16 fw-medium">{{ skill.judul }}</h4>
                        <p class="fs-16 mx-md-3 fw-light">{{ skill.deskripsi }}</p>
                        <div class="text-center cbtn">
                            <ButtonSuccess class="btn btn-hijau rounded-3 w-50 mb-3 fs-14 fw-medium h-39"
                                @click="navigateToPage(skill.id)">Get Started
                            </ButtonSuccess>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>