import { Router } from 'express';
import { validateZod } from '../middlewares/zod-validation.middleware';
import {
    initiatePaymentSchema,
    transactionReferenceSchema
} from '../schemas/payment.schema';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    initiatePayment,
    getPaymentStatus,
    getTransactionHistory
} from '../controllers/payment.controller';

const router = Router();

// Apply auth middleware to all payment routes
router.use(authMiddleware);

// Payment routes with Zod validation
router.post('/initiate', validateZod(initiatePaymentSchema), initiatePayment);
router.get('/status/:transactionReference', validateZod(transactionReferenceSchema, 'params'), getPaymentStatus);
router.get('/history', getTransactionHistory);

export default router; 