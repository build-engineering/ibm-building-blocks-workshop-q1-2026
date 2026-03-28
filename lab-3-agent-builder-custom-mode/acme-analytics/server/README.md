# Acme Analytics Backend Server

## Overview

Express.js backend server that securely connects the Acme Analytics website to the watsonx Orchestrate pandas_dataset_qa_agent. Handles authentication, token management, and API communication with Orchestrate.

## Architecture

```
Browser (React)
    ↓ HTTP Request
Backend Server (Express)
    ↓ IAM Token Exchange
IBM Cloud IAM
    ↓ Bearer Token
watsonx Orchestrate API
    ↓ Agent Execution
pandas_dataset_qa_agent
    ↓ HTML Response
Browser (iframe)
```

## Security Features

- **Server-side API key storage**: API keys never exposed to browser
- **IAM token caching**: Tokens cached and refreshed automatically
- **Token expiry handling**: Automatic retry with fresh tokens on 401/403
- **CORS protection**: Configured for local development
- **Request validation**: Input validation on all endpoints

## Files

- `server.js` - Main Express server with API endpoints
- `auth.js` - IAM token management and caching
- `orchestrate.js` - Orchestrate API client with retry logic
- `.env` - Environment configuration (not committed to git)
- `package.json` - Dependencies and scripts

## Environment Variables

Create a `.env` file with:

```env
# Orchestrate Configuration
AUTH_URL=https://iam.cloud.ibm.com/identity/token
API_KEY=your-ibm-cloud-api-key
INSTANCE_URL=https://api.us-south.watson-orchestrate.cloud.ibm.com/instances/your-instance-id
AGENT_ID=your-agent-id

# Server Configuration
PORT=3001
```

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```

Returns server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-26T04:00:00.000Z",
  "agent_id": "9cca903c-a36e-4642-8d10-b0be144682a8"
}
```

### Ask Agent
```
POST /api/ask
```

Send a question to the pandas_dataset_qa_agent.

**Request Body:**
```json
{
  "question": "What are the top 5 neighborhoods with the most building permits?",
  "dataset": "san-francisco-building-permits"
}
```

**Response:**
```json
{
  "success": true,
  "html": "<script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>...",
  "metadata": {
    "question": "What are the top 5 neighborhoods with the most building permits?",
    "dataset": "san-francisco-building-permits",
    "timestamp": "2026-03-26T04:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Agent Info
```
GET /api/agent-info
```

Get information about the configured agent.

**Response:**
```json
{
  "agent_id": "9cca903c-a36e-4642-8d10-b0be144682a8",
  "instance_url": "https://api.us-south.watson-orchestrate.cloud.ibm.com/instances/...",
  "available": true
}
```

## Token Management

The server automatically handles IAM token lifecycle:

1. **Initial Request**: Exchanges API key for bearer token
2. **Caching**: Stores token with expiry time
3. **Reuse**: Returns cached token if still valid (60s buffer)
4. **Refresh**: Automatically gets new token when expired
5. **Retry**: Retries failed requests with fresh token (up to 3 attempts)

## Error Handling

The server implements comprehensive error handling:

- **Authentication Errors (401/403)**: Automatic token refresh and retry
- **Network Errors**: Exponential backoff retry logic
- **Validation Errors**: Clear error messages for invalid input
- **Timeout**: 2-minute timeout for long-running agent queries

## Logging

The server logs:
- All incoming requests with timestamps
- Token acquisition and refresh events
- Orchestrate API calls and responses
- Errors with full context

## Testing

### Test Health Endpoint
```bash
curl http://localhost:3001/health
```

### Test Agent Endpoint
```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the most popular product categories by sales volume?",
    "dataset": "ecommerce-order-and-supply-chain"
  }'
```

## Troubleshooting

### Server won't start
- Check that port 3001 is not in use
- Verify `.env` file exists and has all required variables
- Run `npm install` to ensure dependencies are installed

### Authentication errors
- Verify API_KEY is correct and has proper permissions
- Check that INSTANCE_URL matches your Orchestrate instance
- Ensure the API key hasn't expired

### Agent not responding
- Verify AGENT_ID is correct using `orchestrate agents list`
- Check that the agent is deployed in Orchestrate
- Ensure the Pandas MCP toolkit is available

### CORS errors
- Verify the frontend is running on the expected port
- Check CORS configuration in `server.js`
- For production, update CORS to allow specific origins only

## Production Deployment

For production deployment:

1. **Environment Variables**: Use secure secret management (not .env files)
2. **CORS**: Configure specific allowed origins
3. **HTTPS**: Use HTTPS for all communication
4. **Rate Limiting**: Add rate limiting middleware
5. **Monitoring**: Add application monitoring and logging
6. **Process Manager**: Use PM2 or similar for process management

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `axios` - HTTP client for API calls

## License

Internal use only

---

*Created with IBM Bob*