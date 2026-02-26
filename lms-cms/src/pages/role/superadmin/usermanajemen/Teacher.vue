
<template>
    <div v-if="CurrentPage === 'teacher'">
        <Index />
    </div>
</template>

<script setup>
import { provide, ref } from 'vue';
import Index from './teacher/Index.vue';

const CurrentPage = ref('teacher');

provide('CurrentPage', CurrentPage);
</script>