# Pandas MCP Server Deployment Guide

## Overview

This guide explains how to deploy the Pandas MCP Server as a toolkit to watsonx Orchestrate. The server provides data analysis capabilities through two main tools:

- **get_datasets**: Lists available datasets with descriptions and file paths
- **run_pandas_code**: Executes pandas code safely with security restrictions

## Prerequisites

1. **watsonx Orchestrate ADK** installed in a Python virtual environment
2. **Environment Configuration**: A `.env` file in the `lab-3-agent-builder-custom-mode` directory with:
   - `WO_ADK_ENVIRONMENT_NAME`: Your Orchestrate ADK environment name
   - `PATH_TO_PYTHON_VENV_WITH_ORCHESTRATE_ADK`: Path to Python venv with orchestrate CLI
   - `WO_INSTANCE`: Your watsonx Orchestrate instance URL
   - `WO_API_KEY`: Your API key for authentication

## Deployment Scripts

Two deployment scripts are provided in the `scripts/` directory:

### 1. deploy-pandas-mcp-server.sh

Deploys the pandas-mcp-server toolkit to watsonx Orchestrate.

**What it does:**
- Loads environment variables from `.env`
- Activates the Python virtual environment
- Adds/activates the Orchestrate environment
- Deploys the toolkit with all tools enabled
- Verifies the deployment

**Usage:**
```bash
cd lab-3-agent-builder-custom-mode
./scripts/deploy-pandas-mcp-server.sh
```

### 2. rollback-pandas-mcp-server.sh

Removes the pandas-mcp-server toolkit from watsonx Orchestrate.

**Usage:**
```bash
cd lab-3-agent-builder-custom-mode
./scripts/rollback-pandas-mcp-server.sh
```

## Deployment Details

### Toolkit Configuration

- **Name**: `pandas-mcp-server`
- **Kind**: `mcp` (Model Context Protocol)
- **Language**: `python`
- **Transport**: `stdio` (configured in server.py)
- **Command**: `python server.py`
- **Tools**: All tools (`*`)

### Server Entry Point

The deployment uses **server.py** as the entry point, which:
- Runs with `transport='stdio'` for Orchestrate compatibility
- Initializes logging to `logs/mcp_server.log`
- Exposes two MCP tools via FastMCP

**Note**: `server-https.py` is NOT used for deployment - it was only for local testing with the MCP Inspector.

### Available Tools After Deployment

Once deployed, the following tools will be available in your Orchestrate environment:

#### 1. pandas-mcp-server:get_datasets

Returns a list of available datasets with descriptions and file paths.

**Returns**: JSON with dataset information
```json
{
  "datasets": {
    "dataset-name": {
      "name": "dataset-name",
      "dataset_description": "...",
      "files": ["datasets/dataset-name/file.csv"]
    }
  }
}
```

#### 2. pandas-mcp-server:run_pandas_code

Executes pandas code safely with security restrictions.

**Parameters:**
- `code` (str): Python code containing pandas operations

**Example:**
```python
import pandas as pd
df = pd.read_csv('datasets/ecommerce-order-and-supply-chain/products.csv')
result = df.head()
```

**Security**: Blocks dangerous operations like `os.`, `sys.`, `subprocess.`, `exec()`, `eval()`, etc.

## Included Datasets

The server includes three datasets in the `datasets/` folder:

1. **ecommerce-order-and-supply-chain**: E-commerce order and supply chain data
2. **multi-channel-customer-behavior**: Customer churn dataset
3. **san-francisco-building-permits**: Building permits data

Each dataset includes:
- CSV data files
- `dataset_description.md` with metadata

## Verification

After deployment, verify the toolkit is available:

```bash
# List all toolkits
orchestrate toolkits list

# View detailed information
orchestrate toolkits list --verbose

# List available tools
orchestrate tools list | grep pandas-mcp-server
```

You should see:
- `pandas-mcp-server:get_datasets`
- `pandas-mcp-server:run_pandas_code`

## Using the Toolkit in Agents

To use the pandas-mcp-server tools in an agent, add them to the agent's YAML specification:

```yaml
spec_version: v1
kind: native
name: data_analyst_agent
llm: groq/openai/gpt-oss-120b
style: default
description: |
  An agent that analyzes datasets using pandas
instructions: |
  You are a data analyst. Use the pandas-mcp-server tools to:
  1. Get available datasets with get_datasets
  2. Execute pandas code with run_pandas_code
  
  Always assign results to a 'result' variable in your code.
tools:
  - pandas-mcp-server:get_datasets
  - pandas-mcp-server:run_pandas_code
```

## Troubleshooting

### Environment Not Active

**Error**: "No active environment is currently set"

**Solution**: The deployment script automatically activates the environment. If running commands manually:
```bash
orchestrate env activate <environment-name> -a <api-key>
```

### Toolkit Already Exists

**Error**: "Toolkit with name 'pandas-mcp-server' already exists"

**Solution**: Remove the existing toolkit first:
```bash
./scripts/rollback-pandas-mcp-server.sh
```
Then redeploy:
```bash
./scripts/deploy-pandas-mcp-server.sh
```

### Permission Denied

**Error**: "Permission denied" when running scripts

**Solution**: Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### Module Import Errors

**Error**: "No module named 'fastmcp'" or similar

**Solution**: Ensure `requirements.txt` is in the `pandas-mcp-server` folder. The Orchestrate runtime will install dependencies automatically.

## Architecture

```
pandas-mcp-server/
├── server.py              # Main entry point (used by Orchestrate)
├── server-https.py        # Local testing only (NOT used in deployment)
├── config.py              # Configuration and security settings
├── execution.py           # Code execution logic
├── error_handling.py      # Error handling utilities
├── requirements.txt       # Python dependencies
├── datasets/              # Dataset files
│   ├── ecommerce-order-and-supply-chain/
│   ├── multi-channel-customer-behavior/
│   └── san-francisco-building-permits/
└── logs/                  # Server logs (created at runtime)
```

## Security Features

The server implements multiple security layers:

1. **Code Blacklist**: Blocks dangerous operations (os, sys, subprocess, exec, eval)
2. **Sandboxed Execution**: Code runs in restricted environment
3. **Memory Monitoring**: Tracks memory usage during execution
4. **Logging**: All operations logged to `logs/mcp_server.log`

## Next Steps

After deployment:

1. **Create an Agent**: Build an agent that uses the pandas-mcp-server tools
2. **Test the Tools**: Use the Orchestrate chat interface to test data analysis
3. **Monitor Logs**: Check `pandas-mcp-server/logs/mcp_server.log` for execution details
4. **Add More Datasets**: Place new datasets in the `datasets/` folder with descriptions

## Support

For issues or questions:
- Review the main README.md in the pandas-mcp-server folder
- Check the watsonx Orchestrate ADK documentation
- Examine logs in `pandas-mcp-server/logs/mcp_server.log`

---

*Deployment scripts created following watsonx Orchestrate ADK best practices*