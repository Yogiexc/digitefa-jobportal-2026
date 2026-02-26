<template>
    <div v-if="currentPage === 'manajemen'">
        <IndexCS />
    </div>

    <div v-if="currentPage === 'add'">
        <AddCourse />
    </div>

    <div v-if="currentPage === 'edit'">
        <EditCourse />
    </div>

</template>

<script setup>
import { ref, provide } from 'vue';
import IndexCS from './cs/IndexCS.vue';
import AddCourse from '@/pages/role/superadmin/cs/AddCourse.vue';
import EditCourse from '@/pages/role/superadmin/cs/EditCourse.vue';
import AddVideo from '../superadmin/cs/detailcourse/modulcourse/AddVideo.vue';
import AddAssignment from '../superadmin/cs/detailcourse/modulcourse/AddAssignment.vue';

const currentPage = ref('manajemen');


provide('currentPage', currentPage);

</script>
