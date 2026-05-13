import axios from 'axios';

export const secureApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
    timeout: 10000, // 10 second timeout
});

// Response interceptor to handle network errors
secureApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.message = 'Request timeout. Please check your connection and try again.';
      } else if (error.message === 'Network Error') {
        error.message = 'Unable to connect to server. Please check your internet connection.';
      } else {
        error.message = 'Unable to connect to server. Please try again later.';
      }
    }
    return Promise.reject(error);
  }
);
