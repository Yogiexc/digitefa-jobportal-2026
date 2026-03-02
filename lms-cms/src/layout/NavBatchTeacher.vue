<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentId = route.params.id || 'someDefaultId';

const navigateTo = (tab) => {
    if (tab === 'log') {
        router.push(`/course-teacher/log-activity/${currentId}`);
    } else if (tab === 'student') {
        router.push(`/course-teacher/batch/student/${currentId}`);
    }
};
</script>

<template>
    <div class="d-flex justify-content-between biru">
        <div class="d-flex justify-content-start mt-11 gap-4">
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('log') }"
                @click="navigateTo('log')">
                Log
            </label>
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('student') }"
                @click="navigateTo('student')">
                Student
            </label>
        </div>
    </div>
    <hr />
</template>
