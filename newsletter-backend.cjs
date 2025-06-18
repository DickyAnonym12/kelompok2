// Newsletter Backend - Express + Nodemailer + node-cron (tanpa database)
// Data disimpan di file JSON lokal
// Cara pakai:
// 1. npm install express nodemailer node-cron cors dotenv
// 2. Buat file .env:
//    EMAIL_USER=your_gmail@gmail.com
//    EMAIL_PASS=your_gmail_app_password
// 3. Jalankan: node newsletter-backend.js

const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const SUBSCRIBERS_FILE = './subscribers.json';
const NEWSLETTERS_FILE = './newsletters.json';

// Helper: load & save JSON
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

// Check email configuration
function checkEmailConfig() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.error('EMAIL_USER=your_gmail@gmail.com');
    console.error('EMAIL_PASS=your_gmail_app_password');
    return false;
  }
  return true;
}

// Nodemailer setup (FIXED)
let transporter;
function setupTransporter() {
  if (!checkEmailConfig()) return null;

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email configuration error:', error.message);
      } else {
        console.log('✅ Email server is ready to send messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to setup email transporter:', error.message);
    return null;
  }
}

// === API ===

// Tambah subscriber
app.post('/api/subscriber', (req, res) => {
  const { email } = req.body;
  let subs = loadJson(SUBSCRIBERS_FILE);
  if (subs.find(s => s.email === email)) return res.status(400).json({ error: 'Email sudah terdaftar' });
  subs.push({ email });
  saveJson(SUBSCRIBERS_FILE, subs);
  res.status(201).json({ email });
});

// Ambil semua subscriber
app.get('/api/subscriber', (req, res) => {
  res.json(loadJson(SUBSCRIBERS_FILE));
});

// Hapus subscriber
app.delete('/api/subscriber/:email', (req, res) => {
  let subs = loadJson(SUBSCRIBERS_FILE);
  subs = subs.filter(s => s.email !== req.params.email);
  saveJson(SUBSCRIBERS_FILE, subs);
  res.json({ success: true });
});

// Tambah campaign newsletter
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

// Ambil semua campaign
app.get('/api/newsletter', (req, res) => {
  res.json(loadJson(NEWSLETTERS_FILE));
});

// Ambil 1 campaign
app.get('/api/newsletter/:id', (req, res) => {
  const newsletters = loadJson(NEWSLETTERS_FILE);
  const newsletter = newsletters.find(nl => nl.id == req.params.id);
  if (!newsletter) return res.status(404).json({ error: 'Not found' });
  res.json(newsletter);
});

// Update campaign
app.put('/api/newsletter/:id', (req, res) => {
  let nls = loadJson(NEWSLETTERS_FILE);
  const idx = nls.findIndex(nl => nl.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  nls[idx] = { ...nls[idx], ...req.body };
  saveJson(NEWSLETTERS_FILE, nls);
  res.json(nls[idx]);
});

// Hapus campaign
app.delete('/api/newsletter/:id', (req, res) => {
  let nls = loadJson(NEWSLETTERS_FILE);
  nls = nls.filter(nl => nl.id != req.params.id);
  saveJson(NEWSLETTERS_FILE, nls);
  res.json({ success: true });
});

// Update status campaign
app.put('/api/newsletter/:id/status', (req, res) => {
  let nls = loadJson(NEWSLETTERS_FILE);
  const idx = nls.findIndex(nl => nl.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  nls[idx].status = req.body.status;
  saveJson(NEWSLETTERS_FILE, nls);
  res.json(nls[idx]);
});

// Kirim campaign secara manual
app.post('/api/newsletter/:id/send', async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({ error: 'Email service not configured.' });
    }

    let nls = loadJson(NEWSLETTERS_FILE);
    const idx = nls.findIndex(nl => nl.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Newsletter not found' });

    const newsletter = nls[idx];
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'No emails selected' });
    }

    nls[idx].status = 'running';
    saveJson(NEWSLETTERS_FILE, nls);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(', '),
      subject: newsletter.title,
      html: newsletter.content,
    };

    const info = await transporter.sendMail(mailOptions);

    nls = loadJson(NEWSLETTERS_FILE);
    nls[idx].status = 'completed';
    nls[idx].lastSent = new Date();
    saveJson(NEWSLETTERS_FILE, nls);

    res.json({
      success: true,
      messageId: info.messageId,
      recipients: emails.length
    });

  } catch (error) {
    console.error('❌ Newsletter send error:', error.message);
    let nls = loadJson(NEWSLETTERS_FILE);
    const idx = nls.findIndex(nl => nl.id == req.params.id);
    if (idx !== -1) {
      nls[idx].status = 'stopped';
      nls[idx].lastSent = new Date();
      saveJson(NEWSLETTERS_FILE, nls);
    }
    res.status(500).json({ error: 'Failed to send newsletter', details: error.message });
  }
});

// Fungsi kirim otomatis via cron
async function sendNewsletter(newsletter) {
  if (!transporter) {
    console.error('❌ Cannot send newsletter: Email service not configured');
    return;
  }

  const subs = loadJson(SUBSCRIBERS_FILE);
  if (subs.length === 0) {
    console.log('⚠️ No subscribers to send newsletter to');
    return;
  }

  const emails = subs.map(s => s.email);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(', '),
      subject: newsletter.title,
      html: newsletter.content,
    };

    const info = await transporter.sendMail(mailOptions);

    let nls = loadJson(NEWSLETTERS_FILE);
    const idx = nls.findIndex(nl => nl.id === newsletter.id);
    if (idx !== -1) {
      nls[idx].lastSent = new Date();
      saveJson(NEWSLETTERS_FILE, nls);
    }

    console.log('✅ Newsletter sent automatically:', newsletter.title, 'Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Automatic newsletter send error:', error.message);
  }
}

// Setup cron job
function setupCronJob(newsletter) {
  if (newsletter.schedule) {
    cron.schedule(newsletter.schedule, () => sendNewsletter(newsletter), {
      timezone: 'Asia/Jakarta'
    });
  }
}

// Setup email dan jadwal awal
setupTransporter();
loadJson(NEWSLETTERS_FILE).forEach(setupCronJob);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Newsletter backend running on http://localhost:${PORT}`);
  if (!transporter) {
    console.log('⚠️ Email service not configured. Newsletter sending will not work.');
  }
});
