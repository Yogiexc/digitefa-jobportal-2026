<script setup>
import NavbarStudent from '@/layout/NavbarStudent.vue';
import SidebarStudent from '@/layout/SidebarStudent.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import ButtonOrange from '@/components/ButtonOrange.vue';
import ButtonSuccess from '@/components/ButtonSuccess.vue';
import ButtonRed from '@/components/ButtonRed.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const isSidebarVisible = ref(true);
const CourseData = ref([]);
const showModal = ref(false);
const currentPage = ref(1);
const searchQuery = ref('');
const searchEnroll = ref('');
const startDate = ref('');
const endDate = ref('');
const router = useRouter();
const selectedCourse = ref(null);
const user = ref({});
const name = ref('');
const batchData = ref([]);
const courseData = ref([]);
const coursesData = ref([]);
const id_course_batch = ref('');
const courseThumbnailUrl = process.env.VUE_APP_COURSE_THUMBNAIL_URL;
const idCourseEnrollments = ref([]);
const progressMap = ref(new Map());

const form = ref({
    id_course_batch: '',
    id_student: '',
});

const fetchStudentProgressData = async () => {
    try {
        if (!idCourseEnrollments.value?.length) return;
        
        const newProgressMap = new Map();
        await Promise.all(idCourseEnrollments.value.map(async (id) => {
            try {
                const response = await axios.get(`/progress/${id}`);
                newProgressMap.set(id, response.data);
            } catch (err) {
                console.error(`Error fetching progress for enrollment ${id}:`, err);
                newProgressMap.set(id, { progress: 0 });
            }
        }));
        progressMap.value = newProgressMap;
    } catch (error) {
        console.error('Failed to fetch progress data:', error);
    }
};

const fetchCoursesData = async () => {
    try {
        const response = await axios.get('/courses-status');
        coursesData.value = response.data;
        console.log('Course Response:', response.data);
        fetchStudentProgressData();
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};


const fetchBatchData = async () => {
    try {
        const response = await axios.get('/courses-status');
        CourseData.value = response.data;
        batchData.value = response.data;

        // console.log('Full API Response:', response.data);

        if (batchData.value.length > 0 && batchData.value[0]?.batches?.length > 0) {
            id_course_batch.value = batchData.value[0].batches[0].id_course_batch;
            form.value.id_course_batch = id_course_batch.value;
        }
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

const fetchCourseData = async () => {
    try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const id_user = storedUser?.id_user;

        if (!id_user) {
            console.error('User ID not found');
            return;
        }

        const response = await axios.get(`/course-enrollments/student/${id_user}`);
        courseData.value = response.data.enrollments;

        idCourseEnrollments.value = response.data.enrollments.map(enrollment => enrollment.id_course_enrollment);

        console.log('ID Course Enrollments:', idCourseEnrollments.value);
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    }
};

idCourseEnrollments.value.forEach(async (id) => {
    try {
        const response = await axios.get(`/latest-progress/${id}`);
        console.log(`Progress Data for ${id}:`, response.data);
    } catch (error) {
        console.error(`Failed to fetch progress data for ${id}:`, error);
    }
});

const truncateText = (text, wordLimit = 3) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : text;
};


const RegisterCourse = async () => {
    form.value.id_student = user.value.student?.id_student;

    if (!form.value.id_student || !form.value.id_course_batch || !selectedCourse.value) {
        alert('Please select a course and ensure your student ID is available.');
        return;
    }

    Swal.fire({
        title: 'Are You Sure You Want to Add This Course?',
        text: 'By adding this course, you will start following the related learning materials. Are you sure you want to continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#06A73B',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Yes, Add Course',
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
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.post('/course-enrollments', {
                    id_course_batch: form.value.id_course_batch,
                    id_student: form.value.id_student,
                });
                if (response.status === 201) {
                    Swal.fire({
                        title: 'Successful Course Added!',
                        html: '<span class="custom-small-text">You have successfully added a new course to your learning list. Happy learning and improve your skills!</span>',
                        icon: 'success',
                        confirmButtonColor: '#F44336',
                        confirmButtonText: 'Close',
                        customClass: {
                            title: 'custom-title',
                            confirmButton: 'custom-button',
                        },
                        didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            confirmButton.classList.add('custom-button');
                        },
                    }).then(() => {
                        fetchCourseData();
                        showModal.value = false;
                        selectedCourse.value = null;
                    });
                    showModal.value = false;
                    selectedCourse.value = null;
                } else {
                    Swal.fire('Enrollment failed. Please try again.');
                }
            } catch (error) {
                console.error('Enrollment error:', error);
                Swal.fire('An error occurred while enrolling. Please try again.');
            }
        } else {
            showModal.value = true;
        }
    });
};

