import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import authRoutes from './auth.ts';
import paymentRoutes from './payment.ts';
import { initializeSocket } from './socket.ts';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize WebSockets
initializeSocket(server);

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. Base Route
app.get('/', (req: Request, res: Response) => {
  res.send('PayPlatform API is running perfectly!');
});

app.use('/api', authRoutes);
app.use('/api', paymentRoutes);

// 4. Start Server
server.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
  console.log('Socket.io server initialized on http://localhost:5000');
  console.log('Webhook URL: http://127.0.0.1:5000/api/webhook');
});