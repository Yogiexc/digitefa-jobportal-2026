<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, onUnmounted, onMounted, computed } from 'vue';
import Email from './akun/Email.vue';
import Password from './akun/Password.vue';

const isSidebarVisible = ref(true);
const activeTab = ref('email');

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

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

const breadcrumbText = computed(() => {
    return `Digitefa/Settings/${activeTab.value.charAt(0).toUpperCase() + activeTab.value.slice(1)}`;
});
const breadcrumbHalaman = computed(() => {
    return `${activeTab.value.charAt(0).toUpperCase() + activeTab.value.slice(1)}`;
});
</script>
<template>
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
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">{{ breadcrumbText }}</h5>
                            <h4 class="fs-24">{{ breadcrumbHalaman}}</h4>
                            <div class="card p-3 bordersa mt-2">
                                <div class="d-flex justify-content-start mt-11 gap-4">
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'email' }"
                                        @click="setActiveTab('email')">
                                        Email
                                    </label>
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'password' }"
                                        @click="setActiveTab('password')">
                                        Password
                                    </label>
                                </div>
                                <hr />
                                <div v-show="activeTab === 'email'">
                                    <Email />
                                </div>
                                <div v-show="activeTab === 'password'">
                                    <Password />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>