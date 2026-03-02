<script setup>
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const store = useStore();
const route = useRoute();

const Logout = () => {
    store.dispatch('logout').then(() => {
        router.push('/');
    }).catch((error) => {
        console.error('Logout failed', error);
    });
};
</script>
<template>
    <div class="body-login-admin">
        <div class="d-flex justify-content-center">
            <div class="card border-0 p-5 shadow rounded-4 w-80">
                <div class="text-center">
                    <h1 class="fs-24 fw-medium">Your page is currently being reviewed by the superadmin.</h1>
                    <label for="subtitle" class="mt-4 fs-16">Please be patient while we complete the review. This process may
                        take up to 24
                        hours.</label>
                </div>
                <div>
                    <label for="time" class="mt-4 ms-2 fs-16">Estimated time remaining: <strong>23 hours 45
                            minutes</strong></label>
                </div>
                <div class="d-flex justify-content-center mt-5 mb-2">
                    <ButtonBiru class="h-45 w-50 fs-16" @click="Logout">Go to Landing Page</ButtonBiru>
                </div>
            </div>
        </div>
    </div>
</template>