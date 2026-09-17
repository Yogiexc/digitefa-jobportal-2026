import axios from "axios";

const Api = axios.create();

Api.defaults.baseURL = import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:3000/api";

Api.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

Api.defaults.timeout = 20000;

Api.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      token = token.replace(/^"(.*)"$/, '$1');
      try {
        const obj = JSON.parse(token);
        if (obj && obj.value) token = obj.value;
      } catch (e) { }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export default Api;
