import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { userApi } from '@/api/user';
import { AuthResponse, LoginRequest, User, UpdateProfileRequest, UserProfile } from '@/types';
import Cookies from 'js-cookie';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

                        // Fetch the full user profile
                        try {
                            const profile = await userApi.getProfile();
                            setUserProfile(profile);
                        } catch (profileErr) {
                            console.error("Failed to load user profile:", profileErr);
                        }
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

            // Fetch user profile after login
            try {
                const profile = await userApi.getProfile();
                setUserProfile(profile);
            } catch (profileErr) {
                console.error("Failed to load user profile after login:", profileErr);
            }

            return response;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Authentication failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update profile function
    const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
        setLoading(true);
        setError(null);

        try {
            const updatedProfile = await userApi.updateProfile(data);
            setUserProfile(updatedProfile);

            // Update user basic info if username has changed
            if (user && updatedProfile.username !== user.username) {
                setUser({
                    ...user,
                    username: updatedProfile.username
                });
                localStorage.setItem('username', updatedProfile.username);
            }

            return updatedProfile;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Profile update failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

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
            setUserProfile(null);

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
        user: userProfile || user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
    };
} 