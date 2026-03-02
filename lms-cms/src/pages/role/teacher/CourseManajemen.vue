<script setup>
import { ref, provide } from 'vue';
import IndexCourse from './ct/IndexCourse.vue';

const currentPage = ref('courseteacher');

provide('currentPage', currentPage);
</script>
<template>
    <div v-if="currentPage === 'courseteacher'">
        <IndexCourse />
    </div>
</template>