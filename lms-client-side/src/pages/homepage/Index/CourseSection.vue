<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentPage = ref(1);
const itemsPerPage = 3;
const maxPages = 4;
const categoryData = ref([]);
const selectedCategory = ref('all');
const courseData = ref([]);

const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;
const courseProfilUrl = process.env.VUE_APP_TEACHER_PROFILE_URL;

const fetchCategoryData = async () => {
    try {
        const response = await axios.get('/categories');
        categoryData.value = response.data.slice(-4);
    } catch (error) {
        console.error('Error fetching category data:', error);
    }
};

const fetchCoursesData = async () => {
    try {
        const response = await axios.get('/courses-status');
        courseData.value = response.data;
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const showDetailCourse = (id) => {
    router.push(`/detail-courses/${id}`);
};

// Filtered courses based on selected category
const filteredCourses = computed(() => {
    let courses = courseData.value;

    // Filter based on category if it's not "all"
    if (selectedCategory.value !== 'all') {
        courses = courses.filter(course => course.category?.name.toLowerCase() === selectedCategory.value);
    }

    return courses;
});

// Total pages for pagination
const totalPages = computed(() => Math.min(Math.ceil(filteredCourses.value.length / itemsPerPage), maxPages));

// Paginated courses
const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCourses.value.slice(start, end);
});

// Change category filter
const setCategory = (category) => {
    selectedCategory.value = category;
    currentPage.value = 1; // Reset to the first page
};

// Navigate to a specific page
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const truncateText = (text, wordLimit = 3) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
};

// Handle navigation (for sections and pointers)
const handleNavigation = () => {
    const pointers = document.querySelectorAll('.pointer');
    const sections = document.querySelectorAll('.section');

    pointers.forEach(pointer => {
        pointer.addEventListener('click', () => {
            pointers.forEach(p => p.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            pointer.classList.add('active');
            const targetId = pointer.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.warn(`No section found with ID: ${targetId}`);
            }
        });
    });
};

onMounted(() => {
    handleNavigation();
    router.afterEach(() => {
        handleNavigation();
    });
});

onUnmounted(() => {
    const pointers = document.querySelectorAll('.pointer');
    pointers.forEach(pointer => {
        pointer.removeEventListener('click', handleNavigation);
    });
});

// Fetch data when the component is mounted
onMounted(() => {
    fetchCategoryData();
    fetchCoursesData();
});
</script>

<template>
    <section class="recomend-index">
        <div class="container my-5">
            <div class="row">
                <h1 class="fs-40 fw-semibold" data-aos="zoom-in-right" data-aos-duration="1000">Recommended Course for You</h1>
            </div>
            <div class="d-flex justify-content-between h4 mb-4 border-bottom border-success-subtle">
                <h5 class="me-3 mt-md-3 opacity-50 pointer fs-16" :class="{ active: selectedCategory === 'all' }" @click="setCategory('all')">All</h5>
                <h5 v-for="category in categoryData" :key="category.id_category" class="me-3 mt-md-3 opacity-50 pointer fs-16" :class="{ active: selectedCategory === category.name.toLowerCase() }" @click="setCategory(category.name.toLowerCase())">{{ category.name }}</h5>
                <router-link to="/courses" class="ms-auto text-right opacity-50 fs-16 garis- text-dark">See all</router-link>
            </div>

            <div id="carouselExampleControls" class="carousel slide shw" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <div class="row">
                            <div class="col-12 col-md-4 shw" v-for="(course, index) in paginatedCourses"
                            :key="course.id" :class="{ 'd-none d-md-block': index > 0 }">
                                <div class="card img-thumbnail p-2 bg-biru mb-4 rounded-4 border-0">
                                    <div class="card w-100 border-0 rounded-4">
                                        <img :src="`${courseThumbnailUrl}/${course.thumbnail}`" class="card-img-top rounded-4" alt="...">
                                        <p class="w-170 text-center fs-12 date" v-if="course.batches.length > 0">
                                            {{ course.batches[0].start_date }} - {{ course.batches[0].end_date }}
                                        </p>
                                        <div class="card-body">
                                            <div class="d-flex align-items-center">
                                                <img :src="`${courseProfilUrl}/${course.teacher?.photo_profile}`" class="rounded-circle me-3" alt="Teacher Photo" height="50px" width="50PX">
                                                <div>
                                                    <p class="fw-medium mb-0 fs-16">{{ course.teacher && course.teacher.user ? course.teacher.user.name : 'No teacher assigned' }}</p>
                                                    <p class="text-muted mb-0">Frontend</p>
                                                </div>
                                            </div>
                                            <a @click="showDetailCourse(course.id_course)" class="garis- text-dark pointer">
                                                <h5 class="mt-4 fs-16 fw-medium">{{ course.title }}</h5>
                                            </a>
                                            <p class="text-justify opacity-75">{{ truncateText(course.description, 20) }}
                                            </p>
                                            <div class="d-flex justify-content-around">
                                                <span class="bi bi-clock me-4">7 <span>day</span></span>
                                                <span class="bi bi-people me-4">80<span>/240</span></span>
                                                <span class="bi bi-star-fill opacity-75"> 4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center mt-2">
                <div v-for="page in totalPages" :key="page" class="pagination-circle" :class="{ 'active-circle': currentPage === page }" @click="goToPage(page)"></div>
            </div>
        </div>
    </section>
</template>
