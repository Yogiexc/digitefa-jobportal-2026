<script setup>
import NavbarLayout from '@/layout/NavbarLayout.vue';
import FooterLayout from '@/layout/FooterLayout.vue';



</script>

<template>
    <!-- NAVBAR START -->
    <NavbarLayout />
    <!-- NAVBAR END -->

    <!-- DETAIL COURSES START -->
    <section class="bg-about-isi fw-semibold mt-100 mb-5">
        <div class="container">
            <div class="row">
                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
                    aria-label="breadcrumb">
                    <ol class="breadcrumb my-4 ms-1">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Teacher</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

    <section class="dt">
        <div class="container">
            <div class="row">
                <div class="d-flex align-items-center mt-4">
                    <img src="../../../assets/images/avatar.png" class="rounded-circle me-3 mt--50" alt="..."
                        height="150px">
                    <div>
                        <p class="fw-medium mb-2 mt--80 fs-20">Habib S</p>
                        <p class="fw-light opacity-75 fs-16">Fullstack programer - kodegiri</p>
                    </div>
                </div>
                <div class="d-flex justify-content-start fw-medium">
                    <p class="me-4 mt-4 fs-17 ms-1">Total students <br><span>822</span></p>
                    <p class="mx-4 mt-4 fs-17 ms-1">Reviews<br><span>822</span></p>
                    <p class="mt-4 fs-17 ms-1">Rating<br> <span class="bi bi-star-fill opacity-75"> 4,8</span></p>
                </div>
                <p class="me-4 mb-1 fw-medium mt-2 ms-1 fs-17">About us</p>
                <p class="fs-16 text-muted ms-1 text-justify">Wina Salim adalah seorang Fullstack Programmer dengan
                    pengalaman lebih
                    dari
                    7 tahun di
                    dunia
                    teknologi. Ia berfokus pada pengembangan aplikasi web dengan menggunakan teknologi terbaru seperti
                    React.js dan Node.js. Wina memiliki passion besar dalam mengajar pemula dan membimbing mereka
                    melalui proses belajar pemrograman. Dengan pengalaman bekerja di beberapa proyek besar, ia juga
                    sering menjadi pembicara di berbagai acara teknologi.</p>
                <p class="me-4 mb-1 fw-medium mt-0 ms-1 fs-17">Keahlian: </p>
                <p class="text-muted ms-1 fs-16"> • HTML, CSS, JavaScript <br>
                    • React.js, Node.js <br>
                    • Integrasi API dan Manajemen Database <br>
                    • Pengembangan Web Fullstack</p>
                <p class="me-4 mb-1 fw-medium mt-0 ms-1 fs-17">Pengalaman:</p>
                <p class="text-muted ms-1 fs-16">
                    • Lead Developer di TechCorp <br>
                    • Pembicara di WebDev Indonesia 2023 <br>
                    • Certified Google Developer <br>
                </p>
                <p class="me-4 mb-2 fw-medium mt-0 ms-1">Teacher courses (1)</p>
                <div class="col-md-4">
                    <div class="card img-thumbnail p-2 bg-biru border-0 mb-4 ms-1 rounded-4">
                        <div class="card w-100 border-0 rounded-4">
                            <img src="../../../assets/images/bg.jpg" class="card-img-top rounded-4" alt="...">
                            <p class="w-170 text-center fs-12 date">10/08/2024-15/09/2024</p>
                            <div class="card-body dt-card">
                                <div class="d-flex align-items-center">
                                    <img src="../../../assets/images/avatar.png" class="rounded-circle me-3" alt="..."
                                        height="48px">
                                    <div>
                                        <p class="fw-medium mb-0 fs-16">Adi</p>
                                        <p class="text-muted mb-0 fs-16">Fullstack Programmer</p>
                                    </div>
                                </div>
                                <a href="/detailcourses" class="garis- text-dark">
                                    <h5 class="mt-4 fs-16 fw-medium">Dasar Pemograman</h5>
                                </a>
                                <p class="text-justify opacity-75 fs-16">Materi pembelajaran mengenai pembuatan
                                    website
                                    tingkat pemula</p>
                                <div class="d-flex justify-content-around fs-16">
                                    <span class="bi bi-clock me-4">
                                        7 <span>day</span>
                                    </span>
                                    <span class="bi bi-people me-4">80<span>/240</span></span>
                                    <span class="bi bi-star-fill opacity-75"> 4,8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="my-2 fs-16 fw-medium ms-1">Find Me Here</p>
                    <div class="d-flex justify-content-start mb-5 ms-1">
                        <button class="rounded-3 c-border bg-white w-120 h-43">LinkedIn</button>
                        <button class="ms-4 rounded-3 c-border bg-white w-120 h-43">Instagram</button>
                        <button class="ms-4 rounded-3 c-border bg-white w-120 h-43">Facebook</button>
                    </div>
                </div>
            </div>
        </div>
    </section>



    <!-- DETAIL COURSES END -->

    <!-- FOOTER START -->
    <FooterLayout />
    <!-- FOOTER END -->
</template>