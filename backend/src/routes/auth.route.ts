import { Router } from 'express';
import { validateZod } from '../middlewares/zod-validation.middleware';
import {
    loginSchema,
    refreshTokenSchema,
    logoutSchema,
    registerUserSchema
} from '../schemas/auth.schema';
import {
    login,
    refresh,
    logout,
    register
} from '../controllers/auth.controller';

const router = Router();

// Authentication routes with Zod validation
router.post('/login', validateZod(loginSchema), login);
router.post('/refresh', validateZod(refreshTokenSchema), refresh);
router.post('/logout', validateZod(logoutSchema), logout);
router.post('/register', validateZod(registerUserSchema), register);

export default router; 