<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { saveToDB, getAllFromDB } from '@/utils/indexedDB';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const faqData = ref([]);
const router = useRouter();
const searchQuery = ref('');
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const currentFaq = ref(null);
const isDeleteModalVisible = ref(false);
const faqToDelete = ref(null);
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
    currentFaq.value = item;
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
    let sortedData = [...faqData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(faq =>
        faq.title.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const sanitizeData = (data) => {
    return JSON.parse(JSON.stringify(data));
};

const saveToIndexedDB = async (data) => {
    try {
        const sanitizedData = sanitizeData(data);
        await saveToDB('FAQData', sanitizedData);
        console.log('FAQ data saved to IndexedDB:', sanitizedData);
    } catch (error) {
        console.error('Failed to save FAQ data to IndexedDB:', error);
    }
};


const loadFromIndexedDB = async () => {
    try {
        const storedData = await getAllFromDB('FAQData');
        if (storedData.length > 0) {
            faqData.value = storedData;
            console.log('FAQ data loaded from IndexedDB:', storedData);
        } else {
            console.log('No FAQ data found in IndexedDB.');
        }
    } catch (error) {
        console.error('Failed to load FAQ data from IndexedDB:', error);
    }
};


const fetchFaqData = async () => {
    try {
        const response = await axios.get('/faqs');
        faqData.value = response.data;
        await saveToIndexedDB(faqData.value);
    } catch (error) {
        console.error('Error fetching Faq:', error);
    }
};

const submitForm = async () => {
    isLoading.value = true;

    try {
        const response = await axios.post('/faqs', form.value);
        console.log(response.data.message);
        closeAddFaqModal();
        showToast('Add Faq successfully!', 'success');

        form.value.title = '';
        form.value.answer = '';
        await fetchFaqData();

        router.push('/cms/faq-admin');
    } catch (error) {
        showToast('Error Add Faq.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showAddFaqModal = () => {
    isModalVisible.value = true;
    form.value.title = '';
    form.value.answer = '';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddFaqModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const saveFaq = async () => {
    isLoading.value = true;

    try {
        if (currentFaq.value) {
            await axios.post(`/faqs/${currentFaq.value.id_faq}`, {
                title: currentFaq.value.title,
                answer: currentFaq.value.answer
            });
            await fetchFaqData();
            closeEditFaqModal();
            showToast('Updated Faq successfully!', 'success');
        }
    } catch (error) {
        showToast('Error Updated Faq.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showEditFaqModal = () => {
    form.value.title = currentFaq.value.title;
    form.value.answer = currentFaq.value.answer;
    hideDropdownMenu();
    isEditModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeEditFaqModal = () => {
    isEditModalVisible.value = false;
    currentFaq.value = null;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const showDeleteFaqModal = () => {
    hideDropdownMenu();
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteFaqModal = () => {
    isDeleteModalVisible.value = false;
    faqToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteFaq = async () => {
    isLoading.value = true;

    try {
        if (currentFaq.value) {
            await axios.delete(`/faqs/${currentFaq.value.id_faq}`);
            fetchFaqData();
            closeModal();
            showToast('Faq deleted successfully!', 'success');
        }
    } catch (error) {
        showToast('Error deleting Faq.', 'error');
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

const truncateFAQ = (faqText, wordLimit = 10) => {
    const words = faqText.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : faqText;
};

const formatDate = (dateString) => {
    let date;
    if (dateString.includes("T")) {
        date = new Date(dateString);
    } else if (dateString.includes(",")) {
        date = new Date(dateString);
    } else {
        const parts = dateString.split(" ");
        const monthMap = {
            "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
            "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
            "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
        };
        const day = parts[1];
        const month = monthMap[parts[2]];
        const year = parts[3];
        const time = parts[4];

        const formattedDateString = `${year}-${month}-${day}T${time.replace('AM', '').replace('PM', '')}:00`;
        date = new Date(formattedDateString);
    }

    if (isNaN(date)) {
        return "Invalid Date";
    }

    const options = {
        weekday: 'short',
        day: 'numeric',  
        month: 'short',
        year: 'numeric', 
        hour: 'numeric',  
        minute: 'numeric', 
        hour12: true    
    };

    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate.replace(",", "");
};


onMounted( async () => {
    fetchFaqData();
    await loadFromIndexedDB();
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
                        <div class="cbg-card rounded-3 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/CMS/FAQ</h5>
                            <h4 class="fs-24">FAQ</h4>

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
                                <ButtonBiru class="fs-16 px-3 rounded-3 h-40" @click="showAddFaqModal">Add Faq
                                </ButtonBiru>
                            </div>

                            <div class="table-responsive">
                                <table class="table custom-table rounded-4">
                                    <thead class="thead-custom">
                                        <tr class="ps-4">
                                            <th class="ps-3 fs-16 fw-light w-1">No</th>
                                            <th class="fs-16 fw-light w-400">Question</th>
                                            <th class="fs-16 fw-light w-400">Answer</th>
                                            <th class="fs-16 fw-light w-310">Date & Time</th>
                                            <th class="pe-4 fs-16 fw-light w-10">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="table-custom">
                                        <tr v-for="(item, index) in paginatedData" :key="item.id">
                                            <td class="ps-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                            <td class="fs-16">{{ truncateFAQ(item.title, 4) }}</td>
                                            <td class="fs-16">{{ truncateFAQ(item.answer, 4) }}</td>
                                            <td class="fs-16">{{ formatDate(item.created_at) }}</td>
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
                                                                @click="showEditFaqModal">
                                                                <i class="bi bi-pencil-square me-1 fs-16"></i>
                                                                Edit
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item fw-normal pointer"
                                                                @click="showDeleteFaqModal">
                                                                <i class="bi bi-trash me-1 fs-16"></i>
                                                                Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="5" class="p-1">
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
                                                        <ul class="pagination custom-pagination justify-content-end">
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

                <!-- Add Modal -->
                <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddFaqModal"></div>
                <div v-if="isModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="true" @click.self="closeAddFaqModal">
                    <div class="modal-dialog custom-modal modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header mb--3">
                                <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                    <i class="bi bi-file-earmark-plus me-1"></i>Add Faq
                                </h5>
                                <button type="button" class="btn-close fs-12 c-close"
                                    @click="closeAddFaqModal"></button>
                            </div>
                            <hr class="mt-0">
                            <div class="px-4 mt-3 mb-2">
                                <div class="d-flex justify-content-between">
                                    <label for="questionName" class="me-3 mt-1 fs-16 mb-0">Question</label>
                                    <textarea id="questionName" class="form-control w-75"
                                        placeholder="Enter your question here" rows="3" v-model="form.title"></textarea>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="answerName" class="fs-16 mb-0 mt-1">Answer</label>
                                    <textarea id="answerName" class="form-control w-75"
                                        placeholder="Enter the answer to this question" rows="3"
                                        v-model="form.answer"></textarea>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen
                                    class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeAddFaqModal">Cancel</ButtonTransparanComponen>
                                <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="submitForm">
                                    Save</ButtonBiru>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Modal -->
                <div v-if="isEditModalVisible" class="modal-backdrop" @click="closeEditFaqModal">
                </div>
                <div v-if="isEditModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="exampleModalLabel" aria-hidden="false" @click.self="closeEditFaqModal">
                    <div class="modal-dialog custom-modal modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header mb--3">
                                <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                    <i class="bi bi-pencil-square me-1"></i>Edit Faq
                                </h5>
                                <button type="button" class="btn-close fs-12 c-close"
                                    @click="closeEditFaqModal"></button>
                            </div>
                            <hr class="mt-0">
                            <div class="px-3 mt-3 mb-2">
                                <div class="d-flex justify-content-between">
                                    <label for="questionName" class="me-3 mt-1 fs-16 mb-0">Question</label>
                                    <textarea id="questionName" class="form-control w-75"
                                        placeholder="Enter your question here" rows="3"
                                        v-model="currentFaq.title"></textarea>
                                </div>
                                <div class="d-flex justify-content-between mt-3">
                                    <label for="answerName" class="fs-16 mb-0 mt-1">Answer</label>
                                    <textarea id="answerName" class="form-control w-75"
                                        placeholder="Enter the answer to this question" rows="3"
                                        v-model="currentFaq.answer"></textarea>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen
                                    class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeEditFaqModal">Cancel
                                </ButtonTransparanComponen>
                                <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="saveFaq">Save
                                </ButtonBiru>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delete Modal -->
                <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteFaqModal">
                </div>
                <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog"
                    aria-labelledby="deleteModalLabel" aria-hidden="true" @click.self="closeDeleteFaqModal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content pt-3">
                            <div
                                class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                                <PhTrashSimple :size="50" color="#ff4c4c" />
                                <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Faq
                                </h5>
                                <h5 class="fs-16 fw-light opacity-50">
                                    Are you sure you want to delete this faq? Once deleted,
                                    this data
                                    cannot be restored.
                                </h5>
                            </div>
                            <div class="d-flex justify-content-center mb-5">
                                <ButtonTransparanComponen class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                    @click="closeDeleteFaqModal">No, Cancel
                                </ButtonTransparanComponen>
                                <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16" @click="deleteFaq">Yes,
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
</div>
</template>
