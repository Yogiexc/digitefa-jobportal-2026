<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import NavBatch from '@/layout/NavBatch.vue';

const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);
const selectedSort = ref('newest');
const courseActivities = ref([]);
const isSidebarVisible = ref(true);

const route = useRoute();

const fetchLogActivityData = async () => {
    try {
        const courseBatchId = route.params.id;
        console.log('Fetching data for course batch ID:', courseBatchId);

        const response = await axios.get(`/course-batches-activities/${courseBatchId}`);
        console.log('Fetched activities:', response.data.activities);

        if (response.data.success) {
            courseActivities.value = response.data.activities;
        } else {
            console.error('Failed to fetch data:', response.data.message);
        }
    } catch (error) {
        console.error('Failed to fetch log activity:', error);
    }
};


const filteredData = computed(() => {
    let filtered = courseActivities.value;

    if (searchQuery.value) {
        filtered = filtered.filter(activity =>
            activity.name_student.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    if (selectedSort.value === 'newest') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedSort.value === 'oldest') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return filtered;
});


const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const pageNumbers = computed(() => {
    const pages = [];
    if (totalPages.value <= 5) {
        for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    } else {
        if (currentPage.value <= 3) {
            pages.push(1, 2, 3, '...', totalPages.value);
        } else if (currentPage.value > 3 && currentPage.value < totalPages.value - 2) {
            pages.push(1, '...', currentPage.value, '...', totalPages.value);
        } else {
            pages.push(1, '...', totalPages.value - 2, totalPages.value - 1, totalPages.value);
        }
    }
    return pages;
});


const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchLogActivityData();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
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
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Batch/Log Activity</h5>
                            <h4 class="fs-24">Log Activity</h4>
                            <div class="card p-3 bordersa mt-2">
                                    <NavBatch />
                                    <div class="d-flex justify-content-between mb-3">
                                        <div class="d-flex justify-content-start">
                                            <div class="search-input w-50 me-md-1">
                                                <input type="text" class="form-control rounded-3 h-40 c-border" v-model="searchQuery"
                                                    placeholder="Search" />
                                                <i class="bi bi-search cmt-1"></i>
                                            </div>
                                            <select class="form-select w-30 c-border h-40 ms-2" v-model="selectedSort">
                                                <option value="newest">Newest</option>
                                                <option value="oldest">Oldest</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="table-responsive">
                                            <table class="table custom-table rounded-4">
                                                <thead class="thead-custom">
                                                    <tr class="ps-4">
                                                        <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                        <th class="fs-16 fw-light w-200">Name Student</th>
                                                        <th class="fs-16 fw-light w-200">Activity Type</th>
                                                        <th class="fs-16 fw-light w-150">Date</th>
                                                        <th class="fs-16 fw-light w-150">Status</th>
                                                        <th class="fs-16 fw-light w-10 pe-3">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="table-custom">
                                                    <tr v-for="(activity, index) in paginatedData" :key="activity.id_student_progress || activity.id_assignment_submission || activity.id_quiz_submission">
                                                        <td class="ps-4 pt-3 pointer">{{ index + 1 }}</td>
                                                        <td class="pt-3 fs-16">{{ activity.name_student }}</td>
                                                        <td class="pt-3 fs-16">{{ activity.activity_type }}</td>
                                                        <td class="pt-3 fs-16">{{ activity.date }}</td>
                                                        <td class="pt-3 fs-16">{{ activity.status }}</td>
                                                        <td class="ps-3">
                                                            <button class="border-0 rounded-2 btn-eye">
                                                                <i class="bi bi-eye"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="6" class="p-1">
                                                            <nav>
                                                                <div class="d-flex justify-content-between">
                                                                    <div class="d-flex align-items-center">
                                                                        <label for="itemsPerPage" class="me-2">Items per page:</label>
                                                                        <select id="itemsPerPage" class="form-select w-auto bg-none border-0"
                                                                            v-model="itemsPerPage">
                                                                            <option value="10">10</option>
                                                                            <option value="20">20</option>
                                                                            <option value="50">50</option>
                                                                        </select>
                                                                        <span class="fs-16">{{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of {{ filteredData.length }} items</span>
                                                                    </div>
                                                                    <ul class="pagination custom-pagination justify-content-end">
                                                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                                                                                <i class="bi bi-chevron-left"></i>
                                                                            </a>
                                                                        </li>
                                                                        <li v-for="page in pageNumbers" :key="page" class="page-item"
                                                                            :class="{ active: page === currentPage }">
                                                                            <a class="page-link" href="#" @click.prevent="goToPage(page)"
                                                                                v-if="page !== '...'">{{ page }}</a>
                                                                            <span class="page-link" v-else>...</span>
                                                                        </li>
                                                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                                                                                <i class="bi bi-chevron-right"></i>
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </nav>
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
            </div>
        </div>
</template>
