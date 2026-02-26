<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import NavbarLayout from '@/layout/NavbarLayout.vue';
import FooterLayout from '@/layout/FooterLayout.vue';
import CourseRecommendationsModal from '@/components/CourseRecommendationsModal.vue'; 

const currentPage = ref(1);
const itemsPerPage = 6;
const router = useRouter();
const courseData = ref([]);
const loadingCourses = ref(true); 
const errorCourses = ref(null);   
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const categoryData = ref([]);
const selectedCategory = ref('all');

const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL || 'http://localhost:8000/storage/courses/thumbnail';
const courseProfilUrl = process.env.VUE_APP_TEACHER_PROFILE_URL || 'http://localhost:8000/storage/users/photo-profile';

const jobsData = ref([]);
const loadingJobs = ref(true);
const errorJobs = ref(null);
const searchQueryJobs = ref(''); 
const selectedJobForRecommendations = ref(null);
const showCourseRecModal = ref(false);          
const appliedJobsData = ref([]);
const loadingAppliedJobs = ref(true);
const errorAppliedJobs = ref(null);
const user = ref(null); 
const savedJobsData = ref([]);
const loadingSavedJobs = ref(true);
const errorSavedJobs = ref(null);
const searchQueryAppliedJobs = ref('');
const searchQuerySavedJobs = ref('');

const filteredAppliedJobs = computed(() => {
  if (!searchQueryAppliedJobs.value.trim()) return appliedJobsData.value;
  const term = searchQueryAppliedJobs.value.toLowerCase();
  return appliedJobsData.value.filter(applied =>
    (applied.job_details?.title?.toLowerCase().includes(term)) ||
    (applied.job_details?.company_name?.toLowerCase().includes(term))
  );
});

const filteredSavedJobs = computed(() => {
  if (!searchQuerySavedJobs.value.trim()) return savedJobsData.value;
  const term = searchQuerySavedJobs.value.toLowerCase();
  return savedJobsData.value.filter(saved =>
    (saved.title?.toLowerCase().includes(term)) ||
    (saved.company?.market_name?.toLowerCase().includes(term))
  );
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const truncateText = (text, wordLimit = 3) => {
    if (!text || typeof text !== 'string') return '';
    const words = text.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
};

const capitalize = (value) => {
  if (!value || typeof value !== 'string') return '';
  value = value.toString().replace(/_/g, ' ');
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const fetchLoginStateAndAppliedJobs = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    loadingAppliedJobs.value = false;
    loadingSavedJobs.value = false;
    return;
  }

  loadingAppliedJobs.value = true;
  loadingSavedJobs.value = true;
  errorAppliedJobs.value = null;
  errorSavedJobs.value = null;

   try {
    const userResponse = await axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (userResponse.data && userResponse.data.user) {
      user.value = userResponse.data.user;
      const jobPortalId = user.value.job_portal_id;

      if (jobPortalId) {
        const [appliedResponse, savedResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/lms/applied-jobs/${jobPortalId}`, {
            headers: { 'X-API-KEY': 'D1GiT3f@' }
          }).catch(e => ({ error: e })),

          axios.get(`http://localhost:3000/api/lms/saved-jobs/${jobPortalId}`, {
            headers: { 'X-API-KEY': 'D1GiT3f@' }
          }).catch(e => ({ error: e }))
        ]);

        if (appliedResponse && !appliedResponse.error && appliedResponse.data && Array.isArray(appliedResponse.data.data)) {
          appliedJobsData.value = appliedResponse.data.data;
        } else {
          console.error('Failed to fetch applied jobs:', appliedResponse.error);
          errorAppliedJobs.value = 'Could not load your applied jobs.';
        }

        if (savedResponse && !savedResponse.error && savedResponse.data.status === 'success' && Array.isArray(savedResponse.data.data)) {
          savedJobsData.value = savedResponse.data.data;
        } else {
          console.error('Failed to fetch saved jobs:', savedResponse.error);
          errorSavedJobs.value = 'Could not load your saved jobs.';
        }

      } else {
        appliedJobsData.value = [];
        savedJobsData.value = [];
      }
    }
  } catch (e) {
    console.error('Failed to fetch user data and integrations:', e);
    errorAppliedJobs.value = 'Could not load your application history.';
    errorSavedJobs.value = 'Could not load your saved jobs.';
  } finally {
    loadingAppliedJobs.value = false;
    loadingSavedJobs.value = false;
  }
};

