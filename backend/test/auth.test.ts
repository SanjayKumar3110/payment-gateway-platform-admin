import request from 'supertest';
import express from 'express';
import authRoutes from './auth';
import * as db from '../config/db';
import bcrypt from 'bcrypt';
import * as jwtUtils from '../utils/jwt';

// Mock DB and JWT to avoid real side effects
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

jest.mock('../utils/jwt', () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 401 if user is not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should return 401 if password does not match', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: '1', email: 'test@test.com', password_hash: 'hashedpassword', role: 'Staff' }]
      });

      // Mock bcrypt
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should return 200 and a token on successful login', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: '1', email: 'test@test.com', password_hash: 'hashedpassword', role: 'Staff' }]
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('mocked.jwt.token');

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'correctpassword' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('mocked.jwt.token');
      expect(res.body.user.role).toBe('Staff');
    });
  });

  describe('POST /api/auth/register-superadmin', () => {
    it('should register a super admin and return 201', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'newhashedpassword');
      (db.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ id: '99', email: 'admin@test.com', role: 'SUPER_ADMIN' }]
      });

      const res = await request(app)
        .post('/api/auth/register-superadmin')
        .send({ email: 'admin@test.com', password: 'securepassword' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Super admin created');
      expect(res.body.user.role).toBe('SUPER_ADMIN');
    });

    it('should return 500 on database failure', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'newhashedpassword');
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB connection failed'));

      const res = await request(app)
        .post('/api/auth/register-superadmin')
        .send({ email: 'admin@test.com', password: 'securepassword' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('DB connection failed');
    });
  });
});
