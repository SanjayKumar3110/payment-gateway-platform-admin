import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { generateToken } from './utils/jwt.ts'; // Ensure the .js is here if you're using ESM!

const app = express();
const PORT = 5000;

// 1. Middlewares (Must be at the top)
app.use(cors());
app.use(express.json());

// 2. Resolve the path to your user.json file
// process.cwd() ensures it finds it no matter where you run the command from
const USER_FILE = path.join(process.cwd(), 'backend', 'user.json');

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

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});