const fetchCategoryData = async () => {
    try {
        const response = await axios.get('/categories'); 

        if (response.data && Array.isArray(response.data)) {
            categoryData.value = response.data.slice(-4); 
        } 
        else if (response.data && Array.isArray(response.data.data)) {
            categoryData.value = response.data.data.slice(0, 4);
        }
        else {
            console.warn("Category data not in expected array format.", response.data);
            categoryData.value = [];
        }
    } catch (error) {
        console.error('Error fetching category data:', error);
        categoryData.value = [];
    }
};

const fetchCoursesData = async () => {
    loadingCourses.value = true;
    errorCourses.value = null;
    try {
        const response = await axios.get('/courses-status');

        if (response.data && Array.isArray(response.data)) {
            courseData.value = response.data;
        } else {
             if (response.data && Array.isArray(response.data.data)) {
                 courseData.value = response.data.data;
             } else {
                console.warn("Course data not in expected array format.", response.data);
                courseData.value = [];
             }
        }
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        errorCourses.value = "Could not load courses. Please check your connection or try again later.";
    } finally {
        loadingCourses.value = false;
    }
};

const filteredCourses = computed(() => {
    let courses = [...courseData.value];
    if (selectedCategory.value !== 'all') {
        courses = courses.filter(course => course.category?.name.toLowerCase() === selectedCategory.value);
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        courses = courses.filter(course =>
            (course.title && course.title.toLowerCase().includes(query)) ||
            (course.description && course.description.toLowerCase().includes(query))
        );
    }
    if (startDate.value && endDate.value) {
        const selectedStartDate = new Date(startDate.value);
        const selectedEndDate = new Date(endDate.value);
        courses = courses.filter(course => {
            if (course.batches && course.batches.length > 0) {
                const courseStartDate = new Date(course.batches[0].start_date);
                const courseEndDate = new Date(course.batches[0].end_date);
                return courseStartDate <= selectedEndDate && courseEndDate >= selectedStartDate;
            }
            return false;
        });
    }
    return courses;
});

const setCategory = (category) => {
    selectedCategory.value = category;
    currentPage.value = 1;
};

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / itemsPerPage) || 1);
const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredCourses.value.slice(start, start + itemsPerPage);
});
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};
const showDetailCourse = (id) => {
    router.push(`/detail-courses/${id}`);
};

const fetchJobsData = async () => {
  loadingJobs.value = true;
  errorJobs.value = null;
  try {
    const response = await axios.get('http://localhost:3000/api/lms/jobs');
    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      jobsData.value = response.data.data;
    } else {
      throw new Error(response.data.message || 'Invalid data from jobs API');
    }
  } catch (e) {
    console.error('Failed to fetch jobs:', e);
    errorJobs.value = e.response?.data?.message || e.message || 'Could not load job opportunities.';
  } finally {
    loadingJobs.value = false;
  }
};

const filteredJobs = computed(() => {
  if (!searchQueryJobs.value.trim()) return jobsData.value;
  const term = searchQueryJobs.value.toLowerCase();
  return jobsData.value.filter(job =>
    (job.title?.toLowerCase().includes(term)) ||
    (job.company?.market_name?.toLowerCase().includes(term)) ||
    (Array.isArray(job.skills_requirement) && job.skills_requirement.some(skill => skill.toLowerCase().includes(term)))
  );
});

