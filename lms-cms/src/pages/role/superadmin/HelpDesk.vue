<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const helpdeskData = ref([]);
const searchQuery = ref('');
const isEditModalVisible = ref(false);
const currentHelpDesk = ref(null);
const isToastVisible = ref(false);
const toastMessage = ref('');
const selectedSort = ref('Sort');
const currentPage = ref(1);
const itemsPerPage = 10;
const toastClass = ref('bg-light-success');
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const dropdownVisible = ref(false);
const dropdownPosition = ref({ top: '0px', left: '0px' });

const form = ref({
    title: '',
    answer: '',
});

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`
    };
    dropdownVisible.value = true;
    currentHelpDesk.value = item;
};

const hideDropdownMenu = () => {
    dropdownVisible.value = false;
};

const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
        hideDropdownMenu();
    }
};

const filteredData = computed(() => {
    let sortedData = [...helpdeskData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(helpdesk =>
        helpdesk.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const fetchHelpDeskData = async () => {
    try {
        const response = await axios.get('/questions');
        helpdeskData.value = response.data;
    } catch (error) {
        console.error('Error fetching Help Desk:', error);
    }
};

const saveHelpDesk = async () => {
    // isLoading.value = true;

    // try {
    //     // if (currentHelpDesk.value) {
    //     //     await axios.post(`/help-center/${currentHelpDesk.value.id_help_center}`, {
    //     //         question: currentHelpDesk.value.question,
    //     //         answer: currentHelpDesk.value.answer,
    //     //         name: currentHelpDesk.value.name,
    //     //         email: currentHelpDesk.value.email
    //     //     });
    //     //     fetchHelpDeskData();
    //     //     closeAnswerHelpCenterModal();
    //     //     showToast('Successfully answered the question!', 'success');
    //     // }
    // } catch (error) {
    //     showToast('Error answering questions:', 'error');
    // } finally {
    //     isLoading.value = false;
    // }
};

const showAnswerHelpCenterModal = () => {
    form.value.question = currentHelpDesk.value.question;
    form.value.answer = currentHelpDesk.value.answer;
    form.value.name = currentHelpDesk.value.nema;
    form.value.email = currentHelpDesk.value.email;
    hideDropdownMenu();
    isEditModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAnswerHelpCenterModal = () => {
    isEditModalVisible.value = false;
    currentHelpDesk.value = null;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    isToastVisible.value = true;
    toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};


const truncateHS = (hsText, wordLimit = 4) => {
    if (!hsText) return ''; // Tambahkan pemeriksaan untuk menangani undefined atau null
    const words = hsText.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : hsText;
};

onMounted(() => {
    fetchHelpDeskData();
});

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
    document.removeEventListener('click', handleClickOutside);
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
                            <div class="cbg-card rounded-3 p-4 border-0">
                                <h5 class="fw-light fs-16">Digitefa/Help Desk</h5>
                                <h4 class="fs-24">Help Desk</h4>

                                <div class="d-flex justify-content-between mb-3 mt-4">
                                    <div class="d-flex justify-content-start">
                                        <div class="search-input w-50 me-md-1">
                                            <input type="text" class="form-control c-border rounded-3 h-40"
                                                v-model="searchQuery" placeholder="Search" />
                                            <i class="bi bi-search"></i>
                                        </div>
                                        <select class="form-select w-30 c-border h-40 ms-2" v-model="selectedSort">
                                            <option selected>Sort</option>
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table custom-table rounded-4">
                                        <thead class="thead-custom">
                                            <tr class="ps-4">
                                                <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                <th class="fs-16 fw-light w-200">Name</th>
                                                <th class="fs-16 fw-light w-200">Email</th>
                                                <th class="fs-16 fw-light w-200">Question</th>
                                                <th class="pe-4 fs-16 fw-light w-10">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-custom">
                                            <tr v-for="(item, index) in paginatedData" :key="item.id">
                                                <td class="ps-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                                <td class="fs-16">{{ truncateHS(item.name || '', 3) }}</td>
                                                <td class="fs-16">{{ item.email }}</td>
                                                <td class="fs-16">{{ truncateHS(item.questions || '', 3) }}</td>
                                                <td class="pe-4">
                                                    <div class="dropdown-container ps-2">
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
                                                                    @click="showAnswerHelpCenterModal">
                                                                    <i class="bi bi-pencil-square me-1 fs-16"></i>
                                                                    Edit
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
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
                                                                <span class="fs-16">{{ (currentPage - 1) * itemsPerPage
                                                                    + 1 }} -
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

                    <!-- Answer Modal -->
                    <div v-if="isEditModalVisible" class="modal-backdrop" @click="closeAnswerHelpCenterModal">
                    </div>
                    <div v-if="isEditModalVisible" class="modal fade show d-block" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="false"
                        @click.self="closeAnswerHelpCenterModal">
                        <div class="modal-dialog custom-modal modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header mb--3">
                                    <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                        <i class="bi bi-pencil-square me-1"></i>Answer Help Desk
                                    </h5>
                                    <button type="button" class="btn-close fs-12 c-close"
                                        @click="closeAnswerHelpCenterModal"></button>
                                </div>
                                <hr class="mt-0">
                                <div class="px-3 mt-3 mb-2">
                                    <div class="d-flex justify-content-between mb-3">
                                        <label for="answerName" class="me-3 mt-1 fs-16 mb-0">Name</label>
                                        <input type="text" id="answerName" v-model="currentHelpDesk.name"
                                            class="form-control w-75 h-43" placeholder="Enter your name" disabled />
                                    </div>
                                    <div class="d-flex justify-content-between mb-3">
                                        <label for="answerEmail" class="me-3 mt-1 fs-16 mb-0">Email</label>
                                        <input type="text" id="answerEmail" v-model="currentHelpDesk.email"
                                            class="form-control w-75 h-43" placeholder="Enter your email" disabled />
                                    </div>
                                    <div class="d-flex justify-content-between mb-3">
                                        <label for="answerquestion" class="me-3 mt-1 fs-16 mb-0">Question</label>
                                        <input type="text" id="answerQuestion" v-model="currentHelpDesk.questions"
                                            class="form-control w-75 h-43" placeholder="Enter your question" disabled />
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center mb-5">
                                    <ButtonTransparanComponen
                                        class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                        @click="closeEditHelpDeskModal">Cancel
                                    </ButtonTransparanComponen>
                                    <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="saveHelpDesk">
                                        Save
                                    </ButtonBiru>
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
    </div>
</template>
