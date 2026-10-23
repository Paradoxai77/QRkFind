require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const foundRoutes = require('./routes/found');
const adminRoutes = require('./routes/admin');
const complaintRoutes = require('./routes/complaints');

const app = express();
const PORT = process.env.PORT || 5001;

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'https://paradoxai77.github.io'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow local network origins (IP addresses starting with 192.168., 10., or 172.16-31. plus IPv6 loopback [::1])
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocal) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complain-box', complaintRoutes);

// Health check endpoints with database connectivity diagnostics
const getDbStatus = () => {
  if (process.env.USE_MOCK_DB === 'true') {
    return { connected: true, type: 'mock-json' };
  }
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = states[mongoose.connection.readyState] || 'unknown';
  return { connected: mongoose.connection.readyState === 1, type: 'mongodb', state };
};

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'QRkFind backend is live',
    database: getDbStatus(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getDbStatus(),
  });
});

// ─── Auto-seed Admin User ───────────────────────────────────────────────────
async function ensureAdminUser() {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const adminEmail = (process.env.ADMIN_EMAIL || 'pratiknerpagar2@gmail.com').toLowerCase().trim();
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('123456789', salt);
      await User.create({
        name: 'Pratik Nerpagar',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log(`👑 Auto-seeded permanent admin account: ${adminEmail}`);
    } else {
      console.log(`👑 Admin account verified: ${adminEmail}`);
    }
  } catch (err) {
    console.error('ensureAdminUser warning:', err.message);
  }
}

// ─── MongoDB Connection ───────────────────────────────────────────────────────
if (process.env.USE_MOCK_DB === 'true') {
  console.log('🌱 Using Mock In-Memory/JSON database (persisted to uploads/db.json)');
  ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`🚀 QRkFind server (MOCK DB MODE) running on http://localhost:${PORT}`);
  });
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('✅ MongoDB connected');
      await ensureAdminUser();
      app.listen(PORT, () => {
        console.log(`🚀 QRkFind server running on http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('💡 Tip: Set USE_MOCK_DB=true in server/.env to run the server without a local MongoDB service.');
      process.exit(1);
    });
}

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoTimeoutError') {
    return res.status(503).json({ message: 'Database temporarily unavailable. Please try again shortly.' });
  }
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

