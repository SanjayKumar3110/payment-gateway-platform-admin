import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from './jwt';

// Mock process.env
process.env.JWT_SECRET = 'test-secret';

describe('JWT Utilities', () => {
  const mockPayload = { userId: '123', role: 'Staff' };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockPayload);
      expect(typeof token).toBe('string');
      // Should have 3 parts split by dots
      const parts = token.split('.');
      expect(parts.length).toBe(3);
    });

    it('should generate a token with the correct payload', () => {
      const token = generateToken(mockPayload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.role).toBe(mockPayload.role);
    });
  });

  describe('verifyToken', () => {
    it('should successfully verify a valid token', () => {
      const token = generateToken({ userId: '456', role: 'Owner' });
      const decoded = verifyToken(token) as any;
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe('456');
      expect(decoded.role).toBe('Owner');
    });

    it('should return null for an invalid token', () => {
      const decoded = verifyToken('invalid.token.string');
      expect(decoded).toBeNull();
    });

    it('should return null if JWT_SECRET is missing', () => {
      // Temporarily delete secret
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      const token = jwt.sign({ userId: '123' }, 'temp-secret');
      const decoded = verifyToken(token);
      
      expect(decoded).toBeNull();
      
      // Restore secret
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
