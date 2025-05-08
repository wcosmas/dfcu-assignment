import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { userApi } from '@/api/user';
import { LoginRequest, User, UpdateProfileRequest, UserProfile } from '@/types';
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
                    // Check if we have tokens in cookies
                    const userId = Cookies.get('userId');
                    const username = Cookies.get('username');

                    if (userId && username) {
                        setUser({
                            userId,
                            username,
                        });

                        // Fetch the full user profile
                        try {
                            const profile = await userApi.getProfile();
                            setUserProfile(profile);

                            // Store email in cookie
                            if (profile.email) {
                                Cookies.set('userEmail', profile.email, {
                                    path: '/',
                                    sameSite: 'lax' as const,
                                    secure: process.env.NODE_ENV === 'production'
                                });
                            }
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

            // Set cookies for all user data
            const cookieOptions = {
                expires: 1, // 1 day
                path: '/',
                sameSite: 'lax' as const,
                secure: process.env.NODE_ENV === 'production'
            };

            Cookies.set('accessToken', response.accessToken, cookieOptions);
            Cookies.set('refreshToken', response.refreshToken, cookieOptions);
            Cookies.set('userId', response.userId, cookieOptions);
            Cookies.set('username', response.username, cookieOptions);

            // Fetch user profile after login
            try {
                const profile = await userApi.getProfile();
                setUserProfile(profile);

                // Store email in cookie
                if (profile.email) {
                    Cookies.set('userEmail', profile.email, cookieOptions);
                }
            } catch (profileErr) {
                console.error("Failed to load user profile after login:", profileErr);
            }

            return response;
        } catch (err: unknown) {
            const message = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Authentication failed'
                : 'Authentication failed';
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
                Cookies.set('username', updatedProfile.username, {
                    path: '/',
                    sameSite: 'lax' as const,
                    secure: process.env.NODE_ENV === 'production'
                });
            }

            // Update email in cookie if provided
            if (updatedProfile.email) {
                Cookies.set('userEmail', updatedProfile.email, {
                    path: '/',
                    sameSite: 'lax' as const,
                    secure: process.env.NODE_ENV === 'production'
                });
            }

            return updatedProfile;
        } catch (err: unknown) {
            const message = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Profile update failed'
                : 'Profile update failed';
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
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }

            // Clear user state regardless of API response
            setUser(null);
            setUserProfile(null);

            // Remove all cookies
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            Cookies.remove('userId', { path: '/' });
            Cookies.remove('username', { path: '/' });
            Cookies.remove('userEmail', { path: '/' });

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