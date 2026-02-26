<script setup>
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const isEditing = ref(false);
const quill = ref(null);
const content = ref('');
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const saveToLocalStorage = (data) => {
    localStorage.setItem('TermCondition', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('TermCondition');
    if (storedData) {
        content.value = JSON.parse(storedData);
    }
};

const fetchTermConditionContent = async () => {
    try {
        const response = await axios.get('/term-condition');
        content.value = response.data.content;
        saveToLocalStorage(content.value);
    } catch (error) {
        console.error("Error fetching Terms & Conditions content:", error);
    }
};

const saveChanges = async () => {
    isLoading.value = true;

    const editedContent = quill.value ? quill.value.root.innerHTML : content.value;
    const formData = new FormData();
    formData.append('content', editedContent);

    try {
        await axios.post('/term-condition/update', formData);
        content.value = editedContent;
        saveToLocalStorage(content.value);
        isEditing.value = false;
        showToast('Terms & Conditions updated successfully!', 'success');
    } catch (error) {
        showToast('Error updating Terms & Conditions.', 'error');
    } finally {
        isLoading.value = false;
    }
};

const initializeQuillEditor = async () => {
    await nextTick();
    const editorElement = document.querySelector('#editor');
    if (editorElement) {
        quill.value = new Quill(editorElement, {
            modules: {
                toolbar: [
                    [{ 'font': [] }],
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
            },
            theme: 'snow',
        });
        quill.value.root.innerHTML = content.value;
    }
};

watch(isEditing, async (newValue) => {
    if (newValue) {
        initializeQuillEditor();
    } else if (quill.value) {
        quill.value = null;
    }
});

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

const toggleEditMode = () => {
    if (isEditing.value) {
        saveChanges();
    }
    isEditing.value = !isEditing.value;
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

onMounted(() => {
    loadFromLocalStorage();
    fetchTermConditionContent();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
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
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/CMS/Terms & Conditions</h5>
                            <h4 class="fs-24">Terms & Conditions</h4>

                            <div class="d-flex justify-content-end">
                                <ButtonBiru @click="toggleEditMode" class="ms-3 mb-4 h-45 px-3 rounded-3 fs-16">
                                    <i class="bi bi-pencil-square me-1 fs-16"></i>
                                    {{ isEditing ? 'Save' : 'Edit' }} Terms & Conditions
                                </ButtonBiru>
                            </div>

                            <!-- Display mode -->
                            <div v-if="!isEditing" class="card bordersa rounded-3 pb-4">
                                <div class="ps-3 pe-4 mt-3 mb-2">
                                    <div class="p-4" v-html="content"></div>
                                </div>
                            </div>

                            <!-- Edit mode -->
                            <div v-else class="card bordersa rounded-3 pb-4">
                                <div class="ps-3 pe-4 mt-3 mb-2">
                                    <div class="p-4">
                                        <div id="editor"></div>
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
</div>
</template>