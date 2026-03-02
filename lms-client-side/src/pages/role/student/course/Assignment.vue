<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import FileUpload from '@/components/FileUpload.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const courseAssignment = ref(null);
const activeTab = ref('about');
const isSidebarVisible = ref(true);
const idAssignment = ref(route.params.id_course_assignment);
const idCourseEnrollment = ref(route.params.id_course_enrollment);

const uploading = ref(false);
const selectedFiles = ref([]);
const submissionDate = ref(null);
const submissionStatus = ref('Not submitted');

const fetchAssignmentMaterial = async () => {
    try {
        const response = await axios.get(`/course-assignments/${idAssignment.value}`);
        courseAssignment.value = response.data;
        console.log('Course Assignment:', courseAssignment.value);
    } catch (error) {
        console.error('Failed to fetch course assignment:', error);
    }
};

const downloadResources = async (event) => {
    try {
        event.preventDefault();
        const response = await axios.get(`/course-assignments/download/${idAssignment.value}`, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${courseAssignment.value.title || 'assignment'}_resources.zip`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Failed to download assignment:', error);
    }
};

const courseAssignmentSubmisson = ref(null);
const assignmentResourceUrl = process.env.VUE_APP_ASGNMNT_SUB_URL;

const fetchAssignmentSubmission = async () => {
    try {
        const submissionsResponse = await axios.get(`/assignment-submissions/assignments/${idAssignment.value}`);
        const submissions = submissionsResponse.data;
        
        if (submissions.length > 0) {
            const latestSubmission = submissions[submissions.length - 1];
            submissionStatus.value = 'Submitted';
            submissionDate.value = new Date(latestSubmission.created_at).toLocaleString();

            const response = await axios.get(`/assignment-submissions/${latestSubmission.id_assignment_submission}`);
            const submission = response.data;

            const processedResources = submission.resources ? await Promise.all(
                submission.resources.map(async (resource) => {
                    try {
                        const fileResponse = await axios.get(
                            resource.raw || `${assignmentResourceUrl}/${resource.id}`, 
                            { responseType: 'blob' }
                        );

                        const fileType = resource.name.split('.').pop().toLowerCase();
                        const fileData = new File([fileResponse.data], resource.name, {
                            type: fileResponse.data.type,
                        });

                        return {
                            id: resource.id,
                            name: fileData.name,
                            type: fileType,
                            size: (fileData.size / 1024).toFixed(2),
                            url: URL.createObjectURL(fileData),
                            raw: fileData,
                        };
                    } catch (error) {
                        console.error(`Error processing resource: ${resource.name}`, error);
                        return null;
                    }
                })
            ) : [];

            selectedFiles.value = processedResources.filter(Boolean);
        } else {
            submissionStatus.value = 'Not submitted';
            submissionDate.value = null;
        }
    } catch (error) {
        console.error('Failed to fetch assignment submission:', error);
        submissionStatus.value = 'Not submitted';
        submissionDate.value = null;
    }
};

const uploadFiles = async () => {
    try {
        uploading.value = true;

        const formData = new FormData();
        formData.append('id_course_assignment', idAssignment.value);
        formData.append('id_course_enrollment', idCourseEnrollment.value);
        
        selectedFiles.value.forEach((file) => {
            formData.append('files[]', file.raw);
        });

        const response = await axios.post('/assignment-submissions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload successful:', response.data);
        alert('Upload successful!');
        await fetchAssignmentSubmission();
    } catch (error) {
        console.error('Failed to upload files:', error);
        alert('Failed to upload files.');
    } finally {
        uploading.value = false;
    }
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 768;
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

onMounted(() => {
    fetchAssignmentSubmission();
    fetchAssignmentMaterial();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div class="bg-room">
        <NavbarCourses />
        <SidebarCourse v-if="isSidebarVisible" />
        <div id="room" class="essay">
            <div class="container mt-md-2 pe-md-4">
                <div class="row">
                    <div class="col-md-12 mt-md-0 ey">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Installasi</h5>
                            <h4 class="fs-24">Assignment</h4>
                            <div class="card p-4 bordersa mt-2">
                                <div class="d-flex justify-content-start mt-11 gap-4">
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'about' }"
                                        @click="setActiveTab('about')">About</label>
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'resources' }"
                                        @click="setActiveTab('resources')">Resources</label>
                                </div>
                                <hr />
                                <div v-show="activeTab === 'about'">
                                    <div v-if="courseAssignment">
                                        <h4 class="card-title fs-16 fw-semibold mb-1">{{ courseAssignment.title }}</h4>
                                        <p class="card-text fs-16 fw-normal text-justify mb-md-4 mb-3">{{ courseAssignment.description }}</p>
                                        <div class="ul">
                                            <h4 class="card-title fs-16 fw-semibold mb-1">Submission Status</h4>
                                            <ul class="card-text fs-16 fw-light">
                                                <li>
                                                    <span class="platform card-text fs-16 fw-light">Grading Status</span>
                                                    <span class="separator"> : </span>
                                                    <a class="garis- text-dark">0/100</a>
                                                </li>
                                                <li>
                                                    <span class="platform card-text fs-16 fw-light">Submission Status</span>
                                                    <span class="separator"> : </span>
                                                    <a class="garis- text-dark">{{ submissionStatus }}</a>
                                                </li>
                                                <li>
                                                    <span class="platform card-text fs-16 fw-light">Submitted at</span>
                                                    <span class="separator"> : </span>
                                                    <span v-if="submissionDate">{{ submissionDate }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="mt-4">
                                            <FileUpload v-model="selectedFiles" />
                                            <div class="text-center">
                                                <ButtonSuccess @click="uploadFiles" :disabled="uploading" class="mt-2 my-0 h-38 w-20 fs-16">
                                                    <template v-if="!uploading">Upload</template>
                                                    <template v-else>Uploading...</template>
                                                </ButtonSuccess>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="activeTab === 'resources'">
                                    <div v-if="courseAssignment">
                                        <h4 class="card-title fs-16 fw-semibold">{{ courseAssignment.title }}</h4>
                                        <p class="card-text fs-16 fw-normal text-justify mb-3">{{ courseAssignment.description }}</p>
                                        <h4 class="card-title fs-16 fw-semibold">Download the required assets </h4>
                                        <div class="text-center mb-4">
                                            <ButtonTransparanComponen @click.prevent="downloadResources"
                                                class="mt-md-4 mt-4 my-0 h-45 w-20 rounded-3 c-border bg-white fs-16">
                                                <i class="bi bi-download me-2"></i>Download
                                            </ButtonTransparanComponen>
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