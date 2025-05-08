import { z } from 'zod';

/**
 * Payment initiation schema
 */
export const initiatePaymentSchema = z.object({
    payer: z.string({
        required_error: "Payer account number is required",
        invalid_type_error: "Payer account number must be a string"
    })
        .length(10, "Payer account number must be exactly 10 digits")
        .regex(/^\d{10}$/, "Payer account number must consist of 10 digits"),

    payee: z.string({
        required_error: "Payee account number is required",
        invalid_type_error: "Payee account number must be a string"
    })
        .length(10, "Payee account number must be exactly 10 digits")
        .regex(/^\d{10}$/, "Payee account number must consist of 10 digits"),

    amount: z.number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number"
    })
        .positive("Amount must be greater than 0")
        .finite("Amount must be a finite number"),

    currency: z.string({
        required_error: "Currency is required",
        invalid_type_error: "Currency must be a string"
    })
        .length(3, "Currency must be a 3-letter ISO code")
        .regex(/^[A-Z]{3}$/, "Currency must be a 3-letter uppercase ISO code")
        .trim(),

    payerReference: z.string()
        .max(100, "Payer reference cannot exceed 100 characters")
        .optional()
        .nullable()
});

/**
 * Payment status schema for URL parameters
 */
export const transactionReferenceSchema = z.object({
    transactionReference: z.string({
        required_error: "Transaction reference is required",
        invalid_type_error: "Transaction reference must be a string"
    })
        .min(1, "Transaction reference cannot be empty")
        // Using a more permissive regex for actual transaction references
        .regex(/^TRX-.*/, "Invalid transaction reference format. Must start with 'TRX-'")
}); 