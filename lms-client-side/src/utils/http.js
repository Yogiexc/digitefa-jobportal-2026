import axios from 'axios';

const http = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8888/api',
});

export default http;

