import { Router } from 'express';
import { validateZod } from '../middlewares/zod-validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { updateProfileSchema, validatePasswordUpdate } from '../schemas/user.schema';
import { getProfile, updateProfile } from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', validateZod(updateProfileSchema), validatePasswordUpdate, updateProfile);

export default router; 