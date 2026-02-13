require('dotenv').config();
const express = require('express');

const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Initialize app
const app = express();

// Trust proxy for Render/Vercel (needed for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting — general API: 100 requests per 15 minutes per IP
// Skip in test environment so tests don't hit the limit
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' }
  }));

  // Stricter rate limit for auth routes: 15 attempts per 15 minutes
  app.use('/api/auth/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: 'Too many login attempts, please try again later' }
  }));
}

// Import routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const orgRoutes = require('./routes/org.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/org', orgRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('backend is healthy along with mongodb');
});

module.exports = app;
