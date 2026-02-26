<script setup>
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const isEditing = ref(false);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const form = ref({
    phone_number: '',
    tiktok: '',
    instagram: '',
    x: '',
    youtube: '',
    linkedin: '',
});

const saveToLocalStorage = (data) => {
    localStorage.setItem('socialMediaData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('socialMediaData');
    if (storedData) {
        Object.assign(form.value, JSON.parse(storedData));
    }
};

const fetchSocialMediaData = async () => {
    try {
        const response = await axios.get('/social-media');
        Object.assign(form.value, response.data);
        saveToLocalStorage(form.value);
    } catch (error) {
        console.error('Error fetching Social Media data:', error);
    }
};

const saveSosmed = async () => {
    isLoading.value = true;

    try {
        await axios.post('/social-media/update', form.value);
        showToast('Social media updated successfully!', 'success');
        isEditing.value = false;
        saveToLocalStorage(form.value);
    } catch (error) {
        showToast('Error updating Social Media.', 'error');
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

const toggleEditMode = async () => {
    if (isEditing.value) {
        await saveSosmed();
    } else {
        isEditing.value = true;
    }
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchSocialMediaData();
    loadFromLocalStorage();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />
    
    <div class="navbg-sa">
        <NavbarAdmin />
        <SidebarSA v-if="isSidebarVisible" />
        <div id="contentsa" class="dashboard-sa">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <!-- Tampilan Awal (Display Mode) -->
                        <div>
                            <div class="card rounded-3 p-4 border-0">
                                <h5 class="fw-light fs-16">Digitefa/CMS/Social Media</h5>
                                <h4 class="fs-24">Social Media</h4>
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru @click="toggleEditMode" class="ms-3 mb-4 h-45 px-3 rounded-3 fs-16">
                                        <i class="bi bi-pencil-square me-1 fs-16"></i>
                                        {{ isEditing ? 'Save' : 'Edit' }} Social Media
                                    </ButtonBiru>
                                </div>
                                <div v-if="!isEditing" class="card bordersa rounded-3 pb-4">
                                    <div class="ps-3 pe-4 mt-3 mb-2">
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">No Handphone</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="No Handphone" v-model="form.phone_number" disabled />
                                        </div>
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">Link Tiktok</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="Link Tiktok" v-model="form.tiktok" disabled />
                                        </div>
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">Link Instagram</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="Link Instagram" v-model="form.instagram" disabled />
                                        </div>
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">Link X</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="Link X" v-model="form.x" disabled />
                                        </div>
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">Link Youtube</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="Link Youtube" v-model="form.youtube" disabled />
                                        </div>
                                        <div class="d-flex justify-content-between mt-3">
                                            <label for="categoryName" class="fs-16 mb-0 mt-2">Link Linkedln</label>
                                            <input type="text" id="categoryName" class="form-control c-border w-75 h-43"
                                                placeholder="Link Linkdln" v-model="form.linkedin" disabled />
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="card bordersa rounded-3 pb-4">
                                    <form @submit.prevent="saveSosmed">
                                        <div class="ps-3 pe-4 mt-3 mb-2">
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">No Handphone</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="No Handphone"
                                                    v-model="form.phone_number" />
                                            </div>
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">Link Tiktok</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="Link Tiktok"
                                                    v-model="form.tiktok" />
                                            </div>
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">Link Instagram</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="Link Instagram"
                                                    v-model="form.instagram" />
                                            </div>
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">Link X</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="Link X"
                                                    v-model="form.x" />
                                            </div>
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">Link Youtube</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="Link Youtube"
                                                    v-model="form.youtube" />
                                            </div>
                                            <div class="d-flex justify-content-between mt-3">
                                                <label for="categoryName" class="fs-16 mb-0 mt-2">Link Linkedln</label>
                                                <input type="text" id="categoryName"
                                                    class="form-control c-border w-75 h-43" placeholder="Link Linkdln"
                                                    v-model="form.linkedin" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Toast Notification -->
                        <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
                            <div v-if="isToastVisible"
                                :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']"
                                role="alert">
                                <div class="d-flex">
                                    <div class="toast-body">
                                        {{ toastMessage }}
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto"
                                        @click="closeToast" aria-label="Close"></button>
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
