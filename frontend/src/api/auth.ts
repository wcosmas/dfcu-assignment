import apiClient from './client';
import { AuthResponse, LoginRequest } from '@/types';

export const authApi = {
    /**
     * Authenticate a user and get tokens
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        apiClient.setTokens(response);
        return response;
    },

    /**
     * Refresh the access token using a refresh token
     */
    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
        apiClient.setTokens(response);
        return response;
    },

    /**
     * Logout user by invalidating refresh token
     */
    logout: async (refreshToken: string): Promise<{ message: string }> => {
        const response = await apiClient.post<{ message: string }>('/auth/logout', { refreshToken });
        apiClient.clearTokens();
        return response;
    },

    /**
     * Check if user is authenticated client-side
     */
    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('accessToken');
    },
}; 