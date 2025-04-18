import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Import the cron job to keep the server alive
import './keepAlive.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const statusPassword = process.env.STATUS_PASSWORD;

// Ensure password is configured
if (!statusPassword) {
  console.error('ERROR: STATUS_PASSWORD environment variable must be set');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Initial state
let userState = {
  status: 'awake', // 'awake' or 'asleep'
  lastUpdated: new Date().toISOString()
};

// Get current state
app.get('/status', (req, res) => {
  res.json(userState);
});

// Update state (only for owner)
app.post('/status', (req, res) => {
  const { status, password } = req.body;

  if (password !== statusPassword) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (status === 'awake' || status === 'asleep') {
    userState.status = status;
    userState.lastUpdated = new Date().toISOString();
    return res.json({ message: `Status updated to: ${status}` });
  }

  return res.status(400).json({ error: 'Invalid status' });
});

app.listen(port, () => {
  console.log(`Sleep status API running at http://localhost:${port}`);
});