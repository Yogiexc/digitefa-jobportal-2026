<script setup>
import LoadingScreen from '@/components/LoadingScreen.vue';
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, onUnmounted, onMounted } from 'vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})

</script>
<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />
    
    <div class="navbg-sa">
        <!-- NAVBAR START -->
        <NavbarSA />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarSA v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->


        <div id="contentsa" class="dashboard-sa">
            <div class="container mt-80">
                <div class="row">
                    <h1> Hlaman Sponsor</h1>
                </div>
            </div>
        </div>
    </div>
</div>
</template>