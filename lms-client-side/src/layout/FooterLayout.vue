<!-- <script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const sosmedData = ref(null);

const fetchAboutUsData = () => {
    axios.get('/social-media')
        .then((response) => {
            sosmedData.value = response.data;
        })
        .catch((error) => {
            console.error('Error fetching Sosial Media data:', error);
        });
};
onMounted(() => {
    fetchAboutUsData();
});
</script> -->
<template>
    <!-- <footer class="container ">
        <div class="row row-cols-5 py-5 border-top bg-footer">
            <div class="col">
                <div class="col d-flex flex-column align-items-start">
                    <a href="/" class="mb-2">
                        <img src="../assets/images/logo-navbar.png" alt="Logo" class="custom-footer" />
                    </a>
                    <div class="contact-us-text posisi">
                        <h5>Contact Us</h5>
                        <p>(+62) 89 529 035 998</p>
                    </div>
                </div>
            </div>
            <div class="d-flex" style="height: 200px;">
                <div class="col text-center">
                </div>
                <div class="vr"></div>
            </div>
            <div class="d-flex" style="height: 200px;">
                <div class="col">
                    <h5 class="mb-4">Quick Links</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">About us</a></li>
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Courses</a></li>
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Jobs</a></li>
                    </ul>
                </div>
                <div class="vr"></div>
            </div>
            <div class="d-flex" style="height: 200px;">
                <div class="col">
                    <h5 class="mb-4">Quick Links</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">About us</a></li>
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Courses</a></li>
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Jobs</a></li>
                    </ul>
                </div>
                <div class="vr"></div>
            </div>
            <div class="col">
                <h5 class="mb-4">Sosial Media</h5>
                <ul class="nav">
                    <li class="nav-item me-3"><a href="#" class="nav-link p-0">
                            <i class="bi bi-instagram fs-3"></i>
                        </a>
                    </li>
                    <li class="nav-item me-3"><a href="#" class="nav-link p-0">
                            <i class="bi bi-linkedin fs-3"></i>
                        </a>
                    </li>
                    <li class="nav-item me-3"><a href="#" class="nav-link p-0">
                            <i class="bi bi-youtube fs-3"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-12 text-center mt-3 footer-akhir">
                <p>Digitefa 2024</p>
            </div>
        </div>
    </footer> -->

    <footer class="container">
        <div class="row row-cols-5 py-md-2 border-top bg-footer">
            <div class="row py-5">
                <div class="col-md-4">
                    <div class="col d-flex flex-column align-items-start cborder-bottom">
                        <a href="/" class="mb-2 ms-md-5">
                            <img src="../assets/images/logo-navbar.png" alt="Logo" class="" width="240px" />
                        </a>
                        <div class="ms-md-5">
                            <h5 class="ms-md-5 fs-16">Contact Us</h5>
                            <p class="ms-md-5 fs-16">(+62) 89 529 035 998</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 border-left cborder-bottom">
                    <h5 class="mb-3 cmt-4">Quick Links</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2"><a href="/about" class="nav-link p-0">About us</a></li>
                        <li class="nav-item mb-2"><a href="/courses" class="nav-link p-0">Courses</a></li>
                        <li class="nav-item mb-2"><a href="/statistics" class="nav-link p-0">Jobs</a></li>
                    </ul>
                </div>
                <div class="col-md-2 border-left">
                    <h5 class="mb-3 cmt-4">Support</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item mb-2"><a href="/help-desk" class="nav-link p-0">Help</a></li>
                        <li class="nav-item mb-2"><a href="/login" class="nav-link p-0">Terms</a></li>
                        <li class="nav-item mb-2"><a href="#" class="nav-link p-0">Privacy</a></li>
                        <li class="nav-item mb-2"><a href="/faq" class="nav-link p-0">FaQ page</a></li>
                    </ul>
                </div>
                <div class="col-md-2 border-left cborder-bottom">
                    <h5 class="mb-3 cmt-4">Sosial Media</h5>
                    <ul class="nav">
                        <li class="nav-item me-3">
                            <a href="#" class="nav-link p-0">
                                <i class="bi bi-instagram fs-3"></i>
                            </a>
                        </li>
                        <li class="nav-item me-3"><a href="#" class="nav-link p-0">
                                <i class="bi bi-linkedin fs-3"></i>
                            </a>
                        </li>
                        <li class="nav-item me-3"><a href="#" class="nav-link p-0">
                                <i class="bi bi-youtube fs-3"></i>
                            </a>
                        </li>
                    </ul>
                    <!-- <ul class="nav">
                        <li class="nav-item me-2" v-for="(sosmed, index) in sosmedData" :key="index">
                            <a class="nav-link p-0" :href="sosmed.link">
                                <img :src="`${axios.defaults.baseURL.replace('/api', '')}/storage/uploads/${sosmed.image}`"
                                    alt="sosmed" class="" style="width: 34px; margin-top: 6px;">
                            </a>
                        </li>
                    </ul> -->
                </div>
                <div class="col-12 text-center mt-4 footer-akhir">
                    <p>© Copyright Digitefa 2024. All Rights Reserved</p>
                </div>
            </div>
        </div>
    </footer>
</template>