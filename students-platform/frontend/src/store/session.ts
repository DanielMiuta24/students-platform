import { defineStore } from 'pinia';
import type { SafeUser } from '../types/auth';
import { getProfile } from '../api/auth';

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: null as SafeUser | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        setUser(user: SafeUser) {
            this.user = user;
            localStorage.setItem('sessionUser', JSON.stringify(user));
        },

        clearUser() {
            this.user = null;
            localStorage.removeItem('sessionUser');
        },

        async restoreSession() {
            const saved = localStorage.getItem('sessionUser');

            if (saved) {
                this.user = JSON.parse(saved);
                // Optionally verify session with server in background
                try {
                    const user = await getProfile();
                    this.setUser(user);
                } catch (error) {
                    // Session expired, clear it silently
                    this.clearUser();
                }
            } else {
                // No saved session, don't make API call to avoid 401 errors in console
                this.clearUser();
            }
        },
    },
});
