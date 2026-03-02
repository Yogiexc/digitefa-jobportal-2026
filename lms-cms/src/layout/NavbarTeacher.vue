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
    <header class="nav-te">
        <nav class="navbar navbar-dashboard navbar-expand-lg navbar-light fixed-top">
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
                        <span class="profile-name fs-16">{{ getFirstName(user.name) }} <br /> <small
                                class="d-block mt--3 fs-12">{{ user.role }}</small></span>
                        <button class="btn border-0 dropdown-toggle" aria-expanded="false">
                            <i class="bi bi-chevron-down ms-0 me--8"></i>
                        </button>

                        <ul class="dropdown-menu w-100 border-0 mt--1 bg shadow" aria-labelledby="dropdownMenuButton">
                            <li>
                                <a class="dropdown-item fs-14" @click="() => router.push('/settings')">
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
                    <div id="sidebar-course" class="mt-5 sidebar-te">
                        <ul>
                            <li class="mt-12">
                                <router-link to="/dashboard-teacher"
                                    :class="['nav-link fs-16 bi bi-house-door-fill ps-4', isActive('/dashboard-teacher') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Dashboard</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/course-teacher"
                                    :class="['nav-link fs-16 bi bi-book ps-4', isActive('/course-teacher') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Course Management</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/settings"
                                    :class="['nav-link fs-16 bi bi-gear ps-4', isActive('/settings') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Settings</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/helpdesk"
                                    :class="['nav-link fs-16 bi bi-info-circle-fill ps-4', isActive('/helpdesk') ? 'active-sidebar' : 'color-sidebar']">
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
            isSettingsDropdownOpen: false,
            isMyCourseDropdownOpen: false,
        };
    },
    methods: {
        toggleSettingsDropdown() {
            this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
        },
        toggleMyCourseDropdown() {
            this.isMyCourseDropdownOpen = !this.isMyCourseDropdownOpen;
        },
        isActive(path) {
            return this.$route.path === path;
        }
    },
    watch: {
        '$route.path'(newPath) {
            if (newPath.includes('/my-course')) {
                this.isMyCourseDropdownOpen = true;
            } else {
                this.isMyCourseDropdownOpen = false;
            }
            if (newPath.includes('/settings')) {
                this.isSettingsDropdownOpen = true;
            } else {
                this.isSettingsDropdownOpen = false;
            }
        }
    }
};
</script>
