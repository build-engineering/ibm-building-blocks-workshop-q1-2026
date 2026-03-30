# Automated Resilience with IBM Concert

## Overview

This guide demonstrates how to implement automated resilience for the Retail Application using IBM Concert. IBM Concert provides intelligent automation capabilities that monitor application health, detect anomalies, and automatically remediate issues before they impact users.

By integrating IBM Concert with your OpenShift deployment, you can achieve:

- **Proactive Issue Detection**: Identify problems before they escalate
- **Automated Remediation**: Self-healing capabilities for common issues
- **Intelligent Insights**: AI-powered analysis of application behavior
- **Reduced Downtime**: Faster recovery from failures
- **Operational Efficiency**: Less manual intervention required

### 📺 Video Tutorial

Watch the complete walkthrough of implementing automated resilience with IBM Concert:

**[Automated Resilience with IBM Concert Demo](https://www.youtube.com/watch?v=0iGyTeYmPyU)**

This video demonstrates:
- Setting up IBM Concert
- Connecting with Instana
- Configuring resilience policies
- Testing automated remediation
- Best practices for production deployment

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Understanding IBM Concert](#understanding-ibm-concert)
- [Step 1: Access IBM Concert](#step-1-access-ibm-concert)
- [Step 2: Generate Instana API Token](#step-2-generate-instana-api-token)
- [Step 3: Establish Connection with Instana](#step-3-establish-connection-with-instana)
- [Step 4: Define Environment from Resources](#step-4-define-environment-from-resources)
- [Step 5: Create Data Ingestion Job](#step-5-create-data-ingestion-job)
- [Step 6: Monitor and Validate](#step-6-monitor-and-validate)
- [Step 7: Generate Vulnerability Scan Report](#step-7-generate-vulnerability-scan-report)
- [Step 8: Upload Vulnerability Scan to Concert](#step-8-upload-vulnerability-scan-to-concert)
- [Step 9: Create Insights Dashboard with IBM Bob](#step-9-create-insights-dashboard-with-ibm-bob)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Additional Resources](#additional-resources)

---

## Prerequisites

Before implementing automated resilience, ensure you have:

- ✅ **IBM Bob installed** - Sign up for early access to IBM Bob
- ✅ **Basic knowledge of IBM Concert** - Understanding of automation concepts
- ✅ **Python 3.12 installed** - Required for running automation scripts
- ✅ **IBM Concert instance** - Free trial or provisioned through your preferred deployment model
- ✅ **IBM Instana instance** - For application observability (see [Observability Guide](observability-instana.md))
- ✅ **OpenShift cluster** - With Retail Application deployed (see [Ansible Deployment](ansible-deployment.md))
- ✅ **Cluster admin access** - For installing Concert operators and agents
- ✅ **Network connectivity** - Between OpenShift, Concert, and Instana instances

---

## Understanding IBM Concert

### What is IBM Concert?

IBM Concert is an AI-powered automation platform that provides:

1. **Application Observability**: Real-time monitoring of application health and performance
2. **Anomaly Detection**: Machine learning models that identify unusual behavior
3. **Automated Remediation**: Pre-configured and custom actions to resolve issues
4. **Root Cause Analysis**: Intelligent correlation of events to identify underlying problems
5. **Predictive Insights**: Forecasting potential issues before they occur
6. **Vulnerability Management**: Automated detection and remediation of security vulnerabilities
7. **Certificate Management**: Automated certificate lifecycle management
8. **Software Composition Analysis**: Dependency tracking and management

### Key Components

- **Concert Dashboard**: Web interface for monitoring and configuration
- **Concert Controller**: Central management plane for policies and automation
- **Concert AI Engine**: Machine learning models for analysis and decision-making
- **Concert Agent**: Deployed in your OpenShift cluster to collect metrics and execute actions
- **Integration Hub**: Connects with Instana, OpenShift, and other tools

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    IBM Concert Platform                     │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐    │
│  │ AI Engine  │  │ Controller │  │ Dashboard/API       │    │
│  └─────┬──────┘  └─────┬──────┘  └──────────┬──────────┘    │
└────────┼───────────────┼────────────────────┼──────────────-┘
         │               │                    │
         │ Analysis      │ Policies           │ Monitoring
         │               │                    │
┌────────▼───────────────▼────────────────────▼──────────────┐
│              OpenShift Cluster                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Concert Agent                           │  │
│  │  • Metrics Collection  • Event Detection             │  │
│  │  • Action Execution    • Health Checks               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Retail Application                         │  │
│  │  • Frontend  • Backend  • Database  • Services       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
         ▲
         │ Observability Data
         │
┌────────┴─────────────────────────────────────────────────────┐
│                    IBM Instana                               │
│  • Application Performance Monitoring                        │
│  • Distributed Tracing                                       │
│  • Infrastructure Monitoring                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 1: Access IBM Concert

### Sign Up for IBM Concert

1. **Visit IBM Concert**
   
   Navigate to [IBM Concert](https://www.ibm.com/products/concert)

2. **Choose Deployment Option**
   
   Select your preferred deployment model:
   - **Free Trial**: 30-day trial with limited features (recommended for workshop)
   - **IBM Cloud**: Fully managed SaaS offering
   - **On-Premises**: Self-hosted deployment

3. **Complete Registration**
   
   - Fill in your business email address
   - Provide company information
   - Accept terms and conditions
   - Wait for provisioning (typically 5-10 minutes)

### Generate API Credentials

After provisioning, generate API credentials for programmatic access:

1. **Access API Key Management**
   
   Click the key icon in the upper right corner of the Concert UI.

2. **Generate API Key**
   
   Click **Generate API key**.

3. **Save Credentials Securely**
   
   Record the API key value and usage details in a secure location. You cannot view the API key secret after closing the dialog box.
   
   **Example credentials:**
   ```bash
   CONCERT_API_KEY="your-api-key-here"
   CONCERT_INSTANCE_URL="https://concert.cloud.ibm.com"
   CONCERT_TENANT_ID="your-tenant-id"
   ```
   
   > **Important**: Store these credentials securely. They will be needed for Concert agent installation and API integrations.

---

## Step 2: Generate Instana API Token

Before connecting IBM Concert with Instana, you need to generate an API token in Instana for authentication.

### Create API Token

1. **Navigate to API Tokens**
   
   From the Instana navigation menu, click **Settings** → **Security & Access** → **API Tokens**.

2. **Create New API Token**
   
   Click **New API Token**.

3. **Configure Token**
   
   - **Name**: Enter a unique name for your API token, such as `Concert`
   - **Permissions**: Choose **all permissions** to ensure full integration capabilities
   
   > **Note**: Selecting all permissions ensures Concert can access all necessary Instana data for comprehensive monitoring and analysis.

4. **Generate Token**
   
   Click **Create**.

5. **Save Token Securely**
   
   After the API token is generated, copy it to a secure location. You will need it when creating the connection in Concert.
   
   **Example:**
   ```
   Token Name: Concert
   API Token: AbCdEfGhIjKlMnOpQrStUvWxYz1234567890...
   Created: [timestamp]
   Permissions: All
   ```
   
   > **Important**: Store this token securely. It will not be displayed again after you leave this page.

---

## Step 3: Establish Connection with Instana

In the Concert UI, establish a connection with Instana to enable data integration and automated workflows.

### Create Connection

1. **Navigate to Integrations**
   
   Click **Administration** → **Integrations**.

2. **Access Connections Tab**
   
   Click the **Connections** tab.

3. **Create New Connection**
   
   Click **Create connection**.

4. **Select Instana Integration**
   
   Use the search bar or scroll to find and click **IBM Instana Observability**.

### Configure Connection Details

5. **Enter Connection Information**
   
   On the **Create IBM Instana Observability connection** screen:
   
   - **Name**: Enter a descriptive name (e.g., `Instana Production`)
   - **Description**: Enter a description for internal reference (e.g., `Connection to Instana for retail application monitoring`)

6. **Configure Endpoint**
   
   In the **Endpoint** field, enter the host URL of your Instana instance:
   
   **For SaaS instances:**
   ```
   https://myname-instana.instana.io
   ```
   
   **For self-hosted instances:**
   ```
   https://<unit-name>-<tenant-name>.<instance-url>
   ```
   
   **Example for self-hosted:**
   ```
   https://unit0-tenant0.instana.cp4i-instance-xxx-xxx.containers.appdomain.cloud
   ```
   
   > **Tip**: To find the unit and tenant names for your self-hosted Instana instance, click the profile menu icon in the Instana UI.

7. **Enter API Token**
   
   Paste the Instana API token that you generated in Step 2.

8. **Validate Connection**
   
   Click **Validate connection**.
   
   Wait for the validation to complete. You should see a success message indicating the connection is valid.

9. **Create Connection**
   
   After successful validation, click **Create**.

### Verify Connection

After creating the connection, verify it appears in your connections list with the following details:

```
Connection Name: Instana Production
Type: IBM Instana Observability
Status: Connected
Last Validated: [timestamp]
Endpoint: https://your-tenant.instana.io
```

---

## Step 4: Define Environment from Resources

Create an environment in Concert to organize and manage your OpenShift resources for the retail application.

### Create Environment

1. **Navigate to Environments**
   
   Select **Inventory** → **Environments**.

2. **Start Environment Definition**
   
   Click **Define environment** → **From resources**.

3. **Enter Environment Details**
   
   - **Name**: Enter a descriptive name (e.g., `Retail App Development`)
   - **Description**: Enter a description for internal reference (e.g., `Development environment for retail application with automated resilience`)

4. **Select Environment Type**
   
   From the **Type** drop-down menu, select **Red Hat OpenShift Container Platform (OCP)**.

5. **Set Environment Purpose**
   
   Select the **Purpose** of this environment: **Development**
   
   > **Note**: Other options include Production, Testing, and Staging. Choose the appropriate purpose based on your use case. This affects default policies and automation behaviors.

6. **Proceed to Next Step**
   
   Click **Next**.

7. **Select Resources** (if prompted)
   
   Review and select the resources imported from the ingestion job:
   - Namespaces (e.g., `retail-app`)
   - Deployments
   - Services
   - Pods
   
   Click **Next**.

8. **Review and Create**
   
   Review the summary of your entries:
   - Environment name
   - Description
   - Type: Red Hat OpenShift Container Platform
   - Purpose: Development
   - Connected resources
   - Associated ingestion jobs
   
   Click **Create**.

### Verify Environment

After creation, verify your environment appears in the environments list:

```
Environment Name: Retail App Development
Type: Red Hat OpenShift Container Platform
Purpose: Development
Status: Active
Resources: [number of connected resources]
Ingestion Jobs: 1
Last Updated: [timestamp]
```

---

## Step 6: Monitor and Validate

Monitor the effectiveness of Concert integration and validate data flow from Instana.

### Access Concert Dashboard

1. **Log in to Concert**
   
   Navigate to your Concert instance URL and log in with your credentials.

2. **View Environment Dashboard**
   
   - Navigate to **Environments** → **Retail App Development**
   - Review real-time health metrics
   - Check active policies and their status
   - Monitor automated actions

### Monitor Automated Actions

1. **View Action History**
   
   Navigate to **Automation** → **Action History** to see:
   - All automated actions performed
   - Success/failure rates
   - Execution times
   - Impact on application health

2. **Review Metrics**
   
   Key metrics to monitor:
   - **MTTR (Mean Time To Recovery)**: Average time to resolve issues
   - **Incident Reduction**: Percentage decrease in manual interventions
   - **Policy Effectiveness**: Success rate of automated remediations
   - **False Positive Rate**: Unnecessary actions triggered

### Test Resilience Scenarios

#### Scenario 1: Pod Failure Recovery

Simulate a pod failure to test auto-restart policy:

```bash
# Delete a frontend pod
oc delete pod -l app=retail-frontend -n retail-app --force

# Watch Concert automatically restart it
oc get pods -n retail-app -w

# Check Concert action log
# Navigate to Concert UI → Action History
# Verify "restart_pod" action was triggered and completed
```

#### Scenario 2: High CPU Load Response

Generate load to trigger auto-scaling:

```bash
# Run load test
cd ~/retailapp/jmeter
./run_spike.sh retail-backend-retail-app.apps.cluster-xyz.techzone.ibm.com

# Watch Concert scale the deployment
oc get hpa -n retail-app -w

# Monitor in Concert dashboard
# Navigate to Metrics → CPU Usage
# Verify scaling action was triggered
```

#### Scenario 3: Certificate Expiration

Test certificate renewal automation:

```bash
# Check current certificate expiration
oc get secret tls-certificate -n retail-app -o jsonpath='{.data.tls\.crt}' | \
  base64 -d | openssl x509 -noout -enddate

# Simulate near-expiration (if in test environment)
# Concert should automatically renew certificate

# Verify renewal in Concert
# Navigate to Action History → Filter by "certificate_renewal"
```

#### Scenario 4: Vulnerability Detection

Test vulnerability remediation:

```bash
# Trigger vulnerability scan
# Concert automatically scans on schedule

# View detected vulnerabilities
# Navigate to Security → Vulnerabilities

# Verify remediation actions
# Check Action History for patch deployments
```

### Validate Integration

1. **Verify Instana Data Flow**
   
   - Check that Concert is receiving data from Instana
   - Verify metrics are up-to-date
   - Confirm traces are being analyzed

2. **Test Notification Channels**
   
   - Trigger a test alert
   - Verify notifications are received via configured channels (Slack, email)
   - Check notification content and formatting

3. **Review Policy Logs**
   
   ```bash
   # View Concert agent logs
   oc logs -f deployment/concert-agent -n ibm-concert | grep "policy_evaluation"
   
   # Check for policy execution
   oc logs -f deployment/concert-agent -n ibm-concert | grep "action_executed"
   ```

## Step 7: Generate Vulnerability Scan Report

Use Trivy to scan container images for vulnerabilities and generate a report that can be uploaded to Concert for comprehensive security analysis.

### Install Trivy (if not already installed)


### Generate Vulnerability Scan Report

1. **Connect to Bastion Host**
   
   SSH to your bastion host if not already connected:
   ```bash
   ssh root@bastion.cluster-xyz.techzone.ibm.com
   ```

2. **Run Trivy Scan**
   
   Execute the following command to scan the retail backend image and generate a CycloneDX format report:
   
   ```bash
   trivy image --format cyclonedx --output retail-backend.cdx.json retail-backend:1.0.0-dev
   ```
   
   **Command Breakdown:**
   - `trivy image`: Scan a container image
   - `--format cyclonedx`: Output in CycloneDX format (SBOM standard)
   - `--output retail-backend.cdx.json`: Save results to this file
   - `retail-backend:1.0.0-dev`: The image to scan
   
   **Expected Output:**
   ```
   2026-03-23T12:00:00.000Z	INFO	Vulnerability scanning is enabled
   2026-03-23T12:00:00.000Z	INFO	Detected OS: alpine
   2026-03-23T12:00:00.000Z	INFO	Detecting Alpine vulnerabilities...
   2026-03-23T12:00:05.000Z	INFO	Number of language-specific files: 1
   2026-03-23T12:00:05.000Z	INFO	Detecting python-pkg vulnerabilities...
   ```

3. **Verify Report Generation**
   
   Check that the report file was created:
   ```bash
   ls -lh retail-backend.cdx.json
   ```
   
   **Expected Output:**
   ```
   -rw-r--r-- 1 root root 125K Mar 23 12:00 retail-backend.cdx.json
   ```

### Copy Report to Your Laptop

Transfer the generated report file from the bastion host to your local laptop:

**Option 1: Using SCP (from your laptop)**

```bash
# From your laptop terminal
scp root@bastion.cluster-xyz.techzone.ibm.com:/root/retail-backend.cdx.json ~/Downloads/

# Verify file was copied
ls -lh ~/Downloads/retail-backend.cdx.json
```

**Option 2: Using SFTP (from your laptop)**

```bash
# From your laptop terminal
sftp root@bastion.cluster-xyz.techzone.ibm.com

# In SFTP session
get retail-backend.cdx.json
exit

# Verify file was copied
ls -lh retail-backend.cdx.json
```

**Option 3: Copy-Paste (for small files)**

```bash
# On bastion host, display file content
cat retail-backend.cdx.json

# Copy the output and paste into a local file on your laptop
# Save as retail-backend.cdx.json
```

### Scan Additional Images (Optional)

Repeat the process for other application components:

```bash
# Scan frontend image
trivy image --format cyclonedx --output retail-frontend.cdx.json retail-frontend:1.0.0-dev

# Scan database image (if custom)
trivy image --format cyclonedx --output retail-db.cdx.json retail-db:1.0.0-dev

# Copy all reports to laptop
scp root@bastion.cluster-xyz.techzone.ibm.com:/root/retail-*.cdx.json ~/Downloads/
```

---

## Step 9: Upload Vulnerability Scan to Concert

Upload the Trivy vulnerability scan report to Concert for centralized security analysis and automated remediation.

### Access Vulnerability Page

1. **Log in to Concert**
   
   Navigate to your Concert instance URL and log in with your credentials.

2. **Navigate to Vulnerability Page**
   
   From the Concert navigation menu:
   - Click **Dimensions** → **Vulnerability**
   
   This page displays all detected vulnerabilities across your applications.

### Upload Vulnerability Scan

1. **Start Upload Process**
   
   On the Vulnerability page, click **Upload vulnerability scan**.

2. **Select File Type**
   
   In the upload dialog, configure the following settings:
   
   - **Vulnerability scan**: Select **Image**
   - **Scan source**: Select **Trivy**

3. **Enter Application Details**
   
   - **Application name**: Enter `Retail`
   
   > **Important**: Use the exact application name as it appears in Instana. This ensures proper correlation between observability data and security findings.

4. **Select Scan File**
   
   - Click **Choose file** or **Browse**
   - Navigate to your local directory (e.g., `~/Downloads/`)
   - Select the `retail-backend.cdx.json` file generated in Step 8

5. **Upload File**
   
   Click **Upload** to submit the vulnerability scan report.

### Verify Upload

After uploading, verify the scan results appear in Concert:

1. **Check Upload Status**
   
   You should see a success message:
   ```
   Vulnerability scan uploaded successfully
   Processing scan results...
   ```

2. **View Scan Results**
   
   - The Vulnerability page will refresh and display findings from the uploaded scan
   - Vulnerabilities are categorized by severity: Critical, High, Medium, Low

3. **Review Vulnerability Details**
   
   Click on any vulnerability to view:
   - **CVE ID**: Common Vulnerabilities and Exposures identifier
   - **Severity**: Risk level (Critical, High, Medium, Low)
   - **Package**: Affected software package
   - **Installed Version**: Current version with vulnerability
   - **Fixed Version**: Version that resolves the vulnerability
   - **Description**: Details about the vulnerability
   - **Remediation**: Recommended actions

### Upload Additional Scans

If you scanned multiple images, upload each report:

```
1. Upload retail-frontend.cdx.json
   - Application name: Retail
   - Scan source: Trivy
   - Vulnerability scan: Image

2. Upload retail-db.cdx.json (if applicable)
   - Application name: Retail
   - Scan source: Trivy
   - Vulnerability scan: Image
```

### Analyze Vulnerability Data

1. **View Vulnerability Dashboard**
   
   Navigate to **Dimensions** → **Vulnerability** to see:
   - Total vulnerabilities by severity
   - Vulnerabilities by application
   - Trend analysis over time
   - Top vulnerable components

2. **Filter and Search**
   
   Use filters to focus on specific vulnerabilities:
   - Filter by severity (Critical, High)
   - Filter by application (Retail)
   - Search by CVE ID or package name

3. **Export Reports**
   
   Generate reports for compliance and auditing:
   - Click **Export** to download vulnerability reports
   - Choose format: CSV, PDF, or JSON
   - Share with security and compliance teams


---

## Troubleshooting

### Connection Issues

#### Instana Connection Failed

**Symptoms:**
- Connection validation fails
- "Unable to reach Instana endpoint" error

**Solutions:**

```bash
# Verify Instana endpoint is accessible
curl -I https://your-tenant.instana.io

# Check API token validity
# In Instana UI: Settings → API Tokens → Verify token status

# Test connection from Concert
# In Concert UI: Administration → Integrations → Connections
# Click "Test connection" on Instana connection

# Check network connectivity
# Ensure Concert can reach Instana endpoint
# Verify firewall rules and network policies
```

#### Ingestion Job Failures

**Symptoms:**
- Ingestion job status shows "Failed"
- No components imported from Instana

**Solutions:**

```bash
# Check ingestion job logs
# In Concert UI: Administration → Integrations → Ingestion Jobs
# Click on job name → View logs

# Verify Instana connection is active
# Check connection status in Connections tab

# Ensure environment is properly configured
# Verify environment exists and is active

# Re-run ingestion job
# Click "Run now" to retry
```

### Policy Issues

#### Policies Not Triggering

**Symptoms:**
- Conditions met but no automated actions
- No notifications received

**Solutions:**

```bash
# Check policy status
# In Concert UI: Automation → Policies
# Verify policy is "Enabled"

# Review policy conditions
# Ensure thresholds are correctly configured
# Check that metrics are being collected

# Verify Concert agent is running
oc get pods -n ibm-concert
oc logs deployment/concert-agent -n ibm-concert

# Check agent permissions
oc auth can-i --list --as=system:serviceaccount:ibm-concert:concert-agent

# Review policy execution logs
# In Concert UI: Automation → Action History
# Filter by policy name and time range
```

#### High False Positive Rate

**Symptoms:**
- Too many unnecessary automated actions
- Frequent notifications for non-issues

**Solutions:**

1. **Adjust Policy Thresholds**
   
   ```yaml
   # Increase threshold values
   trigger:
     metric: cpu_usage
     value: 85  # Increase from 70 to 85
     duration: 10m  # Increase from 5m to 10m
   ```

2. **Add Cooldown Periods**
   
   ```yaml
   action:
     type: scale_deployment
     cooldown: 15m  # Prevent rapid successive scaling
   ```

3. **Implement Graduated Responses**
   
   ```yaml
   policies:
     - name: cpu-warning
       trigger:
         value: 70
       action:
         type: notify  # Only notify at 70%
     
     - name: cpu-critical
       trigger:
         value: 85
       action:
         type: scale_deployment  # Scale at 85%
   ```

### Certificate Management Issues

#### Certificate Renewal Failed

**Symptoms:**
- Certificate expiration warnings
- Renewal action failed in Action History

**Solutions:**

```bash
# Check certificate provider status
# Verify Let's Encrypt or other provider is accessible

# Review renewal logs
# In Concert UI: Action History → Filter "certificate_renewal"

# Manually renew certificate
oc create secret tls tls-certificate \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key \
  -n retail-app --dry-run=client -o yaml | oc apply -f -

# Restart affected pods
oc rollout restart deployment/retail-frontend -n retail-app

# Update Concert policy
# Adjust renewal timing or validation method
```

### Vulnerability Management Issues

#### Vulnerabilities Not Detected

**Symptoms:**
- No vulnerabilities showing in Concert
- Scan results empty

**Solutions:**

```bash
# Verify Instana is scanning for vulnerabilities
# In Instana UI: Check security scanning is enabled

# Trigger manual vulnerability scan
# In Concert UI: Security → Vulnerabilities → Scan now

# Check ingestion job is importing security data
# Verify ingestion job includes security findings

# Review Concert agent logs
oc logs deployment/concert-agent -n ibm-concert | grep "vulnerability"
```

## Step 9: Create Insights Dashboard with IBM Bob

Use IBM Bob with the Automated Resilience Builder custom mode to create a comprehensive Python Dash application that visualizes Concert data and provides actionable insights.

### Import Custom Bob Mode

Before creating the dashboard, import the Automated Resilience Builder custom mode into IBM Bob.

#### Access the Custom Mode Repository

1. **Navigate to GitHub Repository**
   
   Visit the custom mode repository:
   ```
   https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/automated-resilience-and-compliance/bob-modes/base-modes
   ```

2. **Review Mode Documentation**
   
   The repository contains:
   - Complete mode configuration files
   - Step-by-step import instructions
   - Usage examples and best practices
   - Sample prompts for common scenarios

#### Import Mode into IBM Bob

Follow the detailed instructions provided in the repository README to import the custom mode:

1. **Download Mode Files**
   
   Clone or download the repository:
   ```bash
   git clone https://github.com/ibm-self-serve-assets/building-blocks.git
   cd building-blocks/optimize/automated-resilience-and-compliance/bob-modes/base-modes
   ```

2. **Follow Import Instructions**
   
   The repository provides specific guidance for:
   - **New Projects**: Setting up the mode from scratch
   - **Existing Projects**: Integrating with existing custom modes
   - **Configuration**: Required settings and customization options
   - **Verification**: Steps to confirm successful import

3. **Copy Mode Files to Your Project**
   
   Follow the repository instructions to copy the mode files to your project's `.bob/` directory structure.

4. **Verify Mode Installation**
   
   After importing, verify that:
   - The Automated Resilience Builder mode appears in Bob's mode selector
   - All mode features are accessible
   - No configuration errors are present

### Create Python Dash Application

Once the custom mode is imported, use IBM Bob to generate a comprehensive insights dashboard.

#### Open IBM Bob

1. **Launch IBM Bob**
   
   Open IBM Bob in your development environment (VS Code or preferred IDE).

2. **Select Custom Mode**
   
   From the mode selector, choose **Automated Resilience Builder** mode.

#### Use the Sample Prompt

Copy and paste the following prompt into IBM Bob to generate the dashboard application:

```
Automated Resiliency and Security Insights Dashboard
Use the Automate Resilience custom mode to build a production-ready, modular Python Dash application for comprehensive Resiliency and Security Insights.

Core Requirements:
Header & Branding:

Title: "Automated Resiliency and Security Insights" (centered, bold, primary color)
Subtitle: "With IBM Bob and IBM Concert" (centered, muted text)
Tab Structure:

Application Security (All Applications - Unfiltered)
- Real-time metrics: Total applications, critical applications, high-risk applications
- Risk distribution pie chart with color-coded severity levels
- Top vulnerable applications bar chart
- Comprehensive sortable/searchable application table with risk scores
- Auto-refresh capability (60-second interval)

Vulnerability Drill-Through (Filtered to specific application via env config)
- Application details card with key metrics
- Build artifacts table with interactive "View CVEs" buttons
- Dynamic CVE display with severity distribution chart
- Top CVEs by risk score visualization
- Detailed CVE table with severity badges and CVSS scores
- Support for drill-down from artifacts to specific CVEs
- Packages list table with interactive "View Packages" buttons

Software Composition (All Packages - Unfiltered)
- Package metrics: Total packages, high vulnerability count, back-level packages
- Package issues distribution chart
- Vulnerable packages table with "View CVEs" drill-down
- CVE tracking status (tracked vs not tracked in Concert database)
- Package version and risk level indicators

Certificate Management (All Certificates - Unfiltered)
- Certificate metrics: Total certificates, expiring soon, expired
- Certificate expiry status distribution chart
- Certificate issuers pie chart
- Comprehensive certificate table with expiry dates
- Status badges: Expired (red), Expiring Soon (yellow), Valid (green)
- Proactive expiration alerts

System Health (Dashboard & API Monitoring)
- System status indicators
- Concert API health check with connectivity status
- Configuration summary display
- API metrics: Request counts, error rates, response times
- Performance tracking over time

Technical Architecture:

Resilience & Performance Features:
- Connection Pooling: Efficient HTTP session management (10 connections, 20 max size)
- Retry Logic: Exponential backoff with configurable max retries (default: 3)
- Rate Limiting: Token bucket algorithm (100 requests/minute)
- Circuit Breaker: Fail-fast mechanism for degraded services
- Timeout Management: Configurable connect (5s) and read (30s) timeouts
- Multi-Level Caching:
	- Application data: 5-minute TTL
	- Vulnerability data: 30-minute TTL
	- Certificate data: 1-hour TTL
	- Package data: 30-minute TTL
- Graceful Degradation: Continue functioning with partial data
- Cache Fallback: Use cached data when API unavailable

Error Handling & Security:
- Comprehensive logging with structured format to file and console
- User-friendly error messages without exposing sensitive details
- Environment-based configuration (all secrets in .env)
- Input validation and sanitization
- Type-safe operations with defensive programming
- Support for varying API response formats (timestamps, ISO strings, etc.)

UI/UX Features:
- Dash Bootstrap Components for modern, responsive design
- Plotly interactive charts with hover details
- Color-coded severity indicators (Critical: red, High: orange, Medium: yellow, Low: blue)
- Loading spinners for async operations
- Auto-refresh with configurable intervals
- Sortable and searchable data tables
- Responsive layout for different screen sizes

Project Structure (follow best practices):
- app.py: Main application and UI
- concert_integration.py: Concert API client and data processing (Using Bob Mode: Automate Resilience)
- requirements.txt, .env.example, setup scripts, documentation

Deliverables:
- Fully functional dashboard with all 5 tabs operational
- Setup scripts for both Windows and Linux/Mac
- Comprehensive documentation: README.md, QUICK_START.md, PROJECT_SUMMARY.md
- Production-ready code with error handling, logging, and monitoring
- Configuration templates: .env.example with all required variables
- Testing checklist for deployment validation

Success Criteria:
- Dashboard loads in < 5 seconds
- All tabs display data correctly
- Drill-down functionality works seamlessly
- Auto-refresh operates without UI blocking
- Graceful handling of API failures
- Clear error messages for users
- Comprehensive logging for troubleshooting
- Responsive design across devices
```

#### What IBM Bob Will Generate

IBM Bob will create a comprehensive Python Dash application with the following components:

**1. Application Security Dashboard**
- Security posture overview
- Active security policies
- Security incidents timeline
- Threat detection metrics
- Compliance status indicators

**2. Application Vulnerabilities**
- Vulnerability severity distribution (Critical, High, Medium, Low)
- CVE tracking and trends
- Vulnerable components list
- Remediation status tracking
- Time-to-patch metrics

**3. Software Composition Analysis**
- Dependency inventory
- License compliance status
- Outdated dependencies tracking
- Security advisories for dependencies
- Dependency update recommendations

**4. Certificate Management**
- Certificate expiration timeline
- Certificate health status
- Renewal history and upcoming renewals
- Certificate types and coverage
- Expiration alerts and warnings

**5. System Health**
- Application uptime and availability
- Resource utilization (CPU, memory, disk)
- Pod health status
- Service response times
- Error rates and trends

### Review Generated Code

After IBM Bob generates the application, review the code structure:

```
resilience-dashboard/
├── app.py                    # Main Dash application
├── requirements.txt          # Python dependencies
├── config.py                 # Configuration settings
├── components/
│   ├── security.py          # Security dashboard components
│   ├── vulnerabilities.py   # Vulnerability charts
│   ├── composition.py       # Software composition views
│   ├── certificates.py      # Certificate management
│   └── health.py            # System health metrics
├── data/
│   └── concert_api.py       # Concert API integration
├── assets/
│   └── styles.css           # Custom styling
└── README.md                # Setup and usage instructions
```

### Configure the Application

1. **Update Configuration**
   
   Edit `config.py` with your Concert credentials:
   
   ```python
   # Concert Configuration
   CONCERT_API_URL = "https://concert.cloud.ibm.com"
   CONCERT_API_KEY = "your-api-key-here"
   CONCERT_TENANT_ID = "your-tenant-id"
   
   # Instana Configuration
   INSTANA_API_URL = "https://your-tenant.instana.io"
   INSTANA_API_TOKEN = "your-instana-token"
   
   # Application Settings
   APP_TITLE = "Retail Application Resilience Dashboard"
   REFRESH_INTERVAL = 60  # seconds
   ```

2. **Install Dependencies**
   
   Install required Python packages:
   ```bash
   cd resilience-dashboard
   pip install -r requirements.txt
   ```

3. **Verify API Connectivity**
   
   Test connections to Concert and Instana:
   ```bash
   python -c "from data.concert_api import test_connection; test_connection()"
   ```

### Run the Dashboard

1. **Start the Application**
   
   Launch the Dash application:
   ```bash
   python app.py
   ```
   
   **Expected Output:**
   ```
   Dash is running on http://127.0.0.1:8050/
   
    * Serving Flask app 'app'
    * Debug mode: on
   WARNING: This is a development server. Do not use it in a production deployment.
   ```

2. **Access the Dashboard**
   
   Open your web browser and navigate to:
   ```
   http://localhost:8050
   ```

3. **Explore Dashboard Features**
   
   The dashboard provides:
   - **Real-time Data**: Auto-refreshing metrics from Concert
   - **Interactive Charts**: Click and drill down into specific metrics
   - **Filtering**: Filter by time range, severity, or component
   - **Export**: Download reports in PDF or CSV format
   - **Alerts**: Visual indicators for critical issues

### Dashboard Sections

#### Application Security Tab

- **Security Score**: Overall security posture rating
- **Active Policies**: Number of enabled security policies
- **Recent Incidents**: Timeline of security events
- **Threat Detection**: Real-time threat monitoring
- **Compliance Status**: Regulatory compliance indicators

#### Vulnerabilities Tab

- **Severity Distribution**: Pie chart showing vulnerability breakdown
- **CVE Timeline**: Trend of vulnerabilities over time
- **Top Vulnerable Components**: Bar chart of most affected components
- **Remediation Progress**: Status of vulnerability fixes
- **CVSS Score Distribution**: Histogram of vulnerability severity scores

#### Software Composition Tab

- **Dependency Count**: Total number of dependencies
- **License Distribution**: Pie chart of license types
- **Outdated Dependencies**: List with update recommendations
- **Security Advisories**: Active security alerts for dependencies
- **Update Timeline**: History of dependency updates

#### Certificate Management Tab

- **Expiration Calendar**: Visual timeline of certificate expirations
- **Certificate Health**: Status indicators (Valid, Expiring Soon, Expired)
- **Renewal History**: Timeline of certificate renewals
- **Certificate Types**: Distribution of TLS, SSL, and other certificates
- **Alert Summary**: Upcoming expiration warnings

#### System Health Tab

- **Uptime Metrics**: Application availability percentage
- **Resource Utilization**: Gauges for CPU, memory, and disk usage
- **Pod Status**: Health status of all application pods
- **Response Time**: Average and percentile response times
- **Error Rate**: Trend of application errors over time

### Customize the Dashboard

IBM Bob generates a fully functional dashboard, but you can customize it further:

1. **Modify Visualizations**
   
   Edit component files to change chart types or add new visualizations:
   ```python
   # Example: Change chart type in vulnerabilities.py
   fig = px.bar(data, x='component', y='count', color='severity')
   # Change to:
   fig = px.scatter(data, x='component', y='count', color='severity', size='cvss_score')
   ```

2. **Add Custom Metrics**
   
   Extend the Concert API integration to fetch additional data:
   ```python
   # In data/concert_api.py
   def get_custom_metric(metric_name):
       response = requests.get(
           f"{CONCERT_API_URL}/api/metrics/{metric_name}",
           headers={"Authorization": f"Bearer {CONCERT_API_KEY}"}
       )
       return response.json()
   ```

3. **Adjust Refresh Intervals**
   
   Modify the auto-refresh interval in `app.py`:
   ```python
   # Change refresh interval to 30 seconds
   dcc.Interval(id='interval-component', interval=30*1000, n_intervals=0)
   ```

4. **Customize Styling**
   
   Update `assets/styles.css` to match your branding:
   ```css
   :root {
       --primary-color: #0f62fe;  /* IBM Blue */
       --secondary-color: #393939; /* IBM Gray */
       --success-color: #24a148;   /* IBM Green */
       --warning-color: #f1c21b;   /* IBM Yellow */
       --danger-color: #da1e28;    /* IBM Red */
   }
   ```

### Deploy the Dashboard

For production deployment, consider these options:

**Option 1: Deploy to IBM Cloud**
```bash
# Install IBM Cloud CLI
ibmcloud cf push resilience-dashboard -m 512M
```

**Option 2: Deploy with Docker**
```bash
# Create Dockerfile
docker build -t resilience-dashboard .
docker run -p 8050:8050 resilience-dashboard
```

**Option 3: Deploy to OpenShift**
```bash
# Create deployment
oc new-app python:3.12~https://github.com/your-repo/resilience-dashboard
oc expose svc/resilience-dashboard
```

### Share with Team

1. **Document Usage**
   
   Create a user guide for your team explaining:
   - How to access the dashboard
   - What each metric means
   - How to interpret the visualizations
   - Who to contact for issues

2. **Set Up Access Control**
   
   Implement authentication if needed:
   ```python
   # Add basic authentication
   import dash_auth
   
   VALID_USERNAME_PASSWORD_PAIRS = {
       'admin': 'secure-password',
       'viewer': 'view-only-password'
   }
   
   auth = dash_auth.BasicAuth(app, VALID_USERNAME_PASSWORD_PAIRS)
   ```

3. **Schedule Reports**
   
   Set up automated report generation:
   ```python
   # Add to app.py
   from apscheduler.schedulers.background import BackgroundScheduler
   
   def generate_daily_report():
       # Generate and email PDF report
       pass
   
   scheduler = BackgroundScheduler()
   scheduler.add_job(generate_daily_report, 'cron', hour=8)
   scheduler.start()
   ```

### Troubleshooting Dashboard Issues

**Issue: Dashboard not loading data**

```bash
# Check API connectivity
curl -H "Authorization: Bearer $CONCERT_API_KEY" \
  $CONCERT_API_URL/api/health

# Check application logs
tail -f logs/dashboard.log
```

**Issue: Charts not rendering**

```python
# Verify data format
print(data.head())
print(data.dtypes)

# Check for missing values
print(data.isnull().sum())
```

**Issue: Slow performance**

```python
# Add caching
from flask_caching import Cache

cache = Cache(app.server, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300
})

@cache.memoize()
def get_vulnerability_data():
    # Expensive API call
    pass
```

---


---

## Best Practices

### 1. Start with Monitoring Only

Begin with Concert in monitoring-only mode to understand application behavior before enabling automated actions:

```yaml
spec:
  remediation:
    enabled: false  # Start with monitoring only
    autoApprove: false
  monitoring:
    enabled: true
    log_all_events: true
```

**Recommended Timeline:**
- **Week 1-2**: Monitor only, collect baseline data
- **Week 3-4**: Enable notifications, no automated actions
- **Week 5-6**: Enable non-critical automated actions (e.g., cache clearing)
- **Week 7+**: Gradually enable critical actions with approval workflows

### 2. Use Graduated Thresholds

Implement multiple severity levels to avoid over-automation:

```yaml
policies:
  # Warning level - notify only
  - name: cpu-warning
    trigger:
      metric: cpu_usage
      value: 70
      duration: 5m
    action:
      type: notify
      channels: [slack]
  
  # High level - scale up
  - name: cpu-high
    trigger:
      metric: cpu_usage
      value: 85
      duration: 5m
    action:
      type: scale_deployment
      increment: 1
  
  # Critical level - scale up + alert
  - name: cpu-critical
    trigger:
      metric: cpu_usage
      value: 95
      duration: 2m
    action:
      type: scale_deployment
      increment: 2
    notification:
      severity: critical
      channels: [slack, pagerduty]
```

### 3. Implement Approval Workflows

For critical actions, require manual approval:

```yaml
action:
  type: rollback_deployment
  approval:
    required: true
    approvers:
      - ops-lead@example.com
      - dev-lead@example.com
    timeout: 30m
    auto_reject_on_timeout: false
```

**When to Require Approval:**
- Production deployments
- Database schema changes
- Security-related actions
- Actions affecting multiple services
- Rollbacks and version changes

### 4. Regular Policy Reviews

Schedule periodic reviews of resilience policies:

**Weekly Reviews:**
- Review action history and success rates
- Identify false positives
- Adjust thresholds based on actual behavior

**Monthly Reviews:**
- Analyze trends in automated actions
- Update policies for new failure modes
- Review and update notification channels

**Quarterly Reviews:**
- Comprehensive policy audit
- Update based on application changes
- Review and update approval workflows
- Assess ROI of automation

### 5. Comprehensive Testing

Test all resilience scenarios in non-production environments:

```bash
# Create test namespace
oc create namespace retail-app-test

# Deploy with test policies
ansible-playbook playbooks/deploy-development.yml \
  --extra-vars "namespace=retail-app-test concert_test_mode=true"

# Run chaos engineering tests
# Use tools like Chaos Mesh or Litmus
kubectl apply -f chaos-experiments/pod-failure.yaml
kubectl apply -f chaos-experiments/network-delay.yaml
kubectl apply -f chaos-experiments/cpu-stress.yaml
```

### 6. Security Best Practices

**Vulnerability Management:**
- Enable continuous vulnerability scanning
- Set up automated patching for critical vulnerabilities
- Implement approval workflows for production patches
- Maintain vulnerability remediation SLAs

**Certificate Management:**
- Monitor certificate expiration (30, 14, 7 days before)
- Enable automatic renewal for supported types
- Test certificate renewal in non-production first
- Maintain certificate inventory

**Software Composition:**
- Scan dependencies regularly
- Monitor for license compliance
- Track outdated dependencies
- Automate security patch updates

### 7. Documentation and Knowledge Sharing

**Document Everything:**
- Policy configurations and rationale
- Threshold values and how they were determined
- Approval workflows and escalation paths
- Incident response procedures

**Share Knowledge:**
- Conduct regular team training on Concert
- Document lessons learned from automated actions
- Share policy templates across teams
- Contribute to internal knowledge base

---

## Additional Resources

### Documentation

- **IBM Concert Documentation**: [ibm.com/docs/concert](https://www.ibm.com/docs/concert)
- **Concert API Reference**: [ibm.com/docs/concert/api](https://www.ibm.com/docs/concert/api)
- **OpenShift Integration Guide**: [docs.openshift.com/concert](https://docs.openshift.com/concert)
- **Instana Integration**: [ibm.com/docs/instana-concert](https://www.ibm.com/docs/instana-concert)

### Related Guides

- [Introduction to Infrastructure as Code](introduction.md)
- [TechZone Environment Setup](techzone-setup.md)
- [Ansible Deployment Guide](ansible-deployment.md)
- [Observability with Instana](observability-instana.md)
- [Main Workshop Guide](../README.md)

### Training Resources

- **IBM Concert Learning Path**: [IBM Skills](https://skills.yourlearning.ibm.com)
- **Resilience Engineering**: [SRE Book](https://sre.google/books/)
- **Chaos Engineering**: [Principles of Chaos](https://principlesofchaos.org/)
- **Security Best Practices**: [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Community

- **IBM Concert Community**: [community.ibm.com/concert](https://community.ibm.com/concert)
- **Slack Channel**: `#ibm-concert-users`
- **GitHub Discussions**: [github.com/IBM/concert-discussions](https://github.com/IBM/concert-discussions)
- **Stack Overflow**: Tag `ibm-concert`

### Tools and Integrations

- **Chaos Engineering**: [Chaos Mesh](https://chaos-mesh.org/), [Litmus](https://litmuschaos.io/)
- **Monitoring**: [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/)
- **Security Scanning**: [Trivy](https://trivy.dev/), [Snyk](https://snyk.io/)
- **Certificate Management**: [cert-manager](https://cert-manager.io/)

---

## Next Steps

After implementing automated resilience:

### 1. Monitor Performance

Track key metrics to measure the impact of automation:

- **MTTR (Mean Time To Recovery)**: Target 50% reduction
- **Incident Reduction**: Track decrease in manual interventions
- **Availability**: Monitor application uptime improvements
- **Cost Savings**: Calculate reduced operational overhead

### 2. Expand Coverage

Gradually expand automated resilience to more applications:

- Add additional applications to Concert monitoring
- Implement resilience policies for databases
- Extend to microservices and APIs
- Integrate with CI/CD pipelines

### 3. Optimize Policies

Continuously improve based on real-world data:

- Fine-tune thresholds based on actual behavior
- Add custom remediation scripts for specific scenarios
- Implement predictive policies using AI insights
- Optimize notification rules to reduce alert fatigue

### 4. Advanced Features

Explore advanced Concert capabilities:

- **Predictive Analytics**: Use AI to forecast issues
- **Multi-Cloud Resilience**: Extend to multiple cloud providers
- **Business Impact Analysis**: Correlate technical issues with business metrics
- **Automated Runbooks**: Create self-documenting remediation procedures

### 5. Share Knowledge

Contribute back to the community:

- Document lessons learned and best practices
- Share policy templates with other teams
- Conduct training sessions for team members
- Contribute to IBM Concert community forums

---

[← Back to Observability with Instana](observability-instana.md) | [Back to Main](../README.md)

---

*Last Updated: March 2026*  
*Maintained by: IBM Build Academy Team*
