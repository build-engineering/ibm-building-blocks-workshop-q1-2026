import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Token cache
let cachedToken = null;
let cachedExpiryMs = 0;

/**
 * Get IAM bearer token for Orchestrate API calls
 * Caches token and refreshes before expiry
 * @returns {Promise<string>} Bearer token
 */
export async function getIamToken() {
  const now = Date.now();
  
  // Return cached token if still valid (with 60 second buffer)
  if (cachedToken && now < cachedExpiryMs - 60_000) {
    console.log('Using cached IAM token');
    return cachedToken;
  }

  console.log('Fetching new IAM token...');
  
  try {
    const body = new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.API_KEY,
    });

    const response = await axios.post(process.env.AUTH_URL, body, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
    });

    cachedToken = response.data.access_token;
    const expiresInSec = response.data.expires_in ?? 3600;
    cachedExpiryMs = Date.now() + expiresInSec * 1000;
    
    console.log(`IAM token acquired, expires in ${expiresInSec} seconds`);
    return cachedToken;
  } catch (error) {
    console.error('Error fetching IAM token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with IBM Cloud');
  }
}

/**
 * Clear cached token (useful for testing or error recovery)
 */
export function clearTokenCache() {
  cachedToken = null;
  cachedExpiryMs = 0;
  console.log('Token cache cleared');
}

// Made with Bob
