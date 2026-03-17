import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';

dotenv.config();

import { createServer } from 'http';
import { initializeSocket } from './socket';

import paymentRoutes from './routes/payment';
import webhookRoutes from './routes/webhook';

const app = express();
const server = createServer(app);

// Initialize Socket.io
initializeSocket(server);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payment platform API is running' });
});

server.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
