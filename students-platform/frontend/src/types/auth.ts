export interface RegisterForm {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface ForgotPasswordForm {
    email: string;
}

export interface VerifyOtpForm {
    otp: string;
}

export interface ResetPasswordForm {
    newPassword: string;
    confirmPassword: string;
}

export interface SafeUser {
    id: string;
    type: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
    isVerified: boolean;
    universityEmail: string | null;
}

export interface AuthResponse {
    success?: boolean;
    message: string;
}

export interface VerifyOtpResponse {
    success: boolean;
    resetToken?: string;
    message?: string;
}
