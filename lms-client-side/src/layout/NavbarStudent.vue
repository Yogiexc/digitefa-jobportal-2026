<script setup>
import ButtonOrange from '@/components/ButtonOrange.vue';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex'; // Import Vuex store
import axios from 'axios';

const profileImage = ref('');

const isSidebarOpen = ref(false);
const router = useRouter();
const route = useRoute();
const store = useStore(); // Vuex store instance

const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
};

// Mengakses data user dari Vuex
const user = computed(() => store.getters.getUser);

// Mengecek apakah path aktif
const isActive = (path) => route.path === path;

// Fungsi toggle sidebar
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Fungsi Logout menggunakan Vuex
const Logout = () => {
    store.dispatch('logout').then(() => {
        router.push('/login');
    }).catch((error) => {
        console.error('Logout failed', error);
    });
};

// Memanggil action fetchUser saat komponen dimount
onMounted(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const studentProfileUrl = process.env.VUE_APP_STUDENT_PROFILE_URL;

    if (storedUser && storedUser.student) {
        profileImage.value = storedUser.student.image
            ? `${studentProfileUrl}/${storedUser.student.image}`
            : require('@/assets/images/my-profile.png');
    } else {
        profileImage.value = require('@/assets/images/my-profile.png');
    }
});


</script>

<template>
    <header class="navdua">
        <nav class="navbar  navbar-dashboard navbar-expand-lg navbar-light fixed-top border-bottom">
            <div class="toggle">
                <button class="navbar-toggler border-0" @click="toggleSidebar" type="button" aria-controls="navbarNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="container-fluid">
                <span class="navbar-brand">
                    <a href="/">
                        <img src="../assets/images/logo-navbar.png" alt="Logo" class="img-navbar" />
                    </a>
                </span>
                <div class="dropdown profile-section dropdown-toggle-custom rounded-25 p-2 me-md-2" type="button"
                    id="dropdownMenuButton" data-bs-toggle="dropdown">
                    <img :src="profileImage" alt="Profile Picture" class="rounded-circle ms-1" />
                    <span class="profile-name fs-16">{{ getFirstName(user.name) }}<br /> <small
                            class="d-block mt--3 fs-12">{{
                                user.role
                            }}</small></span>
                    <button class="btn border-0 dropdown-toggle" aria-expanded="false">
                        <i class="bi bi-chevron-down ms-0 me--8"></i>
                    </button>
                    <ul class="dropdown-menu border-0 mt--1 bg shadow" aria-labelledby="dropdownMenuButton">
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
                                <i class="bi  bi-box-arrow-right me-2 fw-light"></i> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
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
                    <div id="sidebar-course" class="mt-5">
                        <ul>
                            <li class="ms-24 mt-2">
                                <router-link to="/overview"
                                    :class="['nav-link fs-16 bi bi-house-door-fill', isActive('/overview') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Dashboard</span>
                                </router-link>
                            </li>
                            <li class="ms-24 mt-2">
                                <a href="#" @click.prevent="toggleMyCourseDropdown"
                                    class="nav-link bi bi-map color-sidebar">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">My Course</span>
                                    <span class="bi text mt-2 p-absolute r-24"
                                        :class="isMyCourseDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                </a>
                                <ul v-show="isMyCourseDropdownOpen" class="dropdown mt--3">
                                    <li class="ms-24">
                                        <router-link to="/my-course/active"
                                            :class="['nav-link', isActive('/my-course/active') ? 'active-sidebar' : 'color-sidebar']">
                                            <span class="icon"></span>
                                            <span class="mt-2 text p-absolute">Active</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-24">
                                        <router-link to="/my-course/history"
                                            :class="['nav-link', isActive('/my-course/history') ? 'active-sidebar' : 'color-sidebar']">
                                            <span class="icon"></span>
                                            <span class="mt-2 text p-absolute">History</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="ms-24 mt-2">
                                <a href="#" @click.prevent="toggleSettingsDropdown"
                                    class="nav-link bi bi-gear color-sidebar">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Settings</span>
                                    <span class="bi text mt-2 p-absolute r-24"
                                        :class="isSettingsDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                                </a>
                                <ul v-show="isSettingsDropdownOpen" class="dropdown mt--3">
                                    <li class="ms-24">
                                        <router-link to="/settings"
                                            :class="['nav-link', isActive('/settings') ? 'active-sidebar' : 'color-sidebar']">
                                            <span class="icon"></span>
                                            <span class="mt-2 text p-absolute">My Profile</span>
                                        </router-link>
                                    </li>
                                    <li class="ms-24">
                                        <router-link to="/settings"
                                            :class="['nav-link', isActive('/settings') ? 'active-sidebar' : 'color-sidebar']">
                                            <span class="icon"></span>
                                            <span class="mt-2 text p-absolute">Edit Password</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li class="ms-24 mt-2">
                                <router-link to="/help-desk"
                                    :class="['nav-link fs-16 bi bi-info-circle-fill', isActive('/help-desk') ? 'active-sidebar' : 'color-sidebar']">
                                    <span class="icon"></span>
                                    <span class="mt-2 text p-absolute">Help Desk</span>
                                </router-link>
                            </li>

                            <li>
                                <ButtonOrange class="w-96 h-43 mt-4 rounded-4 ms-2 text-left" @click="Logout">
                                    Logout
                                </ButtonOrange>
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
