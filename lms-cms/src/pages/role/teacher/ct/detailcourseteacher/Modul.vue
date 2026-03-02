<script setup>
import axios from 'axios';
import { ref, computed, onUnmounted, onMounted, nextTick } from 'vue';
import SidebarTeacher from '@/layout/SidebarTeacher.vue';
import NavbarTeacher from '@/layout/NavbarTeacher.vue';
import NavCourse from '../../../../../layout/NavCourse.vue';
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRoute, useRouter } from 'vue-router';

const isSidebarVisible = ref(true);
const router = useRouter();
const route = useRoute();
const dropdownVisible = ref(false);
const dropdownPosition = ref({ top: '20px', left: '0px' });
const showButtons = ref(false);
const showContent = ref(false);
const isEditing = ref(false);
const editingIndex = ref(null);
const editedContent = ref("");
const originalText = ref("Modul");
const courseId = route.params.id;
const modules = ref([]);
const material = ref([]);
const selectedModule = ref(null);
const toastMessage = ref('');
const isToastVisible = ref(false);
const toastClass = ref('bg-light-success');

const showDropdownMenu = (event, item) => {
    if (item.dropdownVisible) {
        item.dropdownVisible = false;
        return;
    }

    modules.value.forEach(module => {
        (module.materials || []).forEach(mat => mat.dropdownVisible = false);
        (module.quizs || []).forEach(qui => qui.dropdownVisible = false);
        (module.assignments || []).forEach(ass => ass.dropdownVisible = false);
        module.dropdownVisible = false;
    });

    const buttonRect = event.target.getBoundingClientRect();
    item.dropdownPosition = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`,
    };
    item.dropdownVisible = true;
    selectedModule.value = item;
};

const showMaterialDropdown = (event, material) => {
    if (material.dropdownVisible) {
        material.dropdownVisible = false;
        return;
    }

    modules.value.forEach(module => {
        (module.materials || []).forEach(mat => mat.dropdownVisible = false);
        (module.quizs || []).forEach(qui => qui.dropdownVisible = false);
        (module.assignments || []).forEach(ass => ass.dropdownVisible = false);
        module.dropdownVisible = false;
    });

    const buttonRect = event.target.getBoundingClientRect();
    material.dropdownPosition = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`,
    };
    material.dropdownVisible = true;
};

