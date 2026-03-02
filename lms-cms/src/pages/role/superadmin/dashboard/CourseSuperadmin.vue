<script setup>
import { ref, computed, onMounted } from 'vue';
import PaginationComponents from '@/components/PaginationComponents.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 3;
const courseData = ref([]);

const fetchCoursesData = async () => {
    try {
        const response = await axios.get('/courses');
        const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;

        courseData.value = response.data.map(course => ({
            ...course,
            thumbnail: course.thumbnail ? `${courseThumbnailUrl}/${course.thumbnail}`
                : require('@/assets/images/home.jpg'),
        }));
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const truncateSubTitle = (subTitle, wordLimit = 3) => {
    if (!subTitle) return '';

    const words = subTitle.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : subTitle;
};

const filteredData = computed(() => {
    return courseData.value.filter(c => {
        const title = c.title ? c.title.toLowerCase() : '';
        const description = c.deskripsi ? c.deskripsi.toLowerCase() : '';
        const query = searchQuery.value.toLowerCase();
        return title.includes(query) || description.includes(query);
    });
});

const goDetailCourse = (id) => {
    router.push(`/course-manajemen/log-activity/${id}`);
};

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.value.slice(start, end);
});

const handlePageChange = (page) => {
    currentPage.value = page;
};

onMounted(() => {
    fetchCoursesData();
});
</script>
<template>
    <div class="mt-4 ds">
        <div class="card rounded-4 p-25 border-0">
            <div class="d-flex justify-content-between">
                <div>
                    <h5 class="fw-semibold fs-24 mb-1 ms-2">Course</h5>
                </div>
                <div class="d-flex justify-content-end">
                    <div class="search-input w-100 me-md-2 me-2 h-43">
                        <input type="text"
                            class="form-control rounded-3 h-40 c-border h-40 bg-biruu rounded-3 border-0 fs-12"
                            v-model="searchQuery" placeholder="Search" />
                        <i class="bi bi-search"></i>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table align-middle mb-0 bg-white rounded">
                    <thead class="bg-light">
                        <tr>
                            <th class="fs-16 fw-medium w-400">Courses Name</th>
                            <th class="fs-16 fw-medium">Active Student</th>
                            <th class="fs-16 fw-medium">Recent Activities</th>
                            <th class="fs-16 fw-medium text-center">View Log</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedData" :key="item.id">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img :src="item.thumbnail" class="rounded me-3" alt="Course Image" width="88px"
                                        height="56px" />
                                    <div class="ms-0">
                                        <h6 class="mb-1 fs-16 fw-medium">{{ truncateSubTitle
                                            (item.title) }}</h6>
                                        <p class="mb-0 text-muted fs-12">{{ truncateSubTitle
                                            (item.description) }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span class="fs-16 fw-light">Active</span>
                            </td>
                            <td class="text-center">
                                <span class="fs-16 fw-light">Active</span>
                            </td>
                            <td class="text-center">
                                <ButtonBiru class="fs-12 rounded-3 py-2 w-110" @click="goDetailCourse(item.id_course_batch)">View
                                </ButtonBiru>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <PaginationComponents :currentPage="currentPage" :totalPages="totalPages" class="mt-md-0 mt-5"
                :onPageChange="handlePageChange" />
        </div>
    </div>
</template>