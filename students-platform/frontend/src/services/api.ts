import axios from 'axios';

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
    timeout: 10000,
    validateStatus: function (status) {
        // Accept all status codes to prevent axios from throwing errors
        // We'll handle error responses manually in our code
        return status >= 200 && status < 600;
    },
});
