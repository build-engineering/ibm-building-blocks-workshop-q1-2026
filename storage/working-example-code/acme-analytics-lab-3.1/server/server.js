import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import askRouter from './routes/ask.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasInstanceUrl: !!process.env.WO_INSTANCE,
      hasApiKey: !!process.env.WO_API_KEY,
      hasAgentId: !!process.env.AGENT_ID,
      hasAgentEnvironmentId: !!process.env.AGENT_ENVIRONMENT_ID,
      port: PORT
    }
  });
});

// API routes
app.use('/api/ask', askRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Acme Analytics Backend Server');
  console.log('='.repeat(60));
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/ask`);
  console.log('='.repeat(60) + '\n');
  
  // Validate configuration
  if (!process.env.WO_INSTANCE) {
    console.warn('⚠️  WARNING: WO_INSTANCE not set in environment');
  }
  if (!process.env.WO_API_KEY) {
    console.warn('⚠️  WARNING: WO_API_KEY not set in environment');
  }
  if (!process.env.AGENT_ID) {
    console.log('ℹ️  Using default AGENT_ID: a6dcc07a-9477-4f2b-ba2e-b2120b35da61');
  }
  if (!process.env.AGENT_ENVIRONMENT_ID) {
    console.warn('⚠️  WARNING: AGENT_ENVIRONMENT_ID not set in environment - API calls will fail');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Made with Bob
