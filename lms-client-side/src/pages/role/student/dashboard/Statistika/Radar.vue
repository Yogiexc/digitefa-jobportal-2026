<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);
const idUser = ref('');
const skillPoints = ref({
  total_points: 0,
  categories: []
});
let chart = null;

onMounted(async () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    idUser.value = storedUser.id_user;
    await fetchSkillPoints();
  } else {
    console.error('No user data found in localStorage.');
  }
});

const fetchSkillPoints = async () => {
  try {
    const response = await axios.get(`/students/${idUser.value}/skill-points`);
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      skillPoints.value = response.data.data;
      console.log('Stored Skill Points:', skillPoints.value);
      initializeChart();
    }
  } catch (error) {
    console.error('Error fetching skill points:', error);
  }
};

const initializeChart = () => {
  console.log('InitializeChart - skillPoints.value:', skillPoints.value);
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById('radarChart').getContext('2d');
  
  // Transform the data for the chart using categories array
  const labels = skillPoints.value.categories.map(category => category.name);
  console.log('Chart Labels:', labels);
  
  const data = skillPoints.value.categories.map(category => category.total_points);
  console.log('Chart Data:', data);

  const config = {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: 'rgba(6, 167, 59, 0.5)',
        borderColor: 'rgba(48, 48, 48, 1)',
        borderWidth: 1,
        data: data,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          ticks: {
            stepSize: 100,
            beginAtZero: true,
          },
          min: 0,
          max: 1000, // Adjusted based on your data
          pointLabels: {
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }
  };
  
  chart = new Chart(ctx, config);
};
</script>

<style scoped>
#radarChart {
    max-width: 450px;
    max-height: 450px;
}
</style>
<template>
    <div class="card px-3">
      <div class="row">
        <div class="col-md-7">
          <canvas id="radarChart"></canvas>
        </div>
        <div class="col-md-5 mt-3">
          <div v-for="category in skillPoints.categories" :key="category.id_category" class="row">
            <label class="col-sm-9 col-form-label fs-15">{{ category.name }}</label>
            <div class="col-sm-3 fs-15 mt-2">
              <span>{{ category.total_points }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>