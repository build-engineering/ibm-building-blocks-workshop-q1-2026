# TechZone Environment Setup

## Overview

This guide provides step-by-step instructions for provisioning an OpenShift environment on IBM TechZone for the Build Academy Workshop. The environment will serve as the foundation for demonstrating Infrastructure as Code principles using Ansible and exploring Terraform concepts.

**Estimated Time:** 45–75 minutes (includes ~30–60 min provisioning wait)

---

## Prerequisites

Before you begin, ensure you have:

- An active IBM TechZone account
- Access to the TechZone reservation system
- Valid IBM credentials
- A terminal application (macOS/Linux: Terminal or iTerm; Windows: PowerShell or Windows Terminal)
- Basic understanding of OpenShift/Kubernetes concepts

---

## Participant Checklist

Use this checklist to track your progress:

- [ ] Logged into TechZone and navigated to the reservation page
- [ ] Filled in Name, Description, and Purpose
- [ ] Selected Geography and Duration
- [ ] Configured OpenShift version, worker node count, and flavor
- [ ] Submitted reservation and noted the reservation ID
- [ ] Received email confirmation that the environment is ready
- [ ] Copied Bastion SSH connection, Bastion Password, and API URL to notepad
- [ ] SSH'd into the bastion host successfully
- [ ] Retrieved and saved the OpenShift access token
- [ ] Logged into OpenShift CLI and verified cluster health

---

## Step 1: Access TechZone

Navigate to the TechZone reservation page:

