<script setup>
import { ref, computed, onMounted } from 'vue';
import PaginationComponents from '@/components/PaginationComponents.vue';
import ButtonOrange from '@/components/ButtonOrange.vue';
import axios from 'axios';
import SearchComponent from '@/components/SearchComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 3;
const courseData = ref([]);
const progressData = ref([]);
const user = ref({});
const name = ref('');
const idCourseEnrollments = ref([]);
const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;

const fetchCourseData = async () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const id_user = storedUser?.id_user;

        if (!id_user) {
            console.error('User ID not found');
            return;
        }

        const response = await axios.get(`/course-enrollments/student/${id_user}`);
        courseData.value = response.data.enrollments;

        idCourseEnrollments.value = response.data.enrollments.map(
            (enrollment) => enrollment.id_course_enrollment
        );

        console.log('ID Course Enrollments:', idCourseEnrollments.value);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

idCourseEnrollments.value.forEach(async (id) => {
    try {
        const response = await axios.get(`/latest-progress/${id}`);
        console.log(`Progress Data for ${id}:`, response.data);
    } catch (error) {
        console.error(`Failed to fetch progress data for ${id}:`, error);
    }
});


const fetchProgressData = async () => {
    try {
        if (idCourseEnrollments.value.length > 0) {
            const response = await axios.get(`/latest-progress/${idCourseEnrollments.value[0]}`);
            progressData.value = response.data;

            console.log('Progress Data:', progressData.value);
        } else {
            console.error('No course enrollments available.');
        }
    } catch (error) {
        console.error('Failed to fetch progress data:', error);
    }
};


const showCoursePage = async (enrollmentId) => {
    const courseEnrollment = courseData.value.find(enrollment => enrollment.id_course_enrollment === enrollmentId);

    if (courseEnrollment) {
        const id_course = courseEnrollment.course_batch.course.id_course;
        const id_course_enrollment = enrollmentId;

        try {
            // Fetch sections and materials for this course
            const response = await axios.get('/course-sections-student', {
                params: {
                    id_course,
                    id_course_enrollment,
                },
            });

            const sections = response.data.sections;

            if (sections.length > 0 && sections[0].materials.length > 0) {
                const id_course_material = sections[0].materials[0].id_course_material;

                console.log('Navigating to Course Material Page with:', { id_course, id_course_enrollment, id_course_material });

                router.push(`/room/course-material/${id_course}/${id_course_enrollment}/${id_course_material}`);
            } else {
                console.error('No materials found for the course.');
            }
        } catch (error) {
            console.error('Failed to fetch sections and materials:', error);
        }
    } else {
        console.error('Course enrollment not found for ID:', enrollmentId);
    }
};

const truncateText = (text, wordLimit = 3) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit
        ? `${words.slice(0, wordLimit).join(' ')}...`
        : text;
};

const filteredData = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return courseData.value.filter((c) => {
        const title = c.course_batch?.course?.title?.toLowerCase() || '';
        const description = c.course_batch?.course?.description?.toLowerCase() || '';
        return title.includes(query) || description.includes(query);
    });
});

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
    fetchProgressData();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored User:', storedUser);

    if (storedUser) {
        user.value = storedUser;
        name.value = user.value.name;
        console.log('User data:', user.value);
        fetchCourseData();
    } else {
        console.error('No user data found in localStorage.');
    }
});
</script>

<template>
    <div class="mt-4 dashboard ov">
        <div class="card rounded-4 p-25 border-0">
            <div class="d-flex justify-content-between">
                <div>
                    <h5 class="fw-semibold fs-24 mb-1 ms-2">Aktivitas Belajar</h5>
                </div>
                <div class="d-flex justify-content-end">
                    <div class="search-input w-100 me-md-0 me-2 h-43">
                        <SearchComponent placeholder="Search" :customClass="'h-40 border-0'" v-model="searchQuery" />
                    </div>
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
                        <tr v-for="item in paginatedData" :key="item.id">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img :src="`${courseThumbnailUrl}/${item.course_batch.course.thumbnail}`"
                                        class="rounded me-3" alt="Course Image" width="88px" height="56px" />
                                    <div class="ms-0">
                                        <h6 class="mb-1 fs-16 fw-medium">{{ item.course_batch.course.title }}</h6>
                                        <p class="mb-0 text-muted fs-12"> {{
                                            truncateText(item.course_batch.course.description, 5) }}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="me-5 w-200 position-relative">
                                    <div class="progress bg-progress h-8">
                                        <div class="h-8 w-20 bg-progress-done" role="progressbar" aria-valuenow="20"
                                            aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                    <span class="progress-text2 fs-14 fw-medium">20%</span>
                                </div>
                            </td>
                            <td>
                                <ButtonOrange @click="showCoursePage(item.id_course_enrollment)"
                                    class="fs-12 rounded-3 h-37 w-110">Continue</ButtonOrange>
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