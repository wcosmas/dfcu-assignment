'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api/auth';
import { useApiMutation } from './useApiMutations';
import { useApiQuery } from './useApiQueries';
import { userApi } from '@/api/user';
import { AuthResponse, LoginRequest, UpdateProfileRequest, User, UserProfile } from '@/types';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Check authentication status on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = Cookies.get('userId');
            const username = Cookies.get('username');

            if (userId && username) {
                setUser({
                    userId,
                    username,
                });
            }
        }
    }, []);

    // Profile query
    const {
        data: userProfile,
        isLoading: isProfileLoading,
        error: profileError,
        refetch: refetchProfile
    } = useApiQuery<UserProfile>(
        QUERY_KEYS.USER.PROFILE,
        userApi.getProfile,
        {
            enabled: !!user, // Only run query if user is authenticated
            retry: false,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                // Store email in cookies when profile is fetched
                if (data?.email) {
                    Cookies.set('userEmail', data.email, {
                        path: '/',
                        sameSite: 'lax' as const,
                        secure: process.env.NODE_ENV === 'production'
                    });
                }
            }
        }
    );

    // Login mutation
    const {
        mutate: loginMutation,
        isPending: isLoginPending,
        error: loginError
    } = useApiMutation<AuthResponse, LoginRequest>(
        (data) => authApi.login(data),
        {
            onSuccess: (response) => {
                setUser({
                    userId: response.userId,
                    username: response.username,
                });

                // Cookie options
                const cookieOptions = {
                    path: '/',
                    sameSite: 'lax' as const,
                    secure: process.env.NODE_ENV === 'production',
                };

                // Set cookies directly here
                Cookies.set('accessToken', response.accessToken, cookieOptions);
                Cookies.set('refreshToken', response.refreshToken, cookieOptions);
                Cookies.set('userId', response.userId, cookieOptions);
                Cookies.set('username', response.username, cookieOptions);

                // Trigger profile query after login
                refetchProfile();
            }
        }
    );

    // Update profile mutation
    const {
        mutate: updateProfileMutation,
        isPending: isUpdatingProfile,
        error: updateProfileError
    } = useApiMutation<UserProfile, UpdateProfileRequest>(
        (data) => userApi.updateProfile(data),
        {
            onSuccess: (updatedProfile) => {
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

                // Update the profile in the cache
                queryClient.setQueryData([QUERY_KEYS.USER.PROFILE], updatedProfile);
            }
        },
        [QUERY_KEYS.USER.PROFILE] // Invalidate profile query on success
    );

    // Common logout cleanup function
    const clearAuthData = () => {
        // Clear user state
        setUser(null);

        // Clear query cache
        queryClient.clear();

        // Remove cookies
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('userId', { path: '/' });
        Cookies.remove('username', { path: '/' });
        Cookies.remove('userEmail', { path: '/' });

        router.push('/auth/login');
    };

    // Logout mutation
    const {
        mutate: logoutMutation,
        isPending: isLoggingOut
    } = useApiMutation<{ message: string }, string>(
        (refreshToken) => authApi.logout(refreshToken),
        {
            onSuccess: () => {
                clearAuthData();
            },
            onError: () => {
                // Even if the API call fails, we should clear local state
                clearAuthData();
            }
        }
    );

    // Wrapper functions with better error handling
    const login = useCallback(async (data: LoginRequest) => {
        try {
            return new Promise<AuthResponse>((resolve, reject) => {
                loginMutation(data, {
                    onSuccess: (response) => resolve(response),
                    onError: (error) => reject(error)
                });
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, [loginMutation]);

    const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
        try {
            return new Promise<UserProfile>((resolve, reject) => {
                updateProfileMutation(data, {
                    onSuccess: (response) => resolve(response),
                    onError: (error) => reject(error)
                });
            });
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }, [updateProfileMutation]);

    const logout = useCallback(async () => {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
            logoutMutation(refreshToken);
        } else {
            // If no refresh token, just clear local state
            clearAuthData();
        }
    }, [logoutMutation, clearAuthData]);

    return {
        user: userProfile || user,
        loading: isProfileLoading || isLoginPending || isUpdatingProfile || isLoggingOut,
        error: profileError || loginError || updateProfileError,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
    };
} 