<template>
    <div id="sidebarte" class="sd sidebar-te" :class="['side', { collapsed }]" ref="sidebar">
        <ul>
            <li class="menu-header">
                <span class="menu-logo-te">Menu</span>
                <button id="toggle-btn" class="btn btn-primary" ref="toggleBtn">
                    <span class="toggle">&#9776;</span>
                </button>
            </li>
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
                <router-link to="/helpdesk"
                    :class="['nav-link fs-16 bi bi-info-circle-fill ps-4', isActive('/helpdesk') ? 'active-sidebar' : 'color-sidebar']">
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
            isSidebarCollapsed: false,
            collapsed: false
        };
    },
    mounted() {
        this.updateSidebar();
        this.setupToggle();
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
            const content = document.getElementById('contentte');
            sidebar.classList.remove('collapsed');
            content.classList.remove('collapsed');
        },
        
        // Method untuk menutup sidebar
        closeSidebar() {
            this.collapsed = true;
            const sidebar = this.$refs.sidebar;
            const content = document.getElementById('contentte');
            sidebar.classList.add('collapsed');
            content.classList.add('collapsed');
            
            // Tutup semua dropdown saat sidebar ditutup
            this.isSettingsDropdownOpen = false;
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
            const sidebar = this.$refs.sidebar;
            if (window.innerWidth <= 769) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        },

        toggleSettingsDropdown() {
            this.openSidebar(); // Pastikan sidebar terbuka
            this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
        },
        isActive(path) {
            return this.$route.path === path;
        }
    },
    watch: {
        '$route.path'(newPath) {
        }
    }
};
</script>