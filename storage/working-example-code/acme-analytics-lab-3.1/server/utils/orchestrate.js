import fetch from 'node-fetch';
import { getIAMToken, clearTokenCache } from './auth.js';

/**
 * Call watsonx Orchestrate agent and poll for response
 * @param {string} question - User's question
 * @param {string} dataset - Dataset name
 * @param {string} instanceUrl - Orchestrate instance URL
 * @param {string} agentId - Agent ID
 * @param {string} apiKey - IBM Cloud API key
 * @returns {Promise<Object>} Complete agent response
 */
export async function callOrchestrateAgent(question, dataset, instanceUrl, agentId, apiKey) {
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Calling Orchestrate agent...`);
      
      // Get IAM token
      const token = await getIAMToken(apiKey);
      
      // Create the run
      const runId = await createRun(question, dataset, instanceUrl, agentId, token);
      console.log(`Run created with ID: ${runId}`);
      
      // Poll for completion
      const result = await pollForCompletion(runId, instanceUrl, token);
      console.log('Agent response received successfully');
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If token expired, clear cache and retry
      if (error.message.includes('401') || error.message.includes('token')) {
        console.log('Token may be expired, clearing cache...');
        clearTokenCache();
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxAttempts} attempts: ${lastError.message}`);
}

/**
 * Create a new agent run
 */
async function createRun(question, dataset, instanceUrl, agentId, token) {
  const url = `${instanceUrl}/v1/orchestrate/runs`;
  
  const requestBody = {
    message: {
      role: 'user',
      content: [{
        response_type: 'text',
        text: `Question: ${question}\nDataset: ${dataset}`
      }]
    },
    agent_id: agentId,
    environment_id: process.env.AGENT_ENVIRONMENT_ID
  };
  
  console.log('Sending request to Orchestrate:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create run: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Run creation response:', JSON.stringify(data, null, 2));
  return data.run_id;
}

/**
 * Poll for run completion
 * Polls every 2 seconds for up to 60 seconds
 */
async function pollForCompletion(runId, instanceUrl, token, maxWaitTime = 120000) {
  const pollInterval = 2000; // 2 seconds
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const url = `${instanceUrl}/v1/orchestrate/runs/${runId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get run status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Check if run is complete
    if (data.status === 'completed') {
      console.log('Run completed successfully');
      return data;
    }
    
    if (data.status === 'failed') {
      throw new Error(`Agent run failed: ${JSON.stringify(data.error || 'Unknown error')}`);
    }
    
    // Still running, wait before next poll
    console.log(`Run status: ${data.status}, waiting...`);
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error(`Timeout: Agent did not respond within ${maxWaitTime / 1000} seconds`);
}

/**
 * Extract HTML response from agent result
 */
export function extractHtmlResponse(result) {
  try {
    // Log the full response structure for debugging
    console.log('\n=== FULL AGENT RESPONSE STRUCTURE ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('=== END RESPONSE STRUCTURE ===\n');
    
    // Try multiple possible paths for the HTML content
    const possiblePaths = [
      // Path 1: result.data.message.content[0].text
      () => result?.data?.message?.content?.[0]?.text,
      // Path 2: result.message.content[0].text
      () => result?.message?.content?.[0]?.text,
      // Path 3: result.result.data.message.content[0].text
      () => result?.result?.data?.message?.content?.[0]?.text,
      // Path 4: result.result.message.content[0].text
      () => result?.result?.message?.content?.[0]?.text,
      // Path 5: result.data.content[0].text
      () => result?.data?.content?.[0]?.text,
      // Path 6: result.content[0].text
      () => result?.content?.[0]?.text,
      // Path 7: result.output (direct output field)
      () => result?.output,
      // Path 8: result.data.output
      () => result?.data?.output,
      // Path 9: result.result.output
      () => result?.result?.output
    ];
    
    // Try each path
    for (let i = 0; i < possiblePaths.length; i++) {
      try {
        const html = possiblePaths[i]();
        if (html && typeof html === 'string' && html.trim().length > 0) {
          console.log(`✓ HTML found at path ${i + 1}`);
          return html;
        }
      } catch (e) {
        // Continue to next path
      }
    }
    
    // If no HTML found, log the structure and throw error
    console.error('HTML not found in any expected location');
    console.error('Available keys at root:', Object.keys(result || {}));
    if (result?.data) {
      console.error('Available keys in result.data:', Object.keys(result.data));
    }
    if (result?.message) {
      console.error('Available keys in result.message:', Object.keys(result.message));
    }
    
    throw new Error('HTML response not found in expected location');
  } catch (error) {
    console.error('Error extracting HTML:', error);
    throw error;
  }
}

/**
 * Extract step history from agent result
 */
export function extractStepHistory(result) {
  try {
    // Try multiple possible paths for step history
    const possiblePaths = [
      () => result?.data?.message?.step_history,
      () => result?.message?.step_history,
      () => result?.result?.data?.message?.step_history,
      () => result?.result?.message?.step_history,
      () => result?.step_history,
      () => result?.data?.step_history,
      () => result?.result?.step_history
    ];
    
    for (let i = 0; i < possiblePaths.length; i++) {
      try {
        const stepHistory = possiblePaths[i]();
        if (stepHistory && Array.isArray(stepHistory) && stepHistory.length > 0) {
          console.log(`✓ Step history found at path ${i + 1} (${stepHistory.length} steps)`);
          return stepHistory;
        }
      } catch (e) {
        // Continue to next path
      }
    }
    
    console.log('No step history found in response');
    return [];
  } catch (error) {
    console.error('Error extracting step history:', error);
    return [];
  }
}

// Made with Bob
