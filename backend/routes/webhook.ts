import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../config/db';
import { getIo } from '../socket';

const router = Router();

router.post('/razorpay', async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

  // Razorpay sends signature in this header
  const signature = req.headers['x-razorpay-signature'] as string;

  try {
    const bodyString = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyString)
      .digest('hex');

    if (expectedSignature !== signature) {
      res.status(400).json({ status: 'ignored', reason: 'Invalid signature' });
      return;
    }

    const event = req.body;

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      // Update Database
      const result = await query(
        "UPDATE payments SET status = 'success', razorpay_payment_id = $1 WHERE razorpay_order_id = $2 RETURNING store_id, id",
        [paymentId, orderId]
      );

      if (result.rows.length > 0) {
        const storeId = result.rows[0].store_id;
        // Emit socket event to the store's room
        getIo().to(`store_${storeId}`).emit('payment_success', {
          orderId,
          paymentId,
          paymentInternalId: result.rows[0].id
        });
      }
    }

    res.status(200).send('Webhook processed');
  } catch (err: any) {
    console.error('Webhook Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
