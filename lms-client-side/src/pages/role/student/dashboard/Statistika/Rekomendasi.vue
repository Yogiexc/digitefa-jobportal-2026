<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import ButtonPutihComponent from '@/components/ButtonPutihComponent.vue';
import ButtonHijauComponent from '@/components/ButtonHijauComponent.vue';

const autoScrollInterval = ref(null);
const idUser = ref('');
const cards = ref([]);
const loading = ref(false);
const error = ref(null);
const containerRef = ref(null);

onMounted(async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        idUser.value = storedUser.id_user;
        await fetchRecommendedJobs();
        if (cards.value.length > 0) {
            startAutoScroll();
        }
    } else {
        console.error('No user data found in localStorage.');
        error.value = 'User data not found. Please login again.';
    }
});

onUnmounted(() => {
    stopAutoScroll();
});

const fetchRecommendedJobs = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const response = await axios.get(`/recommended-jobs/${idUser.value}`, {
            params: {
                page: 1,
                size: 10
            }
        });

        console.log('API Response:', response.data);

        // Data jobs berada di response.data.data.data
        if (response.data.success && response.data.data && response.data.data.data) {
            const jobsData = response.data.data.data;
            
            cards.value = jobsData.map(job => ({
                id: job.job_id,
                title: job.title,
                company: job.company.market_name,
                location: job.location,
                salary: job.minimum_salary === 0 && job.maximum_salary === 0 
                    ? 'Salary Negotiable'
                    : `Rp ${formatSalary(job.minimum_salary)} - Rp ${formatSalary(job.maximum_salary)}`,
                date: formatDate(job.published_at),
                employment_type: job.employment_type,
                work_location: job.work_type,
                experience: job.experience_requirement,
                logo_url: job.company.logo_url
            }));
        } else {
            error.value = 'No job listings available';
            cards.value = [];
        }
    } catch (err) {
        console.error('Error fetching recommended jobs:', err);
        error.value = 'Failed to load recommended jobs. Please try again later.';
        cards.value = [];
    } finally {
        loading.value = false;
    }
};
const formatSalary = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const formatDate = (dateString) => {
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - publishDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days Ago`;
};

const goToNext = () => {
    if (containerRef.value) {
        containerRef.value.scrollBy({ 
            left: containerRef.value.offsetWidth, 
            behavior: 'smooth' 
        });
    }
};

const startAutoScroll = () => {
    if (cards.value.length > 1) {
        autoScrollInterval.value = setInterval(() => {
            goToNext();
        }, 4000);
    }
};

const stopAutoScroll = () => {
    if (autoScrollInterval.value) {
        clearInterval(autoScrollInterval.value);
        autoScrollInterval.value = null;
    }
};

const goToPrevious = () => {
    if (containerRef.value) {
        containerRef.value.scrollBy({ 
            left: -containerRef.value.offsetWidth, 
            behavior: 'smooth' 
        });
    }
};

const baseApiUrl ='https://api-portal.digitefa.id/api/lms/jobs'
</script>

<template>
    <div class="job-portal-container">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="cards.length === 0" class="text-center py-4">
            <p>No job recommendations available at this time.</p>
        </div>

        <!-- Content -->
        <div v-else class="d-flex align-items-center position-relative">
            <i v-if="cards.length > 1" 
               class="bi bi-chevron-left me-3 carousel-control-custom rounded-2 left" 
               @click="goToPrevious"></i>
            <div class="card-container" ref="containerRef">
                <div class="card-item" v-for="card in cards" :key="card.id">
                    <div class="card p-3 shadow-sm rounded-4" style="min-height: 235px;">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <img :src="`${baseApiUrl}/${card.company.logo_url}`" alt="Company Logo" width="50" class="me-3" />
                                <div>
                                    <h5 class="mb-0 fs-15">{{ card.title }}</h5>
                                    <span class="text-muted f-13">
                                        {{ card.company }}, {{ card.location }}
                                    </span>
                                </div>
                            </div>
                            <div class="border pointer card-bookmark">
                                <i class="bi bi-bookmark fs-16"></i>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-3">
                            <span class="px-3 py-2 d-flex align-items-center card-part-time">
                                <i class="bi bi-clock-fill me-2 text-card-part-time"></i>
                                {{ card.employment_type }}
                            </span>
                            <span class="px-3 py-2 d-flex align-items-center card-part-time">
                                <i class="bi bi-geo-alt-fill me-2 text-card-part-time"></i>
                                {{ card.work_location }}
                            </span>
                            <span class="px-3 py-2 d-flex align-items-center card-part-time">
                                <i class="bi bi-calendar3 me-2 text-card-part-time"></i>
                                {{ card.experience }}
                            </span>
                        </div>
                        <div class="mt-3">
                            <span class="px-3 py-2 d-flex align-items-center card-gaji">
                                <i class="bi bi-coin me-2 text-card-gaji"></i>
                                {{ card.salary }}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-dark fs-12">{{ card.date }}</small>
                            <div>
                                <ButtonPutihComponent class="fs-12 me-2">View Detail</ButtonPutihComponent>
                                <ButtonHijauComponent class="fs-12">Apply</ButtonHijauComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <i v-if="cards.length > 1" 
               class="bi bi-chevron-right ms-3 carousel-control-custom rounded-2 right" 
               @click="goToNext"></i>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding: 0 20px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
}

.card-container::-webkit-scrollbar {
    height: 8px;
}

.card-container::-webkit-scrollbar-thumb {
    background-color: transparent;
}

.card-container::-webkit-scrollbar-track {
    background-color: transparent;
}

.card-item {
    flex: 0 0 calc(50% - 10px);
    scroll-snap-align: start;
    box-sizing: border-box;
}

.carousel-control-custom {
    cursor: pointer;
    font-size: 16px;
    color: #000;
    background-color: rgba(245, 245, 245, 1);
    padding: 7px 12px 7px 12px;
}

.card-bookmark {
    padding: 10px 15px;
    border: 3px solid #D8D8D8;
    border-radius: 10px;
}

.card-part-time {
    border-radius: 10px;
    background-color: #E3FCEC;
    color: green;
    font-size: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.text-card-part-time {
    color: green;
    font-size: 12px;
}

.card-gaji {
    border-radius: 10px;
    background-color: #E0F7FA;
    color: #00796B;
    font-size: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.text-card-gaji {
    color: #00796B;
    font-size: 12px;
}
</style>