**Direct Link**: [TechZone OpenShift Reservation](https://techzone.ibm.com/collection/69c6c2db1bdc18e8109d08ed?platform=69cad5020e6973c20ef9d02c)

```
https://techzone.ibm.com/collection/69c6c2db1bdc18e8109d08ed?platform=69cad5020e6973c20ef9d02c
```

- Log in with your IBM credentials if prompted
- Verify you are on the OpenShift cluster reservation page

---

## Step 2: Fill in General Information

In the **Name** field, enter:
```
Build Academy Workshop Q1
```

In the **Description** field, enter:
```
Build Academy Workshop
```

Click **Next**.

---

## Step 3: Select Business Purpose

- Select **Education** as the Primary Use case
- Click **Next**

---

## Step 4: Choose Deployment Geography

- Under Geography, select:
  ```
  itz-osv-01 - any - any region - any datacenter
  ```
- Click **Next**

---

## Step 5: Set Duration

- Choose the default options (current date)
- Click **Next**

---

## Step 6: Configure the Cluster

Click the **Customize** button (pencil icon) and apply the following settings:

| Parameter | Value |
|-----------|-------|
| **OpenShift Version** | 4.18 |
| **Worker Node Count** | 4 |
| **Worker Node Flavor** | 16 vCPU x 64 GB - 300 GB ephemeral storage |

Click **Save** after configuring.

### Why These Specifications?

| Setting | Reason |
|---------|--------|
| OpenShift 4.18 | Latest stable version with current security updates |
| 4 Worker Nodes | Provides high availability and supports distributed workloads |
| 16 vCPU x 64 GB | Sufficient resources for the retail application and all lab exercises |
| 300 GB ephemeral storage | Adequate for container images and temporary data |

**Total cluster capacity with 4 worker nodes:**
- vCPUs: 64 total
- RAM: 256 GB total
- Storage: 1.2 TB ephemeral total

---

## Step 7: Review and Submit

1. **Review Configuration**
   - Double-check all settings match the table in Step 6
   - Verify the geography selection
   - Confirm worker node count is **4**

2. **Accept Terms**
   - Read the terms and conditions
   - Check the acceptance checkbox

3. **Submit**
   - Click the **Submit** button
   - Note your reservation ID for reference

---

## Step 8: Wait for Provisioning

After submitting, provisioning begins automatically.

**Typical Duration:** 30–60 minutes

**What happens during provisioning:**
1. Infrastructure allocation
2. OpenShift cluster installation
3. Network configuration
4. Security setup
5. Access credential generation

**Monitoring your reservation:**
- Visit [TechZone My Reservations](https://techzone.ibm.com/my/requests)
- Watch for status to change: `Provisioning` → `Ready`
- An email notification is sent when the environment is ready

> **While you wait:** Review the workshop materials or take a break. Do not proceed to the next steps until you receive the confirmation email.

---

## Environment Specifications

Your provisioned environment includes the following:

### Platform Details

| Property | Value |
|----------|-------|
| Platform | Red Hat OpenShift Container Platform 4.18 |
| Architecture | x86_64 |
| Container Runtime | CRI-O |
| Networking | OpenShift SDN or OVN-Kubernetes |

### Cluster Configuration

| Component | Count | Specs per Node |
|-----------|-------|---------------|
| Control Plane Nodes | 3 (TechZone managed) | Managed |
| Worker Nodes | 4 | 16 vCPU / 64 GB RAM / 300 GB storage |

### Total Cluster Capacity

| Resource | Total |
|----------|-------|
| vCPUs | 64 (across 4 worker nodes) |
| RAM | 256 GB |
| Ephemeral Storage | 1.2 TB |

### Pre-installed Components

- OpenShift Web Console
- OpenShift CLI (`oc`)
- Kubernetes API
- Internal container registry
- Monitoring stack (Prometheus, Grafana)

---

## Post-Provisioning: Access Your Cluster

### Step 1: Collect Access Information from TechZone

Once you receive the email notification that your environment is ready:

1. Go to [TechZone My Reservations](https://techzone.ibm.com/my/requests)
2. Click on your active reservation
3. Locate the **Reservation Details** section

Copy the following values to a notepad — you will need all three:

| Field | Example Value |
|-------|--------------|
| **Bastion SSH Connection** | `ssh root@bastion.cluster-xyz.techzone.ibm.com` |
| **Bastion Password** | `P@ssw0rd123` |
| **API URL** | `https://api.cluster-xyz.techzone.ibm.com:6443` |

> **Security Note:** Store these credentials securely. Do not share or commit them to version control.

---

### Step 2: Connect to the Bastion Host

**What is the bastion host?**
The bastion host is a secure, intermediate server provided by TechZone. It acts as a gateway into your OpenShift cluster's private network. You will run all cluster commands from this host during the workshop.

1. **Open a terminal** on your laptop

2. **SSH into the bastion host** using the connection string you copied:

   ```bash
   ssh root@bastion.cluster-xyz.techzone.ibm.com
   ```

   When prompted, enter the **Bastion Password** you copied.

3. **Verify successful login** — you should see a prompt like:

   ```
   [root@bastion ~]#
   ```

---

### Step 3: Obtain Your OpenShift Access Token

From the bastion host, run:

```bash
oc whoami --show-token
```

**Example output:**
```
sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

Copy the entire token (starting with `sha256~`) and save it to your notepad.

> **Note:** The `oc` CLI is pre-configured on the bastion host and already logged in as cluster admin. This command retrieves the token for use in subsequent steps.

---

### Step 4: Set Environment Variables

Using the values you collected, set the following environment variables on the bastion host. Replace the placeholder values with your actual token and API URL:

```bash
export OC_TOKEN="sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
export OC_URL="https://api.cluster-xyz.techzone.ibm.com:6443"
```

Verify the variables are set:

```bash
echo "Token: $OC_TOKEN"
echo "API URL: $OC_URL"
```

---

### Step 5: Log In to OpenShift CLI

```bash
oc login --token=$OC_TOKEN --server=$OC_URL
```

**Expected output:**
```
Logged into "https://api.cluster-xyz.techzone.ibm.com:6443" as "system:admin" using the token provided.

You have access to 67 projects, the list has been suppressed. You can list all projects with 'oc projects'

Using project "default".
```

---

### Step 6: Verify Cluster Health

Run the following commands to confirm your cluster is healthy and ready for the workshop:

```bash
# Check CLI and cluster version
oc version

# List all nodes (expect 4 worker nodes in Ready state)
oc get nodes

# Check cluster operators (all should show Available=True)
oc get clusteroperators

# View cluster info
oc cluster-info

# View available storage classes
oc get sc
```

**Expected output — Nodes:**
```
NAME                         STATUS   ROLES    AGE   VERSION
worker-0.cluster-xyz.com     Ready    worker   45m   v1.31.0
worker-1.cluster-xyz.com     Ready    worker   45m   v1.31.0
worker-2.cluster-xyz.com     Ready    worker   45m   v1.31.0
worker-3.cluster-xyz.com     Ready    worker   45m   v1.31.0
```

**Expected output — Storage Classes:**
```
NAME                          PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ibmc-block-bronze             ibm.io/ibmc-block              Delete          Immediate              true                   45m
ibmc-block-gold               ibm.io/ibmc-block              Delete          Immediate              true                   45m
ibmc-block-silver (default)   ibm.io/ibmc-block              Delete          Immediate              true                   45m
```

> **Success!** If all nodes show `Ready` and cluster operators show `Available=True`, your cluster is ready for the workshop exercises.

---

## Troubleshooting

### Provisioning Takes Too Long

**Symptoms:** Status stuck for over 90 minutes, no email notification received.

**Steps:**
1. Check the [TechZone Status Page](https://techzone.ibm.com/status) for outages
2. Verify reservation details in the dashboard
3. Contact TechZone support if stuck for more than 2 hours

---

### Cannot SSH to Bastion Host

**Symptoms:** `Connection refused`, `Connection timed out`, or `Permission denied`.

**Steps:**
1. Verify the bastion hostname is copied correctly (no extra spaces)
2. Confirm you are using `root` as the username
3. Check that your laptop is not behind a firewall blocking port 22
4. Try from a different network (e.g., mobile hotspot) to rule out local firewall issues
5. Re-check the bastion password — copy-paste rather than typing manually

---

### Cannot Access OpenShift Console

**Symptoms:** Console URL not loading, certificate errors, connection timeout.

**Steps:**
1. Verify the URL is correct (check your email or TechZone reservation details)
2. Accept the self-signed certificate warning in your browser
3. Check VPN/network connectivity
4. Try a different browser or clear browser cache and cookies

---

### Login Credentials Not Working

**Symptoms:** Invalid username/password error, authentication failed.

**Steps:**
1. Copy-paste credentials from the email rather than typing manually
2. Check for leading or trailing spaces in the password field
3. Request a password reset via TechZone if needed

---

### CLI Cannot Connect to API

**Symptoms:** `Connection refused`, certificate errors, timeout errors.

**Diagnostic commands:**

```bash
# Check network connectivity to API endpoint
ping api.cluster-xyz.techzone.ibm.com

# Verify the API endpoint is reachable
curl -k https://api.cluster-xyz.techzone.ibm.com:6443/version

# Login skipping TLS verification (for testing only — not for production use)
oc login https://api.cluster-xyz.techzone.ibm.com:6443 \
  --token=$OC_TOKEN \
  --insecure-skip-tls-verify=true
```

---

## Resource Management

### Reservation Duration

- **Default Duration**: Typically 1–2 weeks (varies by TechZone policy)
- **Extension**: Available through the TechZone dashboard
- **Expiration Warning**: Email sent 24–48 hours before expiration

### Extending Your Reservation

1. Go to [TechZone My Reservations](https://techzone.ibm.com/my/reservations)
2. Find your active reservation
3. Click **Extend**
4. Select a new end date and provide a justification
5. Submit the extension request

### Cleaning Up After the Workshop

When the workshop is complete:

1. **Delete test resources:**
   ```bash
   oc delete project test-project
   oc get projects
   ```

2. **End the reservation:**
   - Go to the TechZone dashboard
   - Select your reservation
   - Click **End Reservation** and confirm

> **Important:** Ending a reservation permanently deletes the cluster and all data. Make sure to save any outputs you need before doing this.

---

## Support Resources

### TechZone Support

| Resource | Link |
|----------|------|
| Support Portal | [TechZone Help](https://techzone.ibm.com/help) |
| Documentation | [TechZone Docs](https://techzone.ibm.com/docs) |
| Status Page | [TechZone Status](https://techzone.ibm.com/status) |

### OpenShift Resources

| Resource | Link |
|----------|------|
| OpenShift Documentation | [docs.openshift.com](https://docs.openshift.com) |
| OpenShift Blog | [cloud.redhat.com/blog](https://cloud.redhat.com/blog) |
| Red Hat Support | [access.redhat.com](https://access.redhat.com) |

### Workshop Support

- Contact your workshop instructor
- Check the workshop Slack channel
- Review the workshop materials
- Consult with fellow participants

---

## Next Steps

Once your environment is provisioned and verified:

1. **Proceed to Workshop Exercises** — Follow the workshop agenda and complete the hands-on labs
2. **Explore Ansible Deployment** — Review Ansible playbooks and deploy applications using automation
3. **Learn Terraform Concepts** — Study infrastructure provisioning and compare approaches

---

[← Back to Introduction](introduction.md) | [Back to Main](../README.md) | [Next: Workshop Exercises →](workshop-exercises.md)
