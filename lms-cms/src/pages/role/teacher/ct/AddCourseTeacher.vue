<script setup>
import axios from 'axios';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import 'daterangepicker/daterangepicker.css';
import 'daterangepicker';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { getFromDB } from '@/utils/indexedDB';

// State management
const isLoading = ref(false);
const router = useRouter();
const isSidebarVisible = ref(true);
const imagePreview = ref(null);
const teacherName = ref('');
const teacherId = ref('');
const levelcourseData = ref([]);
const categoryData = ref([]);
const categoryOptions = computed(() => categoryData.value);
const levelcourseOptions = computed(() => levelcourseData.value);
const selectedAreas = ref([]);
const toolsOptions = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

// Form data model
const form = ref({
    image: null,
    nameCourse: '',
    maxStudent: '',
    description: '',
    duration: '',
    dateRange: '',
    category: '',
    levelcourse: '',
    thumbnail_link: '',
    rules: ''
});

// Fetch data from API
const fetchCategoryData = async () => {
    try {
        const response = await axios.get('/categories');
        categoryData.value = response.data;
    } catch (error) {
        console.error('Error fetching Category data:', error);
    }
};

const fetchLevelCourseData = async () => {
    try {
        const response = await axios.get('/course-levels');
        levelcourseData.value = response.data;
    } catch (error) {
        console.error('Error fetching Level Course data:', error);
    }
};

const fetchToolsData = async () => {
    try {
        const response = await axios.get('/tools');
        const tools = response.data;

        toolsOptions.value = tools.map((tool) => ({
            label: tool.name,
            value: tool.id_tool,
        }));
    } catch (error) {
        console.error('Error fetching tools data:', error);
    }
};

// Handle file upload for image
const handleFileUploadEdit = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    } else {
        form.value.image = null;
        imagePreview.value = null;
    }
};

// Submit the course form
const submitCourse = async () => {
    isLoading.value = true;
    try {
        const formData = new FormData();
        formData.append('id_category', form.value.category);
        formData.append('id_teacher', teacherId.value);
        formData.append('id_course_level', form.value.levelcourse);
        formData.append('title', form.value.nameCourse);
        formData.append('thumbnail', form.value.image);
        formData.append('thumbnail_link', form.value.thumbnail_link);
        formData.append('description', form.value.description);
        formData.append('duration', form.value.duration);
        formData.append('rules', form.value.rules);

        selectedAreas.value.forEach((tool) => {
            formData.append('tools[]', tool.value);
        });

        const response = await axios.post('/courses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const newCourseId = response.data.course.id_course;
        showToast('Add Course successfully!', 'success');

        setTimeout(() => {
            router.push(`/course-teacher/detail/${newCourseId}`);
        }, 800);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            showToast('You do not have access to create a course at this level.', 'error');
        } else {
            showToast('Error Add Course.', 'error');
        }
    } finally {
        isLoading.value = false;
    }
};

const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    isToastVisible.value = true;
    toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

// Check window size for responsive sidebar
const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(async () => {
    fetchCategoryData();
    fetchLevelCourseData();
    fetchToolsData();

    const user = await getFromDB('users', 'id_user');
    if (user && user.teacher) {
        teacherId.value = user.teacher.id_teacher;  // Set the teacher ID
        teacherName.value = user.name;  // Set the teacher name if needed
    }
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />
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
                        <div class="col-md-12 add">
                            <div class="card rounded-2 p-4 border-0 mt-4 mt-md-0">
                                <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Add Course</h5>
                                <h4 class="fs-24">Course Manajemen</h4>
                                <div class="card p-3 bordersa mt-4">
                                    <h5 class="fs-20">Add Course</h5>
                                    <hr />
                                    <div class="mb-3 row">
                                        <label for="nameCourse" class="col-sm-3 col-form-label fs-16">Name
                                            Course</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                v-model="form.nameCourse" placeholder="Enter Course Name" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row align-items-center">
                                        <label for="categoryName"
                                            class="col-sm-3 col-form-label fs-16 mt--50">Thumbnail</label>
                                        <div class="col-sm-9 d-flex flex-column align-items-start">
                                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                                class="img-fluid mb-2 rounded-2"
                                                style="max-height: 100px; max-width: 105px;">
                                            <input type="file" id="fileInput" class="d-none" accept="image/*"
                                                @change="handleFileUploadEdit" />
                                            <button type="button" class="btn c-border px-4 py-2 opacity-75"
                                                onclick="document.getElementById('fileInput').click();">
                                                Upload
                                            </button>
                                            <div class="mt-2 fs-12 opacity-75">
                                                <label>Max file size : 2Mb</label> <br>
                                                <label>Format : .jpg, .png , .jpeg</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="thumbnail_link" class="col-sm-3 col-form-label fs-16">Youtube Link /
                                            Thumbnail</label>
                                        <div class="col-sm-9">
                                            <input type="url" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                v-model="form.thumbnail_link" placeholder="Enter Thumbnail Link" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="description"
                                            class="col-sm-3 col-form-label fs-16 mt-md-3">Description</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control fs-16 c-border rounded-2" rows="3"
                                                v-model="form.description" placeholder="Enter Description Course"
                                                required></textarea>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="duration" class="col-sm-3 col-form-label fs-16">Duration</label>
                                        <div class="col-sm-9">
                                            <input type="number" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                v-model="form.duration" placeholder="Enter Duration Course" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="levelcourse" class="col-sm-3 col-form-label fs-16">Level
                                            Course</label>
                                        <div class="col-sm-9">
                                            <select class="form-select w-50 fs-16 h-43 opacity-75 rounded-3 bordersa"
                                                :value="form.levelcourse"
                                                @change="form.levelcourse = $event.target.value">
                                                <option value="" disabled selected>Select Level</option>
                                                <option v-for="levelcourse in levelcourseOptions"
                                                    :key="levelcourse.id_course_level"
                                                    :value="levelcourse.id_course_level">
                                                    {{ levelcourse.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="levelcourse" class="col-sm-3 col-form-label fs-16">Tools</label>
                                        <div class="col-sm-9">
                                            <MultipleSelect :options="toolsOptions" v-model="selectedAreas"
                                                placeholder="Select tools" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="category" class="col-sm-3 col-form-label fs-16">Category</label>
                                        <div class="col-sm-9">
                                            <select class="form-select w-50 fs-16 h-43 opacity-75 rounded-3 bordersa"
                                                :value="form.category" @change="form.category = $event.target.value">
                                                <option value="" disabled selected>Select Category</option>
                                                <option v-for="category in categoryOptions" :key="category.id_category"
                                                    :value="category.id_category">
                                                    {{ category.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="rulesAndConditions" class="col-sm-3 col-form-label fs-16 mt-3">Rules
                                            &
                                            Conditions</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control fs-16 c-border rounded-2" rows="3"
                                                v-model="form.rules"
                                                placeholder="Write rules and conditions for the course"
                                                required></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <ButtonBiru class="h-40 px-4 rounded-3 fs-16" @click="submitCourse">
                                            Submit
                                        </ButtonBiru>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
                <div v-if="isToastVisible"
                    :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']" role="alert">
                    <div class="d-flex">
                        <div class="toast-body">
                            {{ toastMessage }}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                            aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
