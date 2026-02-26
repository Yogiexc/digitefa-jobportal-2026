<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const teacherData = ref([]);
const router = useRouter();
const searchQuery = ref('');
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const currentTeacher = ref(null);
const isDeleteModalVisible = ref(false);
const teacherToDelete = ref(null);
const isToastVisible = ref(false);
const toastMessage = ref('');
const selectedSort = ref('Sort');
const selectedStatus = ref('Status');
const currentPage = ref(1);
const currentItem = ref(null);
const itemsPerPage = 10;
const toastClass = ref('bg-light-success');
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const dropdownVisible = ref(false);
const dropdownPosition = ref({ top: '0px', left: '0px' });

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'teacher',
    status: 'approved',
    note: '',
});

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`
    };
    dropdownVisible.value = true;
    currentTeacher.value = item;
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

const filteredData = computed(() => {
    let sortedData = [...teacherData.value];

    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (selectedStatus.value === 'verified') {
        sortedData = sortedData.filter(student => student.is_verified);
    } else if (selectedStatus.value === 'unverified') {
        sortedData = sortedData.filter(student => !student.is_verified);
    }

    return sortedData.filter(student =>
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.value.slice(startIndex, endIndex);
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

const saveToLocalStorage = (data) => {
    localStorage.setItem('teacherData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('teacherData');
    if (storedData) {
        teacherData.value = JSON.parse(storedData);
    }
};

const fetchUsersData = async () => {
    try {
        const response = await axios.get('/teachers');
        const teacherProfileUrl = process.env.VUE_APP_TEACHER_PROFILE_URL;
        teacherData.value = response.data.teachers.map(user => ({
            ...user,
            teacher: {
                ...user.teacher,
                photo_profile: user.teacher?.photo_profile ? `${teacherProfileUrl}/${user.teacher.photo_profile}` : require('@assets/images/avatar.png'),
            }
        }));
        saveToLocalStorage(teacherData.value);
    } catch (error) {
        console.error('Failed to fetch teachers:', error);
    }
};

const submitForm = async () => {
    isLoading.value = true;

    try {
        form.value.role = 'teacher';

        const response = await axios.post('/register', form.value);
        closeAddTeacherModal();
        showToast('Add Teacher successfully!', 'success');

        await fetchUsersData();

        router.push('/user-manajemen/teacher');
    } catch (error) {
        showToast('Error Add teacher.', 'error');
        closeAddTeacherModal();
    } finally {
        isLoading.value = false;
    }
};


const showAddTeacherModal = () => {
    form.value.name = '';
    form.value.email = '';
    form.value.password = '';
    form.value.password_confirmation = '';
    form.value.role = '';
    isModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddTeacherModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const goToEdit = (id) => {
    router.push(`/user-manajemen/teacher/detail-teacher/${id}`);
};


const saveApproveTeacher = async () => {
    isLoading.value = true;
    if (!currentTeacher.value) return;
    const id = currentTeacher.value.id_user;
    try {
        const payload = {
            status: form.value.status,
        };

        if (form.value.status === 'rejected') {
            payload.note = form.value.note;
        }

        await axios.post(`/teacher-status/${id}`, payload);
        showToast('Updated Status Teacher successfully!', 'success');
        closeApproveTeacherModal();
        fetchUsersData();
    } catch (error) {
        showToast('Error updated status teacher.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showApproveTeacherModal = () => {
    hideDropdownMenu();
    isEditModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeApproveTeacherModal = () => {
    isEditModalVisible.value = false;
    currentTeacher.value = null;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const showDeleteTeacherModal = () => {
    hideDropdownMenu();
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteTeacherModal = () => {
    isDeleteModalVisible.value = false;
    teacherToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteTeacher = async () => {
    isLoading.value = true;

    try {
        if (currentTeacher.value) {
            await axios.delete(`/users/${currentTeacher.value.id_user}`);
            fetchUsersData();
            closeModal();
            showToast('Teacher deleted successfully!', 'success');
        }
    } catch (error) {
        showToast('Error deleting Teacher.', 'error');
    } finally {
        isLoading.value = false;
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

const closeModal = () => {
    isDeleteModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

onMounted(() => {
    fetchUsersData();
    loadFromLocalStorage();
});

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    checkWindowSize();
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

        <div class="navbg-sa">
            <!-- NAVBAR START -->
            <NavbarAdmin />
            <!-- NAVBAR END -->

            <!-- SIDEBAR START -->
            <SidebarSA v-if="isSidebarVisible" />
            <!-- SIDEBAR END -->

            <div id="contentsa" class="dashboard-sa">
                <div class="container mt-80">
                    <div class="row">
                        <div class="col-md-12 mt-4 mt-md-0">
                            <div class="cbg-card rounded-2 p-4 border-0">
                                <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Teacher</h5>
                                <h4 class="fs-24">Teacher</h4>
                                <div class="d-flex justify-content-between mb-3 mt-4">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control rounded-3 h-40 c-border"
                                                v-model="searchQuery" placeholder="Search" />
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <select class="form-select w-25 c-border h-40 ms-2" v-model="selectedStatus">
                                            <option selected>Status</option>
                                            <option value="verified">Verified</option>
                                            <option value="unverified">Unverified</option>
                                        </select>
                                        <select class="form-select w-25 c-border h-40 ms-2" v-model="selectedSort">
                                            <option selected>Sort</option>
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                    <div>
                                        <ButtonBiru class="ms-3 h-40 px-3 rounded-3 fs-16" @click="showAddTeacherModal">
                                            Add Teacher
                                        </ButtonBiru>
                                    </div>
                                </div>
                                <div class="col-md-12 mt-md-0">
                                    <div class="table-responsive">
                                        <table class="table custom-table rounded-4">
                                            <thead class="thead-custom">
                                                <tr class="ps-4">
                                                    <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                    <th class="fs-16 fw-light w-400">Teacher</th>
                                                    <th class="fs-16 fw-light">Addrress</th>
                                                    <th class="fs-16 fw-light">Affiliate</th>
                                                    <th class="fs-16 fw-light w-110">Status</th>
                                                    <th class="fs-16 fw-light">Level</th>
                                                    <th class="ps-4 fs-16 fw-light w-10">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-custom">
                                                <tr cla v-for="(item, index) in paginatedData" :key="item.id">
                                                    <td class="ps-4 pt-20">{{ (currentPage - 1) * itemsPerPage + index +
                                                        1
                                                        }}</td>
                                                    <td>
                                                        <div class="d-flex justify-content-start align-items-center gap-2">
                                                            <div class="">
                                                                <img v-if="item.teacher.photo_profile"
                                                                    :src="item.teacher.photo_profile"
                                                                    alt="Profile Image" class="profile-image">
                                                            </div>
                                                            <div class="profile-info">
                                                                {{ item.name }}<br>
                                                                {{ item.email }}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="pt-20">{{ item.teacher.address }}</td>
                                                    <td class="pt-20">{{ item.teacher.affiliation }}</td>
                                                    <td class="pt-20">{{ item.teacher.status }}</td>
                                                    <td class="pt-20">{{ item.teacher.teacher_level.name }}</td>
                                                    <td class="ps-4 pt-20">
                                                        <div class="dropdown-container ps-2">
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
                                                                        @click="currentItem && goToEdit(currentItem.id_user)">
                                                                        <i class="bi bi-eye me-1 fs-16"></i>
                                                                        Detail
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a class="dropdown-item fw-normal fs-16 pointer"
                                                                        @click="showApproveTeacherModal">
                                                                        <i class="bi bi-check-square me-1 fs-16"></i>
                                                                        Approve
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a class="dropdown-item fw-normal pointer"
                                                                        @click="showDeleteTeacherModal">
                                                                        <i class="bi bi-trash me-1 fs-16"></i>
                                                                        Delete
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="7" class="p-1">
                                                        <nav>
                                                            <div class="d-flex justify-content-between">
                                                                <div class="d-flex align-items-center">
                                                                    <label for="itemsPerPage" class="me-2">Items per
                                                                        page:</label>
                                                                    <select id="itemsPerPage"
                                                                        class="form-select w-auto bg-none border-0"
                                                                        v-model="itemsPerPage">
                                                                        <option value="10">10</option>
                                                                        <option value="20">20</option>
                                                                        <option value="50">50</option>
                                                                    </select>
                                                                    <span class="fs-16">{{ (currentPage - 1) *
                                                                        itemsPerPage
                                                                        + 1
                                                                        }} -
                                                                        {{
                                                                            Math.min(currentPage * itemsPerPage,
                                                                                filteredData.length) }}
                                                                        of
                                                                        {{ filteredData.length }} items</span>
                                                                </div>
                                                                <ul
                                                                    class="pagination custom-pagination justify-content-end mt-1">
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

                <!-- Add Modal -->
                <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddTeacherModal"></div>
                <div v-if="isModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true" @click.self="closeAddTeacherModal">
                    <div class="modal-dialog custom-modal modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header mb--3">
                                <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                    <i class="bi bi-file-earmark-plus me-1"></i>Add Teacher
                                </h5>
                                <button type="button" class="btn-close fs-12 c-close"
                                    @click="closeAddTeacherModal"></button>
                            </div>
                            <hr class="mt-0">
                            <div class="px-3 mb-2">
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="userName" class="me-3 fs-16 mb-0 mt-2">Name</label>
                                    <input type="text" id="userName" class="form-control w-66 h-43"
                                        placeholder="Enter teacher name" v-model="form.name" />
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="emailName" class="me-3 fs-16 mb-0 mt-2">Email</label>
                                    <input type="email" id="emailName" class="form-control w-66 h-43"
                                        placeholder="Enter email name" v-model="form.email" />
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="passwordName" class="me-3 fs-16 mb-0 mt-2">Password</label>
                                    <input type="password" id="passwordName" class="form-control w-66 h-43"
                                        placeholder="Enter password name" v-model="form.password" />
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="passwordName" class=" fs-16 mb-0 mt-2">Confirm Password</label>
                                    <input type="password" id="passwordName" class="form-control w-66 h-43"
                                        placeholder="Confirm password" v-model="form.password_confirmation" />
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen
                                    class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeAddTeacherModal">Cancel</ButtonTransparanComponen>
                                <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="submitForm">
                                    Save</ButtonBiru>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Modal -->
                <div v-if="isEditModalVisible" class="modal-backdrop" @click="closeApproveTeacherModal">
                </div>
                <div v-if="isEditModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="false" @click.self="closeApproveTeacherModal">
                    <div class="modal-dialog custom-modal modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header mb--3">
                                <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                    <i class="bi bi-pencil-square me-1"></i>Edit Approve
                                </h5>
                                <button type="button" class="btn-close fs-12 c-close"
                                    @click="closeApproveTeacherModal"></button>
                            </div>
                            <hr class="mt-0">
                            <div class="px-3 mt-3 mb-2">
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="teacherName" class="me-3 fs-16 mb-0 mt-2">Status Approve</label>
                                    <select v-model="form.status" class="form-select w-66 fs-14 h-40 ms-2">
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div v-if="form.status === 'rejected'" class="d-flex justify-content-between mt-3">
                                    <label for="userEmail" class="me-3 fs-16 mb-0 mt-2">Note</label>
                                    <textarea id="questionName" class="form-control fs-14 w-66"
                                        placeholder="Enter your question here" rows="3" v-model="form.note"></textarea>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen
                                    class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeApproveTeacherModal">Cancel</ButtonTransparanComponen>
                                <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16"
                                    @click="saveApproveTeacher">
                                    Save
                                </ButtonBiru>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delete Modal -->
                <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteTeacherModal">
                </div>
                <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="deleteModalLabel" aria-hidden="false" @click.self="closeDeleteTeacherModal">
                    <div class="modal-dialog custom-modal modal-dialog-centered">
                        <div class="modal-content pt-3">
                            <div
                                class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                                <PhTrashSimple :size="50" color="#ff4c4c" />
                                <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Teacher</h5>
                                <h5 class="fs-16 fw-light opacity-50">
                                    Are you sure you want to delete this teacher? Once deleted, this
                                    data
                                    cannot be restored.
                                </h5>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeDeleteTeacherModal">No, Cancel
                                </ButtonTransparanComponen>
                                <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteTeacher">Yes,
                                    Delete</ButtonMerah>
                            </div>
                        </div>
                    </div>
                </div>
                <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
                    <div v-if="isToastVisible"
                        :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']"
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
</template>

<style>
.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>