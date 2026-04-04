# Acme Analytics Backend Server

Backend API server for the Acme Analytics application, providing integration with watsonx Orchestrate's pandas_dataset_qa_agent.

## Overview

This Express.js server acts as a secure proxy between the frontend React application and watsonx Orchestrate, handling:
- IAM token authentication and caching
- Agent invocation and polling
- Response formatting and error handling

## Architecture

```
Frontend (React) → Backend (Express) → IBM Cloud IAM → watsonx Orchestrate → Agent
```

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
WO_INSTANCE=https://api.us-south.watson-orchestrate.cloud.ibm.com/instances/YOUR_INSTANCE_ID
WO_API_KEY=YOUR_IBM_CLOUD_API_KEY
AGENT_ID=a6dcc07a-9477-4f2b-ba2e-b2120b35da61
PORT=3001
NODE_ENV=development
```

**Getting Your Credentials:**

- **WO_INSTANCE**: Your watsonx Orchestrate instance URL (from the Orchestrate dashboard)
- **WO_API_KEY**: IBM Cloud API key with access to your Orchestrate instance
- **AGENT_ID**: The deployed agent ID (default: a6dcc07a-9477-4f2b-ba2e-b2120b35da61)

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and configuration check.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-31T10:00:00.000Z",
  "environment": {
    "hasInstanceUrl": true,
    "hasApiKey": true,
    "hasAgentId": true,
    "port": 3001
  }
}
```

### Ask Question

```
POST /api/ask
```

Submit a question to the pandas_dataset_qa_agent.

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
  "html": "<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>...",
  "stepHistory": [...],
  "fullResponse": {...},
  "metadata": {
    "question": "...",
    "dataset": "...",
    "timestamp": "2026-03-31T10:00:00.000Z",
    "agentId": "a6dcc07a-9477-4f2b-ba2e-b2120b35da61"
  }
}
```

## Project Structure

```
server/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in git)
├── .env.example          # Environment template
├── README.md             # This file
├── routes/
│   └── ask.js            # /api/ask endpoint
└── utils/
    ├── auth.js           # IAM token management
    └── orchestrate.js    # Orchestrate API client
```

## Features

### IAM Token Caching

The server caches IAM tokens to reduce authentication overhead:
- Tokens are cached until 5 minutes before expiry
- Automatic refresh on expiry
- Retry logic for transient failures

### Error Handling

Comprehensive error handling with:
- Input validation
- Network error retry (exponential backoff)
- Token expiry handling
- User-friendly error messages

### Polling Mechanism

The server polls the Orchestrate API for agent responses:
- Polls every 2 seconds
- Maximum wait time: 60 seconds
- Automatic timeout handling

## Troubleshooting

### Server won't start

**Issue**: Missing environment variables

**Solution**: Ensure `.env` file exists with all required variables

```bash
cp .env.example .env
# Edit .env with your credentials
```

### Authentication errors

**Issue**: "Failed to authenticate with IBM Cloud"

**Solution**: 
1. Verify your API key is correct
2. Ensure the API key has access to your Orchestrate instance
3. Check that the instance URL is correct

### Agent timeout

**Issue**: "Timeout: Agent did not respond within 60 seconds"

**Solution**:
1. Question may be too complex - try a simpler question
2. Check agent is deployed and active in Orchestrate
3. Verify agent ID matches the deployed agent

### CORS errors

**Issue**: CORS errors in browser console

**Solution**: Ensure frontend is running on `http://localhost:5173` or update CORS configuration in `server.js`

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses Node's `--watch` flag for automatic reloading on file changes.

### Testing the API

Test the health endpoint:

```bash
curl http://localhost:3001/health
```

Test the ask endpoint:

```bash
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the most popular product categories?",
    "dataset": "ecommerce-order-and-supply-chain"
  }'
```

## Security Considerations

- API keys are stored server-side only (never exposed to frontend)
- IAM tokens are cached securely in memory
- CORS is configured to allow only specific origins
- Input validation on all endpoints
- Sandboxed iframe rendering in frontend

## Dependencies

- **express**: Web server framework
- **cors**: CORS middleware
- **dotenv**: Environment variable management
- **node-fetch**: HTTP client for API calls

## License

Private - IBM Internal Use

---

*Created with IBM Bob*