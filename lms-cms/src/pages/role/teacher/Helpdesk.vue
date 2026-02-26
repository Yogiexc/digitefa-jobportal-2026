<script setup>
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import PaginationComponents from '@/components/PaginationComponents.vue';
import { ref, computed, onUnmounted, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const isSidebarVisible = ref(true);
const faqData = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 4;
const email = ref('');
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

const filteredData = computed(() => {
    return faqData.value.filter(c =>
        c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        c.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / itemsPerPage);
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.value.slice(start, end);
});

const submit = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            form.value.email = user.email; 
        } else {
            form.value.email = localStorage.getItem('email') || ''; 
        }

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
        form.value.questions = '';

        router.push('/helpdesk');
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

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    email.value = localStorage.getItem('email');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        email.value = user.email;
    }
    fetchFaqs();
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
});

const handlePageChange = (pageNumber) => {
    currentPage.value = pageNumber;
};
</script>

<template>
    <div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="cbg-card rounded-3 p-4">
                            <h5 class="fw-light fs-16">Digitefa/Help Desk</h5>
                            <h4 class="fs-24 mb-4">Help Desk</h4>
                            <div class="card rounded-3 p-2">
                                <div class="container">
                                    <div class="row">
                                        <h4 class="fs-20 mt-1">Search FAQ</h4>
                                        <div class="my-1 d-flex justify-content-center">
                                            <div class="search-input w-100 me-md-1">
                                                <input type="text" class="form-control rounded-3 h-43"
                                                    v-model="searchQuery" placeholder="Type your question..." />
                                                <i class="bi bi-search"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="border-bottom border-dark mt-3" />
                                <div v-for="faq in paginatedData" :key="faq.id_faq"
                                    class="card mt-3 ms-md-3 ms-2 border-0 bg-faq-isi rounded-4">
                                    <div class="mt-2">
                                        <h4 class="ms-4 mt-3 fs-16">{{ faq.title }}</h4>
                                        <p class="ms-4 mt-2 fs-16 fw-lighter">{{ faq.answer }}</p>
                                        <p class="ms-4 mt-3 mb-4 fw-lighter opacity-25 fs-12">{{
                                            formatDate(faq.created_at) }}</p>
                                    </div>
                                </div>
                                <PaginationComponents class="mt-4" :currentPage="currentPage" :totalPages="totalPages"
                                    :onPageChange="handlePageChange" />

                                <div class="container">
                                    <div class="row">
                                        <div class="col-12 text-center mt-5">
                                            <h5 class="fs-24">“Need Help? Contact Us!”</h5>
                                            <p class="fs-16 fw-light">“If your question has not been answered in the FAQ
                                                section,
                                                please
                                                contact us via the <br> form below.”</p>
                                        </div>
                                        <div class="col-12 col-md-6 offset-md-3">
                                            <div class="p-md-1 pb-md-4 rounded mx-1">
                                                <form @submit.prevent="submit">
                                                    <div class="mt-0">
                                                        <label for="exampleInputName" class="form-label">Name</label>
                                                        <input type="text" class="form-control h-48"
                                                            id="exampleInputName" placeholder="Enter Your Name Here"
                                                            v-model="form.name" required />
                                                    </div>
                                                    <div class="form-group mt-2">
                                                        <label for="exampleFormControlTextarea1">Your Question</label>
                                                        <textarea class="form-control" id="exampleFormControlTextarea1"
                                                            rows="3" placeholder="Write your question here..."
                                                            v-model="form.questions" required></textarea>
                                                    </div>
                                                    <div class="text-center mt-3 mb-4">
                                                        <ButtonBiru class="rounded-3 px-5 h-40" @click="submit">
                                                            Submit
                                                        </ButtonBiru>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    </div>
</template>
