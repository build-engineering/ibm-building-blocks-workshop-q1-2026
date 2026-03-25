# Tax Document Assistant

A watsonx Orchestrate agent designed to help clients organize and track their tax documents throughout the year. This agent assists Individual, Small Business, and Corporate clients with document management, status tracking, and personalized communications.

## Overview

The Tax Document Assistant helps clients with:
- Tracking tax document submission status and progress
- Organizing documents by category and client type
- Monitoring document completeness and deadlines
- Generating personalized status updates and reminders
- Providing insights on document requirements by client type

## Quick Start

### Prerequisites
- Python 3.12+
- watsonx Orchestrate ADK (`pip install ibm-watsonx-orchestrate`)
- WXO Developer Edition running locally

### Import the Agent

From the `lab-4-agent-ops/` directory, run these commands **in order**:

```bash
# Import tools
orchestrate tools import -f assets/tax-document-assistant-agent/tools/client_tools.py
orchestrate tools import -f assets/tax-document-assistant-agent/tools/communication_tools.py

# Import knowledge base
orchestrate knowledge-bases import -f assets/tax-document-assistant-agent/knowledge_bases/tax_document_kb.yaml

# Import agent config
orchestrate agents import -f assets/tax-document-assistant-agent/agent_config.yaml
```

> **Note:** In Developer Edition, agents are ready immediately after import. There is no separate deploy step.

## Project Structure

```
tax-document-assistant-agent/
├── agent_config.yaml              # Agent configuration
├── tools/
│   ├── client_tools.py           # Client management tools (4 tools)
│   └── communication_tools.py    # Communication generation tool (1 tool)
├── data/
│   ├── clients.csv               # Sample client data
│   └── tax_document_requirements.txt  # Tax document guide
├── knowledge_bases/
│   └── tax_document_kb.yaml      # Knowledge base configuration
└── README.md                      # This file
```

## Client Types

The agent supports three client types, each with different document requirements:

### Individual
Personal tax filers with standard W-2s, 1099s, and deductions
- **Typical Documents Required**: 6-8
- **Common Forms**: W-2, 1099-INT, 1099-DIV, 1098, receipts
- **Filing Deadline**: April 15

### Small Business
Self-employed individuals and small businesses with additional forms
- **Typical Documents Required**: 12-15
- **Common Forms**: Schedule C, quarterly estimates, business expenses, mileage logs
- **Filing Deadline**: April 15

### Corporate
Corporations with complex tax requirements
- **Typical Documents Required**: 25-30
- **Common Forms**: Form 1120, financial statements, payroll records, K-1s
- **Filing Deadline**: March 15 (S-Corps/Partnerships) or April 15 (C-Corps)

## Agent Capabilities

### Client Management Tools
- **get_client_data**: Retrieve client profiles with flexible filtering options
- **get_client_by_id**: Get specific client details by ID
- **get_clients_by_type**: Filter clients by type (Individual/Small Business/Corporate)
- **calculate_client_metrics**: Compute document completion analytics and metrics

### Communication Tools
- **generate_communication**: Create personalized communications for clients
  - Status updates
  - Missing document reminders
  - Deadline alerts
  - Completion reports

### Knowledge Base
The agent has access to comprehensive tax document information including:
- Client profiles and submission status
- Document requirements by client type
- Common tax filing questions
- Filing deadlines and extensions
- Document organization best practices

## Sample Queries

**Client Lookup:**
- "Get client CLI001"
- "Show me all Individual clients"
- "List clients with In Progress status"

**Metrics and Analytics:**
- "Calculate client metrics"
- "Show me metrics for Small Business clients"
- "What's the overall document completion rate?"

**Communication Generation:**
- "Generate a status update for client CLI001"
- "Create a missing reminder for CLI006"
- "Send a deadline alert to CLI007"
- "Generate a completion report for CLI003"

**Knowledge Base Questions:**
- "What documents do Individual clients need?"
- "When is the filing deadline for corporations?"
- "What are the requirements for Small Business clients?"

## Sample Client Data

The agent includes 8 sample clients with diverse profiles:

| Client ID | Name | Type | Status | Completion |
|-----------|------|------|--------|------------|
| CLI001 | Sarah Johnson | Individual | In Progress | 75% |
| CLI002 | Michael Chen | Small Business | Not Started | 0% |
| CLI003 | Emily Rodriguez | Individual | Complete | 100% |
| CLI004 | TechStart Inc | Corporate | In Progress | 72% |
| CLI005 | David Martinez | Small Business | In Progress | 83% |
| CLI006 | Jennifer Lee | Individual | In Progress | 43% |
| CLI007 | Global Solutions LLC | Corporate | Not Started | 0% |
| CLI008 | Robert Thompson | Individual | Complete | 100% |

## Customization

### Adding Real Client Data
Replace the sample data in `tools/client_tools.py` and `tools/communication_tools.py` with your actual client data. Data must be embedded directly in the tools since WXO tools run in an isolated environment.

### Adding More Tools
You can add additional tools (up to 5 total) by:
1. Creating a new Python file in the `tools/` directory
2. Using the `@tool` decorator from `ibm_watsonx_orchestrate.agent_builder.tools`
3. Updating `agent_config.yaml` to reference the new tool
4. Re-importing tools and the agent config

### Customizing Communications
Edit the message templates in `tools/communication_tools.py` to match your branding and communication style.
