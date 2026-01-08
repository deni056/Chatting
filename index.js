require('dotenv').config();
const express = require('express');

const app = express();

// untuk WhatsApp webhook, cukup JSON
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// GET /webhook → untuk verifikasi webhook dari Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// POST /webhook → untuk menerima event pesan
app.post('/webhook', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  // WAJIB balas 200 OK supaya Meta anggap sukses
  return res.sendStatus(200);
});

// Jalankan server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
