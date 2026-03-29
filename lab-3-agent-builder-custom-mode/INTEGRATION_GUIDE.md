# Acme Analytics Q&A Agent Integration Guide

## Overview

This guide documents the complete integration of the pandas_dataset_qa_agent with the Acme Analytics website, enabling users to ask natural language questions about datasets and receive AI-powered insights with interactive visualizations.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Frontend (Vite)                                 │ │
│  │  - DatasetQA.jsx: Question selection & display        │ │
│  │  - Iframe: Secure HTML/Chart.js rendering             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│              Express Backend Server (Node.js)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  auth.js: IAM token management & caching              │ │
│  │  orchestrate.js: API client with retry logic          │ │
│  │  server.js: REST API endpoints                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS + Bearer Token
┌─────────────────────────────────────────────────────────────┐
│              watsonx Orchestrate (IBM Cloud)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  pandas_dataset_qa_agent                               │ │
│  │  - Analyzes questions                                  │ │
│  │  - Generates pandas code                               │ │
│  │  - Executes via Pandas MCP toolkit                    │ │
│  │  - Returns HTML with Chart.js visualizations          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Trust Boundaries

1. **Browser → Backend**: Standard HTTP/CORS
2. **Backend → IBM Cloud IAM**: API key exchange for bearer token
3. **Backend → Orchestrate**: Bearer token authentication
4. **Browser Iframe**: Sandboxed HTML rendering

### Security Features

- ✅ API keys stored server-side only
- ✅ IAM token caching with automatic refresh
- ✅ Token expiry handling with retry logic
- ✅ Iframe sandboxing for safe HTML/script execution
- ✅ Input validation on all endpoints
- ✅ CORS configuration for origin control

## Setup Instructions

### Prerequisites

1. watsonx Orchestrate instance with active environment
2. Pandas MCP toolkit deployed in Orchestrate
3. pandas_dataset_qa_agent deployed in Orchestrate
4. IBM Cloud API key with Orchestrate access
5. Node.js 18+ installed

### Step 1: Deploy the Agent

```bash
cd lab-3-agent-builder-custom-mode

# Deploy using the script
./scripts/deploy_agent.sh

# Or manually
source /path/to/venv/bin/activate
orchestrate env activate your-env-name -a YOUR_API_KEY
orchestrate agents import -f agents/pandas_dataset_qa_agent.yaml
```

### Step 2: Configure Backend Server

```bash
cd acme-analytics/server

# Create .env file
cat > .env << EOF
AUTH_URL=https://iam.cloud.ibm.com/identity/token
API_KEY=your-ibm-cloud-api-key
INSTANCE_URL=https://api.us-south.watson-orchestrate.cloud.ibm.com/instances/your-instance-id
AGENT_ID=your-agent-id
PORT=3001
EOF

# Install dependencies
npm install
```

### Step 3: Start Backend Server

```bash
cd acme-analytics/server
npm run dev
```

Server will start on `http://localhost:3001`

### Step 4: Start Frontend

```bash
cd acme-analytics
npm install  # if not already done
npm run dev
```

Frontend will start on `http://localhost:5173`

### Step 5: Test the Integration

1. Open browser to `http://localhost:5173`
2. Navigate to the "Q&A with Data" page
3. Select a dataset from the navigation
4. Choose a question from the dropdown
5. Click "Submit"
6. Wait 30-60 seconds for the agent to analyze and respond
7. View the natural language answer and interactive chart

## User Flow

### Question Submission Flow

```
1. User selects dataset (via navigation)
   ↓
2. User selects question from dropdown
   ↓
3. User clicks "Submit" button
   ↓
4. Frontend shows loading indicator
   ↓
5. Frontend sends POST to /api/ask
   ↓
6. Backend gets/refreshes IAM token
   ↓
7. Backend calls Orchestrate runs API
   ↓
8. Agent executes workflow:
   - Gets dataset info
   - Generates pandas code
   - Executes code via MCP
   - Generates HTML response
   ↓
9. Backend extracts HTML from response
   ↓
10. Frontend receives HTML
    ↓
11. Frontend renders HTML in sandboxed iframe
    ↓
12. User sees answer + interactive chart
```

## API Integration Details

### Frontend → Backend

**Endpoint**: `POST http://localhost:3001/api/ask`

**Request**:
```javascript
{
  question: "What are the top 5 neighborhoods with the most building permits?",
  dataset: "san-francisco-building-permits"
}
```

**Response**:
```javascript
{
  success: true,
  html: "<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>...",
  metadata: {
    question: "...",
    dataset: "...",
    timestamp: "2026-03-26T04:00:00.000Z"
  }
}
```

### Backend → Orchestrate

**Endpoint**: `POST {INSTANCE_URL}/v1/orchestrate/runs`

**Headers**:
```
Authorization: Bearer {IAM_TOKEN}
Content-Type: application/json
```

**Request**:
```javascript
{
  message: {
    role: "user",
    content: [{
      response_type: "text",
      text: "Question: {question}\nDataset: {dataset}"
    }]
  },
  agent_id: "{AGENT_ID}"
}
```

## HTML Response Format

The agent returns self-contained HTML with:

1. **Script imports** (Chart.js or Plotly.js CDN)
2. **Natural language answer** (styled div)
3. **Canvas/div element** for chart
4. **Inline script** with chart configuration

