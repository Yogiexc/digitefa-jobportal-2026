<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentId = route.params.id || 'someDefaultId';
const id_quiz = route.params.id_quiz || 'someDefaultId';
const id_course_section = route.params.id_course_section || 'someDefaultSectionId';

const navigateTo = (tab) => {
    if (tab === 'quiz') {
        router.push(`/course-manajemen/modul/${currentId}/edit-quiz/${id_quiz}/${id_course_section}`);
    } else if (tab === 'questions') {
        router.push(`/course-manajemen/modul/${currentId}/add-questions/${id_quiz}/${id_course_section}`);
    }
};
</script>

<template>
    <div class="d-flex justify-content-between biru">
        <div class="d-flex justify-content-start mt-11 gap-4">
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('quiz') }"
                @click="navigateTo('quiz')">
                Quiz
            </label>
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('questions') }"
                @click="navigateTo('questions')">
                Questions
            </label>
        </div>
    </div>
    <hr />
</template>
