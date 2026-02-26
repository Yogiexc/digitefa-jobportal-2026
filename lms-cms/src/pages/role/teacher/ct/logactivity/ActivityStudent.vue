<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activityStudent = [
    {
        id: 1,
        activity: 'Submitted Assignment',
        date: '01/10/2024',
        status: 'Completed'
    },
    {
        id: 2,
        activity: 'Essay Submitted',
        date: '01/10/2024',
        status: 'Completed'
    },
    {
        id: 3,
        activity: 'Watched Video',
        date: '01/10/2024',
        status: 'Completed'
    },
]

const ActivityStudent = ref(activityStudent);
const isSidebarVisible = ref(true);
const searchQuery = ref('');
const selectedSort = ref('Newtest');
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));

const filteredData = computed(() => {
    let sortedData = [...ActivityStudent.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(tools =>
        tools.activity.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.value.slice(startIndex, endIndex);
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
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})

const goToDetail = (id, activity) => {
    const target = activity === 'Submitted Assignment' ? 'assignment' : 'essay';
    router.push({
        path: '/course-teacher/batch/activity-student/detail-activity',
        query: { id, type: target },
    });
};

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
                        <div class="cbg-card rounded-3 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Batch/Activity Student</h5>
                            <h4 class="fs-24">Activity Student</h4>
                            <div class="card p-3 bordersa mt-3">
                                <div class="d-flex justify-content-between mb-3">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control rounded-3 h-40 c-border"
                                                v-model="searchQuery" placeholder="Search" />
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <select class="form-select w-35 c-border ms-2 h-40 c-border"
                                            v-model="selectedSort">
                                            <option selected>Newtest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table custom-table rounded-4">
                                        <thead class="thead-custom">
                                            <tr class="ps-4">
                                                <th class="ps-3 fs-16 fw-medium w-1">No</th>
                                                <th class="fs-16 fw-light w-350">Activity Type</th>
                                                <th class="fs-16 fw-light w-170">Date</th>
                                                <th class="fs-16 fw-light w-170">Status</th>
                                                <th class="fs-16 fw-light w-10">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-custom">
                                            <tr v-for="(item, index) in paginatedData" :key="item.id">
                                                <td class="ps-4 pt-3">{{ (currentPage - 1) * itemsPerPage + index +
                                                    1 }}</td>
                                                <td class="pt-3">{{ item.activity }}</td>
                                                <td class="pt-3">{{ item.date }}</td>
                                                <td class="pt-3">{{ item.status }}</td>
                                                <td class="ps-3 pt-2">
                                                    <button class="border-0 rounded-2 btn-eye"
                                                        @click="goToDetail(item.id, item.activity)">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="6" class="p-1">
                                                    <nav>
                                                        <div class="d-flex justify-content-between">
                                                            <div class="d-flex align-items-center">
                                                                <label for="itemsPerPage" class="me-2">Items per
                                                                    page:</label>
                                                                <select id="itemsPerPage"
                                                                    class="form-select w-auto bg-none border-0"
                                                                    v-model="itemsPerPage">
                                                                    <option value="10">10</option>
                                                                    <option value="20">20</option>
                                                                    <option value="50">50</option>
                                                                </select>
                                                                <span class="fs-16">{{ (currentPage - 1) *
                                                                    itemsPerPage + 1 }} -
                                                                    {{
                                                                        Math.min(currentPage * itemsPerPage,
                                                                            filteredData.length) }}
                                                                    of
                                                                    {{ filteredData.length }} items</span>
                                                            </div>
                                                            <ul
                                                                class="pagination custom-pagination justify-content-end">
                                                                <li class="page-item"
                                                                    :class="{ disabled: currentPage === 1 }">
                                                                    <a class="page-link" href="#"
                                                                        @click.prevent="goToPage(currentPage - 1)">
                                                                        <i class="bi bi-chevron-left"></i>
                                                                    </a>
                                                                </li>
                                                                <li v-for="page in pageNumbers" :key="page"
                                                                    class="page-item"
                                                                    :class="{ active: page === currentPage }">
                                                                    <a class="page-link" href="#"
                                                                        @click.prevent="goToPage(page)"
                                                                        v-if="page !== '...'">{{
                                                                            page }}</a>
                                                                    <span class="page-link" v-else>...</span>
                                                                </li>
                                                                <li class="page-item"
                                                                    :class="{ disabled: currentPage === totalPages }">
                                                                    <a class="page-link" href="#"
                                                                        @click.prevent="goToPage(currentPage + 1)">
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
</template>