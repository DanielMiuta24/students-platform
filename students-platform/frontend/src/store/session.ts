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
                return;
            }

            try {
                const user = await getProfile();
                this.setUser(user);
            } catch (error) {
                this.clearUser();
            }
        },
    },
});
