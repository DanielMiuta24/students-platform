import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { LoginForm, RegisterForm, AuthResponse, SafeUser } from '../types/auth';
import { loginUser, registerUser, logoutUser, getProfile } from '../api/auth';
import { useSessionStore } from '../store/session';
import { socketService } from '../services/socket';
import { parseApiError } from '../utils/errorHandler';
import type { ParsedError } from '../types/errors';

export const useAuth = () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const success = ref<string | null>(null);
    const parsedError = ref<ParsedError | null>(null);
    const session = useSessionStore();
    const { user, isAuthenticated } = storeToRefs(session);
    const router = useRouter();

    const clearMessages = () => {
        error.value = null;
        success.value = null;
        parsedError.value = null;
    };

    const register = async (form: RegisterForm): Promise<AuthResponse | undefined> => {
        loading.value = true;
        clearMessages();

        try {
            const res: AuthResponse = await registerUser(form);
            success.value = res.message;
            return res;
        } catch (err: unknown) {
            const parsed = parseApiError(err);
            parsedError.value = parsed;
            error.value = parsed.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const login = async (form: LoginForm): Promise<SafeUser | undefined> => {
        loading.value = true;
        clearMessages();

        try {
            await loginUser(form);
            const userProfile: SafeUser = await getProfile();
            session.setUser(userProfile);
            socketService.connect();
            success.value = 'Logged in successfully';
            return userProfile;
        } catch (err: unknown) {
            const parsed = parseApiError(err);
            parsedError.value = parsed;
            error.value = parsed.message;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const logout = async (): Promise<void> => {
        loading.value = true;

        try {
            await logoutUser();
            session.clearUser();
            socketService.disconnect();
            clearMessages();
            success.value = 'Logged out successfully';
            router.push('/login');
        } catch (err: unknown) {
            const parsed = parseApiError(err);
            parsedError.value = parsed;
            error.value = parsed.message;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        success,
        parsedError,
        user,
        isAuthenticated,
        register,
        login,
        logout,
        clearMessages,
    };
};
