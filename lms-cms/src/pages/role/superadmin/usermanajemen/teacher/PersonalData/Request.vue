<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, onUnmounted, onMounted } from 'vue';
import NavRequest from '@/layout/NavRequest.vue';
import Index from './Request/Index.vue';

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
});
</script>
<template>
    <div class="navbg-sa">
        <NavbarSA />
        <SidebarSA v-if="isSidebarVisible" />

        <div id="contentsa" class="dashboard-sa">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/User Manajemen/Teacher/Request</h5>
                            <h4 class="fs-24"> Request</h4>
                            <div class="card p-3 bordersa mt-2">
                                <NavRequest />
                                <Index />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
