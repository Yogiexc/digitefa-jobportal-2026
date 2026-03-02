<template>
    <div v-if="CurrentPage === 'student'">
        <Index />
    </div>
</template>

<script setup>
import { provide, ref } from 'vue';
import Index from './student/Index.vue';

const CurrentPage = ref('student');

provide('CurrentPage', CurrentPage);
</script>