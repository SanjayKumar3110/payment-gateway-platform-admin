import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getIo } from './socket.ts';

// Import your adapter logic
// import { syncRazorpayPayment } from './adapters/razorpay.ts';

const router = express.Router();
const PAYMENTS_FILE = path.join(process.cwd(), 'data', 'payments.json');
const USER_FILE = path.join(process.cwd(), 'data', 'user.json');

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf-8'));

router.post('/process-external', async (req: Request, res: Response) => {
  const { key_id, key_secret, platform, externalUrl, transactionId } = req.body;

  try {
    // 1. AUTHENTICATION: Is this user allowed to use our system?
    const users = readJson(USER_FILE);
    const user = users.find((u: any) => u.key_id === key_id && u.key_secret === key_secret);

    if (!user) {
      return res.status(401).json({ error: 'Auth Failed: Check your credentials' });
    }

    let finalPaymentData: any = null;

    // 2. DATA ACQUISITION: Where are we getting the data from?
    if (platform === 'razorpay') {
      console.log('Razorpay integration is not implemented yet.');
    }
    else if (externalUrl) {
      console.log(`Fetching from external source: ${externalUrl}`);
      const response = await axios.get(externalUrl);
      finalPaymentData = response.data;
    }
    else {
      return res.status(400).json({ error: 'No data source provided (Must have platform or externalUrl)' });
    }

    // 3. STORAGE: Save whatever we caught into our local JSON database
    if (finalPaymentData) {
      const payments = readJson(PAYMENTS_FILE);

      // We normalize the data slightly to ensure it fits our Dashboard's structure
      const normalizedRecord = {
        ...finalPaymentData,
        processed_at: new Date().toISOString(),
        source_user: user.name
      };

      try {
        getIo().emit('newPayment', normalizedRecord);
        console.log(`[Socket] Broadcasted external payment sync: ${normalizedRecord.id}`);
      } catch (err) {
        console.log('[Socket] Info: No active frontend to receive sync update.');
      }

      return res.json({ success: true, data: normalizedRecord });
    }

  } catch (error: any) {
    console.error('Gateway Error:', error.message);
    res.status(500).json({ error: `Failed to fetch external data: ${error.message}` });
  }
});

router.get('/payments', (req: Request, res: Response) => {
  try {
    // Check if file exists first to prevent crashing
    if (!fs.existsSync(PAYMENTS_FILE)) {
      return res.json([]); // Return empty array if no payments exist yet
    }

    const payments = readJson(PAYMENTS_FILE);

    // Return the payments array
    res.json(payments);
  } catch (error: any) {
    console.error('Error reading payments:', error.message);
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
});

router.post('/webhook', (req: Request, res: Response) => {
  try {
    const rawData = req.body;
    console.log('Webhook payload received from external tester:', rawData);

    if (!rawData || Object.keys(rawData).length === 0) {
      return res.status(400).json({ error: 'No payload provided. Make sure to send JSON format.' });
    }

    // Try to locate the payment object (supports Razorpay standard or direct flat JSON)
    const entity = rawData?.payload?.payment?.entity || rawData;

    // Load DB
    let payments = [];
    try {
      payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf-8'));
    } catch (e) {
      payments = [];
    }

    // Normalize incoming data dynamically
    const newPayment = {
      id: entity.id || `pay_script_${Math.random().toString(36).substr(2, 9)}`,
      order_id: entity.order_id || `order_script_${Date.now()}`,
      status: (entity.status === 'captured' || entity.status === 'Succeeded' || entity.status === 'success' || entity.status === 'PAID') ? 'Succeeded' : 'Pending',
      amount: entity.amount ? (Number(entity.amount) > 1000 ? (Number(entity.amount) / 100).toString() : entity.amount.toString()) : '0',
      currency: entity.currency || 'INR',
      method: entity.method || 'API Webhook',
      date: new Date().toLocaleString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      iconType: entity.method === 'card' ? 'visa' : entity.method === 'upi' ? 'nupay' : 'smartphone'
    };

    payments.unshift(newPayment);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));

    // Send Real-time update to the Frontend via WebSockets
    try {
      getIo().emit('newPayment', newPayment);
      console.log(`[Socket] Broadcasted new payment: ${newPayment.id}`);
    } catch (socketError: any) {
      console.log('[Socket] Info: Socket is not actively connected by frontend yet.');
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook data fully processed and saved!',
      paymentId: newPayment.id
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error while evaluating webhook' });
  }
});

export default router;