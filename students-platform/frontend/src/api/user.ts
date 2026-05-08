import { api } from '../services/api';
import { secureApi } from '../services/secureApi';
import type { UpdateProfileResponse, ChangePasswordPayload, ChangePasswordResponse } from '../types/user';

export interface SafeUser {
  id: string;
  type: 'Student' | 'StudySeeker' | 'Admin';
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  isVerified: boolean;
}

export const getUserByUsername = async (username: string): Promise<SafeUser> => {
  try {
    const response = await api.get<SafeUser>(`/users/username/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

export const updateProfile = async (formData: FormData): Promise<UpdateProfileResponse> => {
  try {
    const response = await secureApi.put<UpdateProfileResponse>('/users/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to update your profile');
    } else if (error.response?.status === 400) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        throw new Error(backendErrors.map((e: any) => e.msg).join(', '));
      }
      throw new Error(error.response?.data?.message || 'Invalid profile data');
    } else if (!error.response) {
      throw new Error('Network error: Cannot connect to server. Please check your connection.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  try {
    const response = await secureApi.put<ChangePasswordResponse>('/users/change-password', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('You must be logged in to change your password');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Invalid password data');
    } else if (error.response?.status === 403) {
      throw new Error('Current password is incorrect');
    } else if (!error.response) {
      throw new Error('Network error: Cannot connect to server. Please check your connection.');
    }
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};
