import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '../config/db';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret',
});

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { amount, currency = 'INR', storeId, customerId } = req.body;
  const processedBy = (req as any).user.userId;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment in DB
    const result = await query(
      `INSERT INTO payments (store_id, customer_id, amount, currency, status, razorpay_order_id, processed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [storeId, customerId || null, amount, currency, 'pending', order.id, processedBy]
    );

    res.status(200).json({ order, dbRecord: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const generateQrCode = async (req: Request, res: Response): Promise<void> => {
  const { amount, storeId } = req.body;
  
  try {
    // Note: Razorpay officially supports QR generation via the UPI payment modes or dedicated QR instances.
    // For test mode without business credentials, we're mocking the API payload.
    // In production, razorpay.qrCode.create() is used for static/dynamic QR codes.
    
    const qrOptions = {
      type: "upi_qr",
      name: "Store Payment",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amount * 100, // in paise
      description: "Payment for store items",
    };

    // Assuming we have full access, we'd do:
    // const qr = await razorpay.qrCode.create(qrOptions);
    
    // Fallback/Mock for test environment since QR APIs require special activation:
    const mockQr = {
      id: `qr_${crypto.randomBytes(8).toString('hex')}`,
      image_url: 'https://cdn.razorpay.com/static/assets/qr/dummy.png', // Dummy QR
      ...qrOptions
    };

    res.status(200).json({ qrCode: mockQr });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'test_key_secret';

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      await query(
        "UPDATE payments SET status = 'success', razorpay_payment_id = $1 WHERE razorpay_order_id = $2",
        [razorpay_payment_id, razorpay_order_id]
      );
      res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      await query(
        "UPDATE payments SET status = 'failed' WHERE razorpay_order_id = $1",
        [razorpay_order_id]
      );
      res.status(400).json({ error: 'Invalid signature. Verification failed' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
