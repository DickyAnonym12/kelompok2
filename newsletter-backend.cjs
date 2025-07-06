// Newsletter Backend - Express + Nodemailer + node-cron + Midtrans
// Simpan data di file JSON lokal, dan transaksi pembayaran pakai Midtrans Snap

const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors');
const fs = require('fs');
const midtransClient = require('midtrans-client');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(cors());

const SUBSCRIBERS_FILE = './subscribers.json';
const NEWSLETTERS_FILE = './newsletters.json';

// === MIDTRANS SETUP ===
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

console.log("✅ Midtrans Server Key Loaded:", !!MIDTRANS_SERVER_KEY);

const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY, // optional di sisi server
});

// === HELPER FUNCTION ===
function loadJson(file, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return fallback;
  }
}
function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// === EMAIL SETUP ===
let transporter;
function setupTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  transporter.verify(err => {
    if (err) console.error('❌ Email setup failed:', err.message);
    else console.log('✅ Email transporter ready');
  });
}

// === API SUBSCRIBER ===
app.post('/api/subscriber', (req, res) => {
  const { email } = req.body;
  let subs = loadJson(SUBSCRIBERS_FILE);
  if (subs.find(s => s.email === email)) return res.status(400).json({ error: 'Email sudah terdaftar' });
  subs.push({ email });
  saveJson(SUBSCRIBERS_FILE, subs);
  res.status(201).json({ email });
});

app.get('/api/subscriber', (req, res) => {
  res.json(loadJson(SUBSCRIBERS_FILE));
});

app.delete('/api/subscriber/:email', (req, res) => {
  let subs = loadJson(SUBSCRIBERS_FILE);
  subs = subs.filter(s => s.email !== req.params.email);
  saveJson(SUBSCRIBERS_FILE, subs);
  res.json({ success: true });
});

// === API NEWSLETTER ===
app.post('/api/newsletter', (req, res) => {
  const { title, content, schedule } = req.body;
  let nls = loadJson(NEWSLETTERS_FILE);
  const nl = {
    id: Date.now(),
    title,
    content,
    schedule,
    status: 'created',
    createdAt: new Date(),
    lastSent: null
  };
  nls.push(nl);
  saveJson(NEWSLETTERS_FILE, nls);
  setupCronJob(nl);
  res.status(201).json(nl);
});

app.get('/api/newsletter', (req, res) => {
  res.json(loadJson(NEWSLETTERS_FILE));
});

app.get('/api/newsletter/:id', (req, res) => {
  const newsletters = loadJson(NEWSLETTERS_FILE);
  const newsletter = newsletters.find(nl => nl.id == req.params.id);
  if (!newsletter) return res.status(404).json({ error: 'Not found' });
  res.json(newsletter);
});

app.post('/api/newsletter/:id/send', async (req, res) => {
  try {
    if (!transporter) return res.status(500).json({ error: 'Email service not configured' });
    const nls = loadJson(NEWSLETTERS_FILE);
    const idx = nls.findIndex(nl => nl.id == req.params.id);
    const { emails } = req.body;
    if (idx === -1 || !emails?.length) return res.status(400).json({ error: 'Invalid request' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(', '),
      subject: nls[idx].title,
      html: nls[idx].content,
    };

    await transporter.sendMail(mailOptions);
    nls[idx].status = 'completed';
    nls[idx].lastSent = new Date();
    saveJson(NEWSLETTERS_FILE, nls);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Send failed', details: err.message });
  }
});

function setupCronJob(newsletter) {
  if (newsletter.schedule) {
    cron.schedule(newsletter.schedule, () => sendNewsletter(newsletter), {
      timezone: 'Asia/Jakarta'
    });
  }
}

async function sendNewsletter(newsletter) {
  if (!transporter) return;
  const subs = loadJson(SUBSCRIBERS_FILE);
  const emails = subs.map(s => s.email);
  if (!emails.length) return;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(', '),
    subject: newsletter.title,
    html: newsletter.content,
  };
  try {
    await transporter.sendMail(mailOptions);
    let nls = loadJson(NEWSLETTERS_FILE);
    const idx = nls.findIndex(n => n.id === newsletter.id);
    if (idx !== -1) {
      nls[idx].lastSent = new Date();
      saveJson(NEWSLETTERS_FILE, nls);
    }
    console.log('✅ Newsletter sent:', newsletter.title);
  } catch (e) {
    console.error('❌ Newsletter send error:', e.message);
  }
}

// === MIDTRANS TRANSACTION ENDPOINT ===
app.post('/api/midtrans/create-transaction', async (req, res) => {
  try {
    const { order_id, gross_amount, customer_details, items } = req.body;
    const parameter = {
      transaction_details: { order_id, gross_amount },
      customer_details,
      item_details: items,
    };
    console.log("📦 Sending to Midtrans:", parameter);
    const transaction = await snap.createTransaction(parameter);
    res.json({ snapToken: transaction.token });
  } catch (err) {
    console.error('❌ MIDTRANS ERROR:', err);
    res.status(500).json({ error: err.message, details: err.ApiResponse?.error_messages });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 5000;
setupTransporter();
loadJson(NEWSLETTERS_FILE).forEach(setupCronJob);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
