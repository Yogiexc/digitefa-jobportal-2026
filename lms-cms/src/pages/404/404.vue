<script setup>
import ButtonSuccess from '@/components/ButtonSuccess.vue';
</script>

<template>
    <div class="body-login">
        <div class="text-center">
            <div class="card-body">
                <img src="../../assets/images/404.png" alt="" width="139px" class="mb-3">
                <h3 class="fs-40 fw-semibold mb-4">Oops... Page Not Found</h3>
                <p class=" mb-5 fs-16 fw-normal">We’re sorry, the page you are trying to access cannot be found <br>
                    <span>Please make sure the URL
                        you entered is correct.</span>
                </p>
                <ButtonSuccess class="mb-3 h-48 w-75 fs-16 mt-3" onclick="window.location.href='/'">
                    Homepage
                </ButtonSuccess>
            </div>
        </div>
    </div>
</template>
