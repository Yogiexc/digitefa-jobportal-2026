<script setup>
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import NavEssayTeacher from '@/layout/NavEssayTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { saveToDB, getFromDB } from '@/utils/indexedDB';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const route = useRoute();
const router = useRouter();
const isToastVisible = ref(false);
const toastMessage = ref('');

const questionData = ref([]);

// Fungsi untuk menyimpan data ke IndexedDB
const saveToIndexedDB = async (data) => {
    try {
        const quizId = route.params.id_quiz;
        const existingQuiz = await getFromDB('quizzesData', quizId);

        // Gabungkan data lama dengan data baru
        const updatedQuiz = {
            ...existingQuiz,
            data: {
                ...existingQuiz?.data,
                ...data, // Data baru akan menimpa data lama jika ada overlap
                questions: data.questions || existingQuiz?.data?.questions || [], // Update hanya questions
            },
        };

        // Simpan data yang telah diperbarui ke IndexedDB
        await saveToDB('quizzesData', updatedQuiz);
        console.log(`Quiz data updated and saved to IndexedDB for ID: ${quizId}`);
    } catch (error) {
        console.error('Error saving to IndexedDB:', error);
    }
};

// Load from IndexedDB
const loadFromIndexedDB = async () => {
    try {
        const quizId = route.params.id_quiz;
        const storedQuiz = await getFromDB('quizzesData', quizId);

        if (storedQuiz && storedQuiz.data) {
            questionData.value = storedQuiz.data.questions || [];
        }
    } catch (error) {
        console.error('Error loading question data from IndexedDB:', error);
    }
};

const deepCloneSerializable = (obj) => JSON.parse(JSON.stringify(obj));

