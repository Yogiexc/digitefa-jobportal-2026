<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const requestData = ref([]);
const searchQuery = ref('');
const itemsPerPage = ref(10);
const errorMessage = ref('');
const currentPage = ref(1);
const selectedSort = ref('newest');
const isApproveModalVisible = ref(false);
const dropdownPosition = ref({ top: '0px', left: '0px' });
const selectedRequestId = ref(null);

const form = ref({
    status: 'approved',
    note: '',
});

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`,
    };
    item.dropdownVisible = true; // Set dropdown visibility for the item
};

const hideDropdownMenu = () => {
    requestData.value.forEach(item => (item.dropdownVisible = false)); // Hide all dropdowns
};

const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
        hideDropdownMenu();
    }
};

const fetchRequestData = async () => {
    const id = route.params.id;
    try {
        const response = await axios.get(`/teacher-update-request/${id}`);
        if (response.data.success) {
            requestData.value = response.data.data.map(item => ({
                ...item,
                dropdownVisible: false, // Initialize dropdown visibility per item
            }));
        } else {
            errorMessage.value = response.data.message;
        }
    } catch (error) {
        errorMessage.value = 'Failed to fetch request data.';
        console.error('Error:', error);
    }
};

const filteredData = computed(() => {
    let sortedData = [...requestData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(category =>
        category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredData.value.slice(startIndex, startIndex + itemsPerPage.value);
});

const showEditAprovedModal = (requestId) => {
    selectedRequestId.value = requestId;
    hideDropdownMenu();
    isApproveModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeApproveModal = () => {
    isApproveModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const approveRequest = async () => {
    if (!confirm('Are you sure you want to approve this request?')) return;

    try {
        const response = await axios.post(`/teacher-update-status/${selectedRequestId.value}`, {
            status: form.value.status,
            note: form.value.status === 'rejected' ? form.value.note : '',
        });
        if (response.data.success) {
            alert('Request status updated successfully.');
            fetchRequestData();
            closeApproveModal();
        } else {
            errorMessage.value = response.data.message;
        }
    } catch (error) {
        errorMessage.value = 'Failed to update request status.';
        console.error('Error:', error);
    }
};

onMounted(() => {
    fetchRequestData();
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', hideDropdownMenu);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('scroll', hideDropdownMenu);
});
</script>

<template>
    <div class="d-flex justify-content-between mb-3">
        <div class="d-flex justify-content-start">
            <div class="search-input w-50 me-md-1">
                <input type="text" class="form-control rounded-3 h-40 c-border" v-model="searchQuery" placeholder="Search" />
                <i class="bi bi-search cmt-1"></i>
            </div>
            <select class="form-select w-30 c-border h-40 ms-2" v-model="selectedSort">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
            </select>
        </div>
    </div>

    <div class="col-md-12">
        <div class="table-responsive">
            <table class="table custom-table rounded-4">
                <thead class="thead-custom">
                    <tr class="ps-4">
                        <th class="ps-3 fs-16 fw-light w-1">No</th>
                        <th class="fs-16 fw-light w-300">Type</th>
                        <th class="fs-16 fw-light w-200">Created</th>
                        <th class="fs-16 fw-light w-150">Status</th>
                        <th class="fs-16 fw-light w-10 ps-3">Action</th>
                    </tr>
                </thead>
                <tbody class="table-custom">
                    <tr v-for="(request, index) in paginatedData" :key="request.id_teacher_update_request">
                        <td>{{ index + 1 }}</td>
                        <td>{{ request.type || 'N/A' }}</td>
                        <td>{{ new Date(request.created_at).toLocaleDateString() }}</td>
                        <td>{{ request.status }}</td>
                        <td class="pt-2 pe-4">
                            <div class="dropdown-container ps-3">
                                <button class="btn border-0 dropdown-toggle" type="button" @click="showDropdownMenu($event, request)">
                                    <p class="bi bi-three-dots-vertical" style="margin-bottom: -8px; margin-top: -5px;"></p>
                                </button>
                                <ul v-if="request.dropdownVisible" class="fixed-dropdown dropdown-menu" style="display: block" :style="{ top: dropdownPosition.top, left: dropdownPosition.left }">
                                    <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                    <li>
                                        <a class="dropdown-item fw-normal fs-16" href="#">
                                            <i class="bi bi-eye me-1 fs-16"></i>
                                            Detail
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item fw-normal" href="#" @click.prevent="showEditAprovedModal(request.id_teacher_update_request)">
                                            <i class="bi bi-check-square me-1 fs-16"></i>
                                            Approve
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Approve Modal -->
        <div v-if="isApproveModalVisible" class="modal-backdrop" @click="closeApproveModal"></div>
        <div v-if="isApproveModalVisible" class="modal fade show d-block" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="false" @click.self="closeApproveModal">
            <div class="modal-dialog custom-modal modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header mb--3">
                        <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                            <i class="bi bi-pencil-square me-1"></i>Approve
                        </h5>
                        <button type="button" class="btn-close fs-12 c-close" @click="closeApproveModal"></button>
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
                            <textarea id="questionName" class="form-control fs-14 w-66" placeholder="Enter your question here" rows="3" v-model="form.note"></textarea>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mb-5">
                        <ButtonTransparanComponen class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16" @click="closeApproveModal">Cancel</ButtonTransparanComponen>
                        <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="approveRequest">Save</ButtonBiru>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
