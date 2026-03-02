<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const navigateTo = (tab) => {
    const currentId = route.params.id;
    router.push(`/course-manajemen/${tab}/${currentId}`);
};
</script>

<template>
    <div class="d-flex justify-content-between">
        <div class="d-flex justify-content-start mt-11 gap-4">
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('detail') }"
                @click="navigateTo('detail')">
                Detail
            </label>
            <label class="fs-16 pointer" :class="{ 'active-tab': route.path.includes('modul') }"
                @click="navigateTo('modul')">
                Modul
            </label>
        </div>
    </div>
    <hr />
</template>
