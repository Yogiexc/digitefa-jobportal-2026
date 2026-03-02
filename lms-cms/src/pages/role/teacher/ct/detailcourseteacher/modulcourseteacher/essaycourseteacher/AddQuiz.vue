<script setup>
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import { ref, computed, onUnmounted, onMounted } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import FileUpload from '@/components/FileUpload.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const isSidebarVisible = ref(true);
const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const courseSection = ref();
const courseId = route.params.id;
const courseSectionId = route.params.id_course_section;
const selectedAreas = ref([]);
const skillsOptions = ref([]);
const uploadedFiles = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const form = ref({
    title: '',
    description: '',
    duration: '',
    max_attempt: '',
});

const fetchCourseSection = async () => {
    try {
        const response = await axios.get(`/course-sections/${courseSectionId}`);
        courseSection.value = response.data.title;
    } catch (error) {
        console.error('Failed to fetch course section:', error);
    }
};

const fetchSkillsData = async () => {
    try {
        const response = await axios.get('/skills');
        const skills = response.data;

        skillsOptions.value = skills.map((skill) => ({
            label: skill.name,
            value: skill.id_skill,
        }));
    } catch (error) {
        console.error('Error fetching skill data:', error);
    }
};

const submitQuiz = async () => {
    try {
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('description', form.value.description);
        formData.append('duration', form.value.duration);
        formData.append('max_attempt', form.value.max_attempt);
        formData.append('id_course_section', courseSectionId);

        selectedAreas.value.forEach((skill) => {
            formData.append('skills[]', skill.value);
        });

        uploadedFiles.value.forEach((file, index) => {
            formData.append(`files[${index}]`, file.raw || file);
        });

        const
            response = await axios.post('/quizzes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        showToast('Add Quiz successfully!', 'success');
        setTimeout(() => {
            router.push(`/course-teacher/modul/${courseId}`);
        }, 800);
    } catch (error) {
        showToast('Error Add Quiz.', 'error');
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

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchCourseSection();
    fetchSkillsData();
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
                        <div class="cbg-card p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Add Quiz</h5>
                            <h4 class="fs-24">Add Quiz</h4>
                            <div class="cbg-card2 p-3 bordersa mt-2 min-height-68">
                                <div class="mb-3 row">
                                    <label for="Name" class="col-sm-3 col-form-label fs-16 mt-1">Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Name Course" v-model="form.title" required />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="description" class="col-sm-3 col-form-label fs-16">Description</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control fs-16 c-border rounded-2" rows="4"
                                            placeholder="Write your review" v-model="form.description"
                                            required></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="workingtime" class="col-sm-3 col-form-label fs-16">Durasi Quiz</label>
                                    <div class="col-sm-9">
                                        <div class="input-group w-50">

                                            <input type="text" class="form-control fs-16 h-43 rounded- bordersa"
                                                placeholder="Enter Durasi Quiz" v-model="form.duration" required />
                                            <span class="input-group-text fs-16">Minute</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="workingtime" class="col-sm-3 col-form-label fs-16">Maximum
                                        Retake</label>
                                    <div class="col-sm-9">
                                        <div class="input-group w-50">

                                            <input type="text" class="form-control fs-16 h-43 rounded- bordersa"
                                                placeholder="Enter Retake Maximum Quiz" v-model="form.max_attempt"
                                                required />
                                            <span class="input-group-text fs-16">x Take</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="level" class="col-sm-3 col-form-label fs-16">Detail Skill</label>
                                    <div class="col-sm-9">
                                        <MultipleSelect :options="skillsOptions" v-model="selectedAreas"
                                            placeholder="Select skills" />
                                    </div>
                                </div>
                                <div class="mb-0 row">
                                    <label for="resource" class="col-sm-3 col-form-label fs-16">Resource</label>
                                    <div class="col-sm-9">
                                        <FileUpload v-model="uploadedFiles" />
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru class="ms-3 mb-4 h-40 px-4 rounded-3 fs-16" @click="submitQuiz">
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
</template>