<template>
  <div v-if="visible" class="modal-backdrop fade show"></div>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    @click.self="closeModal"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Course Recommendations for <br /><em
              >"{{ job?.title || "this job" }}"</em
            >
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div
              class="spinner-border text-primary"
              role="status"
              style="width: 3rem; height: 3rem"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">
              Analyzing job requirements & finding best courses...
            </p>
          </div>
          <div v-else-if="error" class="alert alert-danger">
            <p class="fw-bold mb-1">Could not load recommendations:</p>
            <p class="mb-0">{{ error }}</p>
          </div>
          <div v-else-if="recommendations && recommendations.length > 0">
            <p class="mb-3 text-muted">
              Based on the required skills, here are some courses you might find
              relevant:
            </p>
            <div class="recommendation-cards-container">
              <div
                v-for="course in recommendations"
                :key="course.id_course"
                class="card recommendation-card mb-3 shadow-sm"
              >
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      :src="`${courseThumbnailUrl}/${course.thumbnail}`"
                      class="img-fluid rounded-start h-100"
                      alt="Course thumbnail"
                      style="object-fit: cover"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body d-flex flex-column h-100">
                      <div class="d-flex justify-content-between">
                        <h6 class="card-title text-primary mb-1">
                          {{ course.title }}
                        </h6>
                        <span
                          class="badge bg-success-subtle text-success-emphasis rounded-pill text-nowrap fw-bold text-center d-flex align-items-center justify-content-center"
                        >
                          {{ (course.similarity_score * 100).toFixed(0) }}%
                          match
                        </span>
                      </div>
                      <p class="card-text fs-sm text-muted flex-grow-1">
                        {{ truncateText(course.description, 20) }}
                      </p>
                      <div class="mt-auto">
                        <router-link
                          :to="`/detail-courses/${course.id_course}`"
                          class="btn btn-sm btn-primary"
                        >
                          View Course <i class="bi bi-arrow-right-short"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <i class="bi bi-emoji-neutral fs-1 mb-3 text-muted"></i>
            <p class="fs-5">No specific course recommendations found.</p>
            <p class="text-muted">
              We couldn't find a strong match for this job right now.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  job: Object,
  visible: Boolean,
});

const emit = defineEmits(["close"]);

const recommendations = ref([]);
const loading = ref(false);
const error = ref(null);

const courseThumbnailUrl =
  process.env.VUE_APP_COURSE_THUMBNAIL_URL ||
  "http://localhost:8000/storage/courses/thumbnail";
const RECOMMENDATIONS_API_URL =
  "http://localhost:8000/api/courses-recommendations";

const fetchCourseRecommendations = async (currentJob) => {
  if (!currentJob || !currentJob.job_id) {
    recommendations.value = [];
    return;
  }

  loading.value = true;
  error.value = null;
  recommendations.value = [];

  try {
    const response = await axios.post(RECOMMENDATIONS_API_URL, {
      job_id: currentJob.job_id,
    });

    if (response.data && Array.isArray(response.data.recommended_courses)) {
      recommendations.value = response.data.recommended_courses;
    } else {
      console.warn(
        "No recommended courses in response or unexpected structure:",
        response.data
      );
      recommendations.value = [];
    }
  } catch (e) {
    console.error("Error fetching course recommendations:", e);
    error.value =
      e.response?.data?.detail || e.message || "An unknown error occurred.";
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  (newVisibility) => {
    if (newVisibility && props.job) {
      fetchCourseRecommendations(props.job);
    } else {
      recommendations.value = [];
      loading.value = false;
      error.value = null;
    }
  }
);

const closeModal = () => {
  emit("close");
};

const truncateText = (text, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}...`
    : text;
};
</script>

<style scoped>
.modal.d-block {
  display: block;
}
.fs-sm {
  font-size: 0.875rem;
}
.recommendation-card {
  transition: box-shadow 0.2s ease-in-out;
}
.recommendation-card:hover {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1) !important;
}
</style>
