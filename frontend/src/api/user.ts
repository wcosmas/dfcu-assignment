import { UserProfile, UpdateProfileRequest } from '@/types';
import apiClient from './client';

export const userApi = {
    /**
     * Get the current user's profile
     */
    getProfile: async (): Promise<UserProfile> => {
        return apiClient.get<UserProfile>('/users/profile');
    },

    /**
     * Update the user's profile
     */
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
        const response = await apiClient.patch<{ message: string, user: UserProfile }>('/users/profile', data);
        return response.user;
    },
}; 