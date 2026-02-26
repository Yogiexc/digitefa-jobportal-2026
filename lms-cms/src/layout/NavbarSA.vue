<script setup>
import ButtonBiru from '@/components/ButtonBiru.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import { getFromDB } from '@/utils/indexedDB';

const profileImage = ref('');

const isSidebarOpen = ref(false);
const router = useRouter();
const route = useRoute();
const store = useStore(); // Vuex store instance

// Mengakses data user dari Vuex
const user = computed(() => store.getters.getUser);

const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
};

// Mengecek apakah path aktif
const isActive = (path) => route.path === path;

// Fungsi toggle sidebar
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Fungsi Logout menggunakan Vuex
const Logout = () => {
    store.dispatch('logout').then(() => {
        router.push('/');
    }).catch((error) => {
        console.error('Logout failed', error);
    });
};

// Memanggil action fetchUser saat komponen dimount
onMounted(() => {
    const storedUser = getFromDB('users', 'id_user');
    if (storedUser && storedUser.student) {
        // Access `student.image` only if it exists
        profileImage.value = storedUser.student.image
            ? `${process.env.VUE_APP_BACKEND_URL}/uploads/${storedUser.student.image}`
            : require('@/assets/images/my-profile.png');
    } else {
        profileImage.value = require('@/assets/images/my-profile.png');
    }
});

</script>

