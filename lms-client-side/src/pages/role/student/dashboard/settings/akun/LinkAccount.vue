<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(["close", "link-success"]);

const loading = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleCancel = () => {
  emit("close");
};

const handleFinish = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await axios.post("/link-job-portal", {
        email: email.value,
        password: password.value,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    emit("link-success");
    handleCancel();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to link account. Please try again.";
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      email.value = "";
      password.value = "";
      errorMessage.value = "";
    }
  }
);
</script>

<template>
  <div v-if="open" class="modal-backdrop fade show"></div>
  <div v-if="open" class="modal fade show d-block" tabindex="-1" @click.self="handleCancel">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title d-flex align-items-center">
            <i class="bi bi-link-45deg text-primary me-2 fs-4"></i>
            Link Job Portal Account
          </h5>
          <button type="button" class="btn-close" @click="handleCancel"></button>
        </div>
        <div class="modal-body p-4">
          <form @submit.prevent="handleFinish">
            <p class="text-muted">
              Link your LMS account with the Job Portal system to access
              integrated features.
            </p>
            <div v-if="errorMessage" class="alert alert-danger fs-14 py-2">
              {{ errorMessage }}
            </div>
            <div class="mb-3">
              <label for="jp-email" class="form-label fs-14">Job Portal Email</label>
              <input type="email" class="form-control h-48" id="jp-email" v-model="email" placeholder="Enter your Job Portal email" required />
            </div>
            <div class="mb-3">
              <label for="jp-password" class="form-label fs-14">Job Portal Password</label>
              <input type="password" class="form-control h-48" id="jp-password" v-model="password" placeholder="Enter your Job Portal password" required />
            </div>
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-primary h-48" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-else>Link Account</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  max-width: 500px;
}
</style>