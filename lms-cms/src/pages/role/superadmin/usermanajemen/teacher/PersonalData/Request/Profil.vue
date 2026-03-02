<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const profileData = ref({});
const errorMessage = ref('');

const fetchProfileData = async () => {
    const id = route.params.id; // Ambil ID dari route params
    try {
        const response = await axios.get(`/teacher-update-request/${id}`);
        if (response.data.success) {
            profileData.value = response.data.data[0]; // Asumsikan API mengembalikan array
        } else {
            errorMessage.value = response.data.message;
        }
    } catch (error) {
        errorMessage.value = 'Failed to fetch profile data.';
        console.error('Error:', error);
    }
};

onMounted(() => {
    fetchProfileData();
});
</script>

<template>
    <div class="navbg-sa">
        <NavbarSA />
        <SidebarSA v-if="isSidebarVisible" />

        <div id="contentsa" class="dashboard-sa">
            <div class="container mt-80">
                <div class="row">
                    <div class="col-md-12 mt-4 mt-md-0">
                        <div class="card rounded-2 p-4 border-0">
                            <h5 class="fw-light fs-16">Digitefa/User Manajemen/Teacher/Profil</h5>
                            <h4 class="fs-24"> Profil</h4>
                            <div v-if="profileData" class="card p-3 bordersa mt-2">
                                <h5>Nama: {{ profileData.name || 'N/A' }}</h5>
                                <p>Email: {{ profileData.email || 'N/A' }}</p>
                                <p>Address: {{ profileData.address || 'N/A' }}</p>
                                <p>Bio: {{ profileData.bio || 'N/A' }}</p>
                                <!-- Tambahkan data lainnya -->
                            </div>
                            <div v-else>
                                <p>{{ errorMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
