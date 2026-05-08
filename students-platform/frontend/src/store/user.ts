import { defineStore } from 'pinia';
import type { SafeUser } from '../types/auth';
import { updateProfile, changePassword } from '../api/user';
import type { UpdateProfilePayload, ChangePasswordPayload } from '../types/user';
import { useSessionStore } from './session';

interface UserState {
  isUpdating: boolean;
  updateError: string | null;
  updateSuccess: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isUpdating: false,
    updateError: null,
    updateSuccess: null,
  }),

  actions: {
    clearMessages() {
      this.updateError = null;
      this.updateSuccess = null;
    },

    async updateUserProfile(payload: UpdateProfilePayload) {
      this.isUpdating = true;
      this.clearMessages();

      try {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('bio', payload.bio);
        formData.append('location', payload.location);

        if (payload.avatar) {
          formData.append('avatar', payload.avatar);
        }

        if (payload.removeAvatar) {
          formData.append('removeAvatar', 'true');
        }

        const response = await updateProfile(formData);

        // Update session store with new user data
        const sessionStore = useSessionStore();
        sessionStore.setUser(response.user);

        this.updateSuccess = response.message || 'Profile updated successfully';
        return response;
      } catch (error: any) {
        this.updateError = error.message || 'Failed to update profile';
        throw error;
      } finally {
        this.isUpdating = false;
      }
    },

    async changeUserPassword(payload: ChangePasswordPayload) {
      this.isUpdating = true;
      this.clearMessages();

      try {
        const response = await changePassword(payload);
        this.updateSuccess = response.message || 'Password changed successfully';
        return response;
      } catch (error: any) {
        this.updateError = error.message || 'Failed to change password';
        throw error;
      } finally {
        this.isUpdating = false;
      }
    },
  },
});
