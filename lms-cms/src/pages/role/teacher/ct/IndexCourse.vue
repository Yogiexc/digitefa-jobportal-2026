<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { ref, onUnmounted, onMounted, computed } from 'vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { useStore } from 'vuex';

const store = useStore(); 
const router = useRouter();
const isLoading = ref(false);
const isSidebarVisible = ref(true);
const courseToDelete = ref(null);
const isDeleteModalVisible = ref(false);
const selectedSort = ref('Sort');
const courseData = ref([]);
const searchQuery = ref('');
const toastMessage = ref('');
const isToastVisible = ref(false);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const currentCourse = ref(null);
const dropdownVisible = ref(false);
const dropdownPosition = ref({ top: '0px', left: '0px' });
const currentPage = ref(1);
const user = ref({});
const currentItem = ref(null);

const fetchCoursesData = async () => {
    try {
        // Fetch user data from Vuex state
        const user = store.getters.getUser;
        const id_teacher = user.teacher?.id_teacher; // Adjust based on how the teacher's data is stored in user

        if (!id_teacher) {
            console.error('Teacher ID not found');
            return;
        }

        const response = await axios.get(`/courses/teacher/${id_teacher}`);
        if (response.data && response.data.courses) {
            const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;
            courseData.value = response.data.courses.map(course => ({
                ...course,
                thumbnail: course.thumbnail
                    ? `${courseThumbnailUrl}/${course.thumbnail}`
                    : require('@/assets/images/home.jpg'),
            }));
        } else {
            console.warn('No courses data found in the response');
        }
        saveToLocalStorage(courseData.value);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};


const saveToLocalStorage = (data) => {
    localStorage.setItem('courseData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('courseData');
    if (storedData) {
        courseData.value = JSON.parse(storedData);
    }
};

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const data = filteredData.value.slice(startIndex, endIndex);
    return data;
});

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

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`
    };
    dropdownVisible.value = true;
    currentCourse.value = item;
    currentItem.value = item;
};

const hideDropdownMenu = () => {
    dropdownVisible.value = false;
    currentItem.value = null;
};

const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
        hideDropdownMenu();
    }
};

const truncateSubTitle = (subTitle, wordLimit = 4) => {
    const words = subTitle.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : subTitle;
};

const filteredData = computed(() => {
    let sortedData = Array.isArray(courseData.value) ? courseData.value : [];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(course =>
        course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const showDeleteLevelCourseModal = (course) => {
    hideDropdownMenu();
    courseToDelete.value = course;
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteCourseModal = () => {
    isDeleteModalVisible.value = false;
    courseToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteCourse = async () => {
    isLoading.value = true;

    try {
        if (currentCourse.value) {
            await axios.delete(`/courses/${currentCourse.value.id_course}`);
            fetchCoursesData();
            closeModal();
            showToast('Student deleted successfully!', 'success');
        }
    } catch (error) {
        showToast('Error deleting student.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showToast = (message) => {
    toastMessage.value = message;
    isToastVisible.value = true;
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

const closeModal = () => {
    isDeleteModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

const showAddPage = () => {
    router.push('/course-teacher/add-course');
}

const showDetailPage = (item) => {
    currentCourse.value = item;
    router.push(`/course-teacher/detail/${currentCourse.value.id_course}`);
};

const goAddBatch = (id) => {
    router.push(`/course-teacher/batch/${id}`);
};

onMounted(async () => {
    await store.dispatch('fetchUserData');
    checkWindowSize();
    
    const user = store.getters.getUser;
    if (user) {
        fetchCoursesData();
    } else {
        console.error('No user data found in Vuex.');
    }
    
    window.addEventListener('resize', checkWindowSize);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', hideDropdownMenu);
});


onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
    document.removeEventListener('click', handleClickOutside);
    document.addEventListener('scroll', hideDropdownMenu);
})
</script>

<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />
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
                            <div class="cbg-card rounded-2 p-4 border-0 cs">
                                <h5 class="fw-light fs-16">Digitefa/Course Manajemen</h5>
                                <h4 class="fs-24">Course Manajemen</h4>
                                <div class="d-flex justify-content-between mb-3 mt-4">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control rounded-3 h-40 c-border"
                                                v-model="searchQuery" placeholder="Search" />
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <select class="form-select w-30 c-border ms-2 h-40 c-border"
                                            v-model="selectedSort">
                                            <option selected>Sort</option>
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                    <ButtonBiru class="fs-16 px-3 rounded-3 h-40" @click="showAddPage">Add
                                        Course
                                    </ButtonBiru>
                                </div>
                                <div class="col-md-12 mt-4 mt-md-0">
                                    <div class="table-responsive">
                                        <table class="table custom-table rounded-4">
                                            <thead class="thead-custom">
                                                <tr class="ps-4">
                                                    <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                    <th class="fs-16 fw-light w-350">Name Course</th>
                                                    <th class="fs-16 fw-light w-150">Teacher</th>
                                                    <th class="fs-16 fw-light w-10 ps-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-custom">
                                                <tr v-for="(item, index) in paginatedData" :key="item.id_course">
                                                    <td class="ps-4" style="padding-top: 33px;">
                                                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                                                    </td>
                                                    <td>
                                                        <div @click="showDetailPage(item)"
                                                            class="d-flex align-items-center hover-background">
                                                            <img v-if="item.thumbnail" :src="item.thumbnail"
                                                                class="rounded me-3" alt="Course Image" width="88px"
                                                                height="56px" />
                                                            <div class="ms-0">
                                                                <h6 class="mb-1 fs-16 fw-medium">{{ item.title }}</h6>
                                                                <p class="mb-0 text-muted fs-12">{{
                                                                    truncateSubTitle(item.description) }}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="fs-16" style="padding-top: 33px;">
                                                        {{ item.teacher?.user?.name }}
                                                    </td>
                                                    <td style="padding-top: 33px;">
                                                        <div class="dropdown-container ps-3">
                                                            <button class="btn border-0 dropdown-toggle" type="button"
                                                                @click="showDropdownMenu($event, item)">
                                                                <p class="bi bi-three-dots-vertical"
                                                                    style="margin-bottom: -8px; margin-top: -5px;"></p>
                                                            </button>
                                                            <ul v-if="dropdownVisible"
                                                                class="fixed-dropdown dropdown-menu"
                                                                style="display: block"
                                                                :style="{ top: dropdownPosition.top, left: dropdownPosition.left }">
                                                                <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                                <li>
                                                                    <a class="dropdown-item fw-normal fs-16 pointer"
                                                                        @click="currentItem && goAddBatch(currentItem.id_course)">
                                                                        <i class=" bi bi-file-earmark-plus me-1
                                                                        fs-16"></i>
                                                                        Batch
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a class="dropdown-item fw-normal pointer"
                                                                        @click="showDeleteLevelCourseModal">
                                                                        <i class="bi bi-trash me-1 fs-16"></i>
                                                                        Delete
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr v-if="paginatedData.length === 0">
                                                    <td colspan="4" class="text-center">No data available</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" class="p-1">
                                                        <nav>
                                                            <div class="d-flex justify-content-between">
                                                                <div class="d-flex align-items-center">
                                                                    <label for="itemsPerPage" class="me-2">Items per
                                                                        page:</label>
                                                                    <select id="itemsPerPage"
                                                                        class="form-select w-auto bg-none border-0">
                                                                        <option value="10">10</option>
                                                                        <option value="20">20</option>
                                                                        <option value="50">50</option>
                                                                    </select>
                                                                    <span class="fs-16">{{ (currentPage - 1) *
                                                                        itemsPerPage
                                                                        + 1 }} - {{
                                                                            Math.min(currentPage * itemsPerPage,
                                                                                filteredData.length) }} of
                                                                        {{ filteredData.length }} items
                                                                    </span>
                                                                </div>
                                                                <ul
                                                                    class="pagination custom-pagination justify-content-end">
                                                                    <li class="page-item"
                                                                        :class="{ disabled: currentPage === 1 }">
                                                                        <a class="page-link" href="#"
                                                                            @click.prevent="goToPage(currentPage - 1)">
                                                                            <i class="bi bi-chevron-left"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li v-for="page in pageNumbers" :key="page"
                                                                        class="page-item"
                                                                        :class="{ active: page === currentPage }">
                                                                        <a class="page-link" href="#"
                                                                            @click.prevent="goToPage(page)"
                                                                            v-if="page !== '...'">{{
                                                                                page }}</a>
                                                                        <span class="page-link" v-else>...</span>
                                                                    </li>
                                                                    <li class="page-item"
                                                                        :class="{ disabled: currentPage === totalPages }">
                                                                        <a class="page-link" href="#"
                                                                            @click.prevent="goToPage(currentPage + 1)">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Modal -->
            <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteCourseModal">
            </div>
            <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog"
                aria-labelledby="deleteModalLabel" aria-hidden="true" @click.self="closeDeleteCourseModal">
                <div class="modal-dialog custom-modal modal-dialog-centered">
                    <div class="modal-content pt-3">
                        <div
                            class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                            <PhTrashSimple :size="50" color="#ff4c4c" />
                            <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Course</h5>
                            <h5 class="fs-16 fw-light opacity-50">
                                Are you sure you want to delete this Course? Once deleted, this
                                data
                                cannot be restored.
                            </h5>
                        </div>
                        <div class="d-flex justify-content-center mb-5">
                            <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                @click="closeDeleteCourseModal">No, Cancel
                            </ButtonTransparanComponen>
                            <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteCourse">Yes, Delete
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
</template>

<style scoped>
.hover-background {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 10px;
    border-radius: 8px;
}

.hover-background:hover {
    background-color: rgba(169, 169, 169, 0.5);
}
</style>