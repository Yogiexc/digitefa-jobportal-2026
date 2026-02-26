<script setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import Swal from 'sweetalert2';

const router = useRouter();

const otp = ref(['', '', '', '']);
const email = ref('');
const notification = ref('');

const isSubmitDisabled = computed(() => {
  return otp.value.some(digit => digit === '');
});

onMounted(() => {
  email.value = localStorage.getItem('email');
});

const handleInput = (index) => {
  if (otp.value[index].length === 1 && index < 3) {
    nextTick(() => {
      const nextInput = document.getElementById(`input${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    });
  }
};

const onlyNumber = (event) => {
  const key = event.key;
  if (!/[0-9]/.test(key) && key !== "Backspace" && key !== "Tab") {
    event.preventDefault();
  }
};

const handleSubmit = async () => {
  const verification_code = otp.value.join('');
  try {
    await axios.post('/verify-email', {
      email: email.value,
      verification_code: verification_code,
    });
    
    Swal.fire({
      title: "Sukses!",
      text: "Email verified successfully",
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
    notification.value = error.response?.data?.message || 'Verification failed, please check your code and try again.';
  }
};

const resendVerificationCode = async () => {
  notification.value = '';
  try {
    await axios.post('/resend-verification-code', { email: email.value });
    notification.value = 'Verification code has been resent to your email.';
  } catch (error) {
    console.error('Error resending verification code:', error.response?.data?.message || error.message);
  }
};
</script>

<template>
  <div class="body-login-nobg">
    <div class="card border-0 rounded-3 custom-shadow2 w-500 mx-3 mx-md-0">
      <div class="p-4 rounded mx-1">
        <h3 class="text-center fs-24 fw-semibold">Enter Verification Code</h3>
        <p class="fs-16 text-center mb-0">
          We have sent a code to
          <span class="fw-medium fs-16">{{ email }}</span>
        </p>

        <div v-if="notification" class="alert text-center mt-3"
          :class="{ 'alert-danger': notification.includes('Invalid'), 'alert-success': notification.includes('resent') }"
          role="alert">
          {{ notification }}
        </div>

        <div class="card-body text-center">
          <form @submit.prevent="handleSubmit">
            <div class="otp-field mb-4">
              <input type="text" v-model="otp[0]" @input="handleInput(0)" maxlength="1" id="input0"
                @keypress="onlyNumber" />
              <input type="text" v-model="otp[1]" @input="handleInput(1)" maxlength="1" :disabled="!otp[0]" id="input1"
                @keypress="onlyNumber" />
              <input type="text" v-model="otp[2]" @input="handleInput(2)" maxlength="1" :disabled="!otp[1]" id="input2"
                @keypress="onlyNumber" />
              <input type="text" v-model="otp[3]" maxlength="1" :disabled="!otp[2]" id="input3"
                @keypress="onlyNumber" />
            </div>
            <img src="../../assets/images/vc.png" alt="" class="image-reset">
            <ButtonSuccess class="mb-3 h-48 w-75 fs-16 mt-3" :class="['btn', 'btn-success']"
              :disabled="isSubmitDisabled">
              Verify Now
            </ButtonSuccess>
          </form>
          <p class="resend text-muted mb--6 fs-16 fw-light">
            Didn't you receive any code?
            <a href="javascript:void(0)" @click="resendVerificationCode" class="garis-">Resend Code</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
