<template>
    <div id="sidebarsa" class="sd sidebar-sa border-end" :class="['side', { collapsed }]" ref="sidebar">
        <ul>
            <li class="menu-header">
                <span class="menu-logo-sa">Menu</span>
                <button id="toggle-btn" class="btn btn-primary" ref="toggleBtn">
                    <span class="toggle">&#9776;</span>
                </button>
            </li>
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
                <router-link to="/help-desk"
                    :class="['nav-link fs-16 bi bi-info-circle-fill ps-4', isActive('/help-desk') ? 'active-sidebar' : 'color-sidebar']">
                    <span class="icon"></span>
                    <span class="mt-2 text p-absolute">Help Desk</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isUserManagementDropdownOpen: false,
            isUserCMSDropdownOpen: false,
            isUserMasterDataropdownOpen: false,
            isSidebarCollapsed: false,
            collapsed: false
        };
    },
    computed: {
        isUserMangementActive() {
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
    mounted() {
        this.updateSidebar();
        this.setupToggle();

        if (this.$route.path.includes('/user-manajemen')) {
            this.isUserManagementDropdownOpen = true;
        }
        if (this.$route.path.includes('/cms')) {
            this.isUserCMSDropdownOpen = true;
        }
        if (this.$route.path.includes('/master-data')) {
            this.isUserMasterDataropdownOpen = true;
        }
    },
    beforeUnmount() {
        this.removeToggle();
    },
    methods: {
        // Method untuk membuka sidebar
        openSidebar() {
            if (!this.collapsed) return; // Jika sidebar sudah terbuka, tidak lakukan apa-apa
            this.collapsed = false;
            const sidebar = this.$refs.sidebar;
            const content = document.getElementById('contentsa');
            sidebar.classList.remove('collapsed');
            content.classList.remove('collapsed');
        },

        // Method untuk menutup sidebar
        closeSidebar() {
            this.collapsed = true;
            const sidebar = this.$refs.sidebar;
            const content = document.getElementById('contentsa');
            sidebar.classList.add('collapsed');
            content.classList.add('collapsed');

            // Tutup semua dropdown saat sidebar ditutup
            this.isUserManagementDropdownOpen = false;
            this.isUserCMSDropdownOpen = false;
            this.isUserMasterDataropdownOpen = false;
        },

        // Method untuk toggle sidebar menggunakan tombol hamburger
        toggleSidebar() {
            if (this.collapsed) {
                this.openSidebar();
            } else {
                this.closeSidebar();
            }
        },

        setupToggle() {
            const toggleBtn = this.$refs.toggleBtn;
            toggleBtn.addEventListener('click', this.toggleSidebar);
        },

        removeToggle() {
            const toggleBtn = this.$refs.toggleBtn;
            toggleBtn.removeEventListener('click', this.toggleSidebar);
        },

        updateSidebar() {
            const sidebar = this.$refs.sidebar;
            if (window.innerWidth <= 769) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        },

        // Function untuk membuka dropdown dan sidebar
        toggleUserManagementDropdown() {
            this.openSidebar(); // Pastikan sidebar terbuka
            this.isUserManagementDropdownOpen = !this.isUserManagementDropdownOpen;
        },

        toggleCMSDropdown() {
            this.openSidebar(); // Pastikan sidebar terbuka
            this.isUserCMSDropdownOpen = !this.isUserCMSDropdownOpen;
        },

        toggleMasterDataDropdown() {
            this.openSidebar(); // Pastikan sidebar terbuka
            this.isUserMasterDataropdownOpen = !this.isUserMasterDataropdownOpen;
        },

        isActive(path) {
            return this.$route.path === path;
        }
    },
    watch: {
        '$route.path'(newPath) {
            if (newPath.includes('/user-manajemen')) {
                this.isUserManagementDropdownOpen = true;
            } else {
                this.isUserManagementDropdownOpen = false;
            }
            if (newPath.includes('/cms')) {
                this.isUserCMSDropdownOpen = true;
            } else {
                this.isUserCMSDropdownOpen = false;
            }
            if (newPath.includes('/master-data')) {
                this.isUserMasterDataropdownOpen = true;
            } else {
                this.isUserMasterDataropdownOpen = false;
            }
        }
    }
};
</script>