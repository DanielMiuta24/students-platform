import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { LoginForm, RegisterForm, AuthResponse, SafeUser } from '../types/auth';
import { loginUser, registerUser, logoutUser, getProfile } from '../api/auth';
import { useSessionStore } from '../store/session';

export const useAuth = () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const success = ref<string | null>(null);
    const session = useSessionStore();
    const { user, isAuthenticated } = storeToRefs(session);
    const router = useRouter();

    const register = async (form: RegisterForm) => {
        loading.value = true;
        error.value = null;
        try {
            const res: AuthResponse = await registerUser(form);
            success.value = res.message;
            return res;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Registration failed';
        } finally {
            loading.value = false;
        }
    };

    const login = async (form: LoginForm) => {
        loading.value = true;
        error.value = null;
        try {
            await loginUser(form);
            const user: SafeUser = await getProfile();
            session.setUser(user);
            success.value = 'Logged in successfully';
            return user;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed';
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        loading.value = true;
        try {
            await logoutUser();
            session.clearUser();
            success.value = 'Logged out successfully';
            router.push('/login');
        } catch (err: any) {
            error.value = 'Logout failed';
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        success,
        user,
        isAuthenticated,
        register,
        login,
        logout,
    };
};
