<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const activeTab = ref('about');
const isSidebarVisible = ref(true);
const courseQuiz = ref(null);
const idCourse = ref(route.params.id_course);
const idQuiz = ref(route.params.id_quiz);
const idCourseEnrollment = ref(route.params.id_course_enrollment);

const inProgress = ref(false);
const idQuizSubmission = ref(null);
const buttonLabel = ref('Start');

const checkQuizInProgress = async () => {
    try {
        const response = await axios.get(
            `/check-quiz-inprogress/${idCourseEnrollment.value}/${idQuiz.value}`
        );

        if (response.data.success) {
            inProgress.value = response.data.in_progress;
            idQuizSubmission.value = response.data.id_quiz_submission;

            buttonLabel.value = inProgress.value ? 'Continue' : 'Start';
        }
    } catch (error) {
        console.error('Error checking quiz progress:', error);
    }
};

const handleButtonClick = () => {
    if (inProgress.value && idQuizSubmission.value) {
        router.push(
            `/room/quiz-question/${idCourse.value}/${idQuiz.value}/${idCourseEnrollment.value}/${idQuizSubmission.value}`
        );
    } else {
        startQuiz();
    }
};

const fetchQuiz = async () => {
    try {
        const response = await axios.get(`/quiz-get-attempts/${idQuiz.value}/${idCourseEnrollment.value}`);
        courseQuiz.value = response.data;
        console.log('Course Quiz:', courseQuiz.value);
    } catch (error) {
        console.error('Failed to fetch course quiz:', error);
    }
};

const startQuiz = async () => {
    try {
        const response = await axios.post('/quiz-start', {
            id_quiz: idQuiz.value,
            id_course_enrollment: idCourseEnrollment.value,
        });

        const { id_quiz_submission } = response.data.submission;
        router.push(
            `/room/quiz-question/${idCourse.value}/${idQuiz.value}/${idCourseEnrollment.value}/${id_quiz_submission}`
        );
    } catch (error) {
        console.error('Failed to start quiz:', error);
    }
};


const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 768;
};

const setActiveTab = (tab) => {
    activeTab.value = tab;
};

onMounted(() => {
    checkQuizInProgress();
    fetchQuiz();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>


<template>
    <div class="bg-room">
        <!-- NAVBAR START -->
        <NavbarCourses />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarCourse v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="room" class="essay">
            <div class="container mt-md-2 pe-md-4">
                <div class="row">
                    <div class="col-md-12 mt-md-0 ey">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Installasi</h5>
                            <h4 class="fs-24">Essay</h4>
                            <div class="card p-4 bordersa mt-2">
                                <div class="d-flex justify-content-start mt-11 gap-4">
                                    <label class="fs-16 pointer" :class="{ 'active-tab': activeTab === 'about' }"
                                        @click="setActiveTab('about')">
                                        About
                                    </label>
                                </div>
                                <hr />
                                <div v-show="activeTab === 'about'">
                                    <div v-if="courseQuiz">
                                        <h4 class="card-title fs-16 fw-semibold">{{ courseQuiz.quiz.title }}</h4>
                                        <p class="card-text fs-16 fw-normal text-justify mb-4">{{
                                            courseQuiz.quiz.description
                                        }}</p>
                                        <div class="ul">
                                            <h4 class="card-title fs-16 fw-semibold">Submission Status</h4>
                                            <ul class="card-text fs-16 fw-light">
                                                <li>
                                                    <span class="platform">Submission Status</span>
                                                    <span class="separator">:</span>
                                                    <a class="garis- text-dark" href="#">Not submitted</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Grading Status</span>
                                                    <span class="separator">: </span>
                                                    <a class="garis- text-dark" href="#">0/100</a>
                                                </li>
                                                <li>
                                                    <span class="platform">Duration</span>
                                                    <span class="separator">: </span>
                                                    <span class="text-dark">{{ courseQuiz.quiz.duration }}
                                                        minutes</span>
                                                </li>
                                                <li>
                                                    <span class="platform">Max retake</span>
                                                    <span class="separator">: </span>
                                                    <a class="garis- text-dark" href="#">{{ courseQuiz.quiz.max_attempt
                                                        }}
                                                    </a>
                                                </li>
                                                <li>
                                                    <span class="platform">Completion Time</span>
                                                    <span class="separator">: </span>
                                                    <a class="garis- text-dark" href="#">2 hours to complete the
                                                        task</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="text-center mb-3">
                                            <ButtonSuccess class="mt-md-5 mt-4 h-38 w-20 fs-16" @click="handleButtonClick">
                                                {{ buttonLabel }}
                                            </ButtonSuccess>
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
