import { Router } from 'express';
import { studentSignup, studentLogin, clubLogin, me } from '../controllers/auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/student/signup', studentSignup);
router.post('/student/login', studentLogin);
router.post('/club/login', clubLogin)
router.get('/me', requireAuth, me);

export default router;

