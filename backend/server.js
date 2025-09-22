const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Firebase
const { initializeFirebase } = require('./config/firebase');
initializeFirebase();

const documentRoutes = require('./routes/document');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(compression()); 

// General rate limiting for non-AI routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: 60 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all routes except AI routes
app.use('/api/', generalLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// More generous rate limiting for AI operations
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 AI requests per windowMs (more generous for AI)
  message: {
    error: 'Too many AI requests',
    message: 'AI rate limit exceeded. Please try again later.',
    retryAfter: 120 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply AI rate limiting specifically to AI routes
app.use('/api/ai', aiLimiter);

// Add connection tracking
let activeConnections = 0;
const MAX_CONNECTIONS = 200;

// Enhanced request queue for AI operations with adaptive rate limiting
const requestQueue = [];
let isProcessing = false;
let queueProcessingDelay = 200; // Start with 200ms delay between requests

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  while (requestQueue.length > 0) {
    const { req, res, next } = requestQueue.shift();
    
    // Add adaptive delay between requests to prevent rate limiting
    // Increase delay if we're getting rate limited
    await new Promise(resolve => setTimeout(resolve, queueProcessingDelay));
    next();
  }
  
  isProcessing = false;
};

// Middleware to queue AI requests with better rate limiting
app.use('/api/ai', (req, res, next) => {
  // For GET requests, process immediately
  if (req.method === 'GET') {
    return next();
  }
  
  // For POST requests to AI endpoints, add to queue with rate limiting awareness
  requestQueue.push({ req, res, next });
  
  // If queue is getting long, increase delay to prevent rate limiting
  if (requestQueue.length > 5) {
    queueProcessingDelay = Math.min(queueProcessingDelay * 1.5, 2000); // Max 2 seconds
  } else if (requestQueue.length < 2 && queueProcessingDelay > 200) {
    queueProcessingDelay = Math.max(queueProcessingDelay * 0.8, 200); // Min 200ms
  }
  
  processQueue();
});

app.use((req, res, next) => {
  if (activeConnections >= MAX_CONNECTIONS) {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Server is at maximum capacity. Please try again later.'
    });
  }
  
  activeConnections++;
  res.on('finish', () => activeConnections--);
  res.on('close', () => activeConnections--);
  
  next();
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5178',
  process.env.FRONTEND_URL,
  // Add Render frontend domain
  'https://legal-ai-frontend.onrender.com',
  // Add wildcard for any Render domain (in case service name changes)
  /\.onrender\.com$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/ai', aiRoutes);

// Enhanced Health check endpoint
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: uptime,
    memoryUsage: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
    },
    activeConnections: activeConnections,
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit.'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Add periodic cleanup
setInterval(() => {
  if (global.gc) {
    global.gc();
    console.log('Manual garbage collection triggered');
  }
}, 30 * 60 * 1000); // Every 30 minutes

module.exports = app;