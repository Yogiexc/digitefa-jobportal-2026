<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonRed from '@/components/ButtonRed.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activityId = route.query.id;
const activityType = route.query.type;

const isSidebarVisible = ref(true);
const selectedOption1 = ref('option1');
const selectedOption2 = ref('');
const selectedOption3 = ref('option3');

const selectedCheckboxOptions4 = ref(['option4']);
const selectedCheckboxOptions5 = ref([]);
const selectedCheckboxOptions6 = ref(['option6']);
const selectedCheckboxOptions7 = ref(['option7']);

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
    <div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte" class="dashboard-teacher">
            <div class="container mt-80 ans">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="cbg-card rounded-3 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Modul
                                Student</h5>
                            <h4 class="fs-24 mb-4">Detail Activity Student</h4>
                            <div class="card bordersa rounded-3 p-4">
                                <div class="mb-4 question-container">
                                    <div class="question-wrapper">
                                        <span class="question-number fs-16 fw-semibold">1. </span>
                                        <label class="question-text fs-16 fw-semibold"> Struktur Dasar HTML dalam
                                            Pembuatan Website</label>
                                    </div>
                                    <div class="form-group mt-2">
                                        <textarea
                                            class="form-control ms-md-3 me-4 ms-2 rounded-3 w-100 mb--6 fs-12 mb-1 bordersa"
                                            rows="3"
                                            placeholder="HTML adalah kerangka dasar halaman web. Elemen utama seperti <html> membungkus seluruh dokumen, <head> berisi metadata, dan <body> menampilkan konten seperti teks, gambar, dan tabel."></textarea>
                                        <span class="fs-12 ms-md-3 ms-2">Jawaban: HTML adalah kerangka dasar halaman
                                            web.</span>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2">
                                        <ButtonSuccess class="h-37 fs-14 rounded-3 px-4">Correct</ButtonSuccess>
                                        <ButtonRed class="h-37 fs-14 rounded-3 px-4 text-white">Incorret</ButtonRed>
                                    </div>
                                </div>
                                <div class="mb-4 question-container">
                                    <div class="question-wrapper">
                                        <span class="question-number fs-16 fw-semibold">2. </span>
                                        <label class="question-text fs-16 fw-semibold"> Manakah dari elemen berikut yang
                                            digunakan untuk membuat paragraf di HTML?</label>
                                    </div>
                                    <div class="form-group mt-2 ms-2">
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedOption1 === 'option1' ? '#FF4C4C73' : '' }">
                                            <div class="form-check mx-2">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <input v-model="selectedOption1" class="form-check-input"
                                                            type="radio" id="flexRadioGroup1Option1" name="group1"
                                                            value="option1"
                                                            :class="{ 'bg-danger': selectedOption1 === 'option1' }" />
                                                        <label class="form-check-label" for="flexRadioGroup1Option1">
                                                            &lt;p&gt; (paragraf)
                                                        </label>
                                                    </div>
                                                    <div class="d-flex justify-content-end">
                                                        <i v-if="selectedOption1 === 'option1'"
                                                            class="bi bi-x fs-16"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedOption2 === 'option2' ? '#70E466' : '' }">
                                            <div class="form-check mx-2">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <input v-model="selectedOption2" class="form-check-input"
                                                            type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                                                            value="option2"
                                                            :class="{ 'bg-success': selectedOption2 === 'option2' }" />
                                                        <label class="form-check-label" for="flexRadioDefault2">
                                                            &lt;div&gt; (div container)
                                                        </label>
                                                    </div>
                                                    <div class="d-flex justify-content-end">
                                                        <i v-if="selectedOption2 === 'option2'" class="bi bi-check"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedOption3 === 'option3' ? '#70E466' : '' }">
                                            <div class="form-check mx-2">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <input v-model="selectedOption3" class="form-check-input"
                                                            type="radio" id="flexRadioGroup2Option3" name="group3"
                                                            value="option3"
                                                            :class="{ 'bg-success': selectedOption3 === 'option3' }" />
                                                        <label class="form-check-label" for="flexRadioGroup2Option3">
                                                            &lt;span&gt; (span)
                                                        </label>
                                                    </div>
                                                    <div class="d-flex justify-content-end">
                                                        <i v-if="selectedOption3 === 'option3'" class="bi bi-check"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mb-4 question-container">
                                    <div class="question-wrapper">
                                        <span class="question-number fs-16 fw-semibold">3. </span>
                                        <label class="question-text fs-16 fw-semibold"> Struktur Dasar HTML dalam
                                            Pembuatan Website</label>
                                    </div>
                                    <div class="form-group mt-2 ms-2">
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedCheckboxOptions4.length ? '#FF4C4C73' : '' }">
                                            <div class="d-flex justify-content-between">
                                                <div class="form-check ms-2">
                                                    <input class="form-check-input" type="checkbox" id="checkbox1"
                                                        value="option4" v-model="selectedCheckboxOptions4" />
                                                    <label class="form-check-label" for="checkbox1">
                                                        &lt;html&gt; - Elemen Root
                                                    </label>
                                                </div>
                                                <div class="me-2" v-if="selectedCheckboxOptions4.length">
                                                    <i class="bi bi-x fs-16"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedCheckboxOptions5.length ? '#70E466' : '' }">
                                            <div class="d-flex justify-content-between">
                                                <div class="form-check ms-2">
                                                    <input class="form-check-input" type="checkbox" id="checkbox2"
                                                        value="option5" v-model="selectedCheckboxOptions5" />
                                                    <label class="form-check-label" for="checkbox2">
                                                        &lt;html&gt; - Elemen Root
                                                    </label>
                                                </div>
                                                <div class="me-2" v-if="selectedCheckboxOptions5.length">
                                                    <i class="bi bi-check fs-16"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedCheckboxOptions6.length ? '#70E466' : '' }">
                                            <div class="d-flex justify-content-between">
                                                <div class="form-check ms-2">
                                                    <input class="form-check-input" type="checkbox" id="checkbox3"
                                                        value="option6" v-model="selectedCheckboxOptions6" />
                                                    <label class="form-check-label" for="checkbox3">
                                                        &lt;html&gt; - Elemen Root
                                                    </label>
                                                </div>
                                                <div class="me-2" v-if="selectedCheckboxOptions6.length">
                                                    <i class="bi bi-check"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-1"
                                            :style="{ backgroundColor: selectedCheckboxOptions7.length ? '#70E466' : '' }">
                                            <div class="d-flex justify-content-between">
                                                <div class="form-check ms-2">
                                                    <input class="form-check-input" type="checkbox" id="checkbox4"
                                                        value="option7" v-model="selectedCheckboxOptions7" />
                                                    <label class="form-check-label" for="checkbox4">
                                                        &lt;html&gt; - Elemen Root
                                                    </label>
                                                </div>
                                                <div class="me-2" v-if="selectedCheckboxOptions7.length">
                                                    <i class="bi bi-check"></i>
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
        </div>
    </div>
</template>
