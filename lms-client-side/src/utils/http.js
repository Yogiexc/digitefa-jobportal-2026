import { createApp } from 'vue';
import App from './App.vue';

import axios from 'axios';

const app = createApp(App);

// Set up axios
axios.defaults.baseURL = 'http://localhost:8000/api';
app.config.globalProperties.$http = axios;

app.mount('#app');
