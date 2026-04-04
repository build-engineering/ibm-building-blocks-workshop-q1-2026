import fetch from 'node-fetch';

// Token cache
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get IAM token from IBM Cloud
 * Implements caching to reduce overhead
 */
export async function getIAMToken(apiKey) {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    console.log('Using cached IAM token');
    return cachedToken;
  }

  console.log('Fetching new IAM token...');
  
  const authUrl = 'https://iam.cloud.ibm.com/identity/token';
  
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  params.append('apikey', apiKey);

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IAM authentication failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Cache the token
    cachedToken = data.access_token;
    // Set expiry time (expires_in is in seconds)
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    
    console.log('IAM token obtained successfully');
    return cachedToken;
  } catch (error) {
    console.error('Error getting IAM token:', error.message);
    throw error;
  }
}

/**
 * Clear cached token (useful for testing or error recovery)
 */
export function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = null;
  console.log('Token cache cleared');
}

// Made with Bob
