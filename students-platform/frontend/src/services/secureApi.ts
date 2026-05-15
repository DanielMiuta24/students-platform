import axios from 'axios';

export const secureApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    withCredentials: true,
    timeout: 10000,
    validateStatus: function (status) {
        return status >= 200 && status < 600;
    },
});
