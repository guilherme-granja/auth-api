import { Router } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
