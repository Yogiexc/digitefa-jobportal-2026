<script setup>
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import MultipleSelect from '@/components/MultiselectComponent.vue';
import FileUpload from '@/components/FileUpload.vue';
import NavEssay from '@/layout/NavEssay.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { saveToDB, getFromDB } from '@/utils/indexedDB';

const isSidebarVisible = ref(true);
const route = useRoute();
const router = useRouter();
const skillsOptions = ref([]);
const selectedSkill = ref([]);
const uploadedFiles = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

// Initialize quizData
const quizData = ref({
    title: '',
    description: '',
    duration: '',
    max_attempt: '',
    skills: [],
    resources: [],
    course_section: '',
});

// Fungsi untuk menyimpan data ke IndexedDB
const saveToIndexedDB = async (data) => {
    const quizId = route.params.id_quiz;
    await saveToDB('quizzesData', { id: quizId, data });
    console.log(`Quiz data saved to IndexedDB for ID: ${quizId}`);
};

// Load from IndexedDB
// Load from IndexedDB
const loadFromIndexedDB = async () => {
    const quizId = route.params.id_quiz;
    const storedQuiz = await getFromDB('quizzesData', quizId);

    if (storedQuiz && storedQuiz.data) {
        // Load quiz data
        quizData.value = {
            title: storedQuiz.data.title || '',
            description: storedQuiz.data.description || '',
            duration: storedQuiz.data.duration || '',
            max_attempt: storedQuiz.data.max_attempt || '',
            skills: storedQuiz.data.skills || [],
            resources: storedQuiz.data.resources || [],
            course_section: storedQuiz.data.course_section || '',
        };

        // Load resources
        uploadedFiles.value = storedQuiz.data.resources || [];

        // Load skills
        selectedSkill.value = storedQuiz.data.skills?.map(skl => ({
            label: skl.name,
            value: skl.id_skill,
        })) || [];

        console.log('Quiz data loaded from IndexedDB:', storedQuiz.data);
    } else {
        await fetchCourseQuiz();
    }
};
// Fetch Skills Data
const fetchSkillsData = async () => {
    try {
        const response = await axios.get('/skills');
        skillsOptions.value = response.data.map(skill => ({
            label: skill.name,
            value: skill.id_skill,
        }));
    } catch (error) {
        console.error('Error fetching skills data:', error);
    }
};

// Modify the fetchCourseQuiz function
const fetchCourseQuiz = async () => {
  const quizId = route.params.id_quiz;
  const quizResourceUrl = process.env.VUE_APP_CONTENT_QUIZ_URL;
  try {
    const response = await axios.get(`/quizzes/${quizId}`);
    const data = response.data;

    // Process main quiz resources and calculate size
    const processedResources = await Promise.all(
      (data.resources || []).map(async (resource) => {
        try {
          const fileResponse = await axios.get(resource.raw || `${quizResourceUrl}/${resource.id}`, {
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
      duration: data.duration,
      max_attempt: data.max_attempt,
      skills: data.skills,
      resources: processedResources,
      course_section: data.course_section?.title,
      questions: data.questions,
    };

    // Save to IndexedDB
    await saveToIndexedDB(processedData);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  }
};


// Submit Quiz
const submitQuiz = async () => {
    try {
        const formData = new FormData();
        formData.append('title', quizData.value.title);
        formData.append('description', quizData.value.description);
        formData.append('duration', quizData.value.duration);
        formData.append('max_attempt', quizData.value.max_attempt);
        formData.append('id_course_section', route.params.id_course_section);

        selectedSkill.value
            .filter(skill => skill.selected !== false)
            .forEach(skill => {
                formData.append('skills[]', skill.value);
        });

        // Only append actual files, not URLs
        uploadedFiles.value.forEach((file, index) => {
            if (file instanceof File) {
                formData.append(`files[${index}]`, file);
            } else if (file.raw instanceof File) {
                formData.append(`files[${index}]`, file.raw);
            }
            // Skip if it's just a URL
        });

        await axios.post(`/quizzes/${route.params.id_quiz}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Updated quiz successfully!', 'success');
        setTimeout(() => {
            router.push(`/course-manajemen/modul/${route.params.id}`);
        }, 800);
    } catch (error) {
        showToast('Error updating Quiz.', 'error');
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

// Window Resize Listener
const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

// Lifecycle Hooks
onMounted(() => {
    loadFromIndexedDB();
    fetchSkillsData();
    fetchCourseQuiz();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
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
                        <div class="cbg-card p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Edit Quiz</h5>
                            <h4 class="fs-24">Edit Quiz</h4>
                            <div class="cbg-card2 p-3 bordersa mt-2 min-height-68">
                                <NavEssay />
                                <div class="mb-3 row">
                                    <label for="Name" class="col-sm-3 col-form-label fs-16 mt-1">Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Name Quiz" v-model="quizData.title" required />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="description" class="col-sm-3 col-form-label fs-16">Description</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control fs-16 c-border rounded-2" rows="4"
                                            placeholder="Write your review" v-model="quizData.description"
                                            required></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="workingtime" class="col-sm-3 col-form-label fs-16">Durasi Quiz</label>
                                    <div class="col-sm-9">
                                        <div class="input-group w-50">
                                            
                                            <input type="text" 
                                                class="form-control fs-16 h-43 rounded- bordersa" 
                                                placeholder="Enter Durasi Quiz" 
                                                v-model="quizData.duration" 
                                                required />
                                            <span class="input-group-text fs-16">Minute</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="workingtime" class="col-sm-3 col-form-label fs-16">Maximum Retake</label>
                                    <div class="col-sm-9">
                                        <div class="input-group w-50">
                                            
                                            <input type="text" 
                                                class="form-control fs-16 h-43 rounded- bordersa" 
                                                placeholder="Enter Retake Maximum Quiz" 
                                                v-model="quizData.max_attempt" 
                                                required />
                                            <span class="input-group-text fs-16">x Take</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="level" class="col-sm-3 col-form-label fs-16">Detail Skill</label>
                                    <div class="col-sm-9">
                                        <MultipleSelect :options="skillsOptions" v-model="selectedSkill"
                                            placeholder="Select skills" />
                                    </div>
                                </div>
                                <div class="mb-0 row">
                                    <label for="resource" class="col-sm-3 col-form-label fs-16">Resource</label>
                                    <div class="col-sm-9">
                                        <FileUpload 
                                            resourceType="quizzes"
                                            v-model="uploadedFiles"/>
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