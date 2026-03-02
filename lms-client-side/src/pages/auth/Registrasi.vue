<script setup>
import IconLeft from '@/components/IconLeft.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import ButtonRed from '@/components/ButtonRed.vue';
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmpassword = ref('');
const role = ref('student');
const agreeToTermsChecked = ref(false);
const termsError = ref('');
const registrationError = ref('');
const router = useRouter();
const showModal = ref(false);
const isAgreed = ref(false);
const showAgreeButton = ref(false);
const content = ref('');

const fetchTermConditionContent = async () => {
    try {
        const response = await axios.get('/term-condition');
        content.value = response.data.content;
    } catch (error) {
        console.error("Error fetching Terms & Conditions content:", error);
    }
};

const submitForm = async () => {
    termsError.value = '';
    registrationError.value = '';

    // Validasi checkbox "I agree to the terms"
    if (!agreeToTermsChecked.value) {
        termsError.value = 'You must agree to the terms and conditions.';
        return;
    }

    try {
        localStorage.setItem('name', name.value);
        localStorage.setItem('email', email.value);
        localStorage.setItem('role', role.value);
        // Kirim data ke API untuk registrasi
        await axios.post('/register', {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: confirmpassword.value,
            role: role.value,
        });
        router.push('/verification-email');
    } catch (error) {
        if (error.response?.data?.message) {
            registrationError.value = error.response.data.message;
        } else if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            registrationError.value = Object.values(errors).flat().join(', ');
        } else {
            registrationError.value = 'Registration failed. Please try again.';
        }
    }
};

const toggleModal = () => {
    showModal.value = !showModal.value;
    if (!showModal.value) {
        showAgreeButton.value = false;
    }
};

const handleScroll = debounce((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        showAgreeButton.value = true;
    } else {
        showAgreeButton.value = false;
    }
}, 100);

const agreeToTerms = () => {
    isAgreed.value = true;
    agreeToTermsChecked.value = true;
    toggleModal();
};

onMounted(() => {
    fetchTermConditionContent();
});
</script>

<template>
    <a href="/" class="icon-back">
        <IconLeft />
    </a>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 d-none d-md-block left-image-registrasi">
                <div class="text-center h-100 d-flex justify-content-center align-items-center mt--85">
                    <div>
                        <h1 class="fw-bold fs-36">One Step Closer to Your Dreams</h1>
                        <p>A free E-Learning service to help you become an expert</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 right-image custom-flex">
                <div class="card border-0 rounded-3 shadow w-450 bg-login">
                    <div class="p-4 rounded mx-1">
                        <div class="text-center">
                            <a href="/">
                                <img src="../../assets/images/logo-navbar.png" alt="Logo" width="200px" />
                            </a>
                        </div>
                        <h4 class="text-center pt-4 fs-30">Register New Account</h4>

                        <div v-if="registrationError" class="alert alert-danger" role="alert">
                            {{ registrationError }}
                        </div>

                        <form class="mx-3" @submit.prevent="submitForm">
                            <div class="mb-2 mt-2">
                                <label for="fullName" class="form-label mb-1 fs-14">Full Name</label>
                                <input type="text" class="form-control h-43 mb-2" id="fullName"
                                    placeholder="Enter Your Full Name Here" v-model="name" required>
                            </div>
                            <div class="mb-2">
                                <label for="email" class="form-label mb-1 fs-14">Email</label>
                                <input type="email" class="form-control h-43 mb-2" id="email"
                                    placeholder="Enter Your Email Here" v-model="email" required>
                            </div>
                            <div class="mb-2">
                                <label for="password-field" class="form-label mb-1 fs-14">Password</label>
                                <div class="password-wrapper">
                                    <input :type="isPasswordVisible ? 'text' : 'password'" id="password-field"
                                        class="form-control h-43 mb-2" placeholder="Enter Your Password"
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
                            <div class="mb-2">
                                <label for="confirm-password-field" class="form-label mb-1 fs-14">Confirm
                                    Password</label>
                                <div class="password-wrapper">
                                    <input :type="isPasswordVisible ? 'text' : 'password'" id="confirm-password-field"
                                        class="form-control h-43 mb-2" placeholder="Enter Your Password again"
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
                            <div class="d-flex justify-content-start">
                                <div class="mb-2 form-check">
                                    <input type="checkbox" class="form-check-input" id="terms"
                                        v-model="agreeToTermsChecked">
                                    <label class="form-check-label fs-12" for="terms">
                                        I agree to the <a href="#" @click.prevent="toggleModal">terms and conditions</a>
                                    </label>
                                </div>
                            </div>

                            <div v-if="termsError" class="text-danger mb-2 fs-16">
                                {{ termsError }}
                            </div>

                            <ButtonSuccess class="mb-3 h-48 w-100">
                                Register
                            </ButtonSuccess>
                            <p class="fs-14 text-center mb-2">Already Have Account? <a href="/login"
                                    class="garis-">Login Here</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="terms">
        <div v-if="showModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header d-flex justify-content-center">
                        <h5 class="modal-title text-center">Terms and Conditions</h5>
                    </div>
                    <div class="modal-body tinggi text-justify" @scroll="handleScroll">
                        <div v-html="content"></div>
                    </div>
                    <div class="modal-footer d-flex justify-content-end align-items-center">
                        <div v-if="showAgreeButton" class="d-flex">
                            <ButtonRed class="h-40 fs-14 mx-3 text-white rounded-3 w-130" @click="toggleModal">Cancel
                            </ButtonRed>
                            <ButtonSuccess class="h-40 fs-16 w-130" @click="agreeToTerms">Agree</ButtonSuccess>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
