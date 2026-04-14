import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import authRoutes from './auth.ts';
import paymentRoutes from './payment.ts';
import resetRoutes from './reset.ts';

import { getIo, initializeSocket } from './socket.ts';
import { initializeRemoteAccess } from './config/qrconfig.ts';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

let currentRemoteData: any = null;

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
app.use('/api', resetRoutes);

// 3. QR code endpoint
app.get('/api/remote-access', (req: Request, res: Response) => {
  if (currentRemoteData) {
    res.json(currentRemoteData);
  } else {
    res.status(404).json({ error: "No QR to generate" });
  }
});

// 4. Start Server
server.listen(PORT, async () => {
  console.log(`Backend is running on:${PORT}`);
  console.log(`Socket.io server initialized on ${process.env.API_URL}`);
  console.log(`Webhook URL: ${process.env.API_URL}/api/webhook`);

  // Auto-start Tunnel and QR Logic
  const remoteData = await initializeRemoteAccess(PORT);
  currentRemoteData = remoteData;

  if (remoteData) {
    // Wait a moment for Socket.io to be ready, then broadcast
    setTimeout(() => {
      try {
        const io = getIo();
        io.emit('remote-access-ready', {
          url: remoteData.url,
          qr: remoteData.qrCode
        });
      } catch (e) {
        console.log("Socket not ready yet to send QR data.");
      }
    }, 2000);
  }
});