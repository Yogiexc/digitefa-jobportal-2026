<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const currentPage = ref(1);
const perPage = 5;
const quizData = ref([]);
const userAnswers = ref({});
const isSubmitting = ref(false);
const route = useRoute();
const router = useRouter();

const idCourse = route.params.id_course;
const idCourseEnrollment = route.params.id_course_enrollment;
const idQuiz = route.params.id_quiz;
const idQuizSubmission = route.params.id_quiz_submission;

const processResources = (resources = []) => {
    return resources.map(resource => ({
        ...resource,
        raw: resource.raw || `${process.env.VUE_APP_CONTENT_QUIZ_QUEST_URL}/${resource.id}`,
    }));
};

const processOptions = (options = []) => {
    return options.map(option => ({
        ...option,
        resources: (option.resources || []).map(resource => ({
            ...resource,
            raw: resource.raw || `${process.env.VUE_APP_CONTENT_QUIZ_OPT_URL}/${resource.id}`,
        })),
    }));
};

const fetchQuizData = async () => {
    try {
        const response = await axios.get(`/quizzes/${idQuiz}`);
        quizData.value = (response.data.questions || []).map(question => ({
            ...question,
            resources: processResources(question.resources),
            options: processOptions(question.options)
        }));

        quizData.value.forEach(question => {
            if (question.type === 'essay') {
                userAnswers.value[question.id_quiz_question] = [''];
            } else {
                userAnswers.value[question.id_quiz_question] = [];
            }
        });
    } catch (error) {
        console.error('Failed to fetch quiz:', error);
    }
};

const totalPages = computed(() => {
    return Math.ceil(quizData.value.length / perPage);
});

const paginatedQuestions = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    return quizData.value.slice(start, end);
});

const handleAnswerChange = (questionId, value, type, optionAnswer = '') => {
    if (type === 'essay') {
        userAnswers.value[questionId] = [value];
    } else if (type === 'multiple_choice') {
        const index = userAnswers.value[questionId].findIndex(answer => answer === value);
        if (index === -1) {
            userAnswers.value[questionId].push(value);
        } else {
            userAnswers.value[questionId].splice(index, 1);
        }
    } else {
        userAnswers.value[questionId] = [value];
    }
};

