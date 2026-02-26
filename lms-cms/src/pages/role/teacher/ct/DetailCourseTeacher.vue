<script setup>
import { ref, onUnmounted, onMounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import { inject } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import Detail from './detailcourseteacher/Detail.vue';
import Modul from './detailcourseteacher/Modul.vue';

const isSidebarVisible = ref(true);
const activeTab = inject('activeTab');

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

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
                        <div class="cbg-card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen</h5>
                            <h4 class="fs-24">Course Manajemen</h4>
                            <div class="cbg-card p-3 bordersa mt-2 min-height-68">
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex justify-content-start mt-11 gap-4">
                                        <label class="fs-16 pointer"
                                            :class="{ 'active-tab': activeTab === 'detailcourse' }"
                                            @click="setActiveTab('detailcourse')">
                                            Detail
                                        </label>
                                        <label class="fs-16 pointer"
                                            :class="{ 'active-tab': activeTab === 'modulcourse' }"
                                            @click="setActiveTab('modulcourse')">
                                            Modul
                                        </label>
                                    </div>
                                </div>
                                <hr />

                                <div v-show="activeTab === 'detailcourse'">
                                    <Detail />
                                </div>
                                <div v-show="activeTab === 'modulcourse'">
                                    <Modul />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>