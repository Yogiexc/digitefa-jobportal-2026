<template>
  <div v-if="job" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- ... (bagian atas modal tetap sama) ... -->

      <!-- Placeholder untuk Rekomendasi Kursus -->
      <div class="mt-6 border-t pt-6">
        <h3 class="text-xl font-semibold mb-3 text-gray-800">Recommended Courses</h3>

        <!-- Gunakan <template> untuk mengelompokkan kondisi tanpa elemen ekstra -->
        <template v-if="loadingRecommendations">
          <div class="text-center">Loading recommendations...</div>
        </template>
        <template v-else-if="recommendationError">
          <div class="text-red-500 p-3 border border-red-300 bg-red-50 rounded-md">{{ recommendationError }}</div>
        </template>
        <template v-else-if="recommendedCourses.length > 0">
          <ul class="space-y-3"> {/* Tambahkan space-y untuk jarak antar item list */}
            <li v-for="course in recommendedCourses" :key="course.id_course || course.title" class="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-150">
              <h4 class="font-semibold text-blue-600 text-base mb-1">{{ course.title }}</h4>
              <p class="text-xs text-gray-700 line-clamp-2 mb-1">{{ course.description }}</p>
              <p class="text-xs text-green-700 font-medium">
                Similarity: <span class="font-bold">{{ (course.similarity_score * 100).toFixed(1) }}%</span>
              </p>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="text-gray-600 p-3 border border-gray-200 bg-gray-50 rounded-md">
            <p>No specific course recommendations are available for this job at the moment. This could be due to the job description's specificity or current course availability.</p>
          </div>
        </template>
      </div>

      <div class="mt-8 text-right">
        <button
          @click="$emit('close')"
          class="bg-gray-200 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-300 transition duration-150"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ... (script setup tetap sama) ...
import { ref, watchEffect } from 'vue';

const props = defineProps({
  job: Object,
});

const emit = defineEmits(['close']);

const recommendedCourses = ref([]);
const loadingRecommendations = ref(false);
const recommendationError = ref(null);

// Pastikan URL dan port FastAPI Anda benar
const FASTAPI_RECOMMEND_URL = 'http://localhost:8001/recommend-courses';

const fetchRecommendations = async (jobId) => {
  if (!jobId) return;
  loadingRecommendations.value = true;
  recommendationError.value = null;
  recommendedCourses.value = [];

  try {
    const response = await fetch(FASTAPI_RECOMMEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: jobId }),
    });

    const responseDataText = await response.text(); // Baca respons sebagai teks dulu untuk debugging
    let data;
    try {
        data = JSON.parse(responseDataText);
    } catch (e) {
        console.error("Failed to parse JSON response from FastAPI:", responseDataText);
        throw new Error("Received an invalid format from the recommendation service.");
    }


    if (!response.ok) {
      throw new Error(data.detail || `Failed to fetch recommendations (status: ${response.status})`);
    }

    if (data.recommended_courses && Array.isArray(data.recommended_courses)) {
      recommendedCourses.value = data.recommended_courses;
    } else {
      // Tetap kosongkan array jika tidak ada atau struktur tidak sesuai
      console.log("No recommended courses in response or unexpected structure:", data);
      recommendedCourses.value = [];
    }
  } catch (e) {
    console.error('Error fetching recommendations:', e);
    recommendationError.value = e.message || 'Could not load course recommendations.';
  } finally {
    loadingRecommendations.value = false;
  }
};

watchEffect(() => {
  if (props.job && props.job.job_id) {
    fetchRecommendations(props.job.job_id);
  } else {
    recommendedCourses.value = [];
    loadingRecommendations.value = false;
    recommendationError.value = null;
  }
});
</script>

<style scoped>
.prose p {
  margin-bottom: 0.75em;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>