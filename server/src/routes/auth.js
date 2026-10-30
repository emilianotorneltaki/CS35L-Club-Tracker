import { Router } from 'express';
import { studentSignup, studentLogin, me } from '../controllers/auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/student/signup', studentSignup);
router.post('/student/login', studentLogin);
router.get('/me', requireAuth, me);

export default router;
