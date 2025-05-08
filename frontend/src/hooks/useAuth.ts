import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { AuthResponse, LoginRequest, User } from '@/types';
import Cookies from 'js-cookie';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (typeof window !== 'undefined') {
                    // Check if we have tokens in localStorage
                    const userId = localStorage.getItem('userId');
                    const username = localStorage.getItem('username');

                    if (userId && username) {
                        setUser({
                            userId,
                            username,
                        });
                    }
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = useCallback(async (data: LoginRequest) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login(data);

            setUser({
                userId: response.userId,
                username: response.username,
            });

            // Set cookie for middleware authentication
            Cookies.set('accessToken', response.accessToken, {
                expires: 1, // 1 day
                path: '/',
                sameSite: 'lax'
            });

            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Authentication failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        setLoading(true);

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }

            // Clear user state regardless of API response
            setUser(null);

            // Remove the access token cookie
            Cookies.remove('accessToken', { path: '/' });

            router.push('/auth/login');
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
    };
} 