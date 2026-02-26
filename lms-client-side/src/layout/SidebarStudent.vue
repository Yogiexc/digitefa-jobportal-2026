<template>
    <div id="sidebar" class="sd sidebar-sa border-end" :class="['side', { collapsed }]" ref="sidebar">
        <ul>
            <li class="menu-header">
                <span class="menu-logo-text">Menu</span>
                <button id="toggle-btn" class="btn btn-primary" ref="toggleBtn">
                    <span class="toggle">&#9776;</span>
                </button>
            </li>
            <li class="mt-12">
                <router-link to="/overview"
                    :class="['nav-link fs-16 bi bi-book ps-4', isActive('/overview') ? 'active-sidebar' : 'color-sidebar']">
                    <span class="icon"></span>
                    <span class="mt-2 text p-absolute">Dashboard</span>
                </router-link>
            </li>
            <li>
                <router-link to="/statistics"
                    :class="['nav-link fs-16 bi bi-graph-up ps-4', isActive('/statistics') ? 'active-sidebar' : 'color-sidebar']">
                    <span class="icon"></span>
                    <span class="mt-2 text p-absolute">Statistics</span>
                </router-link>
            </li>
            <li>
                <a href="#" @click.prevent="toggleMyCourseDropdown" class="nav-link bi bi-map ps-4 color-sidebar"
                    :class="{ 'active-sidebar': isActive('/my-course') }">
                    <span class="icon"></span>
                    <span class="mt-2 text p-absolute">My Course</span>
                    <span class="bi text mt-2 p-absolute r-13"
                        :class="isMyCourseDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></span>
                </a>
                <ul v-show="isMyCourseDropdownOpen" class="dropdown mt--3">
                    <li class="ms-18">
                        <router-link to="/my-course/active"
                            :class="['nav-link', isActive('/my-course/active') ? 'active-sidebar2' : 'color-sidebar2']">
                            <span class="icon"></span>
                            <span class="ms-4 mt-2 text p-absolute">Active</span>
                        </router-link>
                    </li>
                    <li class="ms-18">
                        <router-link to="/my-course/history"
                            :class="['nav-link', isActive('/my-course/history') ? 'active-sidebar2' : 'color-sidebar2']">
                            <span class="icon"></span>
                            <span class="ms-4 mt-2 text p-absolute">History</span>
                        </router-link>
                    </li>
                </ul>
            </li>
            <li>
                <router-link to="/help-desk"
                    :class="['nav-link fs-16 bi bi-info-circle-fill ps-4', isActive('/help-desk') ? 'active-sidebar' : 'color-sidebar']">
                    <span class="icon"></span>
                    <span class="mt-2 text">Help Desk</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isMyCourseDropdownOpen: false,
            collapsed: false // status sidebar, collapsed berarti tertutup
        };
    },
    mounted() {
        this.updateSidebar();
        this.setupToggle();

        // Buka dropdown yang sesuai saat halaman dimuat
        if (this.$route.path.includes('/my-course')) {
            this.isMyCourseDropdownOpen = true;
        }
    },
    beforeUnmount() {
        this.removeToggle();
    },
    methods: {
        openSidebar() {
            if (!this.collapsed) return;
            this.collapsed = false;
            const sidebar = this.$refs.sidebar;
            const content = document.getElementById('content');
            sidebar.classList.remove('collapsed');
            content.classList.remove('collapsed');
        },
        closeSidebar() {
            this.collapsed = true;
            const sidebar = this.$refs.sidebar;
            const content = document.getElementById('content');
            sidebar.classList.add('collapsed');
            content.classList.add('collapsed');
            this.isSettingsDropdownOpen = false;
            this.isMyCourseDropdownOpen = false;
        },
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
            if (window.innerWidth <= 769) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        },
        toggleMyCourseDropdown() {
            this.openSidebar();
            this.isMyCourseDropdownOpen = !this.isMyCourseDropdownOpen;
        },
        isActive(path) {
            return this.$route.path.startsWith(path);
        }
    },
    watch: {
        '$route.path'(newPath) {
            this.isMyCourseDropdownOpen = newPath.includes('/my-course');
        }
    }
};
</script>
