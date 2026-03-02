<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import axios from 'axios';

const profileImage = ref('');
const imageFile = ref(null);
const studentData = ref([]);
const isToastVisible = ref(false);

// Initialize user data with defaults, including student data
const user = ref({
    name: '',
    email: '',
    student: {
        date_of_birth: '',
        address: '',
        phone: '',
        image: ''
    }
});

const saveToLocalStorage = (data) => {
    localStorage.setItem('studentData', JSON.stringify(data));
};

const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('studentData');
    if (storedData) {
        studentData.value = JSON.parse(storedData);
    }
};

const fetchUsersData = async () => {
    try {
        const response = await axios.get('/user', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const studentProfileUrl = process.env.VUE_APP_STUDENT_PROFILE_URL;
        const userResponse = response.data.user;
        user.value = {
            name: userResponse.name || '',
            email: userResponse.email || '',
            student: {
                date_of_birth: userResponse.student?.date_of_birth || '',
                address: userResponse.student?.address || '',
                phone: userResponse.student?.phone || '',
                image: userResponse.student?.image
                    ? `${studentProfileUrl}/${userResponse.student.image}`
                    : require('@/assets/images/my-profile.png'),
            }
        };
        console.log('Profile Image URL:', user.value.student.image);

    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
};



// Function to handle file input change
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file; // Store the file
        const reader = new FileReader();
        reader.onload = () => {
            profileImage.value = reader.result; // Show the preview
        };
        reader.readAsDataURL(file);
    }
};

const saveProfile = async () => {
    try {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const studentProfileUrl = process.env.VUE_APP_STUDENT_PROFILE_URL;

        if (savedUser && savedUser.student) {
            const userId = savedUser.id_user;

            const formData = new FormData();
            formData.append('name', user.value.name);
            formData.append('date_of_birth', user.value.student.date_of_birth);
            formData.append('address', user.value.student.address);
            formData.append('phone', user.value.student.phone);
            formData.append('email', user.value.email);
            if (imageFile.value) {
                formData.append('image', imageFile.value);
            }

            const response = await axios.post(`/students/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.student) {
                const updatedStudent = {
                    ...savedUser.student,
                    date_of_birth: response.data.student.date_of_birth,
                    address: response.data.student.address,
                    phone: response.data.student.phone,
                    image: response.data.student.image
                };

                const updatedUser = {
                    ...savedUser,
                    name: user.value.name,
                    student: updatedStudent
                };

                profileImage.value = updatedStudent.image
                    ? `${studentProfileUrl}/${updatedStudent.image}`
                    : require('@/assets/images/my-profile.png');

                localStorage.setItem('user', JSON.stringify(updatedUser));
                showToast();
            } else {
                alert('Failed to retrieve updated data from server.');
            }
            fetchUsersData();
        } else {
            alert('User or student data not found.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
};

const showToast = () => {
    isToastVisible.value = true;
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

onMounted(() => {
    fetchUsersData();
    loadFromLocalStorage();
});
</script>
<template>
    <div class="row no">
        <div class="col-md-4 mb-4">
            <div class="card rounded-4 p-4 border-0">
                <div
                    class="d-flex align-items-center justify-content-center justify-content-md-center justify-content-sm-between flex-sm-row flex-md-column">
                    <img :src="user.student.image" alt="Profile Image"
                        class="rounded-circle mb-3 ms-2 me-4 size-profil">

                    <div class="mt-md-2">
                        <div class="my-2">
                            <input class="form-control fs-12" type="file" id="formFile" @change="handleFileChange">
                        </div>
                        <div>
                            <p class="fs-12 mb-0 opacity-50">Max file size : 2Mb</p>
                            <p class="fs-12 opacity-50 mb-1">Format : .jpg, .png , .jpeg</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-8">
            <div class="card rounded-4 p-4 border-0">
                <form @submit.prevent="saveProfile">
                    <div class="row mb-3 mt-3 align-items-center">
                        <div class="col-sm-3">
                            <h6 class="mb-0 fs-16">Full Name</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                            <input type="text" class="form-control h-48 fs-16" v-model="user.name">
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-sm-3">
                            <h6 class="mb-0 fs-16">Email</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                            <input type="email" class="form-control h-48 fs-16" v-model="user.email" disabled>
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-sm-3">
                            <h6 class="mb-0 fs-16">Tanggal lahir</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                            <input type="date" class="form-control h-48 fs-16 fs-16"
                                v-model="user.student.date_of_birth">
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-sm-3">
                            <h6 class="mb-0 fs-16">Alamat</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                            <input type="text" class="form-control h-48 fs-16" v-model="user.student.address"
                                placeholder="alamat">
                        </div>
                    </div>
                    <div class="row mb-3 align-items-center">
                        <div class="col-sm-3">
                            <h6 class="mb-0 fs-16">Nomor Telpon</h6>
                        </div>
                        <div class="col-sm-9 text-secondary">
                            <input type="text" class="form-control h-48 fs-16" v-model="user.student.phone"
                                placeholder="nomor telpon">
                        </div>
                    </div>
                    <div class="text-center">
                        <ButtonSuccess class="w-25 fs-12 h-40" type="submit">Save
                        </ButtonSuccess>
                    </div>
                </form>
            </div>
        </div>
        <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
            <div v-if="isToastVisible" class="toast align-items-center text-white bg-light-success border-0 show"
                role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        Profil Update successfully!
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                        aria-label="Close"></button>
                </div>
            </div>
        </div>
    </div>
</template>