<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarStudent from '@/layout/NavbarStudent.vue';
import SidebarStudent from '@/layout/SidebarStudent.vue';
import Radar from './Statistika/Radar.vue';
import Rekomendasi from './Statistika/Rekomendasi.vue';

const isSidebarVisible = ref(true);

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};
</script>

<template>
    <div class="user-background">
        <!-- NAVBAR -->
        <NavbarStudent />

        <!-- SIDEBAR -->
        <SidebarStudent v-if="isSidebarVisible" />

        <!-- CONTENT -->
        <div id="content" class="help">
            <div class="container mt-80">
                <div class="cbg-card rounded-3 p-4 border-0">
                    <h5 class="fw-light fs-16">Digitefa/My Course/Statistics</h5>
                    <h4 class="fs-24 mb-4">Statistics</h4>
                    <div class="card rounded-3 p-3">

                        <Radar />
                        <h5 class="fs-16 mt-5">Recommendation</h5>
                        <Rekomendasi />

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>