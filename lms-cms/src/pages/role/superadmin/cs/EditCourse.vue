<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const isSidebarVisible = ref(true);
const categoryData = ref([]);
const levelcourseData = ref([]);
const imagePreview = ref(null);
const selectedAreas = ref([]);
const toolsOptions = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const form = ref({
    title: '',
    description: '',
    duration: null,
    thumbnail_link: '',
    rules: '',
    category: '',
    teacher: '',
    courseLevel: '',
    image: null,
});

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

const fetchCourseData = async () => {
    try {
        const courseId = route.params.id;
        const response = await axios.get(`/courses/${courseId}`);

        const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;

        form.value.title = response.data.title;
        form.value.description = response.data.description;
        form.value.duration = response.data.duration;
        form.value.thumbnail_link = response.data.thumbnail_link;
        form.value.rules = response.data.rules;
        form.value.teacher = response.data.teacher.id_teacher;
        form.value.teacherName = response.data.teacher.user.name;
        form.value.category = response.data.category.id_category;
        form.value.courseLevel = response.data.id_course_level;

        if (response.data.thumbnail) {
            imagePreview.value = `${courseThumbnailUrl}/${response.data.thumbnail}`;
        }
        selectedAreas.value = response.data.tools.map((tool) => ({
            label: tool.name,
            value: tool.id_tool,
        }));
    } catch (error) {
        console.error('Failed to fetch course data:', error);
    }
};

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

const updateCourse = async () => {
    isLoading.value = true;
    const courseId = route.params.id;

    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('duration', form.value.duration);
    formData.append('thumbnail_link', form.value.thumbnail_link);
    formData.append('rules', form.value.rules);
    formData.append('id_category', form.value.category);
    formData.append('id_teacher', form.value.teacher);
    formData.append('id_course_level', form.value.courseLevel);

    if (form.value.image) {
        formData.append('thumbnail', form.value.image);
    }

    selectedAreas.value.forEach((tool) => {
        formData.append('tools[]', tool.value);
    });

    try {
        await axios.post(`/courses/${courseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        showToast('Updated Course successfully!', 'success');
        setTimeout(() => {
            router.push(`/course-manajemen/detail/${courseId}`);
        }, 800);
    }  catch (error) {
        showToast('Error Updated Course.', 'error');
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

onMounted(() => {
    fetchCourseData();
    fetchCategoryData();
    fetchToolsData();
    fetchLevelCourseData();
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
});
</script>

<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />

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
                        <div class="col-md-12">
                            <div class="card rounded-2 p-4 border-0 mt-4 mt-md-0">
                                <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Edit Course</h5>
                                <h4 class="fs-24">Course Manajemen</h4>
                                <div class="card p-3 bordersa">
                                    <h5 class="fs-20">Edit Course</h5>
                                    <hr />
                                    <div class="mb-3 row">
                                        <label for="nameCourse" class="col-sm-3 col-form-label fs-16">Name
                                            Course</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                placeholder="Enter Course Name" v-model="form.title" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row align-items-center">
                                        <label for="categoryName"
                                            class="col-sm-3 col-form-label fs-16">Thumbnail</label>
                                        <div class="col-sm-9 d-flex flex-column align-items-start">
                                            <!-- Tampilkan preview gambar lama atau baru -->
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
                                                <label>Max file size: 2Mb</label> <br>
                                                <label>Format: .jpg, .png, .jpeg</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="thumbnailLink" class="col-sm-3 col-form-label fs-16">Thumbnail
                                            Link</label>
                                        <div class="col-sm-9">
                                            <input type="url" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                placeholder="Enter Thumbnail Link" v-model="form.thumbnail_link" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="description"
                                            class="col-sm-3 col-form-label fs-16">Description</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control fs-16 c-border rounded-2" rows="3"
                                                placeholder="Enter Description Course" v-model="form.description"
                                                required></textarea>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="duration" class="col-sm-3 col-form-label fs-16">Duration</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                v-model="form.duration" placeholder="Enter Duration Course" />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="levelcourse" class="col-sm-3 col-form-label fs-16">Level
                                            Course</label>
                                        <div class="col-sm-9">
                                            <select class="form-select w-50 fs-16 h-43 opacity-75 rounded-3 bordersa"
                                                v-model="form.courseLevel">
                                                <option value="" disabled selected>Select Level</option>
                                                <option v-for="levelcourse in levelcourseData"
                                                    :key="levelcourse.id_course_level"
                                                    :value="levelcourse.id_course_level">
                                                    {{ levelcourse.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="nameTeacher" class="col-sm-3 col-form-label fs-16">Teacher</label>
                                        <div class="col-sm-9">
                                            <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                                placeholder="Name Teacher" v-model="form.teacherName" disabled />
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
                                                v-model="form.category">
                                                <option value="" disabled>Select Category</option>
                                                <option v-for="category in categoryData" :key="category.id_category"
                                                    :value="category.id_category">
                                                    {{ category.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="rulesAndConditions" class="col-sm-3 col-form-label fs-16">Rules &
                                            Conditions</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control fs-16 c-border rounded-2" rows="3"
                                                placeholder="Write rules and conditions for the course"
                                                v-model="form.rules" required></textarea>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <ButtonBiru class="h-40 px-5 rounded-3 fs-16" @click="updateCourse">
                                            Save
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