const enrollCourse = async (id_course_enrollment) => {
    Swal.fire({
        title: 'Are you sure you want to unenroll from this course?',
        text: 'By unenrolling, you will lose access to this course. Make sure you’ve completed all necessary steps.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#06A73B',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'YES',
        cancelButtonText: 'No',
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
            axios.delete(`/course-enrollments/${id_course_enrollment}`)
                .then(() => {
                    Swal.fire({
                        title: 'Successful Course Unenrolled!',
                        html: '<span class="custom-small-text">You have successfully unenrolled from this course. If you change your mind, you can always re-enroll and continue learning.</span>',
                        icon: 'success',
                        confirmButtonColor: '#F44336',
                        confirmButtonText: 'Close',
                        customClass: {
                            title: 'custom-title',
                            confirmButton: 'custom-button',
                        },
                        didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            confirmButton.classList.add('custom-button');
                        },
                    }).then(() => {
                        fetchCourseData();
                        showModal.value = false;
                        selectedCourse.value = null;
                    });
                })
                .catch((error) => {
                    console.error('Failed to unenroll course:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Sorry, you can`t unenroll from a class you`ve already worked on.',
                        icon: 'error',
                        confirmButtonColor: '#F44336',
                        confirmButtonText: 'Close',
                    });
                });
        }
    });
};

const showCoursePage = async (enrollmentId) => {
    const courseEnrollment = courseData.value.find(enrollment => enrollment.id_course_enrollment === enrollmentId);

    if (courseEnrollment) {
        const id_course = courseEnrollment.course_batch.course.id_course;
        const id_course_enrollment = enrollmentId;

        try {
            // Fetch sections and materials for this course
            const response = await axios.get('/course-sections-student', {
                params: {
                    id_course,
                    id_course_enrollment,
                },
            });

            const sections = response.data.sections;

            if (sections.length > 0) {
                const firstSection = sections[0];

                // Check for materials
                if (firstSection.materials.length > 0) {
                    const id_course_material = firstSection.materials[0].id_course_material;
                    console.log('Navigating to Course Material Page with:', { id_course, id_course_enrollment, id_course_material });
                    router.push(`/room/course-material/${id_course}/${id_course_enrollment}/${id_course_material}`);
                }
                // Check for assignments if no materials are available
                else if (firstSection.assignments.length > 0) {
                    const assignment = firstSection.assignments[0];
                    console.log('Navigating to Course Assignment Page with:', { id_course, id_course_enrollment, assignment });
                    router.push(`/room/course-assignment/${id_course}/${id_course_enrollment}/${assignment.id_course_assignment}`);
                }
                // Check for quizzes if no assignments are available
                else if (firstSection.quizzes.length > 0) {
                    const quiz = firstSection.quizzes[0];
                    console.log('Navigating to Course Quiz Page with:', { id_course, id_course_enrollment, quiz });
                    router.push(`/room/course-quiz/${id_course}/${quiz.id_quiz}/${id_course_enrollment}`);
                } else {
                    console.error('No materials, assignments, or quizzes found for the first section.');
                }
            } else {
                console.error('No sections found for the course.');
            }
        } catch (error) {
            console.error('Failed to fetch sections and materials:', error);
        }
    } else {
        console.error('Course enrollment not found for ID:', enrollmentId);
    }
};


const filteredCourses = computed(() => {
    const filteredBySearch = CourseData.value.filter(course =>
        course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    if (startDate.value && endDate.value) {
        const selectedStartDate = new Date(startDate.value);
        const selectedEndDate = new Date(endDate.value);

        return filteredBySearch.filter(course => {
            if (course.batches.length > 0) {
                const courseStartDate = new Date(course.batches[0].start_date);
                const courseEndDate = new Date(course.batches[0].end_date);
                return courseStartDate <= selectedEndDate && courseEndDate >= selectedStartDate;
            }
            return false;
        });
    }
    return filteredBySearch;
});

const filteredEnrollments = computed(() => {
    if (!searchEnroll.value) {
        return courseData.value;
    }
    const query = searchEnroll.value.toLowerCase();
    return courseData.value.filter(enrollment =>
        enrollment.course_batch.course.title.toLowerCase().includes(query) ||
        enrollment.course_batch.course.description.toLowerCase().includes(query)
    );
});


const openModal = () => {
    showModal.value = true;
    resetModal();
};

const resetModal = () => {
    selectedCourse.value = null;
    searchQuery.value = '';
    startDate.value = '';
    endDate.value = '';
};

const closeModal = () => {
    showModal.value = false;
    resetModal();
};

const selectCard = (course) => {
    selectedCourse.value = course;
    form.value.id_course_batch = course.batches[0]?.id_course_batch;
};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

onMounted(() => {
    fetchBatchData();
    fetchCoursesData();
    checkWindowSize();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored User:', storedUser);

    if (storedUser) {
        user.value = storedUser;
        name.value = user.value.name;
        console.log('User data:', user.value);
        fetchCourseData().then(() => {
            fetchStudentProgressData();
        });
    } else {
        console.error('No user data found in localStorage.');
    }

    window.addEventListener('resize', checkWindowSize);
});


onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
})
</script>

