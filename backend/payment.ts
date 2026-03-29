import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getIo } from './socket.ts';

const router = express.Router();
const PAYMENTS_FILE = path.join(process.cwd(), 'data', 'payments.json');

// Initialize payments file if it doesn't exist
if (!fs.existsSync(PAYMENTS_FILE)) {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2));
}

// Create Order
router.post('/create-order', async (req: Request, res: Response) => {
  const { amount, currency, keyId, keySecret } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required.' });
  if (!keyId || !keySecret) return res.status(400).json({ error: 'Razorpay Keys are missing.' });

  if (keyId === 'DEMO') {
    return res.json({
      id: `order_demo_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(Number(amount) * 100),
      currency: currency || 'INR',
      receipt: `receipt_demo_${Date.now()}`,
      status: 'created'
    });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// Verify Payment and Store
router.post('/verify-payment', async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret, paymentDetails } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !keySecret) {
    return res.status(400).json({ error: 'Missing required payment verification fields' });
  }

  try {
    if (!razorpay_order_id.startsWith('order_demo_')) {
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const expectedSign = hmac.digest("hex");

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ error: 'Invalid payment signature.' });
      }
    }

    const paymentsData = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    const payments = JSON.parse(paymentsData);

    const newPayment = {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      status: 'Succeeded',
      amount: paymentDetails?.amount || '0',
      currency: paymentDetails?.currency || 'INR',
      method: paymentDetails?.method || 'UPI',
      date: new Date().toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      iconType: paymentDetails?.iconType || 'smartphone'
    };

    payments.unshift(newPayment);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));

    res.json({ success: true, payment: newPayment });
  } catch (error: any) {
    console.error('Save Payment Error:', error);
    res.status(500).json({ error: error.message || 'Failed to record payment.' });
  }
});

// Universal Webhook for external test scripts or Razorpay
router.post(['/webhook', '/razorpay-webhook'], (req: Request, res: Response) => {
  try {
    const rawData = req.body;
    console.log('Webhook payload received:', rawData);

    // Extract payment data (supporting Razorpay format or direct properties)
    const entity = rawData?.payload?.payment?.entity || rawData;
    
    // Ignore non-payment events
    if (rawData.event && !rawData.event.includes('payment.')) {
      return res.json({ status: 'ignored' });
    }

    const paymentsData = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    const payments = JSON.parse(paymentsData);

    const newPayment = {
      id: entity.id || `pay_script_${Math.random().toString(36).substr(2, 9)}`,
      order_id: entity.order_id || `order_script_${Date.now()}`,
      status: entity.status === 'captured' || entity.status === 'Succeeded' ? 'Succeeded' : 'Pending',
      amount: entity.amount ? (Number(entity.amount) / 100).toString() : '0', // Assuming Razorpay paisa format
      currency: entity.currency || 'INR',
      method: entity.method || 'webhook',
      date: new Date().toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      iconType: entity.method === 'card' ? 'visa' : entity.method === 'upi' ? 'nupay' : 'bank'
    };

    payments.unshift(newPayment);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));

    // Broadcast the new payment strictly over websockets
    try {
      getIo().emit('newPayment', newPayment);
      console.log(`Broadcasted webhook payment ${newPayment.id} over WebSockets`);
    } catch (e) {
      console.log('Socket not connected broadly yet', e);
    }

    res.json({ status: 'ok', recordedId: newPayment.id });
  } catch (err: any) {
    console.error('Webhook processing error:', err.message);
    res.status(500).json({ error: 'Webhook ingestion failed' });
  }
});

// Fetch all payments
router.get('/payments', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(PAYMENTS_FILE)) return res.json([]);
    const paymentsData = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    res.json(JSON.parse(paymentsData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

export default router;