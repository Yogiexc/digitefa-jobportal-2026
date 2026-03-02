<script setup>
import ButtonBiru from '@/components/ButtonBiru.vue';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const isConfirmPasswordVisible = ref(false);
const isToastVisible = ref(false);
const errorMessage = ref('');
const currentEmail = ref('');
const newEmail = ref('');
const confirmPassword = ref('');
const toastMessage = ref('');
const toastClass = ref('bg-light-success');

const fetchEmail = async () => {
    try {
        await store.dispatch('fetchUserData');
        const user = store.getters.getUser;
        if (user && user.email) {
            currentEmail.value = user.email;
        } else {
            console.error('Email not found in user data.');
        }
    } catch (error) {
        console.error('Error fetching email:', error);
    }
};

const updateEmail = async () => {
    if (!newEmail.value || !confirmPassword.value) {
        errorMessage.value = 'Please fill in all fields.';
        return;
    }

    try {
        const response = await axios.post('/change-email', {
            new_email: newEmail.value,
            password: confirmPassword.value,
        });

        if (response.data.success) {
            currentEmail.value = newEmail.value;
            newEmail.value = '';
            confirmPassword.value = '';
            showToast();
        }
        showToast('Updating email successfully!', 'success');
        fetchEmail();
    } catch (error) {
        showToast('Error updated email.', 'error');
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

onMounted(async () => {
    await fetchEmail();
});
</script>

<template>
    <div class="row d-flex justify-content-between">
        <div class="col-md-6">
            <div class="fs-16 text-justify fw-normal">To update your registered email address, follow
                these steps:
                <p class="fs-16 fw-light mt-4 p-2">
                    • Enter your new email address in the provided field.<br>
                    • Ensure the new email is active and capable of receiving messages. <br>
                    • After updating, all notifications and important alerts will be sent to
                    the new email address. <br>
                    • If you do not receive the verification email, check your spam folder
                    or contact our support team for further assistance. <br>
                </p>
            </div>
        </div>
        <div class="col-md-6">
            <form class="mx-1" @submit.prevent="updateEmail">
                <div class="mb-2">
                    <label for="emailSA" class="form-label mb-1 fs-12">Current Email</label>
                    <input type="text" id="emailSA" class="form-control fs-14 h-48" placeholder="Enter your email"
                        :value="currentEmail" disabled />
                </div>
                <div class="mb-2">
                    <label for="newEmailSA" class="form-label mb-1 fs-12">New Email</label>
                    <input type="email" id="newEmailSA" v-model="newEmail" class="form-control fs-14 h-48"
                        placeholder="Enter your new email" />
                </div>
                <div class="mb-2">
                    <label for="confirm-password-field" class="form-label mb-1 fs-12">Confirm
                        Password</label>
                    <div class="password-wrapper">
                        <input :type="isConfirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword"
                            id="confirm-password-field" class="form-control fs-14 h-48 mb-2"
                            placeholder="Enter your password" />
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
                        Email
                    </ButtonBiru>
                </div>
            </form>
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
</template>