import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { AuthController } from './auth.controller';
import { authMiddleware } from './auth.middleware';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Rate limiter for authentication routes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authRateLimiter, AuthController.login);
router.post('/refresh', authRateLimiter, AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);

router.post('/forgot-password', authRateLimiter, AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, AuthController.resetPassword);
router.post('/change-password', authMiddleware, AuthController.changePassword);

router.post('/avatar', authMiddleware, upload.single('avatar'), AuthController.uploadAvatar);
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;
