<script setup>
import { ref, onMounted } from 'vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import axios from 'axios';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { saveToDB, getFromDB } from '@/utils/indexedDB';

const isLoading = ref(false);
const email = ref('');
const password = ref('');
const role = ref('');
const rememberMe = ref(false);
const loginError = ref('');
const showPassword = ref(false);
const router = useRouter();
const store = useStore();

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const saveCredentialsToDB = async () => {
    const credentials = {
        key: 'credentials',
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value,
    };

    try {
        await saveToDB('loginData', credentials);
        console.log('Credentials saved to IndexedDB');
    } catch (error) {
        console.error('Failed to save credentials to IndexedDB:', error);
    }
};

const loginRole = async () => {
    try {
        // Simpan data login ke IndexedDB

        await store.dispatch('login', {
            email: email.value,
            password: password.value,
            role: role.value,
            remember_me: rememberMe.value
        });

        await saveCredentialsToDB();

        // Redirect berdasarkan role user
        if (store.state.user.role === 'admin') {
            router.push('/dashboard-superadmin');
        } else if (store.state.user.role === 'teacher') {
            router.push('/dashboard-teacher');
        }

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Login Successful'
        });
    } catch (error) {
        if (error.response?.data?.message === 'Your email is not verified. Please verify your email to login.') {
            Swal.fire({
                title: 'Account Verification Required',
                text: 'Please verify your account first before logging in.',
                icon: 'warning',
                confirmButtonColor: '#06A73B',
                confirmButtonText: 'Verify Now',
            }).then(() => {
                resendVerificationCode();
            });
        } else {
            loginError.value = error.response?.data?.message || 'Login failed, please try again';
        }
    }
};

const resendVerificationCode = async () => {
    isLoading.value = true;
    try {
        await axios.post('/resend-verification-code', { email: email.value });
        window.location.href = '/verification-email';
    } catch (error) {
        console.error('Error resending verification code:', error.response?.data?.message || error.message);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div>
        <LoadingScreen :isVisible="isLoading" />
        <div class="body-login-admin">
            <div class="card border-0 rounded-4 shadow w-450 bg-login-admin">
                <div class="p-4 rounded mx-1">
                    <div class="text-center">
                        <a href="/">
                            <img src="../../assets/images/logo-admin.png" alt="Logo" width="200px" />
                        </a>
                    </div>
                    <h4 class="text-center pt-4 fs-30">Login to Your Account</h4>
                    <form class="mx-3" @submit.prevent="loginRole">
                        <div v-if="loginError" class="alert alert-danger" role="alert">
                            {{ loginError }}
                        </div>
                        <div class="mb-3 mt-3">
                            <label for="exampleInputEmail1" class="form-label mb-1 fs-14">Email</label>
                            <input type="email" class="form-control h-45 rounded-3" id="exampleInputEmail1"
                                placeholder="Enter Your Email Here" v-model="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password-field" class="form-label mb-1 fs-14">Password</label>
                            <div class="password-wrapper">
                                <input :type="showPassword ? 'text' : 'password'" id="password-field"
                                    class="form-control h-45 mb-2 rounded-3" placeholder="Enter Your Password"
                                    v-model="password" required />
                                <div class="toggle-button password-toggle" @click="togglePassword">
                                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path
                                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path
                                            d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z" />
                                        <path
                                            d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                        <path
                                            d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between">
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="rememberMe">
                                <label class="form-check-label fs-14" for="exampleCheck1">Remember Me</label>
                            </div>
                            <div>
                                <a href="/reset-password" class="text-right fs-14 garis- fw-medium">Forgot
                                    Password</a>
                            </div>
                        </div>
                        <ButtonBiru class="mb-3 h-48 w-100">
                            Login
                        </ButtonBiru>
                        <p class="fs-14 text-center">Don't Have an Account? <a href="/registrasi-teacher"
                                class="garis-">Register
                                Here</a></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
