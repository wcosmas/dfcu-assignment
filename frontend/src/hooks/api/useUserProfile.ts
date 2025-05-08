'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';
import { UpdateProfileRequest } from '@/types';
import { QUERY_KEYS } from '@/lib/query-keys';

export function useUserProfile() {
    const queryClient = useQueryClient();

    // Get user profile query
    const {
        data: profile,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEYS.USER.PROFILE],
        queryFn: userApi.getProfile,
        // Don't refetch on window focus
        refetchOnWindowFocus: false,
    });

    // Update profile mutation
    const {
        mutate: updateProfile,
        isPending: isUpdating,
        error: updateError,
        reset,
    } = useMutation({
        mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
        onSuccess: (updatedProfile) => {
            // Update the profile in the cache
            queryClient.setQueryData([QUERY_KEYS.USER.PROFILE], updatedProfile);
        },
    });

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        isUpdating,
        updateError,
        refetchProfile: refetch,
        resetUpdateState: reset,
    };
} 