<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarStudent from '@/layout/NavbarStudent.vue';
import SidebarStudent from '@/layout/SidebarStudent.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';

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
    <div class="user-background2">
        <!-- NAVBAR START -->
        <NavbarStudent />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarStudent v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="content" class="mycourse">
            <div class="container mt-80">
                <div class="row">
                    <div class="dashboard">
                        <div class="card rounded-4 p-25 border-0">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="fw-semibold fs-24 mb-3 ms-2">History</h5>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mb-2">
                                <div class="search-input w-330 me-1">
                                    <SearchComponent placeholder="Search" :classCustom="'h-40'" />
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table align-middle mb-0 bg-white rounded">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="fs-16 fw-medium">Course Name</th>
                                            <th class="fs-16 fw-medium">Progress</th>
                                            <th class="fs-16 fw-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="../../../../../assets/images/bg-7.png" class="rounded me-3"
                                                        alt="Course Image" width="88px" height="56px" />
                                                    <div class="ms-0">
                                                        <h6 class="mb-1 fs-16 fw-medium">Dasar Pemrograman Web</h6>
                                                        <p class="mb-0 text-muted fs-12">Materi pembelajaran mengenai
                                                            pembuatan</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="me-5 w-200 position-relative">
                                                    <div class="progress bg-progress h-8">
                                                        <div class="h-8 w-20 bg-progress-failed" role="progressbar"
                                                            aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                        </div>
                                                    </div>
                                                    <span class="progress-text2 fs-14 fw-medium">20%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p class="f-12 rounded-3 h-37 w-110 text-start p-2 fw-medium">
                                                    FAILED
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="../../../../../assets/images/ak.png" class="rounded me-3"
                                                        alt="Course Image" width="88px" height="56px" />
                                                    <div class="ms-0">
                                                        <h6 class="mb-1 fs-16 fw-medium">Dasar Pemrograman Web</h6>
                                                        <p class="mb-0 text-muted fs-12">Materi pembelajaran mengenai
                                                            pembuatan</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="w-200 position-relative">
                                                    <div class="progress bg-progress h-8">
                                                        <div class="h-8 w-100 bg-progress-succcess" role="progressbar"
                                                            aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                        </div>
                                                    </div>
                                                    <span class="progress-text2 fs-14 fw-medium">100%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p class="f-12 fw-medium text-start ms-1 mb-0">YOU ARE ELIGIBLE</p>
                                                <ButtonSuccess class="fs-12 rounded-3 h-37 w-110 mt-0">Certificate
                                                </ButtonSuccess>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>