<template>
    <header class="nav-sa">
        <nav class="navbar navbar-dashboard navbar-expand-lg navbar-light fixed-top border-bottom">
            <div class="toggle">
                <button class="navbar-toggler border-0" @click="toggleSidebar" type="button" aria-controls="navbarNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <span class="navbar-brand lg">
                <a href="/">
                    <img src="../assets/images/logo-admin.png" alt="Logo" class="img-navbar" />
                </a>
            </span>
            <h1 class="kosong"></h1>
            <div class="container-fluid">
                <span class="navbar-brand">
                    <a href="/">
                        <img src="../assets/images/logo-admin.png" alt="Logo" class="img-navbar" />
                    </a>
                </span>

                <div class="notification-profile d-flex align-items-center">
                    <button class="btn border-0 position-relative me-3" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#notificationOffcanvas" aria-controls="notificationOffcanvas">
                        <i class="bi bi-bell" style="font-size: 1.5rem;"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
                    </button>

                    <div class="dropdown profile-section dropdown-toggle-custom rounded-25 p-2 me-2" type="button"
                        id="dropdownMenuButton" data-bs-toggle="dropdown">
                        <img :src="profileImage" alt="Profile Picture" class="rounded-circle ms-1" />
                        <span class="profile-name fs-16">{{ getFirstName(user.name) }}<br /> <small
                                class="d-block mt--3 fs-12">{{
                                    user.role }}</small></span>
                        <button class="btn border-0 dropdown-toggle" aria-expanded="false">
                            <i class="bi bi-chevron-down ms-0 me--8"></i>
                        </button>
                        <ul class="dropdown-menu w-100 border-0 mt--1 bg shadow" aria-labelledby="dropdownMenuButton">
                            <li>
                                <a class="dropdown-item fs-14" @click="() => router.push('/setting')">
                                    <i class="bi bi-gear me-2 fw-light"></i> Settings
                                </a>
                            </li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li>
                                <button class="dropdown-item fs-14" @click="Logout">
                                    <i class="bi bi-box-arrow-right me-2 fw-light"></i> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="notificationOffcanvas"
            aria-labelledby="notificationOffcanvasLabel">
            <div class="offcanvas-header">
                <h5 id="notificationOffcanvasLabel" class="offcanvas-title">Notifications</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="list-group">
                    <li class="list-group-item">
                        <strong>New message</strong> from John Doe.
                        <small class="text-muted d-block ">2 mins ago</small>
                    </li>
                    <li class="list-group-item">
                        Server restarted successfully.
                        <small class="text-muted d-block">10 mins ago</small>
                    </li>
                    <li class="list-group-item">
                        System update available.
                        <small class="text-muted d-block">1 hour ago</small>
                    </li>
                </ul>
                <ButtonBiru class="h-34 fs-14 w-100 mt-3">View All Notifications</ButtonBiru>
            </div>
        </div>
    </header>

    <div class="side">
        <transition name="slide">
            <div v-if="isSidebarOpen" class="sidebar">
                <div class="sidebar-content">
                    <div class="d-flex justify-content-between">
                        <h5 class="fs-16 fw-medium mt-12">Profil</h5>
                        <i @click="toggleSidebar" class="bi bi-x mt--18 mr--10"></i>
                    </div>
                    <div class="profile-section2 dropdown-toggle-custom rounded-5 p-2 ps-3 mb-3 ms--8">
                        <img :src="profileImage" alt="Profile Picture" class="rounded-circle profil-mobile" />
                        <div>
                            <span class="profile-name fs-18">{{ getFirstName(user.name) }}</span> <br>
                            <small class="profile-role fs-14">{{ user.role }}</small>
                        </div>
                    </div>
                    <div id="sidebar-course" class="mt-5 sidebar-sa">
                        <ul>
                            <li class="mt-12">
                                <router-link to="/dashboard-superadmin"
                                    :class="['nav-link fs-16 bi bi-house-door-fill ps-4', isActive('/dashboard-superadmin') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Dashboard</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/course-manajemen"
                                    :class="['nav-link fs-16 bi bi-book ps-4', isActive('/course-manajemen') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Course Management</span>
                                </router-link>
                            </li>
                            <li>
                                <a href="#" @click.prevent="toggleUserManagementDropdown"
                                    :class="['nav-link bi bi-people-fill color-sidebar ps-4', { 'active-sidebar': isUserMangementActive }]">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">User Management</span>
                                    <span class="bi text mt-2 p-absolute r-13"
                                        :class="isUserManagementDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                </a>
                                <ul v-show="isUserManagementDropdownOpen" class="dropdown mt--3">
                                    <li class="ms-18">
                                        <router-link to="/user-manajemen/superadmin"
                                            :class="['nav-link', isActive('/user-manajemen/superadmin') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Superadmin</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/user-manajemen/student"
                                            :class="['nav-link', isActive('/user-manajemen/student') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Student</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/user-manajemen/teacher"
                                            :class="['nav-link', isActive('/user-manajemen/teacher') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Teacher</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" @click.prevent="toggleCMSDropdown"
                                    :class="['nav-link bi bi-file-earmark-plus-fill color-sidebar ps-4', { 'active-sidebar': isCMSActive }]">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">CMS</span>
                                    <span class="bi text mt-2 p-absolute r-13"
                                        :class="isUserCMSDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                </a>
                                <ul v-show="isUserCMSDropdownOpen" class="dropdown mt--3">
                                    <li class="ms-18">
                                        <router-link to="/cms/media-partner"
                                            :class="['nav-link', isActive('/cms/media-partner') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Media Partner</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/cms/sosial-media"
                                            :class="['nav-link', isActive('/cms/sosial-media') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Sosial Media</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/cms/about-us"
                                            :class="['nav-link', isActive('/cms/about-us') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">About Us Content</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/cms/tc"
                                            :class="['nav-link', isActive('/cms/tc') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Terms & Conditions</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/cms/faq-admin"
                                            :class="['nav-link', isActive('/cms/faq-admin') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Faq</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" @click.prevent="toggleMasterDataDropdown"
                                    :class="['nav-link bi bi-folder-plus color-sidebar ps-4', { 'active-sidebar': isMasterDataActive }]">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Master Data</span>
                                    <span class="bi text mt-2 p-absolute r-13"
                                        :class="isUserMasterDataropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                </a>
                                <ul v-show="isUserMasterDataropdownOpen" class="dropdown mt--3">
                                    <li class="ms-18">
                                        <router-link to="/master-data/level-teacher"
                                            :class="['nav-link', isActive('/master-data/level-teacher') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Level Teacher</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/master-data/level-course"
                                            :class="['nav-link', isActive('/master-data/level-course') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Level Course</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/master-data/category"
                                            :class="['nav-link', isActive('/master-data/category') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Category</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/master-data/skills"
                                            :class="['nav-link', isActive('/master-data/skills') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Skills</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-18">
                                        <router-link to="/master-data/tools"
                                            :class="['nav-link', isActive('/master-data/tools') ? 'active-sidebar2' : 'color-sidebar2']">
                                            <span class="icon"></span>
                                            <span class="ms-4 mt-2 text p-absolute">Tools</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <router-link to="/setting"
                                    :class="['nav-link fs-16 bi bi-gear ps-4', isActive('/setting') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Setting</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/help-desk"
                                    :class="['nav-link fs-16 bi bi-info-circle-fill ps-4', isActive('/help-desk') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Help Desk</span>
                                </router-link>
                            </li>
                            <li>
                                <ButtonBiru class="w-96 h-43 mt-3 rounded-4 ms-2 text-center" @click="Logout">
                                    Logout
                                </ButtonBiru>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div v-if="isSidebarOpen" class="overlay-blur" @click="toggleSidebar"></div>
