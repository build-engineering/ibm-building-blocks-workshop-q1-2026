# Deploying Retail Application with Ansible

## Overview

This guide walks you through deploying the Retail Application on OpenShift using Ansible playbooks. The deployment automates the entire application setup, including container image management, OpenShift resource creation, and configuration management.

> **What is IBM Bob?** IBM Bob is an AI-powered assistant used during the development of these playbooks to generate idempotent task definitions, implement OpenShift best practices, and structure roles for maintainability. You'll learn more about it in the [Understanding the Ansible Playbooks](#understanding-the-ansible-playbooks) section.

**Estimated Time:** 20–30 minutes (plus 5–10 minutes for deployment)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Participant Checklist](#participant-checklist)
- [Setup Docker Hub Account](#setup-docker-hub-account)
- [Install Ansible](#install-ansible)
- [Download Ansible Playbooks](#download-ansible-playbooks)
- [Configure Environment](#configure-environment)
- [Deploy the Application](#deploy-the-application)
- [Verify Deployment](#verify-deployment)
- [Performance Testing with JMeter](#performance-testing-with-jmeter)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Prerequisites

Before starting the deployment, ensure you have:

- ✅ OpenShift cluster provisioned and accessible (see [TechZone Setup](techzone-setup.md))
- ✅ Bastion host access via SSH (username: `itzuser`)
- ✅ OpenShift CLI (`oc`) available on the bastion host
- ✅ Valid OpenShift access token (collected during TechZone setup)
- ✅ Internet connectivity from the bastion host
- ✅ watsonx API credentials (URL, API key, and project ID — provided by your instructor)
- ✅ Milvus connection details (host, port, credentials — provided by your instructor)

---

## Participant Checklist

Use this checklist to track your progress:

- [ ] Created or verified Docker Hub account and saved credentials
- [ ] SSH'd into bastion host
- [ ] Installed Ansible and verified with `ansible --version`
- [ ] Downloaded and extracted the playbook repository
- [ ] Navigated to the correct deployment directory
- [ ] Set all required environment variables (`OC_TOKEN`, `OC_URL`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`)
- [ ] Updated `group_vars/development.yml` with the correct storage class
- [ ] Updated `roles/workshop_env/defaults/main.yml` with watsonx and Milvus credentials
- [ ] Ran the deployment playbook successfully (no `failed` tasks)
- [ ] Verified all pods are in `Running` state
- [ ] Opened the application URL in a browser
- [ ] (Optional) Ran the JMeter spike test

---

## Setup Docker Hub Account

The Retail Application container images are hosted on Docker Hub. You need a Docker Hub account to authenticate and pull these images during deployment.

### Create or Log In to Docker Hub

1. Navigate to [https://hub.docker.com/](https://hub.docker.com/)

2. - **New users**: Click **Sign Up** and create a free account
   - **Existing users**: Click **Sign In** with your credentials

3. Save the following to your notepad — you will need them later:

   ```
   Docker Username: <your Docker Hub username>
   Docker Password: <your Docker Hub password or access token>
   ```

> **Security Tip**: Use a Docker Hub **Access Token** instead of your account password. Go to **Account Settings** → **Security** → **New Access Token**. Access tokens can be scoped and revoked independently.

---

## Install Ansible

Ansible must be installed on the bastion host. All deployment commands are run from there.

### Step 1: Connect to the Bastion Host

If not already connected, SSH in using the credentials from your TechZone reservation:

```bash
ssh itzuser@bastion.cluster-xyz.techzone.ibm.com
```

### Step 2: Install Ansible Core

```bash
sudo dnf install -y ansible-core
```

### Step 3: Verify the Installation

```bash
ansible --version
```

**Expected output:**
```
ansible [core 2.14.x]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.9/site-packages/ansible
  ansible collection location = /root/.ansible/collections:/usr/share/ansible/collections
  executable location = /usr/bin/ansible
  python version = 3.9.x
```

> If the version shown is `2.14.x` or higher, you are ready to proceed.

---

## Download Ansible Playbooks

The Ansible playbooks for deploying the Retail Application are available in the IBM Building Blocks repository on GitHub.

### Step 1: Download the Repository

```bash
wget https://github.com/ibm-self-serve-assets/building-blocks/archive/refs/heads/main.zip
```

### Step 2: Extract the Archive

```bash
unzip main.zip
```

### Step 3: Navigate to the Deployment Directory

```bash
cd building-blocks-main/build-and-deploy/Iaas/assets/deploy-bob-ansible/
```

### Step 4: Verify the Directory Contents

```bash
ls -la
```

**Expected structure:**
```
.
├── ansible.cfg
├── group_vars/
│   └── development.yml
├── inventory/
│   └── hosts
├── playbooks/
│   └── deploy-development.yml
├── roles/
└── README.md
```

> If the directory is empty or missing files, re-check that the `unzip` command completed without errors and that you are in the correct path.

---

## Configure Environment

Before running the playbook, you need to set environment variables and update two configuration files.

### Step 1: Set Environment Variables

Set the following variables in your terminal session. Replace each placeholder with your actual values:

```bash
export OC_TOKEN="sha256~AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
export OC_URL="https://api.cluster-xyz.techzone.ibm.com:6443"
export DOCKER_USERNAME="myusername"
export DOCKER_PASSWORD="mypassword123"
```

> **Where to find these values:**
> - `OC_TOKEN` and `OC_URL`: Collected during the [TechZone Setup](techzone-setup.md) post-provisioning steps or login into the OCP Console and retrive these credentials.
> - `DOCKER_USERNAME` / `DOCKER_PASSWORD`: Your Docker Hub credentials from the previous section

### Step 2: Verify Environment Variables

Confirm all variables are set before proceeding:

```bash
echo "OC_TOKEN:        $OC_TOKEN"
echo "OC_URL:          $OC_URL"
echo "DOCKER_USERNAME: $DOCKER_USERNAME"
echo "DOCKER_PASSWORD: [hidden]"
```

All four lines should show a value. If any are blank, re-run the corresponding `export` command.

### Step 3: Update the Storage Class Configuration

The deployment requires a storage class to provision persistent volumes for the database. You need to identify which storage class is available in your cluster.

1. **Get the available storage classes:**

   ```bash
   oc get storageclass
   ```

   **Example output:**
   ```
   NAME                                                   PROVISIONER                                     RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
   ocs-external-storagecluster-ceph-rbd (default)         openshift-storage.rbd.csi.ceph.com              Delete          Immediate           true                   5h
   ocs-external-storagecluster-cephfs                     openshift-storage.cephfs.csi.ceph.com           Delete          Immediate           true                   5h
   openshift-storage.noobaa.io                            openshift-storage.noobaa.io/obc                 Delete          Immediate           false                  4h58m
   ```

   Note the storage class marked **(default)** — this is typically the correct one to use.

   ![Storage Class](../images/storage_class.png)

2. **Edit the configuration file:**

   ```bash
   vi group_vars/development.yml
   ```

3. **Update the `storage_class` value** with your default storage class name:

   ```yaml
   storage_class: "ocs-external-storagecluster-ceph-rbd"
   ```

4. **While in this file, also review:**
   - Application namespace
   - Resource limits and replica counts
   - Image repository references

5. **Save and exit:**
   Press `Esc`, then type `:wq` and press `Enter`.

### Step 4: Update watsonx and Milvus Configuration

The Retail Application integrates with watsonx (IBM's AI platform) and Milvus (a vector database). These credentials are provided by your workshop instructor.

1. **Open the workshop environment configuration:**

   ```bash
   vi roles/workshop_env/defaults/main.yml
   ```

2. **Update the following parameters** with the values provided by your instructor:

   | Parameter | Description | Where to get it |
   |-----------|-------------|-----------------|
   | `workshop_watsonx_url` | watsonx API endpoint URL | Instructor handout |
   | `workshop_watsonx_api_key` | watsonx API key | Instructor handout |
   | `workshop_watsonx_project_id` | watsonx project ID | Instructor handout |
   | `workshop_milvus_host` | Milvus database host address | Instructor handout |
   | `workshop_milvus_port` | Milvus database port | Instructor handout |
   | `workshop_milvus_user` | Milvus username | Instructor handout |
   | `workshop_milvus_password` | Milvus password | Instructor handout |
   | `workshop_milvus_collection` | Milvus collection name | Instructor handout |

   > **Note**: If you do not have these credentials yet, ask your instructor before proceeding. The application will deploy without them but AI-powered features will not function.

3. **Save and exit:**
   Press `Esc`, then type `:wq` and press `Enter`.

---

## Deploy the Application

With configuration complete, you are ready to run the Ansible playbook.

### Step 1: Confirm You Are in the Correct Directory

```bash
pwd
```

Expected output:
```
/home/itzuser/building-blocks-main/build-and-deploy/Iaas/assets/deploy-bob-ansible/
```

If the path is different, navigate back:

```bash
cd ~/building-blocks-main/build-and-deploy/Iaas/assets/deploy-bob-ansible/
```

### Step 2: Run the Deployment Playbook

```bash
ansible-playbook playbooks/deploy-development.yml
```

### Step 3: Monitor Deployment Progress

The playbook executes multiple tasks sequentially. You will see output similar to:

```
PLAY [Deploy Retail Application to OpenShift] **********************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Login to OpenShift] ******************************************************
changed: [localhost]

TASK [Create namespace] ********************************************************
changed: [localhost]

TASK [Create Docker registry secret] *******************************************
changed: [localhost]

TASK [Deploy database] *********************************************************
changed: [localhost]

TASK [Deploy backend services] *************************************************
changed: [localhost]

TASK [Deploy frontend] *********************************************************
changed: [localhost]

TASK [Create routes] ***********************************************************
changed: [localhost]

PLAY RECAP *********************************************************************
localhost                  : ok=8    changed=7    unreachable=0    failed=0
```

> **Success indicator**: The `PLAY RECAP` line should show `failed=0`. If you see any non-zero `failed` count, check the [Troubleshooting](#troubleshooting) section.

### Step 4: Wait for Pods to Start

The playbook completes quickly, but the pods continue starting in the background. Wait 5–10 minutes for all images to be pulled and containers to start, depending on network speed and image sizes.

### What the Playbook Does

| Task | Description |
|------|-------------|
| Authentication | Logs into OpenShift using your token |
| Namespace creation | Creates a dedicated `retail-dev` namespace |
| Secret management | Creates a Docker registry pull secret for image access |
| Database deployment | Deploys PostgreSQL with persistent storage |
| Backend services | Deploys microservices (inventory, orders, users, etc.) |
| Frontend deployment | Deploys the web UI |
| Networking | Creates OpenShift Routes for external access |
| Configuration | Applies ConfigMaps and environment variables |

---

## Verify Deployment

After the playbook completes, confirm the application is running correctly.

### Step 1: Switch to the Application Namespace

```bash
oc project retail-dev
```

### Step 2: Check Pod Status

```bash
# List all pods
oc get pods

# Watch pods as they start (Ctrl+C to stop)
oc get pods -w
```

**Expected output (all pods should show `Running` and `1/1`):**
```
NAME                          READY   STATUS    RESTARTS   AGE
retail-db-1-xxxxx             1/1     Running   0          5m
retail-backend-1-xxxxx        1/1     Running   0          4m
retail-frontend-1-xxxxx       1/1     Running   0          3m
retail-inventory-1-xxxxx      1/1     Running   0          4m
retail-orders-1-xxxxx         1/1     Running   0          4m
```

> If any pod shows `ImagePullBackOff`, `CrashLoopBackOff`, or `Pending` after 10 minutes, see [Troubleshooting](#troubleshooting).

### Step 3: Check Services

```bash
oc get svc
```

**Expected output:**
```
NAME                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
retail-db           ClusterIP   172.30.xxx.xxx   <none>        5432/TCP   5m
retail-backend      ClusterIP   172.30.xxx.xxx   <none>        8080/TCP   4m
retail-frontend     ClusterIP   172.30.xxx.xxx   <none>        80/TCP     3m
```

### Step 4: Check Routes

```bash
oc get routes
```

**Expected output:**
```
NAME              HOST/PORT                                                           PATH   SERVICES          PORT   TERMINATION
retail-backend    retail-backend-retail-dev.apps.cluster-xyz.techzone.ibm.com               retail-backend    http   edge
retail-frontend   retail-frontend-retail-dev.apps.cluster-xyz.techzone.ibm.com              retail-frontend   http   edge
```

![Deployment Output](../images/deployment-output.png)

### Step 5: Open the Application

1. **Get the frontend URL:**

   ```bash
   oc get route retail-frontend -o jsonpath='{.spec.host}'
   ```

2. **Open the URL in your browser:**
   ```
   https://retail-frontend-retail-dev.apps.cluster-xyz.techzone.ibm.com
   ```

3. **Verify the application loads** — you should see the Retail Application homepage with:
   - Product catalog
   - Shopping cart functionality
   - User authentication

### Step 6: Check Logs (If Needed)

If the application does not load or behaves unexpectedly:

```bash
# Check frontend logs
oc logs -f deployment/retail-frontend

# Check backend logs
oc logs -f deployment/retail-backend

# Check database logs
oc logs -f deployment/retail-db
```

---

## Performance Testing with JMeter

### Overview

Apache JMeter is pre-configured on the bastion host to test the Retail Application under simulated load. The spike test simulates concurrent users performing actions such as browsing products, adding items to a cart, and checking out — helping identify performance bottlenecks under traffic bursts.

**Prerequisites:**
- ✅ Application deployed and all pods in `Running` state
- ✅ SSH access to bastion host

---

### Step 1: Get the Backend Route URL

The JMeter test targets the retail backend service. Retrieve its route:

```bash
oc get route -n retail-dev
```

**Example output:**
```
NAME              HOST/PORT                                                              PATH   SERVICES          PORT   TERMINATION   WILDCARD
retail-backend    retail-backend-retail-dev.apps.itz-bxpw9m.hub01-lb.techzone.ibm.com         retail-backend    http   edge          None
retail-frontend   retail-frontend-retail-dev.apps.itz-bxpw9m.hub01-lb.techzone.ibm.com        retail-frontend   http   edge          None
```

Copy the **retail-backend** HOST/PORT value — you will use it in Step 4.

---

### Step 2: Navigate to the JMeter Directory

Copy the pre-installed JMeter scripts to your home directory and navigate to them:

```bash
USER=$(whoami) && sudo sh -c "cp -r /root/retailapp /home/$USER && chown -R $USER:$USER /home/$USER/retailapp"
cd ~/retailapp/jmeter
```

---

### Step 3: Verify JMeter Scripts

```bash
ls -la
```

**Expected files:**
```
-rwxr-xr-x  1 itzuser itzuser  run_spike.sh
-rw-r--r--  1 itzuser itzuser  spike_test.jmx
-rw-r--r--  1 itzuser itzuser  load_test.jmx
-rw-r--r--  1 itzuser itzuser  stress_test.jmx
```

> If `run_spike.sh` is not executable, run: `chmod +x run_spike.sh`

---

### Step 4: Run the Spike Test

Execute the spike test using the backend route URL from Step 1:

```bash
./run_spike.sh retail-backend-retail-dev.apps.cluster-xyz.techzone.ibm.com
```

> Replace the URL with your actual backend route hostname.

---

### Step 5: Monitor Test Execution

The spike test runs for approximately **20–30 minutes**. You will see periodic summary output in the console:

```
Creating summariser <summary>
Created the tree successfully using ./retail_spike.jmx
Starting standalone test @ 2026 Mar 16 15:51:47 UTC (1773676307927)
Waiting for possible Shutdown/StopTestNow/HeapDump/ThreadDump message on port 4445
Warning: Nashorn engine is planned to be removed from a future JDK release
summary +     58 in 00:00:12 =    4.9/s Avg:   167 Min:     4 Max:   665 Err:     0 (0.00%) Active: 20 Started: 20 Finished: 0
summary +    102 in 00:00:15 =    7.0/s Avg:    11 Min:     4 Max:   323 Err:     0 (0.00%) Active: 0 Started: 20 Finished: 20
summary =    160 in 00:00:26 =    6.1/s Avg:    68 Min:     4 Max:   665 Err:     0 (0.00%)
Tidying up ...    @ 2026 Mar 16 15:52:14 UTC (1773676334729)
```

**Key metrics to watch:**
| Metric | What it means |
|--------|--------------|
| `/s` | Requests per second (throughput) |
| `Avg` | Average response time in milliseconds |
| `Err` | Error count — should remain `0` or near `0` |
| `Active` | Number of concurrent simulated users |

---

### Step 6: Monitor the Cluster During the Test

Open a second terminal session on the bastion host to observe cluster behavior while the test runs:

```bash
# Watch pod status
watch oc get pods -n retail-dev

# Monitor resource consumption per pod
oc adm top pods -n retail-dev

# Stream backend logs
oc logs -f deployment/retail-backend -n retail-dev

# Monitor node-level resource usage
oc adm top nodes
```

---

### Troubleshooting JMeter

| Problem | Command to Diagnose |
|---------|-------------------|
| Script not found | `find ~ -name "run_spike.sh"` |
| Permission denied | `chmod +x ~/retailapp/jmeter/run_spike.sh` |
| Connection error to backend | `curl -I https://<retail-backend-route>` |
| High error rate | `oc logs deployment/retail-backend -n retail-dev` |
| Pods restarting under load | `oc adm top pods -n retail-dev` |

---

## Troubleshooting

### Pods Not Starting

**Symptoms:** Pods stuck in `Pending`, `ImagePullBackOff`, or `CrashLoopBackOff`.

**Diagnosis steps:**

1. **Inspect pod events** — this is usually the fastest way to identify the root cause:
   ```bash
   oc describe pod <pod-name> -n retail-dev
   ```
   Look at the `Events` section at the bottom of the output.

2. **Verify Docker credentials:**
   ```bash
   oc get secret -n retail-dev
   oc describe secret docker-registry-secret -n retail-dev
   ```

3. **Check persistent volume claims (for database pods):**
   ```bash
   oc get pvc -n retail-dev
   oc describe pvc <pvc-name> -n retail-dev
   ```

---

### Image Pull Errors

**Symptoms:** `Failed to pull image` or `unauthorized: authentication required` in pod events.

**Steps:**

1. **Confirm environment variables are set:**
   ```bash
   echo $DOCKER_USERNAME
   echo $DOCKER_PASSWORD
   ```

2. **Recreate the Docker pull secret and redeploy:**
   ```bash
   oc delete secret docker-registry-secret -n retail-dev
   ansible-playbook playbooks/deploy-development.yml --tags secrets
   ```

---

### Database Connection Failures

**Symptoms:** Backend services cannot connect to the database; logs show `Connection refused`.

**Steps:**

1. **Check the database pod:**
   ```bash
   oc get pods -l app=retail-db -n retail-dev
   oc logs -f deployment/retail-db -n retail-dev
   ```

2. **Verify the database service is running:**
   ```bash
   oc get svc retail-db -n retail-dev
   oc describe svc retail-db -n retail-dev
   ```

3. **Check backend environment variables point to the correct DB host:**
   ```bash
   oc set env deployment/retail-backend --list -n retail-dev
   ```

---

### Route Not Accessible

**Symptoms:** Application URL returns 404, 503, or times out.

**Steps:**

1. **Check route configuration:**
   ```bash
   oc get route retail-frontend -n retail-dev
   oc describe route retail-frontend -n retail-dev
   ```

2. **Verify the service has endpoints (pods are backing it):**
   ```bash
   oc get endpoints retail-frontend -n retail-dev
   ```

3. **Test connectivity from inside the cluster:**
   ```bash
   oc rsh deployment/retail-frontend -n retail-dev
   curl http://localhost:8080
   ```

---

### Playbook Execution Fails

**Symptoms:** Ansible playbook exits with `failed=1` or higher.

**Steps:**

1. **Confirm you are still logged into OpenShift:**
   ```bash
   oc whoami
   oc cluster-info
   ```

2. **Verify all required environment variables are present:**
   ```bash
   env | grep -E "OC_TOKEN|OC_URL|DOCKER"
   ```

3. **Re-run with verbose output to identify the failing task:**
   ```bash
   ansible-playbook playbooks/deploy-development.yml -vvv
   ```

4. **Check the Ansible configuration:**
   ```bash
   ansible-config dump
   ```

---

## Cleanup (Optional)

To remove the application and free cluster resources:

```bash
# Delete all resources in the namespace
oc delete all --all -n retail-dev

# Delete persistent volume claims
oc delete pvc --all -n retail-dev

# Delete secrets
oc delete secret docker-registry-secret -n retail-dev

# Delete the namespace entirely
oc delete namespace retail-dev
```

To redeploy from scratch after cleanup:

```bash
ansible-playbook playbooks/deploy-development.yml
```

---

## Understanding the Ansible Playbooks

### Playbook Structure

The deployment uses a modular Ansible role structure, where each role handles one layer of the application:

```
deploy-bob-ansible/
├── ansible.cfg                      # Ansible configuration
├── group_vars/
│   └── development.yml              # Environment-specific variables (storage class, etc.)
├── inventory/
│   └── hosts                        # Inventory (localhost for this deployment)
├── playbooks/
│   └── deploy-development.yml       # Main entry point — orchestrates all roles
└── roles/
    ├── openshift-login/             # OpenShift authentication via token
    ├── namespace/                   # Creates and labels the application namespace
    ├── secrets/                     # Docker registry pull secrets
    ├── database/                    # PostgreSQL deployment with PVC
    ├── backend/                     # Backend microservices
    ├── frontend/                    # Web UI deployment and route
    └── workshop_env/                # watsonx and Milvus integration config
```

### Key Ansible Concepts Demonstrated

| Concept | Where Used |
|---------|------------|
| **Roles** | Each application layer (db, backend, frontend) is a separate role |
| **Variables** | `group_vars/development.yml` holds environment-specific values |
| **Jinja2 Templates** | Used to generate OpenShift manifests dynamically |
| **Handlers** | Triggered on configuration changes to restart services |
| **Tags** | Allow selective re-execution of specific tasks (e.g., `--tags secrets`) |

### IBM Bob's Contribution

The Ansible playbooks were developed with assistance from IBM Bob (IBM's AI coding assistant), which helped:

- Generate idempotent task definitions (safe to re-run without side effects)
- Create proper error handling across all roles
- Implement OpenShift deployment best practices
- Structure roles for readability and maintainability
- Add comprehensive inline documentation

---

## Additional Resources

### Documentation

- **Ansible Playbooks Repository**: [GitHub - Building Blocks](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/build-and-deploy/Iaas/assets/deploy-bob-ansible)
- **Retail Application Source**: [GitHub - Retail App](https://github.com/SunilManika/retailapp)
- **OpenShift Documentation**: [docs.openshift.com](https://docs.openshift.com)
- **Ansible Documentation**: [docs.ansible.com](https://docs.ansible.com)

### Related Guides

- [Introduction to Infrastructure as Code](introduction.md)
- [TechZone Environment Setup](techzone-setup.md)
- [Main Workshop Guide](../README.md)

### Support

- **Workshop Instructor**: Available during workshop sessions
- **Slack Channel**: `#build-academy-workshop`
- **GitHub Issues**: Report issues in the respective repositories

---

## Next Steps

After successfully deploying the Retail Application:

1. **Explore the Application** — Test all features, review the architecture, and understand the microservices design
2. **Review the Ansible Code** — Examine the playbook structure, understand role organization, and learn Ansible best practices
3. **Experiment with Modifications** — Adjust resource limits, scale deployments, or modify configurations
4. **Apply to Your Projects** — Use the playbooks as templates and adapt the IaC patterns for your own applications

---

[← Back to TechZone Setup](techzone-setup.md) | [Back to Main](../README.md)

---

*Last Updated: March 2026*  
*Maintained by: IBM Build Academy Team*
