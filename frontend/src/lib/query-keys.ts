/**
 * Centralized query keys for React Query
 */
export const QUERY_KEYS = {
    // User related keys
    USER: {
        PROFILE: 'userProfile',
        ALL: 'users',
    },

    // Payment related keys
    PAYMENT: {
        HISTORY: 'transactionHistory',
        STATUS: (transactionRef: string) => ['paymentStatus', transactionRef],
        ALL: 'payments',
    },

    // Auth related keys
    AUTH: {
        SESSION: 'session',
        TOKEN: 'token',
    },
}; 