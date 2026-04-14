import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'; // Added for security

dotenv.config({ path: path.format(process.env) });

const router = express.Router();
const USER_FILE = path.join(process.cwd(), 'data', 'user.json');

// In-memory code store
const resetCodes = new Map<string, { code: string; expires: number }>();

// 1. Setup REAL Email Transporter
// Replace these with your actual credentials or process.env variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Forgot password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);
    const user = users.find((u: any) => u.email === email);

    // Security Tip: Even if user isn't found, you might want to return a 200 
    // to prevent "email fishing," but for debugging we'll keep 404 for now.
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits is better
    resetCodes.set(email, { code, expires: Date.now() + 5 * 60 * 1000 });

    const htmlTemplate = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Password Reset</h2>
        <p>Your verification code is: <b>${code}</b></p>
        <p>This code expires in 5 minutes.</p>
      </div>
    `;

    await transporter.sendMail({
      from: '"Support Team" <your-email@gmail.com>',
      to: email,
      subject: 'Your Password Reset Code',
      html: htmlTemplate,
    });

    res.json({ message: 'Code sent to your email' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// 2. Verify Code
router.post('/verify-reset-code', (req: Request, res: Response) => {
  const { email, code } = req.body;
  const stored = resetCodes.get(email);

  if (!stored || Date.now() > stored.expires || stored.code !== code) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  res.json({ message: 'Code verified' });
});

// 3. Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  const stored = resetCodes.get(email);

  if (!stored || stored.code !== code) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  try {
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    let users = JSON.parse(usersData);
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // SECURE: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    users[userIndex].password = await bcrypt.hash(newPassword, salt);

    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
    resetCodes.delete(email);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;