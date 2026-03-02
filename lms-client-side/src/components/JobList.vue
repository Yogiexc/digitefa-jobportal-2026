<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Job Portal</h1>

    <!-- Search Input -->
    <div class="mb-8 max-w-xl mx-auto">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search for jobs (e.g., Frontend Developer, React)..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-600">
      <p class="text-xl">Loading jobs...</p>
      <!-- Optional: Add a spinner -->
      <div class="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v.else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
      <p class="font-semibold">Could not load jobs:</p>
      <p>{{ error }}</p>
    </div>

    <!-- No Jobs Found -->
    <div v.else-if="filteredJobs.length === 0 && !loading" class="text-center text-gray-600 py-10">
      <p class="text-xl font-semibold">No jobs found.</p>
      <p v-if="searchTerm">Try adjusting your search term.</p>
    </div>

    <!-- Job List -->
    <!-- Corrected JobList.vue -->
    <div v-if="loading" class="text-center text-gray-600">
        <p class="text-xl">Loading jobs...</p>
        <div class="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
        <p class="font-semibold">Could not load jobs:</p>
        <p>{{ error }}</p>
    </div>

    <div v-else-if="filteredJobs.length === 0 && !loading" class="text-center text-gray-600 py-10">
        <p class="text-xl font-semibold">No jobs found.</p>
        <p v-if="searchTerm">Try adjusting your search term.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="job in filteredJobs"
            :key="job.job_id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
        >
            <div class="p-6 flex-grow">
                <h2 class="text-2xl font-semibold text-blue-700 mb-2">{{ job.title }}</h2>
                <div class="mb-3">
                    <span class="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {{ job.company.market_name || job.company.legal_name }}
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-4">
                    {{ job.description }}
                </p>
            </div>
            <div class="p-6 bg-gray-50 border-t border-gray-200">
                <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>Published: {{ formatDate(job.published_at) }}</span>
                    <span>Location: {{ job.location }}</span>
                </div>
                <button
                    @click="showJobDetails(job)"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    View Details & Recommend Courses
                </button>
            </div>
        </div>
    </div>

    <!-- Placeholder untuk Modal/Detail Pekerjaan (Akan ditambahkan nanti) -->
    <JobDetailModal v-if="selectedJob" :job="selectedJob" @close="selectedJob = null" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import JobDetailModal from './JobDetailModal.vue'; // Kita akan buat komponen ini

const jobs = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedJob = ref(null);

const API_URL = 'http://localhost:3000/api/lms/jobs'; // Sesuaikan jika URL berbeda

const fetchJobs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      jobs.value = data.data;
    } else {
      throw new Error('Invalid data structure from API');
    }
  } catch (e) {
    console.error('Failed to fetch jobs:', e);
    error.value = e.message || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};

const filteredJobs = computed(() => {
  if (!searchTerm.value.trim()) {
    return jobs.value;
  }
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return jobs.value.filter(job =>
    job.title.toLowerCase().includes(lowerSearchTerm) ||
    job.description.toLowerCase().includes(lowerSearchTerm) ||
    (job.company.market_name && job.company.market_name.toLowerCase().includes(lowerSearchTerm)) ||
    (job.company.legal_name && job.company.legal_name.toLowerCase().includes(lowerSearchTerm)) ||
    (job.skills_requirement && job.skills_requirement.some(skill => skill.toLowerCase().includes(lowerSearchTerm)))
  );
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const showJobDetails = (job) => {
  selectedJob.value = job;
  // Di sini Anda bisa membuka modal atau navigasi ke halaman detail
  console.log('Selected Job for details and recommendations:', job.job_id, job.title);
};

onMounted(fetchJobs);
</script>

<style scoped>
/* Menggunakan line-clamp untuk membatasi deskripsi (membutuhkan plugin Tailwind) */
/* Jika tidak menggunakan plugin, Anda bisa menggunakan CSS manual */
.line-clamp-4 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

/* Optional: Styling untuk spinner jika tidak menggunakan library */
/* @keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
} */
</style>