# Build End-to-End Application Observability with IBM Bob and Instana

## Table of Contents

- [Overview](#overview)
- [What is Application Observability?](#what-is-application-observability)
- [IBM Instana Overview](#ibm-instana-overview)
- [Prerequisites](#prerequisites)
- [Step 1: Provision IBM Instana](#step-1-provision-ibm-instana)
- [Step 2: Access IBM Instana](#step-2-access-ibm-instana)
- [Step 3: Generate an Instana API Key](#step-3-generate-an-instana-api-key)
- [Step 4: Install Instana Agent](#step-4-install-instana-agent)
- [Step 5: Deploy and Monitor Your Application](#step-5-deploy-and-monitor-your-application)
- [Step 6: Configure Application Monitoring](#step-6-configure-application-monitoring)
- [Step 7: Leverage IBM Bob for Observability Insights](#step-7-leverage-ibm-bob-for-observability-insights)
- [Step 8: Explore Instana Features](#step-8-explore-instana-features)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview

This guide demonstrates how to implement comprehensive application observability using IBM Instana for monitoring and IBM Bob for intelligent analysis. You'll learn to set up Instana monitoring, integrate it with your applications, and leverage IBM Bob to gain actionable insights from observability data.

### Video Tutorial

Watch the complete walkthrough of this workshop:

**[Build End-to-End Application Observability with IBM Bob and Instana](https://youtu.be/8SZwr_RGhNc?si=D-qBE61rO8VCKCFO)**

This video demonstrates:
- Setting up IBM Instana
- Installing and configuring the Instana agent
- Deploying and monitoring applications
- Using IBM Bob for intelligent analysis
- Best practices for observability

---

## What is Application Observability?

**Application observability** goes beyond traditional monitoring by providing deep insights into application behavior, performance, and health. It enables you to:

- **Understand System Behavior**: Gain visibility into how your applications perform in production
- **Detect Issues Proactively**: Identify problems before they impact users
- **Accelerate Troubleshooting**: Quickly diagnose and resolve issues
- **Optimize Performance**: Make data-driven decisions to improve application efficiency
- **Ensure Reliability**: Maintain high availability and user satisfaction

### The Three Pillars of Observability

| Pillar | Description |
|--------|-------------|
| **Metrics** | Quantitative measurements of system performance (CPU, memory, response times) |
| **Logs** | Detailed records of events and transactions |
| **Traces** | End-to-end request flows across distributed systems |

---

## IBM Instana Overview

**IBM Instana** is an enterprise-grade observability platform that provides:

- **Automatic Discovery**: Automatically detects and monitors applications and infrastructure
- **Real-time Monitoring**: Provides 1-second granularity for metrics and traces
- **AI-Powered Analytics**: Uses machine learning to detect anomalies and predict issues
- **Full-Stack Visibility**: Monitors from infrastructure to application code
- **Distributed Tracing**: Tracks requests across microservices architectures
- **Dynamic Graph**: Visualizes application dependencies and relationships

### Key Features

| Feature | Description |
|---------|-------------|
| **AutoTrace™** | Automatic distributed tracing without code changes |
| **Unbounded Analytics** | Query and analyze unlimited observability data |
| **Smart Alerts** | Context-aware alerting with root cause analysis |
| **Service Maps** | Visual representation of application architecture |
| **Infrastructure Monitoring** | Complete visibility into hosts, containers, and cloud services |

---

## Prerequisites

Before you begin, ensure you have:

### Required

- ✅ **IBM Bob installed** — [Sign up for early access to IBM Bob](https://ibm.com/bob)
- ✅ **Python 3.12 installed** — Required for running automation scripts
- ✅ **IBM Instana instance** — Provision through one of these options:
  - [Free 14-day trial](https://lp2.email.ibm.com/instana-trial.html)
  - IBM Cloud deployment
  - On-premises installation
  - SaaS subscription

### Recommended

- Basic knowledge of IBM Instana and IBM Concert
- Understanding of observability concepts
- Familiarity with distributed systems and microservices
- OpenShift or Kubernetes cluster (from TechZone setup)

---

## Step 1: Provision IBM Instana

### Option A: Free Trial (Recommended for Workshop)

1. **Sign up for trial**

   Navigate to the Instana trial page:
   ```
   https://lp2.email.ibm.com/instana-trial.html
   ```

2. **Complete registration**
   - Fill in your business email address
   - Provide company information
   - Select your region preference
   - Accept terms and conditions

3. **Wait for provisioning**

   **Timeline**: 5–10 minutes

   You will receive an email from IBM containing:
   - Instana URL (e.g., `https://your-tenant.instana.io`)
   - Login credentials (username and password)
   - Getting started guide

4. **Save your credentials**

   Store the following information securely in your notepad:
   ```
   Instana URL:      https://your-tenant.instana.io
   Username:         your-email@company.com
   Password:         [provided in email]
   ```

---

## Step 2: Access IBM Instana

1. **Open the Instana URL**

   Navigate to the URL provided in your provisioning email:
   ```
   https://your-tenant.instana.io
   ```

2. **Enter your credentials**

   Use the credentials from your provisioning email:
   - **Email**: Your registered email address
   - **Password**: Provided password (you will be prompted to change it on first login)

3. **Complete first-time setup**

   Upon first login, you will be prompted to:
   - Set a new password
   - Configure notification preferences
   - Set up your profile
   - Review the quick start guide

4. **Verify access**

   You should see the Instana dashboard with:
   - Navigation menu on the left
   - Overview dashboard in the center
   - No agents detected yet (this is expected)

---

## Step 3: Generate an Instana API Key

An API key is required to connect external tools — including IBM Bob and the Instana MCP server — to your Instana instance. Generate and save this key before proceeding to the agent installation.

1. **Log in to your Instana SaaS instance**

   Open your Instana URL in a browser and log in with your credentials.

2. **Open Settings**

   Click the main menu (hamburger icon) in the top-left corner and select **Settings**.

3. **Navigate to API Tokens**

   In the left sidebar, go to **Security & Access** → **API Tokens**.

4. **Create a new token**

   Click **New API Token** (or **Create API Key** depending on your Instana version).

5. **Name the token**

   In the **API key description** field, enter a descriptive name:
   ```
   Build Academy Workshop
   ```

6. **Assign permissions**

   For this workshop, enable all permissions.

7. **Click Create**

8. **Copy and save the token immediately**

   The token is **only shown once**. Copy it now and add it to your notepad:
   ```
   Instana API Token: <paste token here>
   ```

   > **Security Note**: Do not share this token or commit it to version control. If lost, you must delete the token and generate a new one.

---

## Step 4: Install Instana Agent

The Instana agent automatically discovers and monitors your applications and infrastructure. All commands in this section are run from the bastion host.

### Prerequisites

- OpenShift cluster from TechZone setup
- Cluster admin access
- `oc` CLI configured on the bastion host

### Navigate to Agent Installation in Instana UI

1. In the Instana UI, click **Agents & Collectors** in the left navigation
2. Select the **Install Agents** tab and click **Instana Agent**
3. Choose **OpenShift - Operator**

### Install the Agent

#### 1. Connect to your cluster

Ensure you are logged into your OpenShift cluster from the bastion host:

```bash
oc login --token=$OC_TOKEN --server=$OC_URL
```

#### 2. Install the Instana Agent Operator

```bash
oc apply -f https://github.com/instana/instana-agent-operator/releases/latest/download/instana-agent-operator.yaml
```

**Expected output:**
```
namespace/instana-agent created
customresourcedefinition.apiextensions.k8s.io/agents.instana.io created
customresourcedefinition.apiextensions.k8s.io/agentsremote.instana.io created
serviceaccount/instana-agent-operator created
clusterrole.rbac.authorization.k8s.io/instana-agent-clusterrole created
clusterrole.rbac.authorization.k8s.io/leader-election-role created
clusterrolebinding.rbac.authorization.k8s.io/instana-agent-clusterrolebinding created
clusterrolebinding.rbac.authorization.k8s.io/leader-election-rolebinding created
configmap/manager-config created
```

#### 3. Retrieve your cluster ID

From the bastion host, run:

```bash
oc get clusterversion -o jsonpath='{.items[].spec.clusterID}{"\n"}'
```

**Example output:**
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

Copy this cluster ID — you will need it in the next step.

#### 4. Configure cluster name and zone in Instana UI

Back in the Instana UI:
- **Cluster name**: Paste your cluster ID from the previous step
- **Agent zone** (optional): Enter a zone name if you want to group agents by location

#### 5. Copy and apply the Custom Resource YAML

1. In the Instana UI, copy the generated Custom Resource YAML

2. On the bastion host, create the configuration file:

   ```bash
   vi instana-agent.customresource.yaml
   ```

   Paste the YAML from the Instana UI. It will look similar to:

   ```yaml
   apiVersion: instana.io/v1
   kind: InstanaAgent
   metadata:
     name: instana-agent
     namespace: instana-agent
   spec:
     cluster:
       name: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'  # Your cluster ID
     zone:
       name: 'your-zone-name'                          # Optional
     agent:
       key: 'YOUR_AGENT_KEY'
       endpointHost: 'your-tenant.instana.io'
       endpointPort: '443'
   ```

   Save and exit: press `Esc`, then type `:wq` and press `Enter`.

#### 6. Deploy the Instana Agent

```bash
oc apply -f instana-agent.customresource.yaml
```

**Expected output:**
```
instanaagent.instana.io/instana-agent created
```

#### 7. Verify the agent pods are running

```bash
# Check agent pods
oc get pods -n instana-agent

# View agent logs if needed
oc logs -n instana-agent -l app.kubernetes.io/name=instana-agent
```

**Expected output:**
```
NAME                                                READY   STATUS    RESTARTS   AGE
instana-agent-297n4                                 1/1     Running   0          11m
instana-agent-6tcjj                                 1/1     Running   0          11m
instana-agent-controller-manager-86f86cdb8c-stsw4   1/1     Running   0          11m
instana-agent-k8sensor-5d785c5bdf-26vkq             1/1     Running   0          11m
instana-agent-k8sensor-5d785c5bdf-m9r6t             1/1     Running   0          11m
instana-agent-k8sensor-5d785c5bdf-zkr4s             1/1     Running   0          11m
instana-agent-rd82v                                 1/1     Running   0          11m
```

#### 8. Confirm the agent connection in Instana UI

- Navigate to **Infrastructure** → **Agents**
- Verify your agents appear with **Connected** status
- Confirm that your cluster nodes are discovered

---

## Step 5: Deploy and Monitor Your Application

### Deploy the Retail Application

If you have not yet deployed the retail application, complete the steps in [ansible-deployment.md](ansible-deployment.md) first, then return here.

Once deployed, verify the application is running:

```bash
# Check application pods
oc get pods -n retail-dev

# Verify services
oc get svc -n retail-dev
```

### Automatic Application Discovery

After the Instana agent is connected, it will automatically discover and instrument your running application. No code changes are required.

1. **Wait for discovery** (5–7 minutes)

   The agent will:
   - Detect running containers
   - Identify application frameworks
   - Instrument application code
   - Begin collecting metrics and traces

2. **View discovered applications**

   In the Instana UI:
   - Navigate to **Applications** → **All Applications**
   - Look for your Retail Application components
   - Click any service to view its metrics and traces

3. **Explore the Service Map**

   - Navigate to **Applications** → **Service Map**
   - View a visual representation of your application architecture
   - Trace dependencies between services
   - Identify communication patterns across microservices

---

## Step 6: Configure Application Monitoring

### Create an Application Perspective

Application Perspectives let you organize and filter monitoring data around a specific application boundary.

1. In the Instana UI, navigate to **Applications** → **All Applications**

2. Click **+ Add Application** and fill in:
   - **Name**: `Retail Application`
   - **Description**: `Workshop retail application monitoring`

3. Define the application scope using the following filter:
   ```
   Filter Type: Kubernetes Namespace
   Operator:    Equals
   Value:       retail-dev
   ```

4. Select the services to include, define service boundaries, and optionally configure service-level objectives (SLOs).

5. Click **Save**.

### Set Up Smart Alerts

Configure alerts to be notified of performance degradation or errors:

![Instana Application Configuration](../images/Instana_Config.png)

---

## Step 7: Leverage IBM Bob for Observability Insights

IBM Bob integrates with Instana through a dedicated MCP server, enabling AI-assisted analysis of your observability data directly within the Bob interface.

### Part 1: Import the Application Observability Custom Bob Mode

Before connecting IBM Bob to Instana, import the Application Observability custom mode into your project.

Download the custom mode zip file from the IBM Building Blocks repository:

**[application-observability.zip](https://github.com/ibm-self-serve-assets/building-blocks/blob/main/observe/application-observability/bob-modes/base-modes/application-observability.zip)**

Extract the zip file — it contains the `custom_modes.yaml` and the `rules/` folder needed in the steps below.

#### For New Projects

If this is a new project with no existing custom modes:

1. Copy the provided mode configuration and rules files into your project:
   ```
   .bob/
   ├── custom_modes.yaml
   └── rules/
       └── application-observability/
           └── [mode rules files]
   ```

2. The Application Observability mode will be immediately available in IBM Bob.

#### For Existing Projects

If your project already has a `custom_modes.yaml`, do not overwrite it. Instead:

1. Open your existing `.bob/custom_modes.yaml` file and **append** the Application Observability mode configuration:

   ```yaml
   # Existing custom modes (do not remove)
   - slug: existing-mode-1
     name: Existing Mode 1
     # ... existing configuration ...

   - slug: existing-mode-2
     name: Existing Mode 2
     # ... existing configuration ...

   # Append the new mode below
   - slug: application-observability
     name: Application Observability
     # ... new mode configuration ...
   ```

2. Add the Application Observability rules folder without modifying existing rule files:

   ```
   .bob/
   ├── custom_modes.yaml              (updated — new mode appended)
   └── rules/
       ├── existing-mode-1/
       │   └── [existing rules]
       ├── existing-mode-2/
       │   └── [existing rules]
       └── application-observability/ (new)
           └── [new mode rules]
   ```

3. Verify the updated configuration:
   - All existing modes still work correctly
   - The Application Observability mode appears in IBM Bob
   - No YAML syntax errors

### Part 2: Add the Instana MCP Server to IBM Bob

The Instana MCP server provides IBM Bob with direct access to your Instana data.

1. Open IBM Bob
2. Click the settings icon in the Bob pane top navigation
3. Select **Edit Global MCP** (to apply to all projects) or **Edit Project MCP** (for this project only)
4. Add the following entry to the MCP configuration:

```json
"Application Observability": {
  "command": "uvx",
  "args": [
    "mcp-proxy",
    "--transport",
    "streamablehttp",
    "https://mcp-instana.268gjj8oawf7.us-south.codeengine.appdomain.cloud/mcp"
  ],
  "description": "Base MCP Server for Application Observability Building Block",
  "disabled": false,
  "alwaysAllow": [
    "manage_instana_resources",
    "manage_custom_dashboards",
    "analyze_infrastructure_elicitation",
    "get_actions",
    "get_action_details",
    "get_action_types",
    "get_action_tags",
    "get_action_matches",
    "submit_automation_action",
    "get_action_instance_details",
    "list_action_instances",
    "delete_action_instance",
    "get_event",
    "get_kubernetes_info_events",
    "get_agent_monitoring_events",
    "get_issues",
    "get_incidents",
    "get_changes",
    "get_events_by_ids",
    "get_website_page_load",
    "get_website_catalog_metrics",
    "get_website_beacon_metrics_v2",
    "get_website_catalog_tags",
    "get_website_tag_catalog",
    "get_website_beacon_groups",
    "get_website_beacons",
    "get_websites",
    "create_website",
    "delete_website",
    "rename_website",
    "get_website_geo_location_configuration",
    "update_website_geo_location_configuration",
    "get_website_ip_masking_configuration",
    "update_website_ip_masking_configuration",
    "get_website_geo_mapping_rules",
    "set_website_geo_mapping_rules",
    "upload_source_map_file",
    "clear_source_map_upload_configuration"
  ]
}
```

### Part 3: Analyze Performance with IBM Bob

With the MCP server connected, you can use IBM Bob to build an observability dashboard for the Retail Application.

**Example prompt:**

```
Use the Application Observability custom mode to build a modular Python Dash
application for observability for the Retail Application.

Requirements:
- Title: "Application Observability using IBM Instana"
- Subtitle: "With IBM Bob and Instana"
- Create 3 tabs: Service Overview, Trace Details, and Intelligent Analysis & Insights
- Create meaningful charts to showcase application performance in the Service Overview tab
- Provide a detailed Analysis & Insights section in the Intelligent Analysis & Insights tab
- Use Dash Bootstrap Components for a modern, responsive layout with Plotly charts
- Implement asynchronous data fetching where applicable to prevent UI blocking
- All configuration via .env file
- Follow modular architecture with a separate Python file for each tab
- Follow Python best practices for folder structure (src/, docs/, scripts/, etc.)

Project structure (follow best practices):
- app.py: Main application entry point and layout
- instana_integration.py: Instana API client and data processing (using Bob Mode: Application Observability)
- requirements.txt, .env.example, setup scripts, documentation
```

### Part 4: Configure the Instana API Connection

IBM Bob communicates with your Instana instance using the API token generated in [Step 3](#step-3-generate-an-instana-api-key). Add the following entries to your project's `.env` file:

```env
INSTANA_BASE_URL=https://your-tenant.instana.io
INSTANA_API_TOKEN=your-api-token-from-step-3
```

---

## Step 8: Explore Instana Features

### Distributed Tracing

View end-to-end request flows across your microservices:

1. Navigate to **Applications** → **Retail Application** → **Calls**

2. Apply filters to focus on areas of interest:
   - Time range: Last 1 hour
   - Filter by: Error traces only
   - Sort by: Latency (descending)

3. Click any trace to view:
   - Complete request timeline
   - Service-to-service call chain
   - Database queries
   - External API calls
   - Error details and stack traces

### Infrastructure Monitoring

Monitor the underlying infrastructure supporting your application:

1. Navigate to **Infrastructure** → **Kubernetes**

2. View cluster health at a glance:
   - Node resource utilization
   - Pod status and health
   - Container metrics
   - Network traffic

3. Click any node to drill into detailed metrics, analyze resource consumption trends, and identify constraints.

### Unbounded Analytics

Query all your observability data with flexible analytics:

1. Navigate to **Analytics** → **Unbounded Analytics**

2. Example queries:

   **Top 10 slowest endpoints:**
   ```
   entity.type:call
   AND call.http.status:200
   GROUP BY call.http.path
   ORDER BY latency DESC
   LIMIT 10
   ```

   **Error rate by service:**
   ```
   entity.type:call
   AND call.error:true
   GROUP BY service.name
   ```

3. Visualize results, export data for reporting, and share dashboards with your team.

---

## Best Practices

### Observability Strategy

1. **Define clear objectives** — Identify KPIs, set service-level objectives (SLOs), and establish baseline metrics before going to production
2. **Monitor all application tiers** — Include infrastructure, application, and business metrics
3. **Use intelligent alerting** — Avoid alert fatigue by setting meaningful thresholds with context-aware rules
4. **Review and iterate regularly** — Analyze trends, optimize based on insights, and update monitoring as the application evolves

### IBM Bob Integration

1. **Automate analysis** — Use IBM Bob to schedule regular performance reviews and generate automated reports
2. **Leverage AI insights** — Ask IBM Bob for optimization recommendations and capacity planning guidance
3. **Measure the impact of changes** — Use Instana data before and after deployments to validate improvements

---

## Troubleshooting

### Agent Not Connecting

**Symptoms:** Agent pods running but not visible in Instana UI; no data appearing in dashboards.

```bash
# Check agent logs
oc logs -n instana-agent -l app.kubernetes.io/name=instana-agent

# Verify agent configuration
oc get configmap -n instana-agent instana-agent -o yaml

# Test network connectivity from the agent pod to Instana
oc exec -n instana-agent <agent-pod> -- curl -v https://your-tenant.instana.io
```

---

### Missing Application Data

**Symptoms:** Infrastructure visible but no application traces; services not discovered.

**Steps:**
1. Verify the application is running: `oc get pods -n retail-dev`
2. Confirm the agent has permission to monitor the `retail-dev` namespace
3. Restart application pods to trigger re-discovery
4. Review agent logs for instrumentation errors

---

### High Agent Resource Usage

**Symptoms:** Agent consuming excessive CPU or memory; node performance degrading.

Reduce the collection frequency by updating the agent ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: instana-agent
  namespace: instana-agent
data:
  configuration.yaml: |
    com.instana.plugin.host:
      pollRate: 10   # Increase interval to reduce overhead
```

---

## Next Steps

### Expand Your Observability

1. **Integrate additional services** — Add monitoring for databases, external APIs, and message queues
2. **Implement advanced features** — Configure synthetic monitoring, website monitoring, and mobile app monitoring
3. **Enhance with IBM Concert** — Integrate Instana with IBM Concert to correlate observability data with business metrics and enable cross-platform insights

### Learn More

- [IBM Instana Documentation](https://www.ibm.com/docs/en/instana-observability)
- [Instana API Reference](https://www.ibm.com/docs/en/instana-observability/current?topic=apis-web-rest-api)
- [IBM Bob Documentation](https://ibm.com/bob/docs)
- [OpenTelemetry Integration](https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-opentelemetry)

---

[← Back to Ansible Deployment](ansible-deployment.md) | [Back to Main](../README.md)
