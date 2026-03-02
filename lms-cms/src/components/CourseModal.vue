<template>
    <div v-if="showModal" class="modal fade show db" tabindex="-1" aria-labelledby="addCourseModalLabel"
        aria-hidden="true" role="dialog" @click.self="closeModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header justify-content-center">
                    <h5 class="modal-title fs-24 fw-medium">Choose a Teacher</h5>
                </div>
                <div class="modal-body">
                    <div class="d-flex justify-content-start gap-2">
                        <div class="search-input w-p40 mb-2 mb-md-0">
                            <input type="text" class="form-control rounded-2 h-39 bordersa fs-12" placeholder="Search" />
                            <i class="bi bi-search fs-14 cmt-2"></i>
                        </div>
                        <div class="w-20">
                            <select class="form-select fs-12 h-39 opacity-75 rounded-3 bordersa">
                                <option selected>Level 1</option>
                                <option value="level2">Level 2</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-start gap-5 ms-5 mt-4">
                        <label class="mb-2 fs-14 ms-2">Gambar</label>
                        <label class="mb-2 fs-14 ms-3">Nama Teacher</label>
                    </div>
                    <p class="border-bottom border-black" />
                    <div class="course-list">
                        <div v-for="course in courses" :key="course.id" class="course-card me-2"
                            :class="{ 'selected': selectedCourse === course.id }" @click="selectCard(course.id)">
                            <img :src="course.image" alt="Course Image" class="circle-image ms-5">
                            <div class="ms-5">
                                <label class="fs-16">{{ course.name }}</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="text-center mt-4">
                        <ButtonBiru class="h-40 fs-14 w-30"  @click="showAddPage">Submit</ButtonBiru>
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
import { inject } from 'vue';
import { defineProps, defineEmits } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';

const props = defineProps({
    showModal: Boolean,
    selectedCourse: String,
    courses: Array
});

const currentPage = inject('currentPage');

const showAddPage = () => {
    currentPage.value = 'add';
};
const emit = defineEmits(['close', 'select', 'enroll']);

const closeModal = () => {
    emit('close');
};

const selectCard = (courseId) => {
    emit('select', courseId);
};

const enroll = () => {
    emit('enroll');
};
</script>