const submitQuiz = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        if (!idQuizSubmission) {
            console.error('ID Quiz Submission is required');
            return;
        }

        const answers = Object.entries(userAnswers.value).map(([id_quiz_question, answers]) => ({
            id_quiz_question: id_quiz_question,
            answers: answers
        }));

        await axios.post('/quiz-submit-answer', {
            id_quiz_submission: idQuizSubmission,
            answers: answers
        });

        await axios.post('/quiz-submit', {
            id_quiz_submission: idQuizSubmission
        });

        router.push(`/room/course-quiz/${idCourse}/${idQuiz}/${idCourseEnrollment}`);
    } catch (error) {
        console.error('Failed to submit quiz:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

onMounted(() => {
    fetchQuizData();
});
</script>

<template>
    <div class="bg-room">
        <NavbarCourses />
        <div id="room" class="quiz">
            <div class="container pe-md-4">
                <div class="row">
                    <div class="card p-4 border-0 rounded-4">
                        <p class="text-end fs-12 fw-light mb-md-3">remaining time: 1 hour 30 minutes</p>
                        <form @submit.prevent="submitQuiz">
                            <div id="scroll-target"></div>
                            <div v-for="(question, index) in paginatedQuestions" :key="question.id_quiz_question"
                                class="mb-4 question-container">
                                <div class="question-wrapper">
                                    <span class="question-number fs-16">{{ (currentPage - 1) * perPage + index + 1 }}.</span>
                                    <label class="question-text fs-16 fw-semibold">{{ question.question }}</label>
                                </div>

                                <div v-if="question.resources && question.resources.length > 0" class="mt-2">
                                    <img v-for="resource in question.resources" 
                                         :key="resource.id"
                                         :src="resource.raw" 
                                         :alt="question.question"
                                         class="img-thumbnail mb-2" 
                                         style="max-height: 500px;"/>
                                </div>

                                <div class="form-group mt-2">
                                    <template v-if="question.type === 'essay'">
                                        <textarea 
                                            class="form-control ms-md-4 me-4 ms-4 rounded-3 w-96 mb--6 fs-12"
                                            rows="3"
                                            placeholder="Write your answer"
                                            v-model="userAnswers[question.id_quiz_question][0]"
                                            @input="handleAnswerChange(question.id_quiz_question, $event.target.value, 'essay')"
                                        ></textarea>
                                    </template>

                                    <template v-else-if="question.type === 'single_choice'">
                                        <div class="d-flex flex-column">
                                            <div v-for="option in question.options" 
                                                 :key="option.id_quiz_option" 
                                                 class="form-check ms-1">
                                                <label class="form-check-label align-items-center">
                                                <input 
                                                    class="form-check-input fs-16 ms-1 pointer" 
                                                    type="radio"
                                                    :name="'question-' + question.id_quiz_question"
                                                    :value="option.id_quiz_option"
                                                    :checked="userAnswers[question.id_quiz_question][0] === option.id_quiz_option"
                                                    @change="handleAnswerChange(question.id_quiz_question, option.id_quiz_option, 'single_choice', option.answer)"
                                                />
                                                <span class="ms-2 pointer">{{ option.answer }}</span>
                                                <div v-if="option.resources && option.resources.length > 0" class="mt-2 ms-4">
                                                    <img v-for="resource in option.resources" 
                                                         :key="resource.id"
                                                         :src="resource.raw" 
                                                         :alt="option.answer"
                                                         class="img-thumbnail mb-2 pointer" 
                                                         style="max-height: 200px;"/>
                                                </div>
                                                </label>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-else-if="question.type === 'multiple_choice'">
                                        <div class="d-flex flex-column">
                                            <div class="ms-2">
                                                <p class="mt-1 ms-4 mb-1 fs-16 light">*Select multiple answers.</p>
                                            </div>
                                            <div v-for="option in question.options" 
                                                 :key="option.id_quiz_option" 
                                                 class="form-check d-flex align-items-center ms-1">
                                                <label class="form-check-label ms-2 mb--5 fs-16">
                                                <input 
                                                    class="form-check-input fs-16 ms-1 pointer" 
                                                    type="checkbox"
                                                    :value="option.id_quiz_option"
                                                    :checked="userAnswers[question.id_quiz_question].includes(option.id_quiz_option)"
                                                    @change="handleAnswerChange(question.id_quiz_question, option.id_quiz_option, 'multiple_choice', option.answer)"
                                                />
                                                <span class="ms-2 pointer">{{ option.answer }}</span>
                                                <div v-if="option.resources && option.resources.length > 0" class="mt-2">
                                                    <img v-for="resource in option.resources" 
                                                         :key="resource.id"
                                                         :src="resource.raw" 
                                                         :alt="option.answer"
                                                         class="img-fluid mb-2 pointer" 
                                                         style="max-height: 200px;"/>
                                                </div>
                                                </label>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <div class="d-flex justify-content-center align-items-center" style="flex-grow: 1;">
                                    <button @click.prevent="goToPreviousPage" class="btn btn-warning border-0 me-2 ukuran">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>

                                    <span class="pagination-number btn-hijau text-white d-flex justify-content-center align-items-center ukuran">
                                        {{ currentPage }}
                                    </span>

                                    <button @click.prevent="goToNextPage" class="btn btn-warning border-0 ms-2 ukuran">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="text-end me-md-3">
                                <ButtonSuccess 
                                    :disabled="isSubmitting"
                                    class="fs-14 fw-medium h-40 w-11" 
                                    type="submit">
                                    {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                                </ButtonSuccess>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
