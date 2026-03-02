<script setup>
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import { ref, onUnmounted, onMounted, computed } from 'vue';
import MyProfill from './akun/MyProfill.vue';
import ChangePassword from './akun/ChangePassword.vue';
import Level from './akun/Level.vue';

const isSidebarVisible = ref(true);
const activeTab = ref('My Profill');

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
    <div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte" class="dashboard-teacher">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">{{ breadcrumbText }}</h5>
                            <h4 class="fs-24">{{ breadcrumbHalaman}}</h4>
                            <div class="card p-3 bordersa mt-2">
                                <div class="d-flex justify-content-start mt-11 gap-4">
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'My Profill' }"
                                        @click="setActiveTab('My Profill')">
                                        My Profill
                                    </label>
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'Change Password' }"
                                        @click="setActiveTab('Change Password')">
                                        Change Password
                                    </label>
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'level' }"
                                        @click="setActiveTab('level')">
                                        Level
                                    </label>
                                </div>
                                <hr />
                                <div v-show="activeTab === 'My Profill'">
                                    <MyProfill />
                                </div>
                                <div v-show="activeTab === 'Change Password'">
                                    <ChangePassword />
                                </div>
                                <div v-show="activeTab === 'level'">
                                    <Level />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>