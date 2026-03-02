<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import NavbarSA from '@/layout/NavbarSA.vue';
import SidebarSA from '@/layout/SidebarSA.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';

const form = ref({
    email: '',
    name: '',
    phone: '',
    address: '',
    date_of_birth: null,
    image: '',
});

const isSidebarVisible = ref(true);
const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const imagePreview = ref(null);
const isHovered = ref(false);
const studentData = ref([]);
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const toggleEditMode = () => {
    if (isEditing.value) {
        submitFormEdit();
    }
    isEditing.value = !isEditing.value;
};

const triggerFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
};

const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const saveToLocalStorage = (data) => {
    localStorage.setItem('studentData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('studentData');
    if (storedData) {
        studentData.value = JSON.parse(storedData);
    }
};

const fetchStudentData = async () => {
    const id = route.params.id;
    try {
        const response = await axios.get(`/users/${id}`);
        const baseURL = axios.defaults.baseURL.replace('/api', '');
        const userData = response.data.user;
        form.value.email = userData.email;
        form.value.name = userData.name;
        form.value.phone = userData.student.phone;
        form.value.address = userData.student.address;
        form.value.date_of_birth = userData.student.date_of_birth;
        form.value.image = userData.student.image
            ? `${baseURL}/uploads/Students Profile/${userData.student.image}`
            : require('@assets/images/my-profile.png');
        saveToLocalStorage(studentData.value);
    } catch (error) {
        console.error('Error fetching data for edit:', error);
    }
};

const submitFormEdit = async () => {
    const id = route.params.id;
    try {
        const formData = new FormData();
        formData.append('email', form.value.email);
        formData.append('name', form.value.name);
        formData.append('phone', form.value.phone);
        formData.append('address', form.value.address);
        formData.append('date_of_birth', form.value.date_of_birth);
        if (imagePreview.value) {
            formData.append('image', document.getElementById('fileInput').files[0]);
        }

        await axios.post(`/students/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        saveToLocalStorage(studentData.value);
        showToast('Student updating successfully!', 'success');
        router.push('/user-manajemen/student');
    } catch (error) {
        showToast('Error updating student.', 'error');
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

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchStudentData();
    loadFromLocalStorage();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})
</script>

<template>
    <div class="navbg-sa">
        <NavbarSA />
        <SidebarSA v-if="isSidebarVisible" />

        <div id="contentsa" class="dashboard-sa">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/User Manajemen/Teacher/Personal Data</h5>
                            <h4 class="fs-24">Personal Data</h4>
                            <div class="card p-3 bordersa mt-2">
                                <div v-if="isEditing">
                                    <div class="d-flex justify-content-start">
                                        <div class="position-relative me-3" @mouseenter="isHovered = true"
                                            @mouseleave="isHovered = false">
                                            <img v-if="imagePreview || form.image" :src="imagePreview || form.image"
                                                alt="Profile" class="rounded-circle profil-teacher"
                                                style="width: 100px; height: 100px;" />
                                            <img v-else :src="require('@assets/images/my-profile.png')" alt="Profile"
                                                class="rounded-circle profil-teacher"
                                                style="width: 100px; height: 100px;" />
                                            <input type="file" id="fileInput" hidden accept="image/*"
                                                @change="handleFile" />
                                            <div v-show="isHovered">
                                                <div class="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                                                    style="width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%;">
                                                    <button type="button" class="btn p-0 text-white" @click="triggerFileInput">
                                                        <i class="bi bi-pencil-square fs-5"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-4 fs-12 opacity-75">
                                            <label>Max file size : 2Mb</label> <br>
                                            <label>Format : .jpg, .png , .jpeg</label>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <img v-if="form.image" :src="form.image" alt="Profile" class="rounded-circle mb-2"
                                        style="width: 100px; height: 100px;">
                                    <span v-else>No Profile Picture</span>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <ButtonBiru @click="toggleEditMode" class="ms-3 h-40 px-3 rounded-3 fs-16">
                                        <i class="bi bi-pencil-square me-1 fs-16"></i>
                                        {{ isEditing ? 'Save' : 'Edit' }}
                                    </ButtonBiru>
                                </div>
                                <div v-if="isEditing">
                                    <form @submit.prevent="submitFormEdit">
                                        <div class="row mt-3">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                                                    <input type="text" id="name" class="form-control h-45 fs-14"
                                                        placeholder="Enter your name here" v-model="form.name">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                                                    <input type="text" id="nohp" class="form-control h-45 fs-14"
                                                        placeholder="Enter your no telepon here" v-model="form.phone">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="address" class="form-label mb-0 fs-16">Address</label>
                                                    <input type="text" id="address" class="form-control h-45 fs-14"
                                                        placeholder="Enter your address here" v-model="form.address">
                                                </div>
                                            </div>
                                            <div class="col-md-6 pd">
                                                <div class="mb-3">
                                                    <label for="email" class="form-label mb-0 fs-16">Email</label>
                                                    <input type="email" id="email" class="form-control h-45 fs-14"
                                                        placeholder="Surakarta" v-model="form.email">
                                                </div>
                                                <div class="mb-3 mt-17">
                                                    <label for="name6" class="form-label mb-0 fs-16">Date of
                                                        birth</label>
                                                    <input type="date" id="nohp"
                                                        class="form-control opacity-75 h-45 fs-14"
                                                        v-model="form.date_of_birth">
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div v-else>
                                    <div class="row mt-3">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="name" class="form-label mb-0 fs-16">Full Name</label>
                                                <input type="text" id="name" class="form-control h-45 fs-14"
                                                    v-model="form.name" disabled>
                                            </div>
                                            <div class="mb-3">
                                                <label for="nohp" class="form-label mb-0 fs-16">No.Telp</label>
                                                <input type="text" id="nohp" class="form-control h-45 fs-14"
                                                    v-model="form.phone" disabled>
                                            </div>
                                            <div class="mb-3">
                                                <label for="address" class="form-label mb-0 fs-16">Address</label>
                                                <input type="text" id="address" class="form-control h-45 fs-14"
                                                    v-model="form.address" disabled>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="email" class="form-label mb-0 fs-16">Email</label>
                                                <input type="email" id="email" class="form-control h-45 fs-14"
                                                    v-model="form.email" disabled>
                                            </div>
                                            <div class="mb-3 mt-17">
                                                <label for="dob" class="form-label mb-0 fs-16">Date of birth</label>
                                                <input type="text" id="nohp" class="form-control h-45 fs-14"
                                                    v-model="form.date_of_birth" disabled>
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
</template>
