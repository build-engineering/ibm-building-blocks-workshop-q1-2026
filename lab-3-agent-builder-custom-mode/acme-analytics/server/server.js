import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { askAgent, extractHtmlFromResponse } from './orchestrate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    agent_id: process.env.AGENT_ID 
  });
});

/**
 * Ask the Q&A agent a question about a dataset
 * POST /api/ask
 * Body: { question: string, dataset: string }
 */
app.post('/api/ask', async (req, res) => {
  try {
    const { question, dataset } = req.body;

    // Validation
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid question parameter' 
      });
    }

    if (!dataset || typeof dataset !== 'string') {
      return res.status(400).json({ 
        error: 'Missing or invalid dataset parameter' 
      });
    }

    console.log('Received question:', { question, dataset });

    // Call the Orchestrate agent
    const agentResponse = await askAgent(question, dataset);
    
    // Extract HTML from the response
    const html = extractHtmlFromResponse(agentResponse);

    // Return the HTML response
    res.json({
      success: true,
      html: html,
      metadata: {
        question,
        dataset,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in /api/ask:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process question',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Get agent information
 * GET /api/agent-info
 */
app.get('/api/agent-info', (req, res) => {
  res.json({
    agent_id: process.env.AGENT_ID,
    instance_url: process.env.INSTANCE_URL,
    available: true
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Acme Analytics Backend Server');
  console.log('='.repeat(50));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Agent ID: ${process.env.AGENT_ID}`);
  console.log(`Instance: ${process.env.INSTANCE_URL}`);
  console.log('='.repeat(50));
  console.log('Available endpoints:');
  console.log(`  GET  /health - Health check`);
  console.log(`  POST /api/ask - Ask agent a question`);
  console.log(`  GET  /api/agent-info - Get agent information`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Made with Bob
