<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const teacherId = route.params.id;

const navigateTo = (tab) => {
    if (tab === 'personaldata') {
        router.push(`/user-manajemen/teacher/detail-teacher/${teacherId}`);
    } else if (tab === 'request') {
        router.push(`/user-manajemen/teacher/request/${teacherId}`);
    }
};
</script>

<template>
    <div class="d-flex justify-content-between biru">
        <div class="d-flex justify-content-start mt-11 gap-4">
            <label 
                class="fs-16 pointer" 
                :class="{ 'active-tab': route.path.includes('/user-manajemen/teacher/detail-teacher/') }"
                @click="navigateTo('personaldata')">
                Personal Data
            </label>
            <label 
                class="fs-16 pointer" 
                :class="{ 'active-tab': route.path.includes('/user-manajemen/teacher/request/') }"
                @click="navigateTo('request')">
                Request
            </label>
        </div>
    </div>
    <hr />
</template>