const showQuizDropdown = (event, quiz) => {
    if (quiz.dropdownVisible) {
        quiz.dropdownVisible = false;
        return;
    }

    modules.value.forEach(module => {
        (module.materials || []).forEach(mat => mat.dropdownVisible = false);
        (module.quizs || []).forEach(qui => qui.dropdownVisible = false);
        (module.assignments || []).forEach(ass => ass.dropdownVisible = false);
        module.dropdownVisible = false;
    });

    const buttonRect = event.target.getBoundingClientRect();
    quiz.dropdownPosition = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`,
    };
    quiz.dropdownVisible = true;
};

const showAssigmentDropdown = (event, assignment) => {
    if (assignment.dropdownVisible) {
        assignment.dropdownVisible = false;
        return;
    }

    modules.value.forEach(module => {
        (module.materials || []).forEach(mat => mat.dropdownVisible = false);
        (module.quizs || []).forEach(qui => qui.dropdownVisible = false);
        (module.assignments || []).forEach(ass => ass.dropdownVisible = false);
        module.dropdownVisible = false;
    });

    const buttonRect = event.target.getBoundingClientRect();
    assignment.dropdownPosition = {
        top: `${buttonRect.bottom}px`,
        left: `${buttonRect.left - 130}px`,
    };
    assignment.dropdownVisible = true;
};


const hideDropdownMenu = (item) => {
    item.dropdownVisible = false;
};

const handleClickOutside = (event) => {
    // Hide module dropdowns
    modules.value.forEach((item) => {
        if (!event.target.closest(`.dropdown-container-${item.id}`)) {
            hideDropdownMenu(item);
        }
    });

    // Hide material dropdowns
    modules.value.forEach((module) => {
        (module.materials || []).forEach((material) => {
            if (!event.target.closest(`.dropdown-container-${material.id}`)) {
                hideMaterialDropdown(material);
            }
        });
    });

    modules.value.forEach((module) => {
        (module.quizs || []).forEach((quiz) => {
            if (!event.target.closest(`.dropdown-container-${quiz.id}`)) {
                hideQuizDropdown(quiz);
            }
        });
    });

    // Hide assignment dropdowns
    modules.value.forEach((module) => {
        (module.assignments || []).forEach((assignment) => {
            if (!event.target.closest(`.dropdown-container-${assignment.id}`)) {
                hideAssignmentDropdown(assignment);
            }
        });
    });
};



const makeEdit = (index) => {
    isEditing.value = true;
    editingIndex.value = index;
    editedContent.value = modules.value[index].title;
};

const cancelEdit = () => {
    isEditing.value = false;
    editingIndex.value = null;
    editedContent.value = "";
};

const saveEdit = async () => {
    try {
        const updatedModule = {
            ...modules.value[editingIndex.value],
            title: editedContent.value,
        };
        const response = await axios.post(`/course-sections/${updatedModule.id_course_section}`, updatedModule);

        if (response.data.success) {
            modules.value[editingIndex.value] = response.data.course_section;
            cancelEdit();
        }
    } catch (error) {
        console.error('Failed to save edit:', error.response?.data || error.message);
    }
};

const deleteModule = async (id) => {
    try {
        const response = await axios.delete(`/course-sections/${id}`);
        if (response.data.success) {
            modules.value = modules.value.filter(item => item.id !== id);
            fetchModules();
            hideDropdownMenu();
        }
    } catch (error) {
        console.error('Failed to delete module:', error.response?.data || error.message);
    }
};

const fetchModules = async () => {
    try {
        const response = await axios.get(`/course-sections?id_course=${courseId}`);

        modules.value = response.data.map(module => ({
            ...module,
            dropdownVisible: false,
            dropdownPosition: { top: '0px', left: '0px' },
            materials: (module.materials || []).map(material => ({
                ...material,
                dropdownVisible: false,
                dropdownPosition: { top: '0px', left: '0px' }
            })),
            quizs: (module.quizzes || []).map(quiz => ({
                ...quiz,
                dropdownVisible: false,
                dropdownPosition: { top: '0px', left: '0px' }
            })),
            assignments: (module.assignments || []).map(assignment => ({
                ...assignment,
                dropdownVisible: false,
                dropdownPosition: { top: '0px', left: '0px' }
            }))
        }));

    } catch (error) {
        console.error('Failed to fetch modules:', error.response?.data || error.message);
    }
};

const hideMaterialDropdown = (material) => {
    material.dropdownVisible = false;
};

const deleteMaterial = async (id) => {
    try {
        const response = await axios.delete(`/course-materials/${id}`);
        if (response.data.success) {
            modules.value.forEach((module) => {
                module.materials = module.materials.filter(material => material.id_course_material !== id);
            });
        }
        showToast('Material deleted successfully!', 'success');
    } catch (error) {
        showToast('Error deleting Material.', 'error');
    }
};


const hideQuizDropdown = (quiz) => {
    quiz.dropdownVisible = false;
};

const deleteQuiz = async (id) => {
    try {
        const response = await axios.delete(`/quizzes/${id}`);
        if (response.data.success) {
            modules.value.forEach((module) => {
                module.quizs = module.quizs.filter(quiz => quiz.id_quiz !== id);
            });
        }
        showToast('Quiz deleted successfully!', 'success');
    } catch (error) {
        showToast('Error deleting Quiz.', 'error');
    }
};

const hideAssignmentDropdown = (assignment) => {
    assignment.dropdownVisible = false;
};

const deleteAssignment = async (id) => {
    try {
        const response = await axios.delete(`/course-assignments/${id}`);
        if (response.data.success) {
            modules.value.forEach((module) => {
                module.assignments = module.assignments.filter(assignments => assignments.id_course_assignment !== id);
            });
        }
        showToast('Assignment deleted successfully!', 'success');
    } catch (error) {
        showToast('Error deleting Assignment.', 'error');
    }
};


const toggleButtons = async (item) => {
    // Close all other module's buttons
    modules.value.forEach((module) => {
        if (module !== item) {
            module.showButtons = false;
        }
    });

    // Toggle current module's buttons
    item.showButtons = !item.showButtons;
    if (item.showButtons) {
        hideDropdownMenu(item);

        // Wait for the DOM to update
        await nextTick(() => {
            // Find the buttons container for the current module
            const buttonsContainer = document.querySelector(`[data-module-id="${item.id_course_section}"]`);

            if (buttonsContainer) {
                // Scroll to the buttons container
                buttonsContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    }
};

const toggleButtonsContent = async () => {
    try {
        if (!courseId) {
            console.error('Course ID is not defined.');
            return;
        }

        const newModule = {
            id_course: courseId,
            title: 'Modul',
        };

        const response = await axios.post('/course-sections', newModule);
        if (response.data.success) {
            modules.value.push(response.data.course_section);
        }
    } catch (error) {
        console.error('Failed to add module:', error.response?.data || error.message);
    }

};

const checkWindowSize = () => {
    isSidebarVisible.value = window.innerWidth >= 770;
};

const showAddVideoPage = () => {
    if (selectedModule.value) {
        const id_course_section = selectedModule.value.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/add-video/${id_course_section}`);
    }
};
const showAddQuizPage = () => {
    if (selectedModule.value) {
        const id_course_section = selectedModule.value.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/add-quiz/${id_course_section}`);
    }
};
const showAddAssignmentPage = () => {
    if (selectedModule.value) {
        const id_course_section = selectedModule.value.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/add-assignment/${id_course_section}`);
    }
};
const showEditVideoPage = (material) => {
    if (material) {
        const id_course_material = material.id_course_material;
        const id_course_section = material.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/edit-video/${id_course_material}/${id_course_section}`);
    }
};
const showEditAssignmentPage = (assignment) => {
    if (assignment) {
        const id_course_assignment = assignment.id_course_assignment;
        const id_course_section = assignment.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/edit-assignment/${id_course_assignment}/${id_course_section}`);
    }
};
const showEditQuizPage = (quiz) => {
    if (quiz) {
        const id_quiz = quiz.id_quiz;
        const id_course_section = quiz.id_course_section;
        router.push(`/course-teacher/modul/${courseId}/edit-quiz/${id_quiz}/${id_course_section}`);
    }
};

