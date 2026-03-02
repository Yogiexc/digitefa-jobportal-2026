<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import NavbarAdmin from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import LoadingScreen from '@/components/LoadingScreen.vue';

const isLoading = ref(false);
const isSidebarVisible = ref(true);
const isEditing = ref(false);
const quill = ref(null);
const title = ref('');
const description = ref('');
const image = ref(null);
const content = ref('');
const imagePreview = ref(null);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

const saveToLocalStorage = () => {
    const data = {
        title: title.value,
        description: description.value,
        content: content.value,
        imagePreview: imagePreview.value,
    };
    localStorage.setItem('aboutUsData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('aboutUsData');
    if (storedData) {
        const data = JSON.parse(storedData);
        title.value = data.title || '';
        description.value = data.description || '';
        content.value = data.content || '';
        imagePreview.value = data.imagePreview || null;
    }
};

const fetchAboutUsContent = async () => {
    try {
        const response = await axios.get('/about-us');
        const teacherAboutUrl = process.env.VUE_APP_TEACHER_ABOUT_URL;
        title.value = response.data.title;
        description.value = response.data.description;
        content.value = response.data.content;
        if (response.data.image) {
            imagePreview.value = `${teacherAboutUrl}/${response.data.image}`;
        }
        saveToLocalStorage();
    } catch (error) {
        console.error("Error fetching About Us content:", error);
    }
};


// Menyimpan data About Us
const saveChanges = async () => {
    isLoading.value = true;

    const editedContent = getModifiedContent();
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('content', editedContent);
    if (image.value) {
        formData.append('image', image.value);
    }

    try {
        await axios.post('/about-us/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        content.value = editedContent;
        isEditing.value = false;

        // Panggil fetch untuk memuat ulang data terbaru
        fetchAboutUsContent();

        // Hapus instance Quill setelah keluar dari mode edit
        if (quill.value) {
            quill.value = null;
        }
        saveToLocalStorage();
        showToast('About Us updated successfully!', 'success');

    } catch (error) {
        showToast('Error updating About Us.', 'error');
    } finally {
        isLoading.value = false;
    }
};


// Memproses file image
const handleFileUploadEdit = (event) => {
    const file = event.target.files[0];
    if (file) {
        image.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};

onMounted(() => {
    fetchAboutUsContent();
    loadFromLocalStorage();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

watch(isEditing, async (newValue) => {
    if (newValue) {
        await nextTick();

        // Periksa apakah Quill sudah ada, jika ya, hapus instance sebelumnya
        if (quill.value) {
            quill.value = null; // Menghapus instance sebelumnya
        }

        const fontSizeArr = [];
        for (let i = 8; i <= 72; i += 2) {
            fontSizeArr.push(`${i}px`);
        }

        const Size = Quill.import('attributors/style/size');
        Size.whitelist = fontSizeArr;
        Quill.register(Size, true);

        const toolbarOptions = [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image'],
            [{ font: [] }, { size: fontSizeArr }],
            [{ background: [] }, { color: [] }],
            [{ script: 'sub' }],
            [{ script: 'super' }],
            ['clean'],
        ];

        const editorElement = document.querySelector('#editor');
        if (editorElement) {
            quill.value = new Quill(editorElement, {
                modules: {
                    toolbar: toolbarOptions,
                },
                theme: 'snow',
            });
            quill.value.root.innerHTML = content.value; // Set initial content
        }
    } else {
        // Hapus instance Quill saat keluar dari mode edit
        if (quill.value) {
            quill.value = null;
            saveToLocalStorage();
        }
    }
});

const getModifiedContent = () => {
    let modifiedContent = quill.value.root.innerHTML;
    // Convert <ol> to <ul>
    modifiedContent = modifiedContent.replace(/<ol>/g, '<ul>').replace(/<\/ol>/g, '</ul>');
    return modifiedContent;
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

const toggleEditMode = () => {
    if (isEditing.value) {
        saveChanges();
    }
    isEditing.value = !isEditing.value;
};
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
                            <h5 class="fw-light fs-16">Digitefa/CMS/About Us Content</h5>
                            <h4 class="fs-24">About Us Content</h4>

                            <div class="d-flex justify-content-end">
                                <ButtonBiru @click="toggleEditMode" class="ms-3 mb-4 h-45 px-3 rounded-3 fs-16">
                                    <i class="bi bi-pencil-square me-1 fs-16"></i>
                                    {{ isEditing ? 'Save' : 'Edit' }} About Us
                                </ButtonBiru>
                            </div>

                            <!-- Tampilan Biasa -->
                            <div v-if="!isEditing" class="card bordersa rounded-3 pb-4">
                                <div class="ps-3 pe-4 mt-3 mb-2">
                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="title" class="fs-16 mb-0 mt-2">Title</label>
                                        <input type="text" id="title" class="form-control c-border w-75 h-43"
                                            :value="title" disabled />
                                    </div>

                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="description" class="fs-16 mb-0 mt-2">Short Description</label>
                                        <input type="text" id="description" class="form-control c-border w-75 h-43"
                                            :value="description" disabled />
                                    </div>

                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="content" class="fs-16 mb-0 mt-2">Content</label>
                                        <div class="form-control w-75 card bordersa p-4" v-html="content"></div>
                                    </div>

                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="image" class="fs-16 mb-0 mt-2">Image</label>
                                        <div class="form-control w-75 c-border image-preview-container">
                                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                                class="img-fluid rounded-2">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Form Edit -->
                            <form v-else @submit.prevent="saveChanges" class="card bordersa rounded-3 pb-4">
                                <div class="ps-3 pe-4 mt-3 mb-2">
                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="title" class="fs-16 mb-0 mt-2">Title</label>
                                        <input type="text" id="title" class="form-control c-border w-75 h-43"
                                            v-model="title" />
                                    </div>
                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="description" class="fs-16 mb-0 mt-2">Short Description</label>
                                        <input type="text" id="description" class="form-control c-border w-75 h-43"
                                            v-model="description" />
                                    </div>
                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="content" class="fs-16 mb-0 mt-2">Content</label>
                                        <div class="form-control w-75 card bordersa p-4">
                                            <div id="editor"></div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between mt-3">
                                        <label for="image" class="fs-16 mb-0 mt-2">Image</label>
                                        <div class="form-control w-75 c-border image-preview-container">
                                            <img v-if="imagePreview" :src="imagePreview" alt="Image Preview"
                                                class="img-fluid rounded-2">
                                            <input type="file" id="fileInput" class="form-control mt-3" accept="image/*"
                                                @change="handleFileUploadEdit" />
                                        </div>
                                    </div>
                                </div>
                            </form>

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


<style>
.image-preview-container {
    max-width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
}

.image-preview-container img {
    height: auto;
    max-height: 150px;
}

/* Customize toolbar labels for font sizes */
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='8px']::before {
    content: '8';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
    content: '10';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
    content: '12';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
    content: '14';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
    content: '16';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
    content: '18';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
    content: '20';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='22px']::before {
    content: '22';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
    content: '24';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='26px']::before {
    content: '26';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='28px']::before {
    content: '28';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='30px']::before {
    content: '30';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='32px']::before {
    content: '32';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='34px']::before {
    content: '34';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='36px']::before {
    content: '36';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='38px']::before {
    content: '38';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='40px']::before {
    content: '40';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='42px']::before {
    content: '42';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='44px']::before {
    content: '44';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='46px']::before {
    content: '46';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='48px']::before {
    content: '48';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='50px']::before {
    content: '50';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='52px']::before {
    content: '52';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='54px']::before {
    content: '54';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='56px']::before {
    content: '56';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='58px']::before {
    content: '58';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='60px']::before {
    content: '60';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='62px']::before {
    content: '62';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='64px']::before {
    content: '64';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='66px']::before {
    content: '66';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='68px']::before {
    content: '68';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='70px']::before {
    content: '70';
}

.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='72px']::before {
    content: '72';
}
</style>