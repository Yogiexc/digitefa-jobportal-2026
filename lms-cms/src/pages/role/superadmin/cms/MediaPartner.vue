<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import ButtonTransparanComponen from '@/components/ButtonTransparanComponen.vue';
import ButtonMerah from '@/components/ButtonMerah.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const mediapartnersData = ref([]);
const imagePreview = ref(null);
// const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const currentMedia = ref(null);
const isDeleteModalVisible = ref(false);
const mediapartnerToDelete = ref(null);
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
    name: '',
    image: null,
});

const showDropdownMenu = (event, item) => {
    const buttonRect = event.target.getBoundingClientRect();
    dropdownPosition.value = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`
    };
    dropdownVisible.value = true;
    currentMedia.value = item;
};

const hideDropdownMenu = () => {
    dropdownVisible.value = false;
};

const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
        hideDropdownMenu();
    }
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    } else {
        form.value.image = null;
        imagePreview.value = null;
    }
};

const handleFileUploadEdit = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
    } else {
        form.value.image = null;
        imagePreview.value = null;
    }
};

const filteredData = computed(() => {
    let sortedData = [...mediapartnersData.value];
    if (selectedSort.value === 'newest') {
        sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort.value === 'oldest') {
        sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return sortedData.filter(media =>
        media.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
    localStorage.setItem('mediapartnersData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('mediapartnersData');
    if (storedData) {
        mediapartnersData.value = JSON.parse(storedData);
    }
};

const fetchMediaPartnerUsData = async () => {
    try {
        const response = await axios.get('/media-partners');
        const teacherMediaPartnerUrl = process.env.VUE_APP_TEACHER_MEDIA_PARTNER_URL;

        mediapartnersData.value = response.data.map((item) => ({
            ...item,
            fullImageUrl: `${teacherMediaPartnerUrl}/${item.image}`
        }));

        saveToLocalStorage(mediapartnersData.value);
    } catch (error) {
        console.error('Error fetching media partner data:', error);
    }
};

// const fetchMediaPartneIdrUsData = async () => {
//     const id = route.params.id;
//     try {
//         const response = await axios.get(`/media-partners/${id}`);
//         form.value.name = response.data.name;
//         imagePreview.value = `${axios.defaults.baseURL.replace('/api', '')}/storage/uploads/${response.data.image}`;
//     } catch (error) {
//         console.error('Error fetching data for edit:', error);
//     }
// };

const submitForm = async () => {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('name', form.value.name);
    if (form.value.image) {
        formData.append('image', form.value.image);
    }

    try {
        const response = await axios.post('/media-partners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        closeAddMediaPartneryModal();
        showToast('Add Media Partner successfully!', 'success');
        await fetchMediaPartnerUsData();
        form.value.name = '';
        form.value.image = '';

        console.log(response.data.message);
        router.push('/cms/media-partner');
    } catch (error) {
        showToast('Error Add Media Partner.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showAddMediaPartnerModal = () => {
    isModalVisible.value = true;
    form.value.name = '';
    imagePreview.value = null;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeAddMediaPartneryModal = () => {
    isModalVisible.value = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const saveMediaPartner = async () => {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('name', form.value.name);
    if (form.value.image) formData.append('image', form.value.image);

    try {
        if (currentMedia.value) {
            await axios.post(`/media-partners/${currentMedia.value.id_media_partner}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchMediaPartnerUsData();
            closeEditMediaPartnerModal();
            showToast('Updated Media Partner successfully!', 'success');
        }
    } catch (error) {
        showToast('Error updating media partner.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const showEditMediaModal = () => {
    form.value.name = currentMedia.value.name;
    form.value.image = null;
    imagePreview.value = currentMedia.value.image
        ? `${process.env.VUE_APP_TEACHER_MEDIA_PARTNER_URL}/${currentMedia.value.image}`
        : null;
    hideDropdownMenu();
    isEditModalVisible.value = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};


const closeEditMediaPartnerModal = () => {
    isEditModalVisible.value = false;
    currentMedia.value = null;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const showDeleteMediaModal = () => {
    hideDropdownMenu();
    isDeleteModalVisible.value = true;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
};

const closeDeleteMediaPartnerModal = () => {
    isDeleteModalVisible.value = false;
    mediapartnerToDelete.value = null;

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

const deleteMediaPartner = async () => {
    isLoading.value = true;

    try {
        if (currentMedia.value) {
            await axios.delete(`/media-partners/${currentMedia.value.id_media_partner}`);
            fetchMediaPartnerUsData();
            closeModal();
            showToast('Media Partner deleted successfully!', 'success');
        }
    } catch (error) {
        showToast('Error deleting Media Partner.', 'error');
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
    fetchMediaPartnerUsData();
    loadFromLocalStorage();
    // fetchMediaPartneIdrUsData();
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
            <NavbarSA />
            <!-- NAVBAR END -->

            <!-- SIDEBAR START -->
            <SidebarSA v-if="isSidebarVisible" />
            <!-- SIDEBAR END -->

            <div id="contentsa" class="dashboard-sa">
                <div class="container mt-80">
                    <div class="row">
                        <div class="col-md-12 mt-4 mt-md-0">
                            <div class="cbg-card rounded-3 p-4 border-0">
                                <h5 class="fw-light fs-16">Digitefa/CMS/Media Partner</h5>
                                <h4 class="fs-24">Media Partner</h4>
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
                                    <ButtonBiru class="fs-16 px-3 rounded-3 h-40" @click="showAddMediaPartnerModal">Add
                                        Media
                                    </ButtonBiru>
                                </div>
                                <div class="table-responsive">
                                    <table class="table custom-table rounded-4">
                                        <thead class="thead-custom">
                                            <tr class="ps-4">
                                                <th class="ps-3 fs-16 fw-light w-1">No</th>
                                                <th class="fs-16 fw-light w-200">Logo Media Partner</th>
                                                <th class="fs-16 fw-light w-400">Nama Media Partner</th>
                                                <th class="ps-4 fs-16 fw-light w-10">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody class="table-custom">
                                            <tr v-for="(item, index) in paginatedData" :key="item.id">
                                                <td class="ps-4 pt-4">{{ (currentPage - 1) * itemsPerPage + index +
                                                    1 }}</td>
                                                <td>
                                                    <img :src="item.fullImageUrl" class="rounded-4 image-tabel-sa"
                                                        alt="Media Partner Image">
                                                </td>
                                                <td class="pt-4">{{ item.name }}</td>
                                                <td class="ps-4 pt-4">
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
                                                                    @click="showEditMediaModal">
                                                                    <i class="bi bi-pencil-square me-1 fs-16"></i>
                                                                    Edit
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a class="dropdown-item fw-normal pointer"
                                                                    @click="showDeleteMediaModal">
                                                                    <i class="bi bi-trash me-1 fs-16"></i>
                                                                    Delete
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="p-1">
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
                    <!-- Add Modal -->
                    <div v-if="isModalVisible" class="modal-backdrop" @click="closeAddMediaPartneryModal"></div>
                    <div v-if="isModalVisible" class="modal fade show d-block" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="true" @click.self="closeAddMediaPartneryModal">
                        <div class="modal-dialog custom-modal modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header mb--3">
                                    <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                        <i class="bi bi-file-earmark-plus me-1"></i>Add Media Partner
                                    </h5>
                                    <button type="button" class="btn-close fs-12 c-close"
                                        @click="closeAddMediaPartneryModal"></button>
                                </div>
                                <hr class="mt-0">
                                <div class="ps-3 pe-4 mt-3 mb-2">
                                    <div class="d-flex align-items-center">
                                        <label for="mediapartnerName" class="me-5 fs-16 mb-0">Name</label>
                                        <input type="text" id="mediapartnerName"
                                            class="form-control w-100 h-45 c-border"
                                            placeholder="Enter media partner name" v-model="form.name" />
                                    </div>
                                    <div class="d-flex align-items-start mt-3">
                                        <label for="categoryName" class="fs-16 mb-0 me-60">Logo</label>
                                        <div>
                                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                                class="img-fluid mb-2 rounded-2"
                                                style="max-height: 100px; max-width: 105px; display: block;">
                                            <input type="file" id="fileInput" class="hidden" accept="image/*"
                                                @change="handleFileUpload" />
                                            <button type="button" class="btn c-border px-4 py-2"
                                                onclick="document.getElementById('fileInput').click();">
                                                Upload
                                            </button>
                                            <div class="mt-2 fs-12 opacity-75">
                                                <label>Max file size : 2Mb</label> <br>
                                                <label>Format : .jpg, .png , .jpeg</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center mb-5">
                                    <ButtonTransparanComponen
                                        class="mt-4 my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                        @click="closeAddMediaPartneryModal">Cancel</ButtonTransparanComponen>
                                    <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-30 rounded-3 fs-16" @click="submitForm">
                                        Save</ButtonBiru>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Modal -->
                    <div v-if="isEditModalVisible" class="modal-backdrop" @click="closeEditMediaPartnerModal">
                    </div>
                    <div v-if="isEditModalVisible" class="modal fade show d-block" role="dialog"
                        aria-labelledby="exampleModalLabel" aria-hidden="false"
                        @click.self="closeEditMediaPartnerModal">
                        <div class="modal-dialog custom-modal modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header mb--3">
                                    <h5 class="fs-16 fw-medium" id="exampleModalLabel">
                                        <i class="bi bi-pencil-square me-1"></i>Edit Media Partner
                                    </h5>
                                    <button type="button" class="btn-close fs-12 c-close"
                                        @click="closeEditMediaPartnerModal"></button>
                                </div>
                                <hr class="mt-0">
                                <div class="ps-3 mt-3 mb-2">
                                    <div class="d-flex align-items-center">
                                        <label for="editCategoryName" class="me-5 fs-16 mb-0">Name
                                        </label>
                                        <input type="text" id="editCategoryName" v-model="form.name"
                                            class="form-control w-66 h-45 c-border"
                                            placeholder="Enter media partner name" />
                                    </div>
                                    <div class="d-flex align-items-center mt-3">
                                        <label for="categoryName" class="fs-16 mb-0 me-60 mt--85">Logo</label>
                                        <div>
                                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                                class="img-fluid mb-2 rounded-2"
                                                style="max-height: 100px; max-width: 105px; display: block;">
                                            <input type="file" id="fileInput" class="hidden" accept="image/*"
                                                @change="handleFileUploadEdit" />
                                            <button type="button" class="btn c-border px-4 py-2 mt-2"
                                                onclick="document.getElementById('fileInput').click();">
                                                Upload
                                            </button>
                                            <div class="mt-2 fs-12 opacity-75">
                                                <label>Max file size : 2Mb</label> <br>
                                                <label>Format : .jpg, .png , .jpeg</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center mb-5">
                                    <ButtonTransparanComponen
                                        class="mt-4 my-0 h-40 w-25 me-5 rounded-3 c-border bg-white fs-16"
                                        @click="closeEditMediaPartnerModal">Cancel</ButtonTransparanComponen>
                                    <ButtonBiru class="ms-3 mt-4 my-0 h-40 w-25 rounded-3 fs-16"
                                        @click="saveMediaPartner">
                                        Save</ButtonBiru>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Modal -->
                    <div v-if="isDeleteModalVisible" class="modal-backdrop" @click="closeDeleteMediaPartnerModal">
                    </div>
                    <div v-if="isDeleteModalVisible" class="modal fade show d-block" role="dialog"
                        aria-labelledby="deleteModalLabel" aria-hidden="true"
                        @click.self="closeDeleteMediaPartnerModal">
                        <div class="modal-dialog custom-modal modal-dialog-centered">
                            <div class="modal-content pt-3">
                                <div
                                    class="modal-header mb-3 d-flex flex-column justify-content-center align-items-center text-center">
                                    <PhTrashSimple :size="50" color="#ff4c4c" />
                                    <h5 class="mb-4 mt-3 fs-16 fw-medium text-merah">Delete Media Partner</h5>
                                    <h5 class="fs-16 fw-light opacity-50">
                                        Are you sure you want to delete this media partner? Once deleted, this
                                        data
                                        cannot be restored.
                                    </h5>
                                </div>
                                <div class="d-flex justify-content-center mb-5">
                                    <ButtonTransparanComponen
                                        class="my-0 h-40 w-30 me-5 rounded-3 c-border bg-white fs-16"
                                        @click="closeDeleteMediaPartnerModal">No, Cancel
                                    </ButtonTransparanComponen>
                                    <ButtonMerah class="ms-3 my-0 h-40 w-30 rounded-3 fs-16"
                                        @click="deleteMediaPartner">
                                        Yes, Delete</ButtonMerah>
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