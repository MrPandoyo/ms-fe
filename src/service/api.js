import axios from 'axios';
import {useAuthenticationStore} from "@/stores/app.js";
import router from "@/router/index.js";

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API base URL
  timeout: 120000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // You can add other default headers here if needed
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  config => {
    // Get the token from wherever you store it (e.g., localStorage, Vuex/Pinia store)
    const token = useAuthenticationStore().getToken(); // Or from your auth store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // For other types of headers:
      // config.headers['X-Custom-Header'] = 'YourCustomValue';
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (for error handling, etc.)
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle global errors here (e.g., redirect to login on 401)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request. Redirecting to login...');
      useAuthenticationStore().removeUser()
      router.push('/login');
      // Example: router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
