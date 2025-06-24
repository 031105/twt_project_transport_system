const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const routeRoutes = require('./routes/routes');
const tripRoutes = require('./routes/trips');
const bookingRoutes = require('./routes/bookings');
const seatRoutes = require('./routes/seats');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/locations');
const debugRoutes = require('./routes/debug');

const app = express();
const PORT = process.env.PORT || 5001;

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (disabled for development)
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// ========================================
// HEALTH CHECK ENDPOINTS
// ========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Transport Booking API',
    version: '1.0.0'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Transport Booking API',
      version: '1.0.0',
      database: dbConnected ? 'Connected' : 'Disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Service Unavailable',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// 添加健康检查端点
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ========================================
// API ROUTES
// ========================================

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/debug', debugRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Transport Booking API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      routes: '/api/routes',
      trips: '/api/trips',
      bookings: '/api/bookings',
      admin: '/api/admin'
    }
  });
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// ========================================
// SERVER STARTUP
// ========================================

const startServer = async () => {
  try {
    // Test database connection (non-blocking for development)
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  Database connection failed - running in mock data mode');
      console.warn('📝 To fix this, update your .env file with correct database credentials');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log('🚀 TRANSPORT BOOKING API SERVER STARTED');
      console.log('🚀 ========================================');
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💡 Health Check: http://localhost:${PORT}/api/health`);
      console.log('🚀 ========================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app; 