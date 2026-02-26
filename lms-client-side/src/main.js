import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Bootstrap (CSS dan JS)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PhosphorIcons from "@phosphor-icons/vue";
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import 'charts.css';

// Import custom
import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/js/main.js';

const app = createApp(App);

// Set up axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
app.config.globalProperties.$http = axios;

store.dispatch('fetchUser');

// Initialize router
app.use(router);
app.use(store);
app.use(PhosphorIcons);

// Mount the app first, then initialize AOS
app.mount('#app');
AOS.init(); // Inisialisasi AOS setelah app mount
