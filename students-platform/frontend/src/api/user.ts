import { api } from '../services/api';

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
    const response = await api.get<SafeUser>(`/user/username/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
