<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import NavCourseTeacher from '@/layout/NavCourseTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const isSidebarVisible = ref(true);
const router = useRouter();
const route = useRoute();
const courseData = ref({
    title: '',
    description: '',
    duration: '',
    category: null,
    teacher: null,
    courseLevels: null,
});

const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;

const saveToLocalStorage = (data) => {
    localStorage.setItem('courseData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('courseData');
    if (storedData) {
        courseData.value = JSON.parse(storedData);
    }
};

const fetchCourseData = async () => {
    try {
        const courseId = route.params.id;
        const response = await axios.get(`/courses/${courseId}`);
        courseData.value = response.data;
        saveToLocalStorage(courseData.value);
    } catch (error) {
        console.error('Failed to fetch course:', error);
    }
};

const showEditPage = () => {
    const courseId = route.params.id;
    router.push(`/course-teacher/edit/${courseId}`);
};

const responsiveThumbnailLink = computed(() => {
    const maxLength = window.innerWidth >= 770 ? 60 : 30;
    const link = courseData.value.thumbnail_link || '';
    return link.length > maxLength ? `${link.slice(0, maxLength)}...` : link;
});

const updateThumbnailLength = () => {
    responsiveThumbnailLink.value;
};

const truncateText = (text, wordLimit = 3) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    checkWindowSize();
    fetchCourseData();
    loadFromLocalStorage();
    window.addEventListener('resize', checkWindowSize);
    window.addEventListener('resize', updateThumbnailLength);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
    window.removeEventListener('resize', updateThumbnailLength);
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
                        <div class="cbg-card p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Detail Course</h5>
                            <h4 class="fs-24">Detail Course</h4>
                            <div class="cbg-card2 p-3 bordersa mt-2 min-height-68">
                                <NavCourseTeacher />
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru class="h-40 px-5" @click="showEditPage">Edit</ButtonBiru>
                                </div>
                                <div class="container">
                                    <div class="mb-3 row">
                                        <label for="nameCourse" class="col-sm-3 col-form-label fs-16">Name Course</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ courseData.title }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="thumbnailLink" class="col-sm-3 col-form-label fs-16">Thumbnail</label>
                                        <div class="col-sm-9 ms--35 mt-3">
                                            <img v-if="courseData.thumbnail" :src="`${courseThumbnailUrl}/${courseData.thumbnail}`"
                                                alt="Course Thumbnail" class="img-fluid mb-2 rounded-2"
                                                style="max-height: 100px; max-width: 105px;" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="thumbnailLink" class="col-sm-3 col-form-label fs-16">Thumbnail Link</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ responsiveThumbnailLink }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="description" class="col-sm-3 col-form-label fs-16">Description</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ truncateText(courseData.description,
                                            50) }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="duration" class="col-sm-3 col-form-label fs-16">Duration</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ courseData.duration }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="category" class="col-sm-3 col-form-label fs-16">Category</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ courseData.category ? courseData.category.name : 'No category assigned' }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="teacher" class="col-sm-3 col-form-label fs-16">Teacher</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ courseData.teacher && courseData.teacher.user ? courseData.teacher.user.name : 'No teacher assigned' }}</span>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="skill" class="col-sm-3 col-form-label fs-16 mt-1">Level Course</label>
                                        <div class="col-sm-9 ms--35">
                                            <div class="d-flex gap-2">
                                                <button class="btn-tag fs-16 border-0 rounded-3 h-40">{{ courseData.course_levels ? courseData.course_levels.name : 'No level assigned' }}</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="tools" class="col-sm-3 col-form-label fs-16 mt-1">Tools</label>
                                        <div class="col-sm-9 ms--35">
                                            <div class="d-flex gap-2">
                                                <button
                                                    v-for="tool in courseData.tools"
                                                    :key="tool.id_tool"
                                                    class="btn-tag fs-16 border-0 rounded-3 h-40"
                                                >
                                                    {{ tool.name }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="rules" class="col-sm-3 col-form-label fs-16">Rules & Conditions</label>
                                        <div class="col-sm-9 ms--35 mt-6">
                                            <span>{{ courseData.rules }}</span>
                                        </div>
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