// Newsletter Backend - Express + Nodemailer + node-cron (tanpa database)
// Data disimpan di file JSON lokal
// Cara pakai:
// 1. npm install express nodemailer node-cron cors dotenv
// 2. Buat file .env:
//    EMAIL_USER=your_gmail@gmail.com
//    EMAIL_PASS=your_gmail_app_password
// 3. Jalankan: node newsletter-backend.js

// Newsletter Backend - Express + Nodemailer + node-cron (tanpa database)
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
  try { return JSON.parse(fs.readFileSync(file)); } catch { return fallback; }
}
function saveJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

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

// ✅ Ambil 1 campaign by ID
app.get('/api/newsletter/:id', (req, res) => {
  const newsletters = loadJson(NEWSLETTERS_FILE);
  const newsletter = newsletters.find(nl => nl.id == req.params.id);
  if (!newsletter) return res.status(404).json({ error: 'Not found' });
  res.json(newsletter);
});

// Update campaign (status, user, dll)
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

// Update status campaign saja
app.put('/api/newsletter/:id/status', (req, res) => {
  let nls = loadJson(NEWSLETTERS_FILE);
  const idx = nls.findIndex(nl => nl.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  nls[idx].status = req.body.status;
  saveJson(NEWSLETTERS_FILE, nls);
  res.json(nls[idx]);
});

// Kirim campaign ke email terpilih
app.post('/api/newsletter/:id/send', (req, res) => {
  let nls = loadJson(NEWSLETTERS_FILE);
  const idx = nls.findIndex(nl => nl.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const newsletter = nls[idx];
  const { emails } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'No emails selected' });
  }
  nls[idx].status = 'running';
  saveJson(NEWSLETTERS_FILE, nls);
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails,
    subject: newsletter.title,
    html: newsletter.content,
  }, (err, info) => {
    nls = loadJson(NEWSLETTERS_FILE);
    nls[idx].status = err ? 'stopped' : 'completed';
    nls[idx].lastSent = new Date();
    saveJson(NEWSLETTERS_FILE, nls);
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// === Kirim otomatis (via cron) ===
function sendNewsletter(newsletter) {
  const subs = loadJson(SUBSCRIBERS_FILE);
  if (subs.length === 0) return;
  const emails = subs.map(s => s.email);
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails,
    subject: newsletter.title,
    html: newsletter.content,
  }, (err, info) => {
    if (err) console.error('Send error:', err);
    else {
      let nls = loadJson(NEWSLETTERS_FILE);
      const idx = nls.findIndex(nl => nl.id === newsletter.id);
      if (idx !== -1) {
        nls[idx].lastSent = new Date();
        saveJson(NEWSLETTERS_FILE, nls);
      }
      console.log('Newsletter sent:', newsletter.title);
    }
  });
}

function setupCronJob(newsletter) {
  if (newsletter.schedule) {
    cron.schedule(newsletter.schedule, () => sendNewsletter(newsletter), {
      timezone: 'Asia/Jakarta'
    });
  }
}

// Setup cron saat server start
loadJson(NEWSLETTERS_FILE).forEach(setupCronJob);

// Jalankan server
app.listen(5000, () => {
  console.log('✅ Newsletter backend running on http://localhost:5000');
});
