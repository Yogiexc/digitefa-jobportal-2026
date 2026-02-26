<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    isLinked: Boolean,
    linkedAt: String,
});

const emit = defineEmits(['open-link-form', 'unlink-success']);

const loading = ref(false);
const errorMessage = ref('');

const handleUnlink = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        await axios.post('/unlink-job-portal', {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        emit('unlink-success');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Failed to unlink account.";
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="p-3">
        <h5 class="fs-18 mb-2">Account Integration</h5>
        <p class="text-muted fs-14">
            Connect your LMS account with the Job Portal system for integrated features like course recommendations and progress synchronization.
        </p>

        <!-- TAMPILAN JIKA SUDAH TERTAUT -->
        <div v-if="isLinked" class="card mt-4">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-check-circle-fill fs-2 text-success me-3"></i>
                    <div>
                        <h6 class="card-title mb-0">Account Linked</h6>
                        <p v-if="linkedAt" class="card-text fs-12 text-muted mb-0">
                            Linked on: {{ new Date(linkedAt).toLocaleString('id-ID') }}
                        </p>
                    </div>
                </div>
                <p class="card-text fs-14 mb-3">
                    Your account is successfully connected to the Job Portal.
                </p>
                <!-- Tombol Unlink langsung di sini -->
                <button @click="handleUnlink" class="btn btn-danger btn-sm" :disabled="loading">
                     <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Unlink Account
                </button>
                 <div v-if="errorMessage" class="alert alert-danger fs-14 py-2 mt-3">
                    {{ errorMessage }}
                </div>
            </div>
        </div>

        <!-- TAMPILAN JIKA BELUM TERTAUT -->
        <div v-else class="mt-4">
            <button @click="$emit('open-link-form')" class="btn btn-primary">
                <i class="bi bi-link-45deg me-2"></i>
                Link Job Portal Account
            </button>
        </div>
    </div>
</template>