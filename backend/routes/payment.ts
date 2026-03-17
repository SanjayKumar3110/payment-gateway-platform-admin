import { Router } from 'express';
import { createOrder, generateQrCode, verifyPayment } from '../controllers/paymentController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

// Staff and Owners can process payments
router.use(authenticate);
router.use(authorizeRole(['OWNER', 'STAFF']));

router.post('/create-order', createOrder);
router.post('/generate-qr', generateQrCode);
router.post('/verify', verifyPayment);

export default router;
