<script setup>
import ButtonBiru from '@/components/ButtonBiru.vue';
import { ref } from 'vue';
import axios from 'axios';

const isSidebarVisible = ref(true);
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const isToastVisible = ref(false);
const errorMessage = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Function to handle password update
const updatePassword = async () => {
    try {
        // Reset pesan error sebelum validasi dan request
        errorMessage.value = '';

        // Periksa apakah password baru dan konfirmasi password cocok
        if (newPassword.value !== confirmPassword.value) {
            errorMessage.value = 'New password and confirmation do not match.';
            return;
        }

        // Kirim request ke server
        const response = await axios.post('/update-password', {
            old_password: currentPassword.value,
            password: newPassword.value,
            password_confirmation: confirmPassword.value,
        });

        // Tanggapi hasil dari server
        if (response.data.success) {
            showToast();
            // Reset the fields
            currentPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
        } else {
            errorMessage.value = 'Failed to update password: ' + response.data.message;
        }
    } catch (error) {
        console.error('Error updating password:', error);
        errorMessage.value = 'Error updating password. Please try again.';
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
</script>

<template>
    <div class="row d-flex justify-content-between">
        <div class="col-md-6">
            <div class="fs-16 text-justify fw-medium">To keep your account secure, please
                follow the
                steps
                below to
                update
                your
                password. Make sure your new password meets the security requirements to
                protect
                your
                information from unauthorized access.
                <p class="fs-16 fw-normal mt-1 p-2">• Enter your current password in the
                    appropriate
                    field.<br>
                    • Create a new password that includes: <br>
                    &emsp;• At least 8 characters<br>
                    &emsp;• One uppercase letter (A-Z) <br>
                    &emsp;• One lowercase letter (a-z) <br>
                    &emsp;• One number (0-9) <br>
                    &emsp;• One special character (e.g., !@#$%^&*)</p>
            </div>
        </div>
        <div class="col-md-6">
            <form class="mx-1" @submit.prevent="updatePassword">
                <div class="mb-2">
                    <label for="password-field" class="form-label mb-1 fs-12">Current
                        Password</label>
                    <div class="password-wrapper">
                        <input :type="isCurrentPasswordVisible ? 'text' : 'password'" v-model="currentPassword"
                            id="password-field" class="form-control fs-14 h-48 mb-2 rounded-3"
                            placeholder="Current Password" />
                        <div class="toggle-button password-toggle"
                            @click="isCurrentPasswordVisible = !isCurrentPasswordVisible">
                            <svg v-if="!isCurrentPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                class="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                <path
                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5s1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="mb-2">
                    <label for="new-password-field" class="form-label mb-1 fs-12">New
                        Password</label>
                    <div class="password-wrapper">
                        <input :type="isNewPasswordVisible ? 'text' : 'password'" v-model="newPassword"
                            id="new-password-field" class="form-control fs-14 h-48 mb-2" placeholder="New Password" />
                        <div class="toggle-button new-password-toggle"
                            @click="isNewPasswordVisible = !isNewPasswordVisible">
                            <svg v-if="!isNewPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                class="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                <path
                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="mb-2">
                    <label for="confirm-password-field" class="form-label mb-1 fs-12">Confirm
                        New Password</label>
                    <div class="password-wrapper">
                        <input :type="isConfirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword"
                            id="confirm-password-field" class="form-control fs-14 h-48 mb-2"
                            placeholder="Confirm New Password" />
                        <div class="toggle-button confirm-password-toggle"
                            @click="isConfirmPasswordVisible = !isConfirmPasswordVisible">
                            <svg v-if="!isConfirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                class="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                <path
                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div v-if="errorMessage" class="alert alert-danger fs-12">
                    {{ errorMessage }}
                </div>
                <div class="d-flex justify-content-end">
                    <ButtonBiru class="rounded-3 my-3 fs-14 h-43">Change
                        Password
                    </ButtonBiru>
                </div>
            </form>
        </div>
    </div>
    <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
        <div v-if="isToastVisible" class="toast align-items-center text-white bg-light-success border-0 show"
            role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    Edit Update successfully!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>