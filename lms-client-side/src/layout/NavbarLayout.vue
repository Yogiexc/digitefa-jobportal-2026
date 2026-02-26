<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import ButtonOrange from '@/components/ButtonOrange.vue';
import ButtonPutih from '@/components/ButtonPutih.vue';

const store = useStore();
const router = useRouter();

const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : '';
};

const profileImage = ref('');

// Mengakses status login dari Vuex
const isLoggedIn = computed(() => store.getters.isLoggedIn);
// Mengakses data user dari Vuex
const user = computed(() => store.getters.getUser);

const isMenuOpen = ref(false);

// Fungsi untuk toggle menu sidebar
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Fungsi Logout
const Logout = () => {
  store.dispatch('logout').then(() => {
    router.push('/login');
  }).catch((error) => {
    console.error('Logout failed', error);
  });
};

// Memanggil fetchUserData saat komponen dimount
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

  // Fungsi untuk mengatur transparansi navbar saat di-scroll
  const nav = document.querySelector('nav');
  const handleScroll = () => {
    if (window.pageYOffset > 30) {
      nav.classList.remove('transparent');
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  };

  // Pastikan navbar transparan di awal, baik di mobile maupun desktop
  nav.classList.add('transparent');
  window.addEventListener('scroll', handleScroll);
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <header :class="{ 'navbar-blur': isMenuOpen }">
    <nav class="navbar navbar-expand-lg navbar-light transparent fixed-top">
      <div class="container d-flex justify-content-between align-items-center">
        <a class="navbar-brand" href="/">
          <img src="../assets/images/logo-navbar.png" alt="Logo" class="img-navbar mf--45">
        </a>

        <button class="navbar-toggler border-0" type="button" @click="toggleMenu" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div :class="['offcanvas-menu', isMenuOpen ? 'show-menu' : '']">
          <div class="d-flex justify-content-between">
            <h5 class="fs-16 fw-medium mt-12">Profil</h5>
            <i class="bi bi-x" @click="toggleMenu"></i>
          </div>
          <!-- Profil User -->
          <div v-if="isLoggedIn"
            class="profile-section2 dropdown-toggle-custom rounded-5 p-2 ps-3 mb-3 ms--15 w-sidebar-profil" onclick="window.location.href='/overview'">
            <img :src="profileImage" alt="Profile Picture" class="rounded-circle profil-mobile" />
            <div>
              <span class="profile-name fs-18">{{ getFirstName(user.name) }}</span> <br>
              <small class="profile-role fs-14">{{ user.role }}</small>
            </div>
          </div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link fs-16" exact-active-class="active-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link fs-16" exact-active-class="active-link">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/courses" class="nav-link fs-16" exact-active-class="active-link">Courses</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/faq" class="nav-link fs-16" exact-active-class="active-link">FAQ</router-link>
            </li>
            <li v-if="!isLoggedIn" class="nav-item ms--15">
              <ButtonOrange onclick="window.location.href='/choose-role'" class="rounded-4 w-100 text-left w-sidebar">
                Login
              </ButtonOrange>
            </li>
            <li v-else class="nav-item ms--15">
              <ButtonOrange class="w-100 text-left h-43 fs-16 rounded-4 w-sidebar" @click="Logout">Logout</ButtonOrange>
            </li>
          </ul>
        </div>

        <div class="collapse navbar-collapse mr--35" id="navbarNav" v-if="!isMenuOpen">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link fs-16" exact-active-class="active-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link fs-16" exact-active-class="active-link">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/courses" class="nav-link fs-16" exact-active-class="active-link">Courses</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/faq" class="nav-link fs-16" exact-active-class="active-link">FAQ</router-link>
            </li>
          </ul>

          <div class="d-flex" v-if="!isLoggedIn">
            <ButtonPutih onclick="window.location.href='/choose-role'" class="rounded-3 plr me-2">
              Sign in
            </ButtonPutih>
            <ButtonOrange onclick="window.location.href='/registrasi'" class="rounded-3 plr">
              Sign Up
            </ButtonOrange>
          </div>
          <div v-else>
            <div class="dropdown profile-section dropdown-toggle-custom rounded-25 p-2 me-md-2" type="button" id="dropdownMenuButton"
            data-bs-toggle="dropdown">
              <img :src="profileImage" alt="Profile Picture" class="rounded-circle ms-1" />
              <span class="profile-name fs-16">{{ getFirstName(user.name) }} <br /> <small class="d-block mt--3 fs-12">{{ user.role
                  }}</small></span>
              <button class="btn border-0 dropdown-toggle"  aria-expanded="false">
                <i class="bi bi-chevron-down ms-0 me--8"></i>
              </button>
              <ul class="dropdown-menu border-0 mt--1 bg" aria-labelledby="dropdownMenuButton">
                <li>
                  <a class="dropdown-item fs-14" @click="() => router.push('/overview')">
                    <i class="bi bi-house-door-fill me-2 fw-light"></i> Dashboard
                  </a>
                </li>
                <li>
                  <a class="dropdown-item fs-14" @click="() => router.push('/my-course/active')">
                    <i class="bi bi-map me-2 fw-light"></i> My Course
                  </a>
                </li>
                <li>
                  <a class="dropdown-item fs-14"  @click="() => router.push('/settings')">
                    <i class="bi bi-gear me-2 fw-light"></i> Settings
                  </a>
                </li>
                <li>
                  <a class="dropdown-item fs-14" @click="() => router.push('help-desk')">
                    <i class="bi bi-exclamation-circle-fill me-2 fw-light"></i> Help Desk
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
        </div>
      </div>
    </nav>
  </header>
  <div v-if="isMenuOpen" class="overlay-blur" @click="toggleSidebar"></div>
</template>
