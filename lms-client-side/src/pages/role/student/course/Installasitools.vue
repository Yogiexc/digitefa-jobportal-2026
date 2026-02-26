<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonOren from '@/components/ButtonOren.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';

const isSidebarVisible = ref(true);

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 768;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

const handleNavigation = () => {
    const pointers = document.querySelectorAll('.pointer');
    const sections = document.querySelectorAll('.section');

    pointers.forEach(pointer => {
        pointer.addEventListener('click', () => {
            pointers.forEach(p => p.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            pointer.classList.add('active');
            const targetId = pointer.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
};

onMounted(() => {
    handleNavigation();
});

const submit = () => {
    Swal.fire({
        title: 'Your course has been completed!',
        text: '“Congratulations! You have successfully completed the Habib S course. Keep learning and reach new milestones in the future.”',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#06A73B',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Lanjutkan ke Rating',
        cancelButtonText: 'Tutup',
        customClass: {
            confirmButton: 'custom-button',
            cancelButton: 'custom-button',
            title: 'custom-title',
            htmlContainer: 'custom-text',
        },
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();
            confirmButton.classList.add('custom-button');
            cancelButton.classList.add('custom-button');
        },
    }).then((result) => {
        if (result.isConfirmed) {
            showRatingModal();
        }
    });
};

const showRatingModal = () => {
    Swal.fire({
        title: 'Rate Your Course Experience',
        html: `
            <div class="star-rating">
                <input type="radio" id="star5" name="rating" value="5"><label for="star5">★</label>
                <input type="radio" id="star4" name="rating" value="4"><label for="star4">★</label>
                <input type="radio" id="star3" name="rating" value="3"><label for="star3">★</label>
                <input type="radio" id="star2" name="rating" value="2"><label for="star2">★</label>
                <input type="radio" id="star1" name="rating" value="1"><label for="star1">★</label>
            </div>
            <label class="text-start2">Give us feedback</label>
            <textarea class="custom-feedback" rows="3" placeholder="Write your review"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Tutup',
        confirmButtonColor: '#06A73B',
        cancelButtonColor: '#F44336',
        customClass: {
            confirmButton: 'custom-button',
            title: 'title-custom',
            cancelButton: 'custom-button',
        },
    });
};
</script>

<template>
    <div class="bg-room room"> <!-- tools-->

        <!-- NAVBAR START -->
        <NavbarCourses />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarCourse v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="room" class="student">
            <div class="container mt-md-2 pe-md-4">
                <div class="row">
                    <h5 class="fs-16 fw-medium">Dasar Pemograman Web</h5>
                    <h1 class="fs-40 fw-semibold">Installasi Tools</h1>
                    <img src="../../../../assets/images/Cover.png" alt="" class="rounded-3" width="100%" height="90%">
                    <div class="d-flex justify-content-between mb-md-1 mt-md-3 mt-2">
                        <ButtonOren class="fs-16 w-20 fw-medium">
                            Kembali
                        </ButtonOren>
                        <ButtonOren class="fs-16 w-20 fw-medium" @click="submit">
                            Selesai & Lanjut
                        </ButtonOren>
                    </div>
                    <div class="container my-3">
                        <div class="d-flex justify-content-start h4 mb-4 border-bottom border-dark ms-md-1 ms-3 me-3">
                            <h5 class="me-3 fw-medium pointer fs-16 active" data-target="about">About</h5>
                            <h5 class="me-3 fw-medium pointer fs-16" data-target="resources">Resources</h5>
                        </div>
                        <div id="about" class="section active p ms-3 me-3">
                            <p class="fs-16 fw-normal text-justify">"Selamat datang di video 'Dasar Pemrograman Web'!
                                Dalam video
                                ini, kita akan membahas
                                fondasi penting yang harus kamu ketahui untuk memulai karier sebagai pengembang web.
                                Mulai dari HTML, CSS, hingga dasar JavaScript, kamu akan dipandu langkah demi langkah
                                untuk memahami cara membangun halaman web interaktif dari awal. Video ini cocok untuk
                                pemula yang ingin mengembangkan keterampilan mereka di dunia web development. Pastikan
                                untuk mengikuti seluruh seri ini agar bisa menjadi ahli dalam membangun situs web
                                modern!"</p>
                            <p class="fs-16 fw-bold">Tools</p>
                            <div class="d-flex justify-content-start mb-5">
                                <a
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <img src="../../../../assets/images/figma.png" alt="Figma Logo"
                                        class="me-3 image-room">
                                    <div class="fs-16 fw-medium">Figma
                                    </div>
                                </a>
                                <a
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <img src="../../../../assets/images/vscode.png" alt="Figma Logo"
                                        class="me-3 image-room">
                                    <div class="fs-16 fw-medium">Vs code
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div id="resources" class="section ms-3 me-3">
                            <div class="d-flex justify-content-start mb-3">
                                <a
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <i class="bi bi-download me-2"></i>
                                    <div class="fs-16 fw-medium">Download
                                    </div>
                                </a>
                            </div>
                            <p class="fs-16 fw-bold">Tools</p>
                            <div class="d-flex justify-content-start mb-3">
                                <a
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <img src="../../../../assets/images/figma.png" alt="Figma Logo"
                                        class="me-3 image-room">
                                    <div class="fs-16 fw-medium">Figma
                                    </div>
                                </a>
                                <a
                                    class="d-flex align-items-center rounded-3 p-2 mb-3 bg-white tool-container px-3 h-43 c-border me-3 pointer garis- text-dark">
                                    <img src="../../../../assets/images/vscode.png" alt="Figma Logo"
                                        class="me-3 image-room">
                                    <div class="fs-16 fw-medium">Vs code
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
