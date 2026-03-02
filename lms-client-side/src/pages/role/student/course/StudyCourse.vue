<script setup>
import NavbarCourses from '@/layout/NavbarCourses.vue';
import SidebarCourse from '@/layout/SidebarCourse.vue';
import ButtonOren from '@/components/ButtonOren.vue';

</script>

<template>
    <div class="bg-room room"> <!-- tools-->

        <!-- NAVBAR START -->
        <NavbarCourses />
        <!-- NAVBAR END -->

        <!-- SIDEBAR START -->
        <SidebarCourse />
        <!-- SIDEBAR END -->

        <div id="room" class="student">
            <div class="container mt-md-2 pe-md-4">
                <h1>Halaman Study Course</h1>
            </div>
        </div>
    </div>
</template>
