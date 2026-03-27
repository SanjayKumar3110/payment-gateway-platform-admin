import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { generateToken } from './utils/jwt.ts'; // Ensure the .js is here if you're using ESM!

const app = express();
const PORT = 5000;

// 1. Middlewares (Must be at the top)
app.use(cors());
app.use(express.json());

// 2. Resolve the path to your user.json file
// process.cwd() ensures it finds it no matter where you run the command from
const USER_FILE = path.join(process.cwd(), 'backend', 'user.json');
const PAYMENTS_FILE = path.join(process.cwd(), 'backend', 'payments.json');

// Initialize payments file if it doesn't exist
if (!fs.existsSync(PAYMENTS_FILE)) {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2));
}

app.get('/', (req, res) => {
  res.send('PayPlatform API is running perfectly!');
});

// 3. Define the Route (The "Door")
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  try {
    // Read your user.json file
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);

    // Find the matching user
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token and send it back
    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token, user });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Signup Route
app.post('/api/signup', (req, res) => {
  const { name, businessName, email, phone, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);

    // Check for duplicate email
    const existing = users.find((u: any) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Generate a unique user ID
    const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: userId,
      email,
      password,
      name,
      businessName: businessName || '',
      phone: phone || '',
      role: 'client'
    };

    users.push(newUser);
    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));

    // Generate token and auto-login
    const token = generateToken({ userId: newUser.id, role: newUser.role });

    // Return user without the password
    const { password: _pw, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// —————————————————————————————————————————————————————————————————————————————
// 5. Razorpay Endpoints
// —————————————————————————————————————————————————————————————————————————————

// Create Order
app.post('/api/create-order', async (req, res) => {
  const { amount, currency, keyId, keySecret } = req.body;

  if (!amount) return res.status(400).json({ error: 'Amount is required.' });
  if (!keyId) return res.status(400).json({ error: 'Razorpay Key ID is missing. Set it in Settings.' });
  if (!keySecret) return res.status(400).json({ error: 'Razorpay Key Secret is missing. Set it in Settings.' });

  // MOCK MODE: If key is "DEMO", return fake order
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
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise (1 INR = 100 paise)
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
app.post('/api/verify-payment', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    keySecret,
    paymentDetails 
  } = req.body;

  if (!razorpay_order_id) return res.status(400).json({ error: 'Missing razorpay_order_id' });
  if (!razorpay_payment_id) return res.status(400).json({ error: 'Missing razorpay_payment_id' });
  if (!razorpay_signature) return res.status(400).json({ error: 'Missing razorpay_signature' });
  if (!keySecret) return res.status(400).json({ error: 'Missing keySecret' });

  try {
    // MOCK MODE: Skip signature verification for demo orders
    if (razorpay_order_id.startsWith('order_demo_')) {
      // Proceed to store payment directly
    } else {
      // Verify real signature
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const expectedSign = hmac.digest("hex");

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ error: 'Invalid payment signature.' });
      }
    }

    // Store payment record
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

    payments.unshift(newPayment); // Add to top
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));

    res.json({ success: true, payment: newPayment });
  } catch (error: any) {
    console.error('Save Payment Error:', error);
    res.status(500).json({ error: error.message || 'Failed to record payment.' });
  }
});

// Webhook for async updates (GPay/UPI often confirms via webhook)
app.post('/api/razorpay-webhook', (req, res) => {
  const secret = req.headers['x-razorpay-signature'];
  // Simplified webhook for demo - in production use hmac verification
  console.log('Webhook received:', req.body);
  res.json({ status: 'ok' });
});

// Fetch all real payments
app.get('/api/payments', (req, res) => {
  try {
    if (!fs.existsSync(PAYMENTS_FILE)) {
      return res.json([]);
    }
    const paymentsData = fs.readFileSync(PAYMENTS_FILE, 'utf-8');
    res.json(JSON.parse(paymentsData));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});