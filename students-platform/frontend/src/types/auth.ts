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
}

export interface AuthResponse {
    success?: boolean;
    message: string;
}