</template>

<script>
export default {
    data() {
        return {
            isUserManagementDropdownOpen: false,
            isUserCMSDropdownOpen: false,
            isUserMasterDataropdownOpen: false,
        };
    },
    computed: {
        isUserManagementActive() {
            const activeRoutes = [
                '/user-manajemen/superadmin',
                '/user-manajemen/student',
                '/user-manajemen/teacher',
            ];
            return activeRoutes.includes(this.$route.path);
        },
        isCMSActive() {
            const activeRoutes = [
                '/cms/media-partner',
                '/cms/sosial-media',
                '/cms/about-us',
                '/cms/tc',
                '/cms/faq-admin',
            ];
            return activeRoutes.includes(this.$route.path);
        },
        isMasterDataActive() {
            const activeRoutes = [
                '/master-data/level-teacher',
                '/master-data/level-course',
                '/master-data/category',
                '/master-data/skills',
                '/master-data/tools',
            ];
            return activeRoutes.includes(this.$route.path);
        },
    },
    methods: {
        toggleUserManagementDropdown() {
            this.isUserManagementDropdownOpen = !this.isUserManagementDropdownOpen;
        },
        toggleCMSDropdown() {
            this.isUserCMSDropdownOpen = !this.isUserCMSDropdownOpen;
        },
        toggleMasterDataDropdown() {
            this.isUserMasterDataropdownOpen = !this.isUserMasterDataropdownOpen;
        },
    },
    watch: {
        '$route.path'(newPath) {
            const userManagementRoutes = [
                '/user-manajemen/superadmin',
                '/user-manajemen/student',
                '/user-manajemen/teacher',
            ];
            this.isUserManagementDropdownOpen = userManagementRoutes.includes(newPath);

            const cmsRoutes = [
                '/cms/media-partner',
                '/cms/sosial-media',
                '/cms/about-us',
                '/cms/tc',
                '/cms/faq-admin',
            ];
            this.isUserCMSDropdownOpen = cmsRoutes.includes(newPath);

            const masterDataRoutes = [
                '/master-data/level-teacher',
                '/master-data/level-course',
                '/master-data/category',
                '/master-data/skills',
                '/master-data/tools',
            ];
            this.isUserMasterDataropdownOpen = masterDataRoutes.includes(newPath);
        },
    },
    mounted() {
        const userManagementRoutes = [
            '/user-manajemen/superadmin',
            '/user-manajemen/student',
            '/user-manajemen/teacher',
        ];
        this.isUserManagementDropdownOpen = userManagementRoutes.includes(this.$route.path);

        const cmsRoutes = [
            '/cms/media-partner',
            '/cms/sosial-media',
            '/cms/about-us',
            '/cms/tc',
            '/cms/faq-admin',
        ];
        this.isUserCMSDropdownOpen = cmsRoutes.includes(this.$route.path);

        const masterDataRoutes = [
            '/master-data/level-teacher',
            '/master-data/level-course',
            '/master-data/category',
            '/master-data/skills',
            '/master-data/tools',
        ];
        this.isUserMasterDataropdownOpen = masterDataRoutes.includes(this.$route.path);
    },
};
</script>
