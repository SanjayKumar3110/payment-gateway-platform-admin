import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { generateToken } from './utils/jwt.ts'; // Ensure the path matches your structure

const router = express.Router();
const USER_FILE = path.join(process.cwd(), 'data', 'user.json');

// Login Route
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token, user });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup Route
router.post('/signup', (req: Request, res: Response) => {
  const { name, businessName, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    // Ensure file exists or create an empty array (good practice)
    if (!fs.existsSync(USER_FILE)) {
      fs.writeFileSync(USER_FILE, JSON.stringify([], null, 2));
    }

    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);

    const existing = users.find((u: any) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

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

    const token = generateToken({ userId: newUser.id, role: newUser.role });

    const { password: _pw, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Razorpay Keys Route
router.post('/update-keys', (req: Request, res: Response) => {
  const { email, rz_key_id, rz_key_secret, rz_webhook_secret, rz_account_id } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required to identify the user.' });
  }

  try {
    const usersData = fs.readFileSync(USER_FILE, 'utf-8');
    const users = JSON.parse(usersData);
    
    const userIndex = users.findIndex((u: any) => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in system.' });
    }

    // Assign new keys to user record
    users[userIndex] = {
      ...users[userIndex],
      rz_key_id: rz_key_id || '',
      rz_key_secret: rz_key_secret || '',
      rz_webhook_secret: rz_webhook_secret || '',
      rz_account_id: rz_account_id || ''
    };

    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));

    const { password: _pw, ...safeUser } = users[userIndex];
    res.json({ message: 'Keys updated successfully', user: safeUser });
  } catch (error) {
    console.error('Update keys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;