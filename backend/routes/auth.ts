import { Router } from 'express';
import { login, registerSuperAdmin } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register-superadmin', registerSuperAdmin);

export default router;
