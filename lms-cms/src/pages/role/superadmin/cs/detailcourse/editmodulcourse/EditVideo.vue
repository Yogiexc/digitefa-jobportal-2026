<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import FileUpload from '@/components/FileUpload.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import { ref, onUnmounted, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { saveToDB, getFromDB } from '@/utils/indexedDB';

const route = useRoute();
const router = useRouter();
const isSidebarVisible = ref(true);
const courseId = route.params.id;
const courseSectionId = route.params.id_course_section;
const selectedSkill = ref([]);
const skillsOptions = ref([]);
const uploadedFiles = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const materialData = ref({
    title: '',
    description: '',
    video_link: '',
    skills: [],
    resources: [],
    course_section: '',
});

const embedCode = ref('');

// Save data to IndexedDB
const saveToIndexedDB = async (data) => {
    const materialsId = route.params.id_course_material;
    await saveToDB('materialsData', { id_course_material: materialsId, data });
    console.log(`Quiz data saved to IndexedDB for ID: ${materialsId}`);
};

// Load data from IndexedDB
const loadFromIndexedDB = async (id) => {
    const materialsId = route.params.id_course_material;
    const storedMateri = await getFromDB('materialsData', materialsId);

    if (storedMateri && storedMateri.data) { 

        materialData.value = {
            title: storedMateri.data.title || '',
            description: storedMateri.data.description || '',
            video_link: storedMateri.data.video_link || '',
            skills: storedMateri.data.skills || [],
            resources: storedMateri.data.resources || [],
            course_section: storedMateri.data.course_section || '',
        }

        uploadedFiles.value = storedMateri.data.resources || [];

        selectedSkill.value = storedMateri.data.skills?.map(skl => ({
            label: skl.name,
            value: skl.id_skill,
        })) || [];

        console.log('material data loaded from IndexedDB:', storedMateri.data);
    } else {
        await fetchCourseMaterial();
    } 
};

// Fetch course material
const fetchCourseMaterial = async () => {
    const id = route.params.id_course_material;
    const materialResourceUrl = process.env.VUE_APP_CONTENT_MATERIAL_URL;
    try {
        const response = await axios.get(`/course-materials/${id}`);
        const data = response.data;
        
        const processedResources = await Promise.all(
            (data.resources || []).map(async (resource) => {
                try {
                const fileResponse = await axios.get(resource.raw || `${materialResourceUrl}/${resource.id}`, {
                    responseType: 'blob',
                });

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
        );
        
        const processedData = {
            title: data.title,
            description: data.description,
            video_link: data.video_link,
            skills: data.skills,
            resources: processedResources,
            course_section: data.course_section?.title,
        };

        // Save fetched data to IndexedDB
        await saveToIndexedDB(processedData);
        loadFromIndexedDB();
    } catch (error) {
        console.error('Error fetching materials data:', error);
    }
};

// Fetch skills data
const fetchSkillsData = async () => {
    try {
        const response = await axios.get('/skills');
        const skillsData = response.data;

        skillsOptions.value = skillsData.map((skl) => ({
            label: skl.name,
            value: skl.id_skill,
        }));
    } catch (error) {
        console.error('Error fetching skill data:', error);
    }
};

// Update embed code
const updateEmbedCode = () => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const shortYoutubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/;
    const match = materialData.value.video_link.match(youtubeRegex) || materialData.value.video_link.match(shortYoutubeRegex);

    if (match) {
        const videoId = match[1];
        embedCode.value = `https://www.youtube.com/embed/${videoId}`;
    } else {
        embedCode.value = '';
    }
};

// Submit course material
const submitVideo = async () => {
    try {
        const formData = new FormData();
        formData.append('title', materialData.value.title);
        formData.append('description', materialData.value.description);
        formData.append('video_link', materialData.value.video_link);
        formData.append('id_course_section', courseSectionId);
        formData.append('id_course', courseId);

        uploadedFiles.value.forEach((file, index) => {
            formData.append(`files[${index}]`, file.raw || file);
        });

        selectedSkill.value
            .filter(skill => skill.selected !== false)
            .forEach(skill => {
                formData.append('skills[]', skill.value);
        });

        await axios.post(`/course-materials/${route.params.id_course_material}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        showToast('Updated material successfully!', 'success');
        setTimeout(() => {
            router.push(`/course-manajemen/modul/${courseId}`);
        }, 800);
    } catch (error) {
        showToast('Error updating material.', 'error');
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

onMounted( async () => {
    fetchCourseMaterial();
    fetchSkillsData();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

watch(() => materialData.value.video_link, updateEmbedCode);
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
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Edit Materi</h5>
                            <h4 class="fs-24">Course Manajemen</h4>
                            <div class="card p-3 bordersa mt-2">
                                <h5 class="fs-20">Edit Materi</h5>
                                <hr />
                                <div class="mb-3 row">
                                    <label for="Name" class="col-sm-3 col-form-label fs-16">Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Name Course" v-model="materialData.title" required />
                                    </div>
                                </div>
                                <div class="mb-0 row">
                                    <label for="linkvideo" class="col-sm-3 col-form-label fs-16">Vidio</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Thumbnail" v-model="materialData.video_link" required />
                                        <p v-if="!embedCode" class="fs-12">(insert videos in the link)</p>
                                        <div v-else class="video-wrapper-container">
                                            <iframe class="video-wrapper" :src="embedCode" frameborder="0"
                                                allowfullscreen>
                                            </iframe>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="description" class="col-sm-3 col-form-label fs-16">Description</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control fs-16 c-border rounded-2" rows="4"
                                            placeholder="Description" v-model="materialData.description" required></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="detailskill" class="col-sm-3 col-form-label fs-16">Detail Skill</label>
                                    <div class="col-sm-9">
                                        <MultipleSelect
                                            :options="skillsOptions" 
                                            v-model="selectedSkill"
                                            placeholder="Select skills" />
                                    </div>
                                </div>
                                <div class="mb-0 row mt--18">
                                    <label for="resource" class="col-sm-3 col-form-label fs-16">Resource</label>
                                    <div class="col-sm-9">
                                        <FileUpload 
                                            resourceType ="materials"
                                            v-model="uploadedFiles"/>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru class="ms-3 mb-4 h-40 px-4 rounded-3 fs-16" @click="submitVideo">
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

<style scoped>
.video-wrapper-container {
    position: relative;
    width: 100%;
    max-width: 560px;
    border-radius: 20px;
    overflow: hidden;
    height: 315px;
    margin-top: 10px;
    margin-bottom: 20px;
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