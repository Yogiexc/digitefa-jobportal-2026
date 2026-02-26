<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import ButtonSuccess from '@/components/ButtonSuccess.vue';

const route = useRoute();
const router = useRouter();
const password = ref('');
const confirmpassword = ref('');
const errorMessage = ref('');

const token = route.params.token;

const submitForgetPassword = async () => {
    if (!token) {
        errorMessage.value = 'Token is required.';
        return;
    }

    if (password.value !== confirmpassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    try {
        await axios.post('/reset-password', {
            token,
            password: password.value,
            password_confirmation: confirmpassword.value
        });

        Swal.fire({
            title: "Sukses!",
            text: "Password has been successfully updated.",
            icon: "success",
            confirmButtonColor: '#06A73B',
            confirmButtonText: 'Login Now',
            customClass: {
                confirmButton: 'custom-button',
            },
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                confirmButton.classList.add('custom-button');
            },
        }).then(() => {
            router.push('/login');
        });
    } catch (error) {
        errorMessage.value = error.response?.data.message || 'An error occurred.';
    }
};
</script>

<template>
    <div class="body-login-nobg">
        <div class="card border-0 rounded-3 custom-shadow2 w-500 mx-3 mx-md-0">
            <div class="p-4 rounded mx-1 text-center">
                <h3 class="fs-24 fw-semibold">Reset Your Password</h3>
                <p class="fs-16 mb-0">The password must be different</p>
                <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                <div class="card-body">
                    <form class="mx-4" @submit.prevent="submitForgetPassword">
                        <div class="mb-3 mt-2 text-start">
                            <label for="new-password-field" class="form-label mb-1 fs-14">New
                                Password</label>
                            <div class="password-wrapper">
                                <input type="password" id="new-password-field" class="form-control h-48 mb-2 rounded-3"
                                    placeholder="New Password" v-model="password" required />
                                <div class="toggle-button new-password-toggle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                        class="bi bi-eye" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path
                                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                </div>
                            </div>
                            <p class="fw-light fs-12 opacity-50">Create a new password that is at least 8
                                characters
                                long, combining uppercase and
                                lowercase letters, numbers, and special symbols (e.g., !, %, &, *).</p>
                            <div class="mb-2">
                                <label for="confirm-password-field" class="form-label mb-1 fs-14">Confirm
                                    Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="confirm-password-field"
                                        class="form-control h-48 mb-2 rounded-3" placeholder="Comfirm Password"
                                        v-model="confirmpassword" required />
                                    <div class="toggle-button confirm-password-toggle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                            <path
                                                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path
                                                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ButtonSuccess class="mb-2 h-48 w-100 fs-16 mt-3" type="submit">
                            Continue
                        </ButtonSuccess>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
