const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

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

  if (password !== 'supersecret') {
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
