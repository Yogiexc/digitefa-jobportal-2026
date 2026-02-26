<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'LineChartCourse',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    const initChart = () => {
      const ctx = chartCanvas.value.getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: props.chartData,
        options: props.chartOptions
      });
    };

    watch(() => props.chartData, (newVal) => {
      if (chart) {
        chart.data = newVal;
        chart.update();
      }
    }, { deep: true });

    onMounted(() => {
      initChart();
    });

    return {
      chartCanvas
    };
  }
};
</script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: auto;
  }
  </style>
  