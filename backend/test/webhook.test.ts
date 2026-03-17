import request from 'supertest';
import express from 'express';
import webhookRoutes from './webhook';
import crypto from 'crypto';
import * as db from '../config/db';
import * as socketUtils from '../socket';

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

const mockTo = jest.fn().mockReturnThis();
const mockEmit = jest.fn();

jest.mock('../socket', () => ({
  getIo: jest.fn(() => ({
    to: mockTo,
    emit: mockEmit
  }))
}));

const app = express();
app.use('/api/webhook', express.json(), webhookRoutes); // Need to parse body for webhook

describe('Webhook Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/webhook/razorpay', () => {
    it('should ignore webhook if signature is invalid (400)', async () => {
      const res = await request(app)
        .post('/api/webhook/razorpay')
        .set('x-razorpay-signature', 'invalid-sig')
        .send({ event: 'payment.captured' });

      expect(res.statusCode).toBe(400);
      expect(res.body.reason).toBe('Invalid signature');
    });

    it('should process payment.captured event successfully (200)', async () => {
      const payload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_valid',
              order_id: 'order_valid'
            }
          }
        }
      };

      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
      const signature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      // Mock the update query returning the store_id
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ store_id: 'store-1', id: 'internal-txn-id' }]
      });

      const res = await request(app)
        .post('/api/webhook/razorpay')
        .set('x-razorpay-signature', signature)
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Webhook processed');

      // Verify db query was fired
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE payments SET status = 'success', razorpay_payment_id = $1 WHERE razorpay_order_id = $2 RETURNING store_id, id",
        ['pay_valid', 'order_valid']
      );

      // Verify socket events
      expect(socketUtils.getIo).toHaveBeenCalled();
      expect(mockTo).toHaveBeenCalledWith('store_store-1');
      expect(mockEmit).toHaveBeenCalledWith('payment_success', expect.objectContaining({
        orderId: 'order_valid',
        paymentId: 'pay_valid',
        paymentInternalId: 'internal-txn-id'
      }));
    });
  });
});
