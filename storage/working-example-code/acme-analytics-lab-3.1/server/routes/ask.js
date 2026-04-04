import express from 'express';
import { callOrchestrateAgent, extractHtmlResponse, extractStepHistory } from '../utils/orchestrate.js';

const router = express.Router();

/**
 * POST /api/ask
 * Submit a question to the pandas_dataset_qa_agent
 */
router.post('/', async (req, res) => {
  try {
    const { question, dataset } = req.body;
    
    // Validate input
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Question is required and must be a string'
      });
    }
    
    if (!dataset || typeof dataset !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Dataset is required and must be a string'
      });
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`POST /api/ask`);
    console.log(`Question: ${question}`);
    console.log(`Dataset: ${dataset}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // Get configuration from environment
    const instanceUrl = process.env.WO_INSTANCE;
    const agentId = process.env.AGENT_ID;
    const apiKey = process.env.WO_API_KEY;
    
    if (!instanceUrl || !apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing WO_INSTANCE or WO_API_KEY'
      });
    }
    
    // Call the agent
    const result = await callOrchestrateAgent(
      question,
      dataset,
      instanceUrl,
      agentId,
      apiKey
    );
    
    // Extract response components
    const html = extractHtmlResponse(result);
    const stepHistory = extractStepHistory(result);
    
    // Return complete response
    res.json({
      success: true,
      html,
      stepHistory,
      fullResponse: result,
      metadata: {
        question,
        dataset,
        timestamp: new Date().toISOString(),
        agentId
      }
    });
    
  } catch (error) {
    console.error('Error in /api/ask:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your question',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

// Made with Bob
