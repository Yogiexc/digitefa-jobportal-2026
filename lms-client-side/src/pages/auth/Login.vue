<script setup>
import IconLeft from '@/components/IconLeft.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // Import Vuex store
import Swal from 'sweetalert2';

// Form inputs
const email = ref('');
const password = ref('');
const role = ref('student');
const rememberMe = ref(false);
const loginError = ref('');

const router = useRouter();
const store = useStore();
// Fungsi untuk login
const loginStudent = async () => {
    try {
        await store.dispatch('login', {
            email: email.value,
            password: password.value,
            role: role.value,
            remember_me: rememberMe.value
        });
        router.push('/overview');
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
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
                title: "Account Verification Required",
                text: "Please verify your account first before logging in.",
                icon: "warning",
                confirmButtonColor: '#06A73B',
                confirmButtonText: 'Verify Now',
                customClass: {
                    confirmButton: 'custom-button',
                },
                didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
                    confirmButton.classList.add('custom-button');
                },
            }).then(() => {
                window.location.href = '/verification-email';
            });
        } else {
            loginError.value = error.response?.data?.message || 'Login failed, please try again';
        }
    }
};
</script>

<template>
    <a href="/" class="icon-dark">
        <IconLeft />
    </a>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 d-none d-md-block left-image">
                <div class="text-center h-100 d-flex justify-content-center align-items-center mt--85">
                    <div>
                        <h1 class="fw-bold fs-36">One Step Closer to Your Dreams</h1>
                        <p>A free E-Learning service to help you become an expert</p>
                    </div>
                </div>

            </div>
            <div class="col-md-6 right-image custom-flex">
                <div class="card border-0 rounded-4 shadow w-450 bg-login">
                    <div class="p-4 rounded mx-1">
                        <div class="text-center">
                            <a href="/">
                                <img src="../../assets/images/logo-navbar.png" alt="Logo" width="200px" />
                            </a>
                        </div>
                        <h4 class="text-center pt-4 fs-30">Login to Your Account</h4>
                        <form class="mx-3" @submit.prevent="loginStudent">
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
                                    <input :type="isPasswordVisible ? 'text' : 'password'" id="password-field"
                                        class="form-control h-45 mb-2 rounded-3" placeholder="Enter Your Password"
                                        v-model="password" required />
                                    <div class="toggle-button password-toggle">
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
                            <ButtonSuccess class="mb-3 h-48 w-100">
                                Login
                            </ButtonSuccess>
                            <p class="fs-14 text-center">Don't Have an Account? <a href="/registrasi"
                                    class="garis-">Register Here</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>