// Modify the fetchCourseQuiz function
const fetchQuestions = async () => {
    const quizId = route.params.id_quiz;
    try {
        const response = await axios.get(`/quizzes/${quizId}`);
        const data = response.data;

        // Pastikan data questions berupa array
        const questions = Array.isArray(data.questions) ? data.questions : [];

        // Proses setiap pertanyaan dan sumber daya terkait
        questionData.value = questions.map((question) => ({
            ...question,
            resources: (question.resources || []).map((resource) => ({
                ...resource,
                raw: resource.raw || `${process.env.VUE_APP_CONTENT_QUIZ_QUEST_URL}/${resource.id}`,
            })),
            options: (question.options || []).map((option) => ({
                ...option,
                resources: (option.resources || []).map((resource) => ({
                    ...resource,
                    raw: resource.raw || `${process.env.VUE_APP_CONTENT_QUIZ_OPT_URL}/${resource.id}`,
                })),
            })),
        }));

        // Simpan questions ke IndexedDB
        await saveToIndexedDB({ questions: deepCloneSerializable(questionData.value) });
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

// Modified UpdateQuestion to handle both local and remote updates
const UpdateQuestion = async (questionIndex) => {
    questionData.value[questionIndex].isLoading = true;

    try {
        const question = questionData.value[questionIndex];
        const formData = new FormData();

        // Tambahkan data utama dari pertanyaan
        formData.append('id_quiz', route.params.id_quiz);
        formData.append('question', question.question || '');
        formData.append('type', question.type || '');
        formData.append('reference_answer', question.reference_answer || '');

        // Tambahkan semua file di question.resources
        for (const resource of question.resources || []) {
            if (resource.file) {
                formData.append('files[]', resource.file, resource.name);
            } else if (resource.raw) {
                const blob = await fetch(resource.raw).then((res) => res.blob());
                formData.append('files[]', blob, resource.name || 'file');
            }
        }

        // Tambahkan semua opsi beserta file mereka
        for (let idx = 0; idx < question.options.length; idx++) {
            const option = question.options[idx];

            formData.append(`options[${idx}][id_quiz_option]`, option.id_quiz_option || '');
            formData.append(`options[${idx}][answer]`, option.answer || '');
            formData.append(`options[${idx}][is_correct]`, option.is_correct ? '1' : '0');

            // Tambahkan semua file di options.resources
            for (const resource of option.resources || []) {
                if (resource.file) {
                    formData.append(`options[${idx}][files][]`, resource.file, resource.name);
                } else if (resource.raw) {
                    const blob = await fetch(resource.raw).then((res) => res.blob());
                    formData.append(`options[${idx}][files][]`, blob, resource.name || 'file');
                }
            }
        }

        // Kirim FormData ke backend
        await axios.post(
            `/quiz-questions/${question.id_quiz_question || ''}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // Perbarui data setelah update
        fetchQuestions();
        showToast('Perubahan berhasil disimpan');
    } catch (error) {
        console.error('Error saving question:', error);
        showToast('Terjadi kesalahan saat menyimpan perubahan');
    } finally {
        questionData.value[questionIndex].isLoading = false;
    }
};

const addOption = async (index) => {
    const newOption = {
        id_quiz_option: null,
        answer: 'Opsi',
        is_correct: 0,
        reference_answer: 'Masukkan Jawabanmu disini',
    };

    if (questionData.value[index].options.length < 5) {
        questionData.value[index].options.push(newOption);
        await UpdateQuestion(index);
        showToast('Opsi baru berhasil ditambahkan.');
    } else {
        showToast('Tidak bisa menambahkan lebih dari 5 opsi.');
    }
};

const getEmptyQuestion = () => ({
    id_quiz_question: null,
    question: 'Question',
    type: 'single_choice',
    reference_answer: '',
    resources: [], // Default array kosong untuk file
    options: [
        {
            id_quiz_option: null,
            answer: '',
            is_correct: false,
            resources: [], // Default array kosong untuk file
        },
    ],
});


const addCard = async () => {
    try {
        const newQuestion = getEmptyQuestion(); // Dapatkan template pertanyaan kosong

        const formData = new FormData();
        formData.append('id_quiz', route.params.id_quiz);
        formData.append('question', newQuestion.question);
        formData.append('type', newQuestion.type);

        const response = await axios.post('/quiz-questions', formData);

        // Tambahkan pertanyaan baru ke state lokal dengan data dari respons backend
        questionData.value.push({
            ...newQuestion,
            id_quiz_question: response.data.id_quiz_question,
            options: response.data.options || [],
        });
        fetchQuestions();
        showToast('Pertanyaan baru berhasil ditambahkan.');
    } catch (error) {
        console.error('Error adding question:', error.response?.data || error.message);
        showToast('Terjadi kesalahan saat menambahkan pertanyaan.');
    }
};

const makeEditCheckboxTable = (index, optionIndex) => {
    questionData.value[index].editingIndex = optionIndex;
    const clickOutsideHandler = (event) => {
        const editInput = document.querySelector(`#edit-input-${index}-${optionIndex}`);
        if (!editInput || !editInput.contains(event.target)) {
            questionData.value[index].editingIndex = null;
            document.removeEventListener('click', clickOutsideHandler);
        }
    };
    document.addEventListener('click', clickOutsideHandler);
};

const showToast = (message) => {
    toastMessage.value = message;
    isToastVisible.value = true;
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const deleteCard = async (index) => {
    const question = questionData.value[index];
    try {
        if (question.id_quiz_question) {
            await axios.delete(`/quiz-questions/${question.id_quiz_question}`);
        }
        questionData.value.splice(index, 1);
        fetchQuestions();
        showToast('Pertanyaan berhasil dihapus.');
    } catch (error) {
        console.error('Error deleting question:', error);
        showToast('Error deleting question from server');
    }
};

const handleImageUpload = async (event, questionIndex, optionIndex = null) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const fileUrl = URL.createObjectURL(file);

        if (optionIndex === null) {
            // Tambahkan file ke resources untuk pertanyaan
            questionData.value[questionIndex].resources.push({ raw: fileUrl, file: file, name: file.name });
        } else {
            // Tambahkan file ke resources untuk opsi
            questionData.value[questionIndex].options[optionIndex].resources.push({ raw: fileUrl, file: file, name: file.name });
        }

        // Trigger UpdateQuestion untuk mengirim file
        await UpdateQuestion(questionIndex);

        showToast('Gambar berhasil diunggah');
    } catch (error) {
        console.error('Error handling image upload:', error);
        showToast('Gagal mengunggah gambar');
    }
};


const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

const addLoadingStateToQuestions = () => {
  questionData.value.forEach((question) => {
    question.isLoading = false; // Tambahkan properti isLoading
  });
};

onMounted(async () => {
  fetchQuestions();
  loadFromIndexedDB();
  addLoadingStateToQuestions(); // Tambahkan state isLoading
  checkWindowSize();
  window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
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
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Add Questions</h5>
                            <h4 class="fs-24">Add Questions</h4>
                            <div class="cbg-card2 p-3 bordersa mt-2 min-height-68">
                                <NavEssay />
                                <div v-for="(card, index) in questionData" :key="index" class="card p-3 card-abu-muda mb-3">

                                      <!-- Loading Effect -->
                                    <div v-if="card.isLoading" class="loading-overlay">
                                        <div class="spinner"></div>
                                    </div>

                                    <div class="d-flex justify-content-center gap-3">
                                        <input type="text" class="form-control fs-16 h-43 rounded-3 bordersa"
                                            placeholder="Enter Question" v-model="card.question"
                                            @change="UpdateQuestion(index)" />
                                        <label class="btn btn-outline-secondary rounded-3 border-0 btn-sm">
                                            <i class="bi bi-image fs-25"></i>
                                            <input type="file" accept="image/*" class="d-none"
                                                @change="(e) => handleImageUpload(e, index, idx)" />
                                        </label>
                                        <select class="form-select w-66 c-border h-43" v-model="card.type"
                                            @change="UpdateQuestion(index)">
                                            <option value="single_choice">Pilihan Ganda (Satu Jawaban)</option>
                                            <option value="multiple_choice">Pilihan Ganda (Banyak Jawaban)</option>
                                            <option value="essay">Essay</option>
                                        </select>
                                    </div>
                                    <div v-for="(resource, rIndex) in card.resources" :key="rIndex" class="mt-2">
                                        <img :src="resource.raw" alt="Question Image"
                                            class="img-thumbnail me-2" style="max-height: 500px;" />
                                    </div>
                                    <div>
                                        <div v-if="card.type === 'single_choice' || card.type === 'multiple_choice'">
                                            <div v-for="(option, idx) in card.options" :key="idx" class="form-check mt-2">
                                                <template v-if="card.editingIndex === idx">
                                                    <div class="input-group" 
                                                    :id="'edit-input-' + index + '-' + idx"
                                                    :ref="'edit-input-' + index + '-' + idx">
                                                        <input type="text" v-model="option.answer" class="form-control" autofocus 
                                                        @change="UpdateQuestion(index)"/>
                                                        <label class="input-group-text pointer" 
                                                        @change="(e) => handleImageUpload(e, index, idx)">
                                                            <i class="bi bi-image"></i>
                                                            <input type="file" accept="image/*" class="d-none"/>
                                                        </label>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <input class="form-check-input" :type="card.type === 'single_choice' ? 'radio' : 'checkbox'"
                                                        :name="'exampleCheckbox' + index" :checked="option.is_correct"
                                                        @change="option.is_correct = $event.target.checked ? 1 : 0; UpdateQuestion(index)" />
                                                    <label class="form-check-label"
                                                        @dblclick="makeEditCheckboxTable(index, idx)">
                                                        {{ option.answer }}
                                                    </label>
                                                    <div  v-for="(res, resIndex) in option.resources" :key="resIndex" class="mt-2">
                                                        <img :src="res.raw" alt="Option Image"
                                                            class="img-thumbnail me-2" style="max-height: 200px;" />
                                                    </div>
                                                </template>
                                            </div>
                                            <button class="btn btn-link" @click="addOption(index)">Tambah Opsi</button>
                                        </div>
                                        <div v-else-if="card.type === 'essay'">
                                            <textarea
                                                class="form-control fs-16 c-border rounded-2 mt-2"
                                                rows="4"
                                                placeholder="Masukkan jawaban referensi"
                                                v-model="card.reference_answer"
                                                @change="UpdateQuestion(index)"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="d-flex justify-content-end fs-16 cpointer">
                                        <i class="bi bi-trash" @click="deleteCard(index)"></i>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center mt-3">
                                    <button class="rounded-3 border-0 card-abu-muda btn-plus" @click="addCard">
                                        <i class="bi bi-plus fs-30"></i>
                                    </button>
                                </div>
                                <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
                                    <div v-if="isToastVisible"
                                        class="toast align-items-center text-white bg-light-success border-0 show"
                                        role="alert">
                                        <div class="d-flex">
                                            <div class="toast-body">{{ toastMessage }}</div>
                                            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                                                @click="isToastVisible = false" aria-label="Close"></button>
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

<style>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>