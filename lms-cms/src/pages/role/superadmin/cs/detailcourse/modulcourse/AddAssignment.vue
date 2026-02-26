<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import FileUpload from '@/components/FileUpload.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import { ref, onUnmounted, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const isSidebarVisible = ref(true);
const courseSection = ref('');
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
    deadline: '',
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

const submitAddAssignment = async () => {
    try {
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('description', form.value.description);
        formData.append('id_course_section', courseSectionId);

        selectedAreas.value.forEach((skill) => {
            formData.append('skills[]', skill.value);
        });

        uploadedFiles.value.forEach((file, index) => {
            formData.append(`files[${index}]`, file.raw || file);
        });

        const response = await axios.post('/course-assignments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        showToast('Add Assignment successfully!', 'success');
        setTimeout(() => {
            router.push(`/course-manajemen/modul/${courseId}`);
        }, 800);
    } catch (error) {
        showToast('Error Add Assignment.', 'error');
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
    checkWindowSize();
    fetchSkillsData();
    fetchCourseSection();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})

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
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Add Assignment</h5>
                            <h4 class="fs-24">Course Manajemen</h4>
                            <div class="card p-3 bordersa mt-2">
                                <h5 class="fs-20">Add Assignment</h5>
                                <hr />
                                <div class="mb-3 row">
                                    <label for="Name" class="col-sm-3 col-form-label fs-16">Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Name assignment" v-model="form.title" required />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="description" class="col-sm-3 col-form-label fs-16">Description</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control fs-16 c-border rounded-2" rows="4"
                                            placeholder="Description" v-model="form.description" required></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="detailskill" class="col-sm-3 col-form-label fs-16">Detail Skill</label>
                                    <div class="col-sm-9">
                                        <MultipleSelect :options="skillsOptions" v-model="selectedAreas"
                                            placeholder="Select skills" />
                                    </div>
                                </div>
                                <div class="mb-0 row mt--18">
                                    <label for="resource" class="col-sm-3 col-form-label fs-16">Resource</label>
                                    <div class="col-sm-9">
                                        <FileUpload v-model="uploadedFiles" />
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru class="ms-3 mb-4 h-40 px-4 rounded-3 fs-16"
                                        @click="submitAddAssignment">
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