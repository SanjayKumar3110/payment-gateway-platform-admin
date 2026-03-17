import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/db';
import { generateToken } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const result = await query('SELECT id, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerSuperAdmin = async (req: Request, res: Response): Promise<void> => {
  // In a real scenario, this endpoint should be heavily protected or run once.
  // For demo purposes, we will leave it open but warn.
  const { email, password } = req.body;

  try {
    const hashedParams = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedParams, 'SUPER_ADMIN']
    );
    res.status(201).json({ message: 'Super admin created', user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
