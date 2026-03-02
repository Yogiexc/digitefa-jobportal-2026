<script setup>
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue';

const email = ref('');
const successMessage = ref('');
const errorMessage = ref('');

const submitReset = async () => {
    try {
        const response = await axios.post('/forgot-password', {
            email: email.value,
        });
        successMessage.value = response.data.message;
        router.push('/reset-password');
    } catch (error) {
        errorMessage.value = error.response?.data.message || 'An error occurred.';
    }
};
</script>

<template>
    <div class="body-login-nobg">
        <div class="card border-0 rounded-3 custom-shadow2 w-500 mx-3 mx-md-0">
            <div class="p-4 rounded mx-1 text-center">
                <h3 class="fs-24 fw-semibold">Forget Password</h3>
                <p class="fs-16 mb-0">Enter your email account to reset password</p>
                <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
                <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                <div class="card-body">
                    <img src="../../assets/images/fp.png" alt="" class="image-reset">
                    <form class="mx-4" @submit.prevent="submitReset">
                        <div class="mb-3 mt-4 text-start">
                            <label for="exampleInputEmail1" class="form-label">Email</label>
                            <input type="email" class="form-control h-48 rounded-3" id="exampleInputEmail1"
                            placeholder="Enter Your Email Here" required v-model="email">
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