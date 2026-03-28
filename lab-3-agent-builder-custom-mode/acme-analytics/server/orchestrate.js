import axios from 'axios';
import { getIamToken, clearTokenCache } from './auth.js';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Poll for run completion
 * @param {string} runId - The run ID to poll
 * @param {string} token - Bearer token
 * @returns {Promise<object>} Completed run result
 */
async function pollForRunCompletion(runId, token) {
  const maxAttempts = 60; // 2 minutes max (60 * 2 seconds)
  const pollInterval = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const url = `${process.env.INSTANCE_URL}/v1/orchestrate/runs/${runId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const status = response.data.status;
      console.log(`Poll attempt ${attempt}: Run status = ${status}`);

      if (status === 'completed') {
        return response.data;
      } else if (status === 'failed' || status === 'cancelled') {
        throw new Error(`Run ${status}: ${response.data.error || 'Unknown error'}`);
      }

      // Still running, wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));

    } catch (error) {
      if (error.message.includes('Run failed') || error.message.includes('Run cancelled')) {
        throw error;
      }
      console.error(`Error polling run ${runId}:`, error.message);
      throw new Error(`Failed to poll run status: ${error.message}`);
    }
  }

  throw new Error(`Run timed out after ${maxAttempts * pollInterval / 1000} seconds`);
}


/**
 * Call the Orchestrate agent with a question
 * @param {string} question - The question to ask the agent
 * @param {string} dataset - The dataset name
 * @returns {Promise<object>} Agent response
 */
export async function askAgent(question, dataset) {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Calling Orchestrate agent...`);
      
      const token = await getIamToken();
      const url = `${process.env.INSTANCE_URL}/v1/orchestrate/runs`;

      // Construct the message with question and dataset context
      const messageText = `Question: ${question}\nDataset: ${dataset}`;

      const payload = {
        message: {
          role: 'user',
          content: [{
            response_type: 'text',
            text: messageText
          }],
        },
        agent_id: process.env.AGENT_ID,
      };

      console.log('Sending request to Orchestrate:', {
        url,
        agent_id: process.env.AGENT_ID,
        message: messageText
      });

      // Create the run
      const createResponse = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 120000,
      });

      const runId = createResponse.data.run_id;
      console.log(`Run created with ID: ${runId}`);

      // Poll for completion
      const result = await pollForRunCompletion(runId, token);
      console.log('Run completed successfully');
      return result;

    } catch (error) {
      lastError = error;
      
      // Check if it's a token expiry error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(`Authentication error on attempt ${attempt}, clearing token cache...`);
        clearTokenCache();
        
        if (attempt < maxRetries) {
          console.log('Retrying with fresh token...');
          continue;
        }
      }

      // Log the error details
      console.error('Orchestrate API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // All retries failed
  throw new Error(
    `Failed to call Orchestrate agent after ${maxRetries} attempts: ${
      lastError.response?.data?.message || lastError.message
    }`
  );
}

/**
 * Extract the HTML response from the agent's output
 * @param {object} agentResponse - The full agent response
 * @returns {string} HTML content
 */
export function extractHtmlFromResponse(agentResponse) {
  try {
    // The agent response structure may vary, so we need to handle different formats
    
    // Check if there's a direct message content
    if (agentResponse.message?.content) {
      const content = agentResponse.message.content;
      
      // If content is an array, find text responses
      if (Array.isArray(content)) {
        for (const item of content) {
          if (item.response_type === 'text' && item.text) {
            return item.text;
          }
        }
      }
      
      // If content is a string
      if (typeof content === 'string') {
        return content;
      }
    }

    // Check for output field
    if (agentResponse.output) {
      if (typeof agentResponse.output === 'string') {
        return agentResponse.output;
      }
      if (agentResponse.output.text) {
        return agentResponse.output.text;
      }
    }

    // Fallback: return the whole response as JSON
    console.warn('Could not extract HTML from standard fields, returning full response');
    return JSON.stringify(agentResponse, null, 2);
    
  } catch (error) {
    console.error('Error extracting HTML from response:', error);
    throw new Error('Failed to extract HTML from agent response');
  }
}

// Made with Bob
