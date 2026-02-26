<script setup>
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { dataStudent } from '@/data/index.js';
import NavBatchTeacher from '@/layout/NavBatchTeacher.vue';

const isSidebarVisible = ref(true);
const StudentData = ref(dataStudent);
const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const studentToDelete = ref(null);
const isToastVisible = ref(false);
const toastMessage = ref('');
const selectedSort = ref('newest');
const router = useRouter();

const filteredData = computed(() => {
    let sortedData = [...StudentData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(category =>
        category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const pageNumbers = computed(() => {
    const pages = [];
    if (totalPages.value <= 5) {
        for (let i = 1; i <= totalPages.value; i++) pages.push(i);
    } else {
        if (currentPage.value <= 3) {
            pages.push(1, 2, 3, '...', totalPages.value);
        } else if (currentPage.value > 3 && currentPage.value < totalPages.value - 2) {
            pages.push(1, '...', currentPage.value, '...', totalPages.value);
        } else {
            pages.push(1, '...', totalPages.value - 2, totalPages.value - 1, totalPages.value);
        }
    }
    return pages;
});

const showAddStudentModal = () => {
    isModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddStudentModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const saveStudent = async () => {

};

const showDeleteStudentModal = (student) => {
    studentToDelete.value = student;
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteStudentModal = () => {
    isDeleteModalVisible.value = false;
    studentToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteStudent = async () => {
    if (!studentToDelete.value) return;
    try {
        StudentData.value = StudentData.value.filter(student => student.id !== studentToDelete.value.id);
        closeModal();
        showToast('Student deleted successfully!');
    } catch (error) {
        console.error('Error deleting student:', error);
        showToast('Error deleting student.');
    }
};


const showToast = (message) => {
    toastMessage.value = message;
    isToastVisible.value = true;
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeModal = () => {
    isDeleteModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

const navigateToActivity = () => {
    router.push({ path: "/course-teacher/batch/activity-student" });
}

const showDeleteStudentnModal = () => {
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

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
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Batch/Student</h5>
                            <h4 class="fs-24">Student</h4>
                            <div class="card p-3 bordersa mt-2">
                                <NavBatchTeacher />
                                <div class="d-flex justify-content-between studentsa">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control rounded-3 h-40 c-border" v-model="searchQuery"
                                                placeholder="Search" />
                                            <i class="bi bi-search mt--10"></i>
                                        </div>
                                        <select class="form-select w-30 c-border ms-2 h-40 c-border rounded-3" v-model="selectedSort">
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                    <ButtonBiru class="ms-3 mb-3 h-40 px-3 rounded-3 fs-16" @click="showAddStudentModal">
                                        Add Student
                                    </ButtonBiru>
                                </div>
                                <div class="col-md-12">
                                    <div class="table-responsive">
                                        <table class="table custom-table rounded-4">
                                            <thead class="thead-custom">
                                                <tr class="ps-4">
                                                    <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                    <th class="fs-16 fw-light w-350">Name Student</th>
                                                    <th class="fs-16 fw-light w-150">Date</th>
                                                    <th class="fs-16 fw-light w-150">Progress</th>
                                                    <th class="fs-16 fw-light w-10 pe-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-custom">
                                                <tr class="pointer" v-for="(course, index) in paginatedData" :key="course.id"  @click="navigateToActivity(course)">
                                                    <td class="ps-4 pt-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                                    <td class="pt-3 fs-16">{{ course.name }}</td>
                                                    <td class="pt-3 fs-16">{{ course.date }}</td>
                                                    <td class="pt-3 fs-16">{{ course.progress }}</td>
                                                    <td class="ps-3" @click.stop>
                                                        <button class="border-0 rounded-2 btn-trash" @click="showDeleteStudentnModal">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="5" class="p-1">
                                                        <nav>
                                                            <div class="d-flex justify-content-between">
                                                                <div class="d-flex align-items-center">
                                                                    <label for="itemsPerPage" class="me-2">Items per page:</label>
                                                                    <select id="itemsPerPage" class="form-select w-auto bg-none border-0"
                                                                        v-model="itemsPerPage">
                                                                        <option value="10">10</option>
                                                                        <option value="20">20</option>
                                                                        <option value="50">50</option>
                                                                    </select>
                                                                    <span class="fs-16">{{ (currentPage - 1) * itemsPerPage + 1 }} -
                                                                        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} of
                                                                        {{ filteredData.length }} items</span>
                                                                </div>
                                                                <ul class="pagination custom-pagination justify-content-end">
                                                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                                                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                                                                            <i class="bi bi-chevron-left"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li v-for="page in pageNumbers" :key="page" class="page-item"
                                                                        :class="{ active: page === currentPage }">
                                                                        <a class="page-link" href="#" @click.prevent="goToPage(page)"
                                                                            v-if="page !== '...'">{{ page }}</a>
                                                                        <span class="page-link" v-else>...</span>
                                                                    </li>
                                                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                                                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                                                                            <i class="bi bi-chevron-right"></i>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </nav>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Add Modal -->
                                <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddStudentModal"></div>
                                <div v-if="isModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true" @click.self="closeAddStudentModal">
                                    <div class="modal-dialog custom-modal modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header mb--3">
                                                <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                                    <i class="bi bi-file-earmark-plus me-1"></i>Add Student
                                                </h5>
                                                <button type="button" class="btn-close fs-12 c-close" @click="closeAddStudentModal"></button>
                                            </div>
                                            <hr class="mt-0">
                                            <div class="ps-4 mt-3 mb-2">
                                                <div class="d-flex align-items-center">
                                                    <label for="categoryName" class="me-3 fs-16 mb-0">Name Student</label>
                                                    <input type="text" id="categoryName" class="form-control w-66 h-43"
                                                        placeholder="Enter student name" v-model="newStudentName" />
                                                </div>
                                            </div>
                                            <div class="d-flex justify-content-center mb-5">
                                                <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                                    @click="closeAddStudentModal">Cancel</ButtonTransparanComponen>
                                                <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="saveStudent">
                                                    Save</ButtonBiru>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Delete Modal -->
                                <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteStudentModal"></div>
                                <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="deleteModalLabel"
                                    aria-hidden="true" @click.self="closeDeleteStudentModal">
                                    <div class="modal-dialog custom-modal modal-dialog-centered">
                                        <div class="modal-content pt-3">
                                            <div class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                                                <PhTrashSimple :size="50" color="#ff4c4c" />
                                                <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Student</h5>
                                                <h5 class="fs-16 fw-light opacity-50">
                                                    Are you sure you want to delete this student? Once deleted, this data
                                                    cannot be restored.
                                                </h5>
                                            </div>
                                            <div class="d-flex justify-content-center mb-5">
                                                <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                                    @click="closeDeleteStudentModal">No, Cancel</ButtonTransparanComponen>
                                                <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteStudent">Yes, Delete
                                                </ButtonMerah>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
                                    <div v-if="isToastVisible" class="toast align-items-center text-white bg-light-success border-0 show"
                                        role="alert">
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
                        </div>
                    </div>
                </div>
             </div>
        </div>
    </div>
</template>
