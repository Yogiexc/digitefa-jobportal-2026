<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import NavbarLayout from '@/layout/NavbarLayout.vue';
import FooterLayout from '@/layout/FooterLayout.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import Swal from 'sweetalert2';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Don't forget to import AOS CSS
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const faqData = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 4;
const isToastVisible = ref(false);
const toastMessage = ref('');
const toastClass = ref('bg-light-success');
const isSubmitting = ref(false);

const form = ref({
    name: '',
    email: '',
    questions: '',
});

const fetchFaqs = async () => {
    try {
        const response = await axios.get('/faqs');
        faqData.value = response.data;
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
    }
};

onMounted(() => {
    fetchFaqs();
    AOS.init({
        once: true,
    });

    window.addEventListener('scroll', resetAOS);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', resetAOS);
});

const resetAOS = () => {
    if (window.scrollY === 0) {
        AOS.refresh();
    }
};

const filteredData = computed(() => {
    return faqData.value.filter(faq =>
        faq.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.value.slice(start, end);
});

const changePage = (pageNumber) => {
    currentPage.value = pageNumber;
};

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage);
});

const submit = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('email', form.value.email);
        formData.append('questions', form.value.questions);

        const response = await axios.post('/questions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        form.value.name = '';
        form.value.email = '';
        form.value.questions = '';

        router.push('/faq');
        showToast('Anda berhasil mengirim pesan!', 'success');
    } catch (error) {
        showToast('Anda gagal mengirim pesan.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};


const showToast = (message, type = 'success') => {
    toastMessage.value = message;
    isToastVisible.value = true;
    toastClass.value = type === 'success' ? 'bg-light-success' : 'bg-light-error';
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

const formatDate = (dateString) => {
    let date;
    if (dateString.includes("T")) {
        date = new Date(dateString);
    } else if (dateString.includes(",")) {
        date = new Date(dateString);
    } else {
        const parts = dateString.split(" ");
        const monthMap = {
            "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
            "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
            "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
        };
        const day = parts[1];
        const month = monthMap[parts[2]];
        const year = parts[3];
        const time = parts[4];

        const formattedDateString = `${year}-${month}-${day}T${time.replace('AM', '').replace('PM', '')}:00`;
        date = new Date(formattedDateString);
    }
    if (isNaN(date)) {
        return "Invalid Date";
    }
    const options = {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
    };
    return date.toLocaleString('en-US', options).replace(",", " pada");
};
</script>

<template>
    <!-- NAVBAR START -->
    <NavbarLayout />
    <!-- NAVBAR END -->

    <section class="bg-faq fw-semibold mt-100">
        <div class="container">
            <div class="row">
                <nav style="--bs-breadcrumb-divider: url(&#34;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E&#34;);"
                    aria-label="breadcrumb">
                    <ol class="breadcrumb my-4 ms-1">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">FAQ</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>

    <!-- FAQ START -->
    <section class="bg-faq-search">
        <div class="container">
            <div class="row">
                <h4 class="fs-40 mt-5 ms-md-1">Search FAQ</h4>
                <p class="mt-1 ms-md-1 fs-16 fw-normal">Find answers to frequently asked questions by typing keywords.
                </p>
                <div class="ps-3 my-3 mb-5 d-flex justify-content-center">
                    <div class="search-input w-100 me-md-1">
                        <input type="text" class="form-control rounded-3 h-43" v-model="searchQuery"
                            placeholder="Type your question..." />
                        <i class="bi bi-search"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container">
            <div class="row cmx-4 shw">
                <div v-for="faq in paginatedData" :key="faq.id_faq"
                    class="card mt-4 ms-md-3 border-0 bg-faq-isi rounded-4" data-aos="fade-right"
                    data-aos-duration="2000" data-aos-once="true">
                    <div class="mt-2">
                        <h4 class="ms-4 mt-3">{{ faq.title }}</h4>
                        <p class="ms-4 mt-3">{{ faq.answer }}</p>
                        <p class="ms-4 mt-3 mb-4 opacity-25">{{ formatDate(faq.created_at) }}</p>

                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col text-center mt-5">
                    <PaginationComponent :currentPage="currentPage" :totalPages="totalPages"
                        @page-change="changePage" />
                </div>
            </div>
        </div>
    </section>
    <!-- FAQ END -->

    <section class="bg-faq-form pt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6" data-aos="fade-right" data-aos-duration="2000" data-aos-once="true">
                    <img src="../assets/images/avatar-form.png" alt="" class="img-fluid rounded" />
                </div>
                <div class="col-md-6 d-flex justify-content-end" data-aos="fade-left" data-aos-duration="2000"
                    data-aos-once="true">
                    <div class="card rounded-3 border-0 w-500 mb-5 me-md-5">
                        <div class="p-md-4 rounded mx-1">
                            <h3 class="text-center pt-4">Form for Questions</h3>
                            <form class="mx-3" @submit.prevent="submit">
                                <div class="mt-2">
                                    <label for="exampleInputName" class="form-label">Name</label>
                                    <input type="text" class="form-control h-48" id="exampleInputName"
                                        placeholder="Enter Your Name" v-model="form.name" required>
                                </div>
                                <div class="mt-2">
                                    <label for="exampleInputEmail1" class="form-label">Email</label>
                                    <input type="email" class="form-control h-48" id="exampleInputEmail1"
                                        placeholder="Enter Your Email" v-model="form.email" required>
                                </div>
                                <div class="form-group mt-2">
                                    <label for="exampleFormControlTextarea1">Your Question</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                                        placeholder="Write your question here..." v-model="form.questions"
                                        required></textarea>
                                </div>
                                <div class="text-center mt-3">
                                    <ButtonSuccess class="rounded-4 w-150 h-43" @click="submit">
                                        Submit
                                    </ButtonSuccess>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div aria-live="polite" aria-atomic="true" class="position-fixed bs-toast">
            <div v-if="isToastVisible"
                :class="['toast', 'align-items-center', 'text-white', toastClass, 'border-0', 'show']" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toastMessage }}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="closeToast"
                        aria-label="Close"></button>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER START -->
    <FooterLayout />
    <!-- FOOTER END -->
</template>
