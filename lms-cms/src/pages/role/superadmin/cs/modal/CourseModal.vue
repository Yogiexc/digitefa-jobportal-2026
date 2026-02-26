<template>
    <div v-if="showModal" class="modal fade show db" tabindex="-1" aria-labelledby="addCourseModalLabel"
        aria-hidden="false" role="dialog" @click.self="closeModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header justify-content-center">
                    <h5 class="modal-title fs-24 fw-medium">Choose a Teacher</h5>
                </div>
                <button type="button" class="btn-close position-absolute top-0 end-0 me-2 mt-2 fs-12" @click="closeModal"></button>
                <div class="modal-body">
                    <div class="d-flex justify-content-start gap-2">
                        <div class="search-input w-p40 mb-2 mb-md-0">
                            <input v-model="searchQuery" type="text" class="form-control rounded-2 h-39 bordersa fs-12"
                                placeholder="Search" />
                            <i class="bi bi-search fs-14 cmt-2"></i>
                        </div>
                        <div class="w-25">
                            <select v-model="selectedLevel" class="form-select fs-12 h-39 opacity-75 rounded-3 bordersa">
                                <option value="" disabled selected>Select Level</option>
                                <option v-for="level in levelTeacherData" :key="level.id" :value="level.name">
                                    {{ level.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-evenly gap-5 mt-4">
                        <label class="mb-2 fs-14">Profile</label>
                        <label class="mb-2 fs-14">Name</label>
                        <label class="mb-2 fs-14">Level</label>
                    </div>
                    <p class="border-bottom border-black" />
                    <div class="course-list">
                        <div v-for="teacher in filteredTeachers" :key="teacher.id_user" class="justify-content-evenly course-card me-2"
                            :class="{ 'selected': selectedTeacher === teacher.id_user }"
                            @click="selectCard(teacher.id_user)">
                            <img :src="teacher.photo_profile" alt="Course Image" class="circle-image">
                            <div class="ms-5 me-5">
                                <label class="fs-16">{{ teacher.name }}</label>
                            </div>
                            <div class="ms-5">
                                <label class="fs-16">{{ teacher.level }}</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="text-center mt-4">
                        <ButtonBiru class="h-40 fs-14 w-30" @click="submitSelection">Submit</ButtonBiru>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.circle-image {
    width: 60px !important;
    height: 60px !important;
    border-radius: 50% !important;
    object-fit: cover !important;
}
</style>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import axios from 'axios';
import { toRaw, defineProps, defineEmits } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';

const props = defineProps({
    showModal: Boolean,
    selectedTeacher: String
});

const emit = defineEmits(['close', 'select', 'submit']);
const selectedTeacher = ref(null);
const currentPage = inject('currentPage');
const levelTeacherData = ref([]);
const teacherData = ref([]);
const selectedLevel = ref('');
const searchQuery = ref('');

const fetchLevelTeacherData = async () => {
    try {
        const response = await axios.get("/teacher-levels");
        levelTeacherData.value = response.data;
    } catch (error) {
        console.error("Error fetching Level teacher data:", error);
    }
};

// Fetch teacher data
const fetchTeacherData = async () => {
    try {
        const response = await axios.get('/teachers');
        const teacherProfileUrl = process.env.VUE_APP_TEACHER_PROFILE_URL;
        teacherData.value = response.data.teachers.map(user => ({
            id_user: user.id_user,
            name: user.name,
            photo_profile: user.teacher?.photo_profile ? `${teacherProfileUrl}/${user.teacher.photo_profile}` : require('@/assets/images/my-profile.png'),
            level: user.teacher?.teacher_level.name,
            teacherid: user.teacher?.id_teacher
        }));
    } catch (error) {
        console.error('Error fetching teacher data:', error);
    }
};

// Close modal
const closeModal = () => {
    emit('close');
};

// Select teacher card
const selectCard = (teacherId) => {
    selectedTeacher.value = teacherId;
    emit('select', teacherId);
};

// Submit teacher selection
const submitSelection = () => {
    if (selectedTeacher.value) {
        const teacher = toRaw(teacherData.value.find(teacher => teacher.id_user === selectedTeacher.value));
        if (teacher && teacher.teacherid) {
            const teacherDataToStore = {
                id: teacher.id_user,
                name: teacher.name,
                teacherid: teacher.teacherid
            };

            sessionStorage.setItem('selectedTeacher', JSON.stringify(teacherDataToStore));
            emit('submit', teacherDataToStore);
            currentPage.value = "add";
        } else {
            console.log("Teacher data is incomplete or missing teacherid.");
        }
    } else {
        console.log("No teacher selected.");
    }
};

const filteredTeachers = computed(() => {
    return teacherData.value.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            teacher.level.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesLevel = teacher.level.toLowerCase().includes(selectedLevel.value.toLowerCase())
        return matchesSearch && matchesLevel;
    });
});

// Fetch data on mounted
onMounted(() => {
    fetchLevelTeacherData();
    fetchTeacherData();
});
</script>
