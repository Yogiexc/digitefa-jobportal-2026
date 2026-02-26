<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen.vue';

const router = useRouter();
const isLoading = ref(false);
const route = useRoute();
const isSidebarVisible = ref(true);
const searchQuery = ref('');
const selectedSort = ref('Newest');
const isDeleteModalVisible = ref(false);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const dropdownVisible = ref(false);
const dropdownPosition = ref({ top: '0px', left: '0px' });
const batchData = ref([]);
const currentBatch = ref(null);
const toastClass = ref('bg-light-success');
const isToastVisible = ref(false);
const toastMessage = ref('');
const currentItem = ref(null);

const courseId = route.params.id;

const form = ref({
    capacity: '',
    start_date: '',
    end_date: '',
    status: '',
});

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`
    };
    dropdownVisible.value = true;
    currentBatch.value = item;
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
    let sortedData = [...batchData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(item =>
        item.start_date && item.start_date.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const fetchCourseBatchData = async () => {
    try {
        const courseId = route.params.id;
        const response = await axios.get(`/course-batches/course/${courseId}`);
        batchData.value = response.data;
    } catch (error) {
        console.error('Error fetching batch data:', error);
    }
};


const submitForm = async () => {
    isLoading.value = true;

    try {
        form.value.id_course = courseId;
        const response = await axios.post('/course-batches', form.value, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        await fetchCourseBatchData();
        closeAddBatchModal();
        showToast('Add Batch successfully!', 'success');
    } catch (error) {
        showToast('Error Add Batch!', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showAddBatchModal = () => {
    form.value.start_date = '';
    form.value.end_date = '';
    form.value.capacity = '';
    form.value.status = '';
    isModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddBatchModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const updatedBatch = async () => {
    isLoading.value = true;

    try {
        if (currentBatch.value) {
            await axios.post(`/course-batches/${currentBatch.value.id_course_batch}`, {
                id_course: courseId,
                capacity: currentBatch.value.capacity,
                start_date: currentBatch.value.start_date,
                end_date: currentBatch.value.end_date,
                status: currentBatch.value.status,
            });
            await fetchCourseBatchData();
            closeEditBatchModal();
            showToast('Updating Batch successfully!', 'success');
        }
    } catch (error) {
        showToast('Error updated batch!', 'error');
    } finally {
        isLoading.value = false;
    }
}

const showEditBatchModal = () => {
    form.value.capacity = currentBatch.value.capacity;
    form.value.start_date = currentBatch.value.start_date;
    form.value.end_date = currentBatch.value.end_date;
    form.value.status = currentBatch.value.status;
    hideDropdownMenu();
    isEditModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeEditBatchModal = () => {
    isEditModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteBatch = async () => {
    isLoading.value = true;

    try {
        if (currentBatch.value) {
            await axios.delete(`/course-batches/${currentBatch.value.id_course_batch}`);
            fetchCourseBatchData();
            closeDeleteBatchModal();
            showToast('Deleted batch successfully!', 'success');
        }
    } catch (error) {
        showToast('Error deleting batch!', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showDeleteBatchModal = () => {
    hideDropdownMenu();
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteBatchModal = () => {
    isDeleteModalVisible.value = false;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const goDetailCourse = (id) => {
    router.push(`/course-teacher/log-activity/${id}`);
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

onMounted(() => {
    fetchCourseBatchData();
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
                            <div class="cbg-card rounded-3 p-4 border-0">
                                <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Batch</h5>
                                <h4 class="fs-24">Batch</h4>

                                <div class="d-flex justify-content-between mb-3 mt-4">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control c-border rounded-3 h-40"
                                                v-model="searchQuery" placeholder="Search" />
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <select class="form-select w-30 c-border h-40 ms-2" v-model="selectedSort">
                                            <option selected>Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                    <ButtonBiru class="fs-16 px-3 rounded-3 h-40" @click="showAddBatchModal">Add Batch
                                    </ButtonBiru>
                                </div>

                                <div class="table-responsive">
                                    <table class="table custom-table rounded-4">
                                        <thead class="thead-custom">
                                            <tr class="ps-4">
                                                <th class="ps-3 fs-16 fw-medium w-1">No</th>
                                                <th class="fs-16 fw-light w-200">Start batch</th>
                                                <th class="fs-16 fw-light w-200">End batch</th>
                                                <th class="fs-16 fw-light w-170">Capacity</th>
                                                <th class="fs-16 fw-light w-170">Status</th>
                                                <th class="ps-1 fs-16 fw-light w-10">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-custom">
                                            <tr v-for="(item, index) in paginatedData" :key="item.id">
                                                <td class="ps-4 pt-3">{{ (currentPage - 1) * itemsPerPage + index +
                                                    1 }}</td>
                                                <td class="pt-3">{{ item.start_date }}</td>
                                                <td class="pt-3">{{ item.end_date }}</td>
                                                <td class="pt-3">{{ item.capacity }}</td>
                                                <td class="pt-3">{{ item.status }}</td>
                                                <td class="pt-2">
                                                    <div class="dropdown-container ps-1">
                                                        <button class="btn border-0 dropdown-toggle" type="button"
                                                            @click="showDropdownMenu($event, item)">
                                                            <p class="bi bi-three-dots-vertical"
                                                                style="margin-bottom: -8px; margin-top: -5px;"></p>
                                                        </button>
                                                        <ul v-if="dropdownVisible" class="fixed-dropdown dropdown-menu"
                                                            style="display: block"
                                                            :style="{ top: dropdownPosition.top, left: dropdownPosition.left }">
                                                            <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                            <li>
                                                                <a class="dropdown-item fw-normal fs-16 pointer"
                                                                @click="currentItem && goDetailCourse(currentItem.id_course_batch)">
                                                                    <i class="bi bi-eye me-1 fs-16"></i>
                                                                    Detail
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item fw-normal fs-16 pointer"
                                                                    @click="showEditBatchModal">
                                                                    <i class="bi bi-file-earmark-plus me-1 fs-16"></i>
                                                                    Edit
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item fw-normal pointer"
                                                                    @click="showDeleteBatchModal">
                                                                    <i class="bi bi-trash me-1 fs-16"></i>
                                                                    Delete
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="paginatedData.length === 0">
                                                <td colspan="6" class="text-center">No data available</td>
                                            </tr>
                                            <tr>
                                                <td colspan="6" class="p-1">
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
                                                                    itemsPerPage + 1 }} -
                                                                    {{
                                                                        Math.min(currentPage * itemsPerPage,
                                                                            filteredData.length) }}
                                                                    of
                                                                    {{ filteredData.length }} items</span>
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

            <!-- Add Modal -->
            <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddBatchModal"></div>
            <div v-if="isModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="false" @click.self="closeAddBatchModal">
                <div class="modal-dialog custom-modal modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header mb--3">
                            <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                <i class="bi bi-file-earmark-plus me-1"></i>Add Batch
                            </h5>
                            <button type="button" class="btn-close fs-12 c-close" @click="closeAddBatchModal"></button>
                        </div>
                        <hr class="mt-0">
                        <div class="px-3 mt-3 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="startBatch" class="me-3 mt-2 fs-16 mb-0">Start Batch</label>
                                <input type="date" id="startBatch" class="form-control opacity-75 w-66 h-43"
                                    v-model="form.start_date" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="endBatch" class="me-3 mt-2 fs-16 mb-0">End Batch</label>
                                <input type="date" id="endBatch" class="form-control opacity-75 w-66 h-43"
                                    v-model="form.end_date" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="capacityName" class="me-3 mt-2 fs-16 mb-0">Capacity</label>
                                <input type="text" id="capacityName" class="form-control w-66 h-43"
                                    placeholder="Enter the capacity" v-model="form.capacity" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="capacityName" class="me-3 mt-2 fs-16 mb-0">Status</label>
                                <select v-model="form.status" class="form-select w-66 fs-14 h-40 ms-2">
                                    <option disabled selected value="">Pilih Status</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Close</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center mb-5">
                            <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                @click="closeAddBatchModal">Cancel</ButtonTransparanComponen>
                            <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="submitForm">
                                Save</ButtonBiru>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div v-if="isEditModalVisible" class="modal-backdrop" @click="closeEditBatchModal">
            </div>
            <div v-if="isEditModalVisible" class="modal fade show d-block" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="false" @click.self="closeEditBatchModal">
                <div class="modal-dialog custom-modal modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header mb--3">
                            <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                <i class="bi bi-pencil-square me-1"></i>Edit Batch
                            </h5>
                            <button type="button" class="btn-close fs-12 c-close" @click="closeEditBatchModal"></button>
                        </div>
                        <hr class="mt-0">
                        <div class="px-3 mt-3 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="startBatch" class="me-3 mt-2 fs-16 mb-0">Start Batch</label>
                                <input type="date" id="startBatch" class="form-control opacity-75 w-66 h-43"
                                    v-model="currentBatch.start_date" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="endBatch" class="me-3 mt-2 fs-16 mb-0">End Batch</label>
                                <input type="date" id="endBatch" class="form-control opacity-75 w-66 h-43"
                                    v-model="currentBatch.end_date" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="capacityName" class="me-3 mt-2 fs-16 mb-0">Capacity</label>
                                <input type="text" id="capacityName" class="form-control w-66 h-43"
                                    placeholder="Enter the capacity" v-model="currentBatch.capacity" />
                            </div>
                        </div>
                        <div class="px-3 mt-2 mb-2">
                            <div class="d-flex justify-content-between">
                                <label for="capacityName" class="me-3 mt-2 fs-16 mb-0">Status</label>
                                <select v-model="currentBatch.status" class="form-select w-66 fs-14 h-40 ms-2">
                                    <option value="open">Open</option>
                                    <option value="closed">Close</option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center mb-5">
                            <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                @click="closeEditBatchModal">Cancel
                            </ButtonTransparanComponen>
                            <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="updatedBatch">
                                Save
                            </ButtonBiru>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Modal -->
            <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteBatchModal">
            </div>
            <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog"
                aria-labelledby="deleteModalLabel" aria-hidden="true" @click.self="closeDeleteBatchModal">
                <div class="modal-dialog custom-modal modal-dialog-centered">
                    <div class="modal-content pt-3">
                        <div
                            class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                            <PhTrashSimple :size="50" color="#ff4c4c" />
                            <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Batch
                            </h5>
                            <h5 class="fs-16 fw-light opacity-50">
                                Are you sure you want to delete this batch? Once deleted,
                                this data
                                cannot be restored.
                            </h5>
                        </div>
                        <div class="d-flex justify-content-center mb-5">
                            <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                @click="closeDeleteBatchModal">No, Cancel
                            </ButtonTransparanComponen>
                            <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteBatch">Yes,
                                Delete</ButtonMerah>
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
    </div>
</template>