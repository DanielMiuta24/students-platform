import type { RegisterForm, LoginForm, AuthResponse, SafeUser } from '../types/auth';
import { api } from '../services/api';
import { secureApi } from '../services/secureApi';


export const registerUser = async (data: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post('/users/register', data);

    if (!response.data.success) {
        // Create a proper AxiosError-like structure
        const error: any = new Error(response.data.message || 'Registration failed');
        error.isAxiosError = true;
        error.response = {
            status: 400,
            statusText: 'Bad Request',
            data: {
                message: response.data.message,
                field: response.data.field
            },
            headers: response.headers,
            config: response.config
        };
        error.config = response.config;
        throw error;
    }

    return response.data;
};

export const loginUser = async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post('/users/login', data);

    if (!response.data.success) {
        // Create a proper AxiosError-like structure
        const error: any = new Error(response.data.message || 'Login failed');
        error.isAxiosError = true;
        error.response = {
            status: 401,
            statusText: 'Unauthorized',
            data: {
                message: response.data.message,
                field: response.data.field
            },
            headers: response.headers,
            config: response.config
        };
        error.config = response.config;
        throw error;
    }

    return response.data;
};

export const logoutUser = async (): Promise<AuthResponse> => {
    const response = await secureApi.post('/users/logout');

    if (response.status !== 200) {
        const error: any = new Error(response.data.message || 'Logout failed');
        error.response = response;
        throw error;
    }

    return response.data;
};

export const getProfile = async (): Promise<SafeUser> => {
    const response = await secureApi.get('/users/get-profile');

    if (response.status !== 200) {
        const error: any = new Error(response.data.message || 'Failed to get profile');
        error.response = response;
        throw error;
    }

    return response.data;
};
