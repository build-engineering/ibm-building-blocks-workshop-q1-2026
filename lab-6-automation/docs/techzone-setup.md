# TechZone Environment Setup

## Overview

This guide provides step-by-step instructions for provisioning an OpenShift environment on IBM TechZone for the Build Academy Workshop. The environment will serve as the foundation for demonstrating Infrastructure as Code principles using Ansible and exploring Terraform concepts.

---

## Prerequisites

Before you begin, ensure you have:

- An active IBM TechZone account
- Access to the TechZone reservation system
- Valid IBM credentials
- Basic understanding of OpenShift/Kubernetes concepts

---

## Access TechZone

Navigate to the TechZone reservation page:

```
https://techzone.ibm.com/my/reservations/create/66576e78d3aaab001ef9aa8d
```

**Direct Link**: [TechZone OpenShift Reservation](https://techzone.ibm.com/my/reservations/create/66576e78d3aaab001ef9aa8d)

---

## Configuration Details

Use the following configuration when provisioning your environment:

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Purpose** | Education | Required for workshop access |
| **Purpose Description** | Build Academy Workshop | Identifies the workshop |
| **Preferred Region Template** | Europe (recommended) | Any region available |
| **OpenShift Version** | 4.18 | Latest stable version |
| **Worker Node Count** | 3 | Minimum for HA setup |
| **Worker Node Flavor** | 16 vCPU x 64 GB - 300 GB ephemeral storage | Adequate for workshop |

### Why These Specifications?

- **3 Worker Nodes**: Provides high availability and demonstrates distributed workloads
- **16 vCPU x 64 GB per node**: Sufficient resources for retail application and workshop exercises
- **300 GB ephemeral storage**: Adequate for container images and temporary data
- **OpenShift 4.18**: Latest features and security updates

---
![](../images/TechZone.png)

## Provisioning Steps

### Step 1: Navigate to TechZone

1. Open the [TechZone reservation link](https://techzone.ibm.com/my/reservations/create/66576e78d3aaab001ef9aa8d)
2. Log in with your IBM credentials if prompted
3. Verify you're on the OpenShift cluster reservation page

### Step 2: Select Purpose

1. Locate the **Purpose** dropdown menu
2. Select `Education` from the available options
3. In the **Purpose Description** field, enter: `Build Academy Workshop`

> **Note**: The purpose description helps track workshop usage and may be required for approval.

### Step 3: Choose Region

1. Find the **Preferred Region Template** section
2. **Recommended**: Select a European region for optimal performance
3. **Alternative**: Choose any available region based on your location
4. Consider latency and data residency requirements

**Available Regions:**
- Europe (Frankfurt, London, Amsterdam)
- Americas (Dallas, Washington DC, Toronto)
- Asia Pacific (Tokyo, Sydney, Singapore)

### Step 4: Configure OpenShift Cluster

#### OpenShift Version
- Select **4.18** from the version dropdown
- This is the latest stable release with enhanced features

#### Worker Node Count
- Set to **3** worker nodes
- This provides:
  - High availability
  - Load distribution
  - Fault tolerance

#### Worker Node Flavor
- Choose **16 vCPU x 64 GB - 300 GB ephemeral storage**
- This configuration provides:
  - 48 total vCPUs across the cluster
  - 192 GB total RAM
  - 900 GB total ephemeral storage

### Step 5: Review and Submit

1. **Review Configuration**
   - Double-check all settings
   - Verify region selection
   - Confirm resource specifications

2. **Accept Terms**
   - Read the terms and conditions
   - Check the acceptance box

3. **Submit Reservation**
   - Click the **Submit** button
   - Note your reservation ID

### Step 6: Wait for Provisioning

**Provisioning Timeline:**
- **Typical Duration**: 30-60 minutes
- **Status Updates**: Available in TechZone dashboard
- **Email Notification**: Sent when environment is ready

**What Happens During Provisioning:**
1. Infrastructure allocation
2. OpenShift cluster installation
3. Network configuration
4. Security setup
5. Access credential generation

**Monitoring Your Reservation:**
- Visit [TechZone My Reservations](https://techzone.ibm.com/my/reservations)
- Check status: `Provisioning` → `Ready`
- View estimated completion time

---

## Environment Specifications

Your provisioned environment will include:

### Platform Details
- **Platform**: Red Hat OpenShift Container Platform 4.18
- **Architecture**: x86_64
- **Container Runtime**: CRI-O
- **Networking**: OpenShift SDN or OVN-Kubernetes

### Cluster Configuration
- **Control Plane Nodes**: 3 (managed by TechZone)
- **Worker Nodes**: 3 (configurable)
- **Node Specifications**:
  - CPU: 16 vCPU per node
  - Memory: 64 GB RAM per node
  - Storage: 300 GB ephemeral storage per node

### Total Cluster Capacity
- **Total vCPUs**: 48 (across 3 worker nodes)
- **Total RAM**: 192 GB
- **Total Storage**: 900 GB ephemeral

### Network Configuration
- **Cluster Network**: Internal pod network
- **Service Network**: Internal service network
- **Ingress**: OpenShift Router with external access
- **Registry**: Internal container registry

### Pre-installed Components
- OpenShift Web Console
- OpenShift CLI (`oc`)
- Kubernetes API
- Internal container registry
- Monitoring stack (Prometheus, Grafana)
- Logging stack (optional)

---

## Post-Provisioning Steps

### 1. Access Credentials

Once provisioning is complete, you'll receive an email notification. Follow these steps to access your cluster.

### 2. Collect Access Information from TechZone

1. **Navigate to TechZone Reservation Details**
   - Go to [TechZone My Reservations](https://techzone.ibm.com/my/reservations)
   - Click on your active reservation
   - Locate the **Reservation Details** section

2. **Copy Required Information**
   
   From the Reservation Details page, copy the following values to a notepad:
   
   - **Bastion SSH Connection** (e.g., `ssh root@bastion.cluster-xyz.techzone.ibm.com`)
   - **Bastion Password** (e.g., `P@ssw0rd123`)
   - **API URL** (e.g., `https://api.cluster-xyz.techzone.ibm.com:6443`)

   > **Security Note**: Store these credentials securely. Do not share or commit to version control.

### 3. Connect to Bastion Host

1. **Open Terminal on Your Laptop**
   
   Open a terminal application:
   - **macOS/Linux**: Terminal or iTerm
   - **Windows**: PowerShell, Command Prompt, or Windows Terminal

2. **SSH to Bastion Host**
   
   Paste the Bastion SSH connection command you copied earlier:
   
   ```bash
   ssh root@bastion.cluster-xyz.techzone.ibm.com
   ```
   
   When prompted, enter the **Bastion Password** you copied.

3. **Verify Successful Login**
   
   Upon successful login, you should see a command prompt similar to:
   ```
   [root@bastion ~]#
   ```

### 4. Obtain OpenShift Access Token

1. **Get Your Access Token**
   
   From the bastion host, run the following command:
   
   ```bash
   oc whoami --show-token
   ```
   
   **Example Output:**
   ```
   sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```

2. **Save the Token**
   
   Copy the entire token output (starting with `sha256~`) and save it in your notepad.

### 5. Configure OpenShift CLI Access

1. **Set Environment Variables**
   
   Using the information you collected, set the following environment variables.
   Replace the placeholder values with your actual values:
   
   ```bash
   export OC_TOKEN="sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
   export OC_URL="https://api.cluster-xyz.techzone.ibm.com:6443"
   ```
   
   > **Note**: Replace `sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890` with your actual token and `https://api.cluster-xyz.techzone.ibm.com:6443` with your actual API URL.

2. **Login to OpenShift**
   
   Use the environment variables to log in:
   
   ```bash
   oc login --token=$OC_TOKEN --server=$OC_URL
   ```
   
   **Expected Output:**
   ```
   Logged into "https://api.cluster-xyz.techzone.ibm.com:6443" as "system:serviceaccount:default:admin" using the token provided.

   You have access to 67 projects, the list has been suppressed. You can list all projects with 'oc projects'

   Using project "default".
   ```

### 6. Verify Cluster Status

Run the following commands to verify your cluster is healthy and accessible:

```bash
# Check cluster version
oc version

# List all nodes
oc get nodes

# Check cluster operators
oc get clusteroperators

# View cluster info
oc cluster-info

# View Storage Classes
oc get sc
```

**Expected Output for Nodes:**
```
NAME                         STATUS   ROLES    AGE   VERSION
worker-0.cluster-xyz.com     Ready    worker   45m   v1.31.0
worker-1.cluster-xyz.com     Ready    worker   45m   v1.31.0
worker-2.cluster-xyz.com     Ready    worker   45m   v1.31.0
```

**Expected Output for Storage Classes:**
```
NAME                          PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ibmc-block-bronze             ibm.io/ibmc-block              Delete          Immediate              true                   45m
ibmc-block-gold               ibm.io/ibmc-block              Delete          Immediate              true                   45m
ibmc-block-silver (default)   ibm.io/ibmc-block              Delete          Immediate              true                   45m
```

> **Success!** If all commands return healthy status, your cluster is ready for the workshop exercises.

---

## Troubleshooting

### Common Issues

#### Issue: Provisioning Takes Too Long

**Symptoms:**
- Provisioning status stuck for over 90 minutes
- No email notification received

**Solutions:**
1. Check TechZone status page for outages
2. Verify reservation details in dashboard
3. Contact TechZone support if stuck > 2 hours

#### Issue: Cannot Access Console

**Symptoms:**
- Console URL not loading
- Certificate errors
- Connection timeout

**Solutions:**
1. Verify URL is correct (check email)
2. Accept self-signed certificate in browser
3. Check VPN/network connectivity
4. Try different browser
5. Clear browser cache and cookies

#### Issue: Login Credentials Not Working

**Symptoms:**
- Invalid username/password error
- Authentication failed

**Solutions:**
1. Verify credentials from email (copy-paste)
2. Check for extra spaces in password
3. Ensure using `kubeadmin` username
4. Request password reset via TechZone

#### Issue: CLI Cannot Connect

**Symptoms:**
- Connection refused
- Certificate errors
- Timeout errors

**Solutions:**
```bash
# Skip TLS verification (for testing only)
oc login https://api.cluster-xyz.techzone.ibm.com:6443 \
  --username=kubeadmin \
  --password=YOUR_PASSWORD \
  --insecure-skip-tls-verify=true

# Check network connectivity
ping api.cluster-xyz.techzone.ibm.com

# Verify API endpoint
curl -k https://api.cluster-xyz.techzone.ibm.com:6443/version
```

---

## Resource Management

### Reservation Duration

- **Default Duration**: Varies by TechZone policy (typically 1-2 weeks)
- **Extension**: Available through TechZone dashboard
- **Expiration Warning**: Email sent 24-48 hours before expiration

### Extending Your Reservation

1. Go to [TechZone My Reservations](https://techzone.ibm.com/my/reservations)
2. Find your active reservation
3. Click **Extend** button
4. Select new end date
5. Provide justification
6. Submit extension request

### Cleaning Up

When workshop is complete:

1. **Delete Test Resources**:
   ```bash
   # Delete test projects
   oc delete project test-project
   
   # Verify deletion
   oc get projects
   ```

2. **End Reservation**:
   - Go to TechZone dashboard
   - Select your reservation
   - Click **End Reservation**
   - Confirm deletion

> **Important**: Ending reservation will permanently delete the cluster and all data.

---

## Support Resources

### TechZone Support

- **Support Portal**: [TechZone Help](https://techzone.ibm.com/help)
- **Documentation**: [TechZone Docs](https://techzone.ibm.com/docs)
- **Status Page**: [TechZone Status](https://techzone.ibm.com/status)

### OpenShift Resources

- **OpenShift Documentation**: [docs.openshift.com](https://docs.openshift.com)
- **OpenShift Blog**: [cloud.redhat.com/blog](https://cloud.redhat.com/blog)
- **Red Hat Support**: [access.redhat.com](https://access.redhat.com)

### Workshop Support

- Contact your workshop instructor
- Check workshop Slack channel
- Review workshop materials
- Consult with fellow participants

---

## Next Steps

Once your environment is provisioned and verified:

1. **Proceed to Workshop Exercises**
   - Follow the workshop agenda
   - Complete hands-on labs
   - Deploy the retail application

2. **Explore Ansible Deployment**
   - Review Ansible playbooks
   - Understand automation workflows
   - Deploy applications using Ansible

3. **Learn Terraform Concepts**
   - Study infrastructure provisioning
   - Compare with Ansible approach
   - Explore multi-cloud scenarios

---

[← Back to Introduction](introduction.md) | [Back to Main](../README.md) | [Next: Workshop Exercises →](workshop-exercises.md)