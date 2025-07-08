// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Add request interceptor
instance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem('access');

    if (accessToken) {
      // OPTIONAL: check expiry here with JWT decode if you want
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for auto-refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, refresh it
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        try {
          const response = await axios.post(
            'http://localhost:8000/api/token/refresh/',
            { refresh: refreshToken }
          );

          const newAccessToken = response.data.access;
          localStorage.setItem('access', newAccessToken);

          // Update header & retry
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh failed:', refreshError);
          // Optional: redirect to login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