const showToast = (message) => {
    toastMessage.value = message;
    isToastVisible.value = true;
    setTimeout(() => {
        isToastVisible.value = false;
    }, 3000);
};

const closeToast = () => {
    isToastVisible.value = false;
};

onMounted(() => {
    fetchModules();
    checkWindowSize();
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkWindowSize);
    document.removeEventListener('click', handleClickOutside);
});

const truncatedText = computed(() => {
    const words = originalText.value.split(" ");
    return words.slice(0, 10).join(" ");
});
</script>

<template>
<div class="navbg-teacher">
        <!-- NAVBAR START -->
        <NavbarTeacher />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarTeacher v-if="isSidebarVisible" />
        <!-- SIDEBAR END -->

        <div id="contentte" class="dashboard-teacher">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="cbg-card p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/Course Manajemen/Modul</h5>
                            <h4 class="fs-24">Modul</h4>
                            <div class="cbg-card2 p-3 bordersa mt-2 min-height-68 modul">
                                <NavCourse />
                                <div v-for="item in modules" :key="item.id">
                                    <div
                                        class="rounded-3 w-100 c-border h-43 d-flex align-items-center justify-content-between ps-2 fs-14 my-3 card-abu-muda">
                                        <div v-if="isEditing && editingIndex === modules.indexOf(item)"
                                            class="d-flex justify-content-start">
                                            <input v-model="editedContent" placeholder="Edit modal here"
                                                class="form-control dynamic-input me-2 border-0" />
                                            <div>
                                                <ButtonBiru class="h-34 me-2 fs-14" @click="saveEdit">Save</ButtonBiru>
                                                <button @click="cancelEdit"
                                                    class="btn btn-secondary rounded-3 fs-14">Cancel</button>
                                            </div>
                                        </div>
                                        <div v-else class="text-container" @dblclick="makeEdit(modules.indexOf(item))">
                                            <span class="bi bi-pencil-square"></span> {{ item.title }}
                                        </div>
                                        <div :class="`dropdown-container-${item.id} ps-2`">
                                            <button class="btn border-0 dropdown-toggle" type="button"
                                                @click="showDropdownMenu($event, item)">
                                                <p class="bi bi-three-dots-vertical"
                                                    style="margin-bottom: -8px; margin-top: -5px;"></p>
                                            </button>
                                            <ul v-if="item.dropdownVisible" class="fixed-dropdown dropdown-menu"
                                                style="display: block"
                                                :style="{ top: item.dropdownPosition.top, left: item.dropdownPosition.left }">
                                                <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                <li>
                                                    <a class="dropdown-item fw-normal fs-14 pointer"
                                                        @click="toggleButtons(item)">
                                                        <i class="bi bi-file-earmark-plus me-1 fs-14"></i>
                                                        Add Content
                                                    </a>
                                                </li>
                                                <li>
                                                    <a @click="deleteModule(item.id_course_section)"
                                                        class="dropdown-item fw-normal fs-14 pointer">
                                                        <i class="bi bi-trash me-1 fs-14"></i>
                                                        Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- Course Material Start -->
                                    <div v-for="material in item.materials" :key="material.id_material">
                                        <div class="d-flex justify-content-center mb-2">
                                            <div
                                                class="rounded-3 w-94 c-border h-43 d-flex align-items-center justify-content-between ps-2 fs-14">
                                                <span>{{ material.title }}</span>
                                                <span class="ms-auto">Material</span>
                                                <div :class="`dropdown-container-${material.id}`">
                                                    <button class="btn border-0 dropdown-toggle" type="button"
                                                        @click="showMaterialDropdown($event, material)">
                                                        <p class="bi bi-three-dots-vertical"
                                                            style="margin-bottom: -8px; margin-top: -5px;"></p>
                                                    </button>
                                                    <ul v-if="material.dropdownVisible"
                                                        class="fixed-dropdown dropdown-menu" style="display: block"
                                                        :style="{ top: material.dropdownPosition.top, left: material.dropdownPosition.left }">
                                                        <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                        <li>
                                                            <a @click="showEditVideoPage(material)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-file-earmark-play me-1 fs-14"></i>
                                                                Edit Materi
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a @click="deleteMaterial(material.id_course_material)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-trash me-1 fs-14"></i>
                                                                Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Course Quiz Start -->
                                    <div v-for="quiz in item.quizs" :key="quiz.id_quiz">
                                        <div class="d-flex justify-content-center mb-2">
                                            <div
                                                class="rounded-3 w-94 c-border h-43 d-flex align-items-center justify-content-between ps-2 fs-14">
                                                <span>{{ quiz.title }}</span>
                                                <span class="ms-auto">Quiz</span>
                                                <div :class="`dropdown-container-${quiz.id}`">
                                                    <button class="btn border-0 dropdown-toggle" type="button"
                                                        @click="showQuizDropdown($event, quiz)">
                                                        <p class="bi bi-three-dots-vertical"
                                                            style="margin-bottom: -8px; margin-top: -5px;"></p>
                                                    </button>
                                                    <ul v-if="quiz.dropdownVisible" class="fixed-dropdown dropdown-menu"
                                                        style="display: block"
                                                        :style="{ top: quiz.dropdownPosition.top, left: quiz.dropdownPosition.left }">
                                                        <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                        <li>
                                                            <a @click="showEditQuizPage(quiz)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-file-earmark-plus me-1 fs-14"></i>
                                                                Edit Quiz
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a @click="deleteQuiz(quiz.id_quiz)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-trash me-1 fs-14"></i>
                                                                Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Course Assignment Start -->
                                    <div v-for="assignment in item.assignments" :key="assignment.id">
                                        <div class="d-flex justify-content-center mb-2">
                                            <div
                                                class="rounded-3 w-94 c-border h-43 d-flex align-items-center justify-content-between ps-2 fs-14">
                                                <span>{{ assignment.title }}</span>
                                                <span class="ms-auto">Assignment</span>
                                                <div :class="`dropdown-container-${assignment.id}`">
                                                    <button class="btn border-0 dropdown-toggle" type="button"
                                                        @click="showAssigmentDropdown($event, assignment)">
                                                        <p class="bi bi-three-dots-vertical"
                                                            style="margin-bottom: -8px; margin-top: -5px;"></p>
                                                    </button>
                                                    <ul v-if="assignment.dropdownVisible"
                                                        class="fixed-dropdown dropdown-menu" style="display: block"
                                                        :style="{ top: assignment.dropdownPosition.top, left: assignment.dropdownPosition.left }">
                                                        <h5 class="ms-3 fs-16 fw-normal">Action</h5>
                                                        <li>
                                                            <a @click="showEditAssignmentPage(assignment)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-file-earmark-plus me-1 fs-14"></i>
                                                                Edit Assignment
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a @click="deleteAssignment(assignment.id_course_assignment)"
                                                                class="dropdown-item fw-normal fs-14 pointer">
                                                                <i class="bi bi-trash me-1 fs-14"></i>
                                                                Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="item.showButtons" :data-module-id="item.id_course_section"
                                        class="d-flex justify-content-center gap-2 h-40 my-3">
                                        <ButtonBiru @click="showAddVideoPage">+ Tambah Materi</ButtonBiru>
                                        <ButtonBiru @click="showAddQuizPage">+ Tambah Quiz</ButtonBiru>
                                        <ButtonBiru @click="showAddAssignmentPage">+ Tambah Assignment</ButtonBiru>
                                    </div>
                                </div>
                                <button
                                    class="bg-none rounded-3 w-100 h-43 d-flex align-items-center ps-2 fs-14 border-spasi mt-3 gap-2"
                                    @click="toggleButtonsContent" title="Tambah Modul Baru">
                                    <i class="bi bi-file-earmark-plus-fill"></i>
                                    <span>Add Modul</span>
                                </button>
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

<style>
button.bg-none:hover {
    background-color: #e0e0e0;
    transition: background-color 0.3s ease;
    cursor: pointer;
}
</style>