import request from 'supertest';
import express from 'express';
import paymentRoutes from './payment';
import * as db from '../config/db';
import crypto from 'crypto';

// Mock DB
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

// Mock Auth
jest.mock('../middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 'staff-1', role: 'STAFF' };
    next();
  },
  authorizeRole: () => (req: any, res: any, next: any) => next()
}));

// Mock Razorpay
const mockRazorpayCreate = jest.fn();
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => {
    return {
      orders: {
        create: mockRazorpayCreate
      }
    };
  });
});

const app = express();
app.use(express.json());
app.use('/api/payment', paymentRoutes);

describe('Payment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payment/create-order', () => {
    it('should create an order via Razorpay and save to DB (200)', async () => {
      const mockOrderResponse = { id: 'order_123', amount: 50000 };
      mockRazorpayCreate.mockResolvedValueOnce(mockOrderResponse);

      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: 'db_txn_1', status: 'pending', amount: 500 }]
      });

      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 500, currency: 'INR', storeId: 'store-1' });

      expect(res.statusCode).toBe(200);
      expect(res.body.order.id).toBe('order_123');
      expect(res.body.dbRecord.status).toBe('pending');
      expect(mockRazorpayCreate).toHaveBeenCalledWith(expect.objectContaining({
        amount: 50000,
        currency: 'INR'
      }));
    });

    it('should throw 500 if Razorpay fails', async () => {
      mockRazorpayCreate.mockRejectedValueOnce(new Error('Razorpay API Error'));

      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 500 });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Razorpay API Error');
    });
  });

  describe('POST /api/payment/generate-qr', () => {
    it('should return a mocked QR code (200)', async () => {
      const res = await request(app)
        .post('/api/payment/generate-qr')
        .send({ amount: 100, storeId: 'store-1' });

      expect(res.statusCode).toBe(200);
      expect(res.body.qrCode.image_url).toBe('https://cdn.razorpay.com/static/assets/qr/dummy.png');
      expect(res.body.qrCode.payment_amount).toBe(10000);
    });
  });

  describe('POST /api/payment/verify', () => {
    it('should verify payment successfully and update DB (200)', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({});

      const orderId = 'order_valid';
      const paymentId = 'pay_valid';
      const secret = process.env.RAZORPAY_KEY_SECRET || 'test_key_secret';

      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(orderId + '|' + paymentId)
        .digest('hex');

      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: validSignature
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('should fail verification for tampered signature (400)', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({});

      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: 'order_test',
          razorpay_payment_id: 'pay_test',
          razorpay_signature: 'invalid_signature_hash'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('Invalid signature');
    });
  });
});
