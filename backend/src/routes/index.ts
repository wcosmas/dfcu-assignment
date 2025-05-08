import { Router } from 'express';
import authRoutes from './auth.route';
import paymentRoutes from './payment.route';
import userRoutes from './user.route';

const router = Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

export default router; 