<template>
    <div class="user-background2">
        <!-- NAVBAR START -->
        <NavbarStudent />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarStudent v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="content" class="mycourse">
            <div class="container mt-80">
                <div class="row">
                    <div class="dashboard">
                        <div class="card rounded-4 p-25 border-0">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h5 class="fw-semibold fs-24 mb-3 ms-2">Learning Activity</h5>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mb-2 gap-3">
                                <div class="search-input w-md-25">
                                    <SearchComponent placeholder="Search" :classCustom="'h-40'"
                                        v-model="searchEnroll" />
                                </div>
                                <ButtonSuccess class="h-38 fs-12 px-4" @click="openModal">Add</ButtonSuccess>
                            </div>
                            <div v-if="showModal" class="modal fade show db" id="addCourseModal" tabindex="-1"
                                aria-labelledby="addCourseModalLabel" aria-hidden="true" role="dialog"
                                @click.self="closeModal">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header justify-content-center">
                                            <h5 class="modal-title fs-24 fw-medium" id="addCourseModalLabel">Add New
                                                Course</h5>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row mb-3">
                                                <div class="col-md-4">
                                                    <label for="searchCourse"
                                                        class="form-label fs-12 mb-0">Search</label>
                                                    <input type="text" class="form-control fs-12" id="searchCourse"
                                                        placeholder="Search" v-model="searchQuery">
                                                </div>
                                                <div class="col-md-4">
                                                    <label for="startDate" class="form-label fs-12 mb-0">Tanggal
                                                        Mulai</label>
                                                    <input type="date" class="form-control fs-12" id="startDate"
                                                        v-model="startDate" @input="currentPage = 1">
                                                </div>
                                                <div class="col-md-4">
                                                    <label for="endDate" class="form-label fs-12 mb-0">Tanggal
                                                        Berakhir</label>
                                                    <input type="date" class="form-control fs-12" id="endDate"
                                                        v-model="endDate" @input="currentPage = 1">
                                                </div>
                                            </div>

                                            <h5 class="mb-2 fs-16 fw-medium ">Course Name</h5>
                                            <p class="border-bottom border-black" />
                                            <div class="course-list">
                                                <div class="course-card me-2" v-for="course in filteredCourses"
                                                    :key="course.id" @click="selectCard(course)"
                                                    :class="{ 'selected': selectedCourse === course }">
                                                    <img :src="`${courseThumbnailUrl}/${course.thumbnail}`"
                                                        alt="Course Image">
                                                    <div>
                                                        <h5 class="fs-16 fw-medium">{{ course.title }}</h5>
                                                        <p class="fs-12 fw-light">{{ truncateText(course.description, 10)
                                                            }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div class="text-center mt-4">
                                                <ButtonSuccess class="h-40 fs-14 w-30" @click="RegisterCourse"
                                                    :disabled="!selectedCourse">
                                                    Enroll
                                                </ButtonSuccess>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table align-middle mb-0 bg-white rounded">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="fs-16 fw-medium">Course Name</th>
                                            <th class="fs-16 fw-medium">Progress</th>
                                            <th class="fs-16 fw-medium">Status</th>
                                            <th class="fs-16 fw-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="enrollment in filteredEnrollments"
                                            :key="enrollment.id_course_enrollment">
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img :src="`${courseThumbnailUrl}/${enrollment.course_batch.course.thumbnail}`"
                                                        class="rounded me-3" alt="Course Image" width="88px"
                                                        height="56px" />
                                                    <div class="ms-0">
                                                        <h6 class="mb-1 fs-16 fw-medium">{{
                                                            enrollment.course_batch.course.title }}</h6>
                                                        <p class="mb-0 text-muted fs-12">
                                                            {{ truncateText(enrollment.course_batch.course.description,
                                                                5) }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="me-5 w-200 position-relative">
                                                    <div class="progress mt-4 bg-progress h-8">
                                                        <div class="h-8 bg-progress-done" 
                                                            role="progressbar"
                                                            :style="{ width: (progressMap.get(enrollment.id_course_enrollment)?.progress || 0) + '%' }"
                                                            :aria-valuenow="progressMap.get(enrollment.id_course_enrollment)?.progress || 0"
                                                            aria-valuemin="0" 
                                                            aria-valuemax="100">
                                                        </div>
                                                    </div>
                                                    <span class="progress-text2 fs-14 fw-medium">
                                                        {{ progressMap.get(enrollment.id_course_enrollment)?.progress || 0 }}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <ButtonOrange @click="showCoursePage(enrollment.id_course_enrollment)"
                                                    class="fs-12 rounded-3 h-37 w-110">Continue</ButtonOrange>
                                            </td>
                                            <td>
                                                <ButtonRed class="fs-12 rounded-3 h-37 w-110 text-white"
                                                    @click="enrollCourse(enrollment.id_course_enrollment)">Delete
                                                </ButtonRed>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>