const openCourseRecModal = (job) => {
  selectedJobForRecommendations.value = job;
  showCourseRecModal.value = true;
};
const closeCourseRecModal = () => {
  showCourseRecModal.value = false;
  selectedJobForRecommendations.value = null;
};

onMounted(() => {
    fetchCategoryData();
    fetchCoursesData();
    fetchJobsData();
    fetchLoginStateAndAppliedJobs();
});
</script>

<template>
    <NavbarLayout />

    <!-- BREADCRUMB -->
    <section class="bg-about-isi fw-semibold mt-100">
        <div class="container">
            <nav style="--bs-breadcrumb-divider: '›';" aria-label="breadcrumb">
                <ol class="breadcrumb my-4 ms-1">
                    <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                    <li class="breadcrumb-item active" aria-current="page">Courses & Jobs</li>
                </ol>
            </nav>
        </div>
    </section>

    <!-- COURSES SECTION START -->
    <section class="coursespage">
        <div class="container my-5">
            <div class="my-4 d-flex justify-content-center">
                <div class="search-input w-100 me-md-1">
                    <input type="text" class="form-control rounded-3 h-43" v-model="searchQuery" placeholder="Find Course..."/>
                    <i class="bi bi-search"></i>
                </div>
            </div>
            <div class="choose-section d-flex justify-content-between align-items-start h4 mb-4 border-bottom border-success-subtle choose">
                <h5 class="me-3 mt-md-3 opacity-50 pointer fs-16" :class="{ active: selectedCategory === 'all' }" @click="setCategory('all')">All</h5>
                <h5 v-for="category in categoryData" :key="category.id_category" class="me-3 mt-md-3 opacity-50 pointer fs-16" :class="{ active: selectedCategory === category.name.toLowerCase() }" @click="setCategory(category.name.toLowerCase())">{{ category.name }}</h5>
                <div class="ms-auto d-flex align-items-center">
                    <div class="d-flex flex-column me-3">
                        <label for="startDate" class="form-label fs-12 mb-1 fw-normal">Tanggal Mulai</label>
                        <input type="date" id="startDate" class="form-control rounded-3 mb-1 c-border fs-12" v-model="startDate" @input="currentPage = 1" aria-label="Tanggal Mulai"/>
                    </div>
                    <div class="d-flex flex-column">
                        <label for="endDate" class="form-label fs-12 mb-1 fw-normal">Tanggal Berakhir</label>
                        <input type="date" id="endDate" class="form-control rounded-3 mb-1 c-border fs-12" v-model="endDate" @input="currentPage = 1" aria-label="Tanggal Berakhir"/>
                    </div>
                </div>
            </div>

            <div v-if="loadingCourses" class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>
            <div v-else-if="errorCourses" class="alert alert-danger text-center">{{ errorCourses }}</div>
            <div v-else-if="paginatedCourses.length > 0">
                <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <div class="row">
                                <div class="col-md-4 shw" v-for="course in paginatedCourses" :key="course.id_course">
                                    <div class="card img-thumbnail p-2 bg-biru mb-4 rounded-4 border-0 course-card" @click="showDetailCourse(course.id_course)">
                                        <div class="card w-100 border-0 rounded-4">
                                            <div class="course-thumbnail-wrapper position-relative">
                                                <img :src="course.thumbnail ? `${courseThumbnailUrl}/${course.thumbnail}` : require('@/assets/images/Cover.png')"
                                                    class="card-img-top rounded-4 course-thumbnail-full object-fit-contain" alt="Course Thumbnail">
                                                <p class="w-170 text-center fs-12 date" v-if="course.batches.length > 0">{{ course.batches[0].start_date }} - {{ course.batches[0].end_date }}</p>
                                            </div>
                                            <div class="card-body">
                                                <div class="d-flex align-items-center mb-3">
                                                    <img :src="course.teacher?.photo_profile ? `${courseProfilUrl}/${course.teacher.photo_profile}` : require('@/assets/images/avatar.png')"
                                                        class="teacher-photo-standard me-3" alt="Teacher Photo">
                                                    <div>
                                                        <p class="fw-medium mb-0 fs-16">{{ course.teacher?.user?.name || 'Instructor' }}</p>
                                                        <p class="text-muted mb-0">{{ course.teacher?.expertise || 'Expert' }}</p>
                                                    </div>
                                                </div>
                                                <h5 class="mt-2 fs-16 fw-medium text-dark">{{ course.title }}</h5>
                                                <p class="text-justify opacity-75">{{ truncateText(course.description, 20) }}</p>
                                                <div class="d-flex justify-content-around">
                                                    <span class="bi bi-clock me-4">7 <span>day</span></span>
                                                    <span class="bi bi-people me-4">80<span>/240</span></span>
                                                    <span class="bi bi-star-fill opacity-75"> 4,8</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination d-flex justify-content-center">
                        <li v-for="page in totalPages" :key="page" :class="['page-item', { active: currentPage === page }]">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div v-else class="text-center text-muted py-5"><p>No Course batches are available for categories.</p></div>
        </div>
    </section>
    <!-- COURSES END -->
    <!-- JOB LIST SECTION START -->
    <section class="job-portal-section bg-light py-5 border-top">
        <div class="container">
            <h2 class="display-6 fw-bold mb-4 text-center text-success">Job Opportunities</h2>
            <p class="text-center text-muted mb-5 lead fs-6">Find your next career step and get course recommendations.</p>

            <div class="mb-5 mx-auto" style="max-width: 700px;">
                <div class="search-input position-relative">
                    <input type="text" v-model="searchQueryJobs" placeholder="Search jobs by title, company, or skills..." class="form-control form-control-lg rounded-pill" />
                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <div v-if="loadingJobs" class="text-center py-5"><div class="spinner-border text-success" role="status"><span class="visually-hidden">Loading...</span></div></div>
            <div v-else-if="errorJobs" class="alert alert-warning text-center">{{ errorJobs }}</div>
            <div v-else-if="filteredJobs.length === 0" class="text-center text-muted py-5"><p>No job opportunities found.</p></div>
            <div v-else class="row g-4">
                <div v-for="job in filteredJobs" :key="job.job_id" class="col-md-6 col-lg-4 d-flex align-items-stretch">
                    <div class="card job-card h-100 shadow-sm rounded-4 border-0">
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="fw-semibold mb-1 fs-6 text-success">{{ job.company.market_name || job.company.legal_name }}</h5>
                            <p class="text-muted fs-sm mb-2"><i class="bi bi-geo-alt-fill me-1"></i>{{ job.location }}</p>
                            <h6 class="card-title fw-bold mt-2 job-title-clamp">{{ job.title }}</h6>
                            <p class="card-text fs-sm text-muted job-desc-clamp flex-grow-1">{{ truncateText(job.description, 15) }}</p>
                            <div class="job-meta fs-xs text-muted mb-3">
                                <span class="badge bg-secondary-subtle text-secondary-emphasis fw-normal me-1">{{ capitalize(job.employment_type) }}</span>
                                <span class="badge bg-secondary-subtle text-secondary-emphasis fw-normal">{{ capitalize(job.work_type) }}</span>
                            </div>
                            <div class="mt-auto pt-3 border-top">
                                <button @click="openCourseRecModal(job)" class="btn btn-info w-100 text-white"><i class="bi bi-stars me-1"></i> Rekomendasi Kursus</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- JOB PORTAL SECTION END -->
    <!-- MY APPLIED JOBS SECTION START -->
    <section v-if="user" class="my-applied-jobs-section bg-white py-5">
        <div class="container">
            <h2 class="display-6 fw-bold mb-4 text-center" style="color: #0d6efd;">My Applied Jobs</h2>
            
            <!-- Tambahkan Search Bar jika ada data -->
            <div v-if="user.job_portal_id" class="mb-5 mx-auto" style="max-width: 700px;">
                <div class="search-input position-relative">
                    <input type="text" v-model="searchQueryAppliedJobs" placeholder="Search your applied jobs..." class="form-control form-control-lg rounded-pill" />
                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <p v-if="!user.job_portal_id" class="text-center text-muted mb-5">
                Link your account to the Job Portal to see your application history here. <router-link to="/settings">Go to Settings</router-link>
            </p>

            <div v-if="loadingAppliedJobs" class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
            <div v-else-if="errorAppliedJobs" class="alert alert-danger text-center">{{ errorAppliedJobs }}</div>
            <!-- Gunakan filteredAppliedJobs untuk mengecek panjang array -->
            <div v-else-if="filteredAppliedJobs.length === 0 && user.job_portal_id" class="text-center text-muted py-5">
                <p v-if="searchQueryAppliedJobs">No applied jobs found for "{{ searchQueryAppliedJobs }}".</p>
                <p v-else>You haven't applied for any jobs yet.</p>
            </div>

            <!-- Gunakan filteredAppliedJobs untuk iterasi v-for -->
            <div v-else-if="filteredAppliedJobs.length > 0" class="row g-4">
                <!-- Ganti appliedJob di v-for dengan item dari filteredAppliedJobs -->
                <div v-for="appliedJob in filteredAppliedJobs" :key="appliedJob.application_id" class="col-md-6 col-lg-4 d-flex align-items-stretch">
                    <!-- Gunakan struktur card yang sama persis dengan Job Opportunities -->
                    <div class="card job-card h-100 shadow-sm rounded-4 border-0">
                        <div class="card-body d-flex flex-column p-4">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="fw-semibold mb-1 fs-6 text-success">{{ appliedJob.job_details.company_name }}</h5>
                                <span :class="`badge bg-${appliedJob.status.toLowerCase() === 'accepted' ? 'success' : (appliedJob.status.toLowerCase() === 'rejected' ? 'danger' : 'secondary')}-subtle text-${appliedJob.status.toLowerCase() === 'accepted' ? 'success' : (appliedJob.status.toLowerCase() === 'rejected' ? 'danger' : 'secondary')}-emphasis fw-semibold`">
                                    {{ capitalize(appliedJob.status) }}
                                </span>
                            </div>
                            <p class="text-muted fs-sm mb-2"><i class="bi bi-geo-alt-fill me-1"></i>{{ appliedJob.job_details.location }}</p>
                            <h6 class="card-title fw-bold mt-2 job-title-clamp flex-grow-1">{{ appliedJob.job_details.title }}</h6>
                            
                            <div class="mt-auto pt-3 border-top">
                                 <p class="fs-xs text-muted mb-2">Applied on: {{ formatDate(appliedJob.applied_at) }}</p>
                                <button @click="openCourseRecModal(appliedJob.job_details)" class="btn btn-info w-100 text-white">
                                    <i class="bi bi-stars me-1"></i> Rekomendasi Kursus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- MY APPLIED JOBS SECTION END -->
     <section v-if="user && user.job_portal_id" class="my-saved-jobs-section bg-light py-5 border-top">
        <div class="container">
            <h2 class="display-6 fw-bold mb-4 text-center" style="color: #6f42c1;">My Saved Jobs</h2>
            
            <!-- Tambahkan Search Bar jika ada data -->
            <div class="mb-5 mx-auto" style="max-width: 700px;">
                <div class="search-input position-relative">
                    <input type="text" v-model="searchQuerySavedJobs" placeholder="Search your saved jobs..." class="form-control form-control-lg rounded-pill" />
                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <div v-if="loadingSavedJobs" class="text-center py-5"><div class="spinner-border" style="color: #6f42c1;" role="status"></div></div>
            <div v-else-if="errorSavedJobs" class="alert alert-danger text-center">{{ errorSavedJobs }}</div>
            <!-- Gunakan filteredSavedJobs untuk mengecek panjang array -->
            <div v-else-if="filteredSavedJobs.length === 0" class="text-center text-muted py-5">
                <p v-if="searchQuerySavedJobs">No saved jobs found for "{{ searchQuerySavedJobs }}".</p>
                <p v-else>You haven't saved any jobs yet.</p>
            </div>

            <!-- Gunakan filteredSavedJobs untuk iterasi v-for -->
            <div v-else class="row g-4">
                <div v-for="savedJob in filteredSavedJobs" :key="savedJob.job_id" class="col-md-6 col-lg-4 d-flex align-items-stretch">
                    <!-- Gunakan struktur card yang sama persis dengan Job Opportunities -->
                    <div class="card job-card h-100 shadow-sm rounded-4 border-0">
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="fw-semibold mb-1 fs-6 text-success">{{ savedJob.company.market_name }}</h5>
                            <p class="text-muted fs-sm mb-2"><i class="bi bi-geo-alt-fill me-1"></i>{{ savedJob.location }}</p>
                            <h6 class="card-title fw-bold mt-2 job-title-clamp flex-grow-1">{{ savedJob.title }}</h6>
                            
                            <div class="job-meta fs-xs text-muted mb-3">
                                <span class="badge bg-secondary-subtle text-secondary-emphasis fw-normal me-1">{{ capitalize(savedJob.employment_type) }}</span>
                                <span class="badge bg-secondary-subtle text-secondary-emphasis fw-normal">{{ capitalize(savedJob.work_type) }}</span>
                            </div>

                            <div class="mt-auto pt-3 border-top">
                                <p class="fs-xs text-muted mb-2">Saved on: {{ formatDate(savedJob.saved_at) }}</p>
                                <button @click="openCourseRecModal(savedJob)" class="btn btn-info w-100 text-white">
                                    <i class="bi bi-stars me-1"></i> Rekomendasi Kursus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- MY SAVED JOBS SECTION END -->
    <FooterLayout />

    <CourseRecommendationsModal
        :visible="showCourseRecModal"
        :job="selectedJobForRecommendations"
        @close="closeCourseRecModal"
    />
</template>

<style scoped>
/* Gaya asli Anda */
.mt-100 { margin-top: 100px; }
.h-43 { height: 43px; }
.fs-16 { font-size: 16px; }
.fs-12 { font-size: 12px; }
.c-border { border-color: #ced4da; }
.bg-biru { background-color: #f0f8ff; }
.pointer { cursor: pointer; }
.choose .pointer.active { font-weight: bold; color: #198754; border-bottom: 2px solid #198754; }
.w-170 { width: 170px; }
.date {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 8px;
    border-radius: 0.25rem;
}
.search-input {
    position: relative;
}
.search-input input {
    padding-right: 2.5rem;
}
.search-input i {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
}
.course-card {
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .4rem .8rem rgba(0,0,0,.1)!important;
}
.job-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .4rem .8rem rgba(0,0,0,.1)!important;
}
.job-title-clamp, .job-desc-clamp {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.job-title-clamp { -webkit-line-clamp: 2; }
.job-desc-clamp { -webkit-line-clamp: 3; }
.course-thumbnail-full {
    width: 100% !important;
    height: 200px !important; /* Set fixed height */
    object-fit: cover !important; /* This will fill the container and crop if needed */
    object-position: center !important; /* Center the image when cropping */
}

/* If you want the image to stretch without maintaining aspect ratio */
.course-thumbnail-stretch {
    width: 100% !important;
    height: 200px !important;
    object-fit: fill !important; /* This will stretch the image to fill completely */
}

/* If you want to maintain aspect ratio but fill with background */
.course-thumbnail-background {
    width: 100%;
    height: 200px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 1rem;
}
.teacher-photo-standard {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    padding: 2px;
    border: none;
    display: block;
}
@media (max-width: 768px) {
  .course-thumbnail-full {
    height: 140px;
  }
  .teacher-photo-standard {
    width: 40px;
    height: 40px;
  }
}
</style>