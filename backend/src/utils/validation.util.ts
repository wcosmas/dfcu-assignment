import { body, param } from 'express-validator';

// Authentication validation
export const loginValidation = [
    body('username')
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required')
];

export const refreshTokenValidation = [
    body('refreshToken')
        .isString()
        .notEmpty()
        .withMessage('Refresh token is required')
];

export const logoutValidation = [
    body('refreshToken')
        .isString()
        .notEmpty()
        .withMessage('Refresh token is required')
];

// User validation
export const registerUserValidation = [
    body('username')
        .isString()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters long'),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('fullName')
        .isString()
        .notEmpty()
        .withMessage('Full name is required'),
    body('accountNumber')
        .isString()
        .notEmpty()
        .withMessage('Account number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Account number must be 10 digits')
        .matches(/^\d{10}$/)
        .withMessage('Account number must consist of 10 digits')
];

// Payment validation
export const initiatePaymentValidation = [
    body('payer')
        .isString()
        .notEmpty()
        .withMessage('Payer account number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Payer account number must be 10 digits')
        .matches(/^\d{10}$/)
        .withMessage('Payer account number must consist of 10 digits'),
    body('payee')
        .isString()
        .notEmpty()
        .withMessage('Payee account number is required')
        .isLength({ min: 10, max: 10 })
        .withMessage('Payee account number must be 10 digits')
        .matches(/^\d{10}$/)
        .withMessage('Payee account number must consist of 10 digits'),
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
    body('currency')
        .isString()
        .notEmpty()
        .withMessage('Currency is required')
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be a 3-letter ISO code')
        .isUppercase()
        .withMessage('Currency must be uppercase'),
    body('payerReference')
        .optional()
        .isString()
        .withMessage('Payer reference must be a string')
];

export const getTransactionStatusValidation = [
    param('transactionReference')
        .isString()
        .notEmpty()
        .withMessage('Transaction reference is required')
]; 