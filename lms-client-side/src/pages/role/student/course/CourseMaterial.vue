<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonOren from '@/components/ButtonOren.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const idCourse = ref(route.params.id_course);
const idCourseMaterial = ref(route.params.id_course_material);
const courseMaterial = ref(null);
const embedCode = ref('');
const isSidebarVisible = ref(true);

// Function to generate embed code from YouTube link
const generateEmbedCode = (videoLink) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const shortYoutubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/;
    const match = videoLink.match(youtubeRegex) || videoLink.match(shortYoutubeRegex);

    if (match) {
        const videoId = match[1];
        embedCode.value = `https://www.youtube.com/embed/${videoId}`;
    } else {
        embedCode.value = '';
    }
};

// Fetch course material and generate embed code
const fetchCourseMaterial = async () => {
    try {
        const response = await axios.get(`/course-student-materials/${idCourseMaterial.value}`);
        courseMaterial.value = response.data;
        console.log('Course Material:', courseMaterial.value);

        // Generate embed code if video_link is available
        if (courseMaterial.value.video_link) {
            generateEmbedCode(courseMaterial.value.video_link);
        }
    } catch (error) {
        console.error('Failed to fetch course material:', error);
    }
};

const downloadResources = async (event) => {
    try {
        // Prevent default behavior of the anchor tag
        event.preventDefault();

        const response = await axios.get(`/course-materials/download/${idCourseMaterial.value}`, {
            responseType: 'blob', // Important for file downloads
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${courseMaterial.value.title || 'material'}_resources.zip`; // Dynamic filename
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        console.log('File downloaded successfully');
    } catch (error) {
        console.error('Failed to download material:', error);
    }
};


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
            }
        });
    });
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 768;
};

onMounted(() => {
    fetchCourseMaterial();
    checkWindowSize();
    handleNavigation();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div class="bg-room room"> <!-- tools-->

        <!-- NAVBAR START -->
        <NavbarCourses />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarCourse v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="room" class="student">
            <div class="container mt-md-2 pe-md-4">
                <div class="row">
                    <h5 class="fs-16 fw-medium">{{ courseMaterial?.course_section.title }}</h5>
                    <h1 class="fs-40 fw-semibold">{{ courseMaterial?.title }}</h1>
                    <div v-if="embedCode" class="video-wrapper-container">
                        <iframe 
                            class="video-wrapper" 
                            :src="embedCode" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="d-flex justify-content-between mb-md-1 mt-md-3 mt-2">
                        <ButtonOren class="fs-16 w-20 fw-medium">
                            Kembali
                        </ButtonOren>
                        <ButtonOren class="fs-16 w-20 fw-medium" @click="submit">
                            Selesai & Lanjut
                        </ButtonOren>
                    </div>
                    <div class="container my-3">
                        <div class="d-flex justify-content-start h4 mb-4 border-bottom border-dark ms-md-1 ms-3 me-3">
                            <h5 class="me-3 fw-medium pointer fs-16 active" data-target="about">About</h5>
                            <h5 class="me-3 fw-medium pointer fs-16" data-target="resources">Resources</h5>
                        </div>
                        <div id="about" class="section active p ms-3 me-3">
                            <p class="fs-16 fw-normal text-justify">{{ courseMaterial?.description }}</p>
                            <p class="fs-16 fw-bold">Tags Skill</p>
                            <div class="d-flex justify-content-start mb-5">
                                <a v-for="skill in courseMaterial?.skills" :key="skill.id_skill"
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <div class="fs-16 fw-medium">{{ skill.name }}
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div id="resources" class="section ms-3 me-3">
                            <div class="d-flex justify-content-start mb-3">
                                <a @click.prevent="downloadResources" 
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                        <i class="bi bi-download me-2"></i>
                                        <div class="fs-16 fw-medium">Download</div>
                                    </a>
                            </div>
                            <p class="fs-16 fw-bold">Tags Skill</p>
                            <div class="d-flex justify-content-start mb-5">
                                <a v-for="skill in courseMaterial?.skills" :key="skill.id_skill"
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <div class="fs-16 fw-medium">{{ skill.name }}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.video-wrapper-container {
    position: relative;
    width: 100%;
    
    border-radius: 20px;
    overflow: hidden;
    height: 600px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.video-wrapper {
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 20px;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .video-wrapper-container {
        border-radius: 15px;
        /* Adjust border-radius */
    }
}
</style>
