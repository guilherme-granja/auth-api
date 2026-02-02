import { Router } from 'express';
import authRoutes from "./auth/authRoutes";

const router = Router();

router.use('/auth', authRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

export default router;