Example:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="padding: 20px; font-family: Arial, sans-serif;">
  <div style="margin-bottom: 30px; padding: 15px; background-color: #f5f5f5;">
    <h3>Answer</h3>
    <p>Based on the analysis, the top 5 neighborhoods are...</p>
  </div>
  
  <div>
    <h3>Visualization</h3>
    <canvas id="myChart"></canvas>
  </div>
</div>

<script>
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, { /* chart config */ });
</script>
```

## Iframe Security

The iframe uses sandbox attributes for security:

```jsx
<iframe
  srcDoc={htmlResponse}
  sandbox="allow-scripts allow-same-origin"
  className="results-iframe"
/>
```

**Sandbox Permissions**:
- `allow-scripts`: Required for Chart.js execution
- `allow-same-origin`: Required for Chart.js to access canvas

**Blocked by Sandbox**:
- Form submission
- Top-level navigation
- Popup windows
- Downloads
- Pointer lock

## Error Handling

### Frontend Errors

- **Network errors**: Display user-friendly error message
- **Timeout**: Show timeout message after 2 minutes
- **Invalid response**: Show parsing error

### Backend Errors

- **Token expiry**: Automatic refresh and retry (up to 3 attempts)
- **Network errors**: Exponential backoff retry
- **Validation errors**: Return 400 with clear message
- **Agent errors**: Return 500 with error details

### Agent Errors

- **Code execution errors**: Agent retries with corrected code
- **Dataset not found**: Agent returns error message
- **Timeout**: Backend timeout after 2 minutes

## Performance Considerations

### Response Times

- **Token acquisition**: ~1-2 seconds (first request)
- **Token reuse**: <100ms (cached)
- **Agent execution**: 30-60 seconds (typical)
- **Total user wait**: 30-60 seconds

### Optimization Strategies

1. **Token caching**: Reduces auth overhead
2. **Connection pooling**: Reuses HTTP connections
3. **Timeout handling**: Prevents hanging requests
4. **Error retry**: Handles transient failures

## Monitoring & Debugging

### Backend Logs

The server logs:
```
2026-03-26T04:00:00.000Z - POST /api/ask
Using cached IAM token
Attempt 1: Calling Orchestrate agent...
Sending request to Orchestrate: {...}
Orchestrate response received
```

### Frontend Console

The frontend logs:
```
Sending question to backend: {question, dataset}
```

### Debugging Tips

1. **Check server logs** for authentication issues
2. **Verify agent ID** matches deployed agent
3. **Test backend directly** with curl
4. **Check browser console** for frontend errors
5. **Inspect iframe content** using browser dev tools

## Testing

### Manual Testing

Test each dataset with sample questions:

**E-commerce Dataset**:
```
What are the most popular product categories by sales volume?
```

**Building Permits Dataset**:
```
What are the top 5 neighborhoods with the most building permits?
```

**Customer Behavior Dataset**:
```
What factors contribute most to customer churn?
```

### Backend Testing

```bash
# Health check
curl http://localhost:3001/health

# Test agent call
curl -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the most popular product categories?",
    "dataset": "ecommerce-order-and-supply-chain"
  }'
```

## Troubleshooting

### Common Issues

**Issue**: "Failed to authenticate with IBM Cloud"
- **Solution**: Verify API_KEY in .env is correct

**Issue**: "Agent not responding"
- **Solution**: Check AGENT_ID matches deployed agent

**Issue**: "CORS error in browser"
- **Solution**: Ensure backend is running on port 3001

**Issue**: "Chart not rendering"
- **Solution**: Check iframe sandbox permissions

**Issue**: "Timeout after 2 minutes"
- **Solution**: Question may be too complex, try simpler question

## Production Deployment

### Checklist

- [ ] Use environment-specific configuration
- [ ] Enable HTTPS for all communication
- [ ] Configure CORS for production domains
- [ ] Add rate limiting middleware
- [ ] Implement request logging
- [ ] Set up monitoring and alerts
- [ ] Use process manager (PM2)
- [ ] Configure load balancing
- [ ] Set up backup/failover
- [ ] Document runbook procedures

## Files Created

### Agent Files
- `agents/pandas_dataset_qa_agent.yaml` - Agent specification
- `agents/README.md` - Agent documentation
- `scripts/deploy_agent.sh` - Deployment script
- `scripts/rollback_agent.sh` - Rollback script

### Backend Files
- `acme-analytics/server/server.js` - Express server
- `acme-analytics/server/auth.js` - IAM authentication
- `acme-analytics/server/orchestrate.js` - Orchestrate client
- `acme-analytics/server/package.json` - Dependencies
- `acme-analytics/server/.env` - Configuration
- `acme-analytics/server/README.md` - Server documentation

### Frontend Files
- `acme-analytics/src/pages/DatasetQA.jsx` - Q&A component
- `acme-analytics/src/pages/datasetqa.scss` - Styles

## Support

For issues or questions:
1. Check server logs for errors
2. Verify agent is deployed: `orchestrate agents list`
3. Test backend endpoint directly
4. Review this integration guide
5. Check Orchestrate ADK documentation

---

*Created with IBM Bob using the Agent Builder skill*