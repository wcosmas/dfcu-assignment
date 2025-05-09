import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthResponse } from '@/types';
import Cookies from 'js-cookie';

// API base URL - we'll use environment variables in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Cookie configuration
const COOKIE_OPTIONS = {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
};

class ApiClient {
    private client: AxiosInstance;
    private refreshPromise: Promise<AuthResponse> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            // Skip adding authorization header for auth endpoints
            if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh')) {
                return config;
            }

            const token = this.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Add response interceptor to handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // If error is 401 and not already retrying, try to refresh token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // If we're not already refreshing
                    if (!this.refreshPromise) {
                        const refreshToken = this.getRefreshToken();

                        if (refreshToken) {
                            try {
                                this.refreshPromise = this.refreshAccessToken(refreshToken);
                                const authResponse = await this.refreshPromise;

                                // Store new tokens
                                this.setTokens(authResponse);

                                // Retry original request with new token
                                originalRequest._retry = true;
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${authResponse.accessToken}`;
                                }

                                return this.client(originalRequest);
                            } catch (refreshError) {
                                // If refresh fails, log out user
                                this.clearTokens();
                                // Redirect to login page on client-side
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/auth/login';
                                }
                                return Promise.reject(refreshError);
                            } finally {
                                this.refreshPromise = null;
                            }
                        }
                    } else {
                        // Wait for the existing refresh promise
                        try {
                            await this.refreshPromise;

                            // Retry original request with new token
                            originalRequest._retry = true;
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${this.getAccessToken()}`;
                            }

                            return this.client(originalRequest);
                        } catch (error) {
                            return Promise.reject(error);
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Helper methods for token management
    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return Cookies.get('accessToken') || null;
    }

    private getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return Cookies.get('refreshToken') || null;
    }

    private async refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, { refreshToken });
        return response.data;
    }

    public setTokens(authResponse: AuthResponse): void {
        if (typeof window === 'undefined') return;

        Cookies.set('accessToken', authResponse.accessToken, COOKIE_OPTIONS);
        Cookies.set('refreshToken', authResponse.refreshToken, COOKIE_OPTIONS);
        Cookies.set('userId', authResponse.userId, COOKIE_OPTIONS);
        Cookies.set('username', authResponse.username, COOKIE_OPTIONS);
    }

    public clearTokens(): void {
        if (typeof window === 'undefined') return;

        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('userId', { path: '/' });
        Cookies.remove('username', { path: '/' });
    }

    // Expose request methods
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

// Create singleton instance
const apiClient = new ApiClient();
export default apiClient; 