# Secrets Management

## Overview

This guide walks you through detecting and migrating hardcoded secrets in source code using IBM Bob and HashiCorp Vault. You will learn how to scan code for exposed credentials, encrypt them using the Vault Transit engine, store them securely in Vault KV, and automatically refactor your code to retrieve secrets via the Vault API — eliminating hardcoded credentials entirely.

**Estimated Time:** 30–45 minutes

---

## Table of Contents

- [Demo Video](#demo-video)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Import the Vault Expert Custom Bob Mode](#import-the-vault-expert-custom-bob-mode)
- [Vault Installation](#vault-installation)
- [Sample Prompt for IBM Bob](#sample-prompt-for-ibm-bob)
- [Running the Application](#running-the-application)
- [Architecture Overview](#architecture-overview)
- [Security Best Practices](#security-best-practices)
- [Related Documentation](#related-documentation)

---

## Demo Video

[![Automated Hardcoded Secret Detection & HashiCorp Vault Migration](https://img.youtube.com/vi/thZ_KW31D_A/0.jpg)](https://www.youtube.com/watch?v=thZ_KW31D_A)

**[Watch: Automated Hardcoded Secret Detection & HashiCorp Vault Migration](https://www.youtube.com/watch?v=thZ_KW31D_A)**

---

## Features

| Feature | Description |
|---------|-------------|
| **Automated Secret Detection** | Scans source code for 40+ types of hardcoded secrets |
| **Transit Encryption** | Encrypts sensitive secrets using Vault Transit engine (AES256-GCM96) |
| **Secure Storage** | Stores encrypted secrets in Vault KV v2 with metadata |
| **Code Refactoring** | Automatically replaces hardcoded secrets with Vault API calls |
| **Multi-Language Support** | Generates code examples in Python, Node.js, Go, CLI, and cURL |
| **Production-Ready** | Complete Ansible deployment automation for Vault |
| **Interactive UI** | Python Dash web application with IBM Carbon Design styling |

---

## Prerequisites

Before you begin, ensure you have:

- ✅ IBM Bob installed — [Sign up for early access](https://ibm.com/bob)
- ✅ Python 3.9 or later installed
- ✅ Ansible 2.9 or later installed on the bastion host
- ✅ OpenShift cluster provisioned and accessible (see [TechZone Setup](techzone-setup.md))
- ✅ Retail Application deployed (see [Ansible Deployment](ansible-deployment.md))

---

## Import the Vault Expert Custom Bob Mode

Before using IBM Bob for secrets management, import the Vault Expert custom mode into your project.

Download the custom mode zip file from the IBM Building Blocks repository:

**[secrets-management.zip](https://github.com/ibm-self-serve-assets/building-blocks/blob/main/build-and-deploy/secrets-management/bob-modes/base-modes/secrets-management.zip)**

Extract the zip file — it contains the `custom_modes.yaml` and the `rules-vault-expert/` folder needed in the steps below.

### For New Projects

If this is a new project with no existing custom modes:

1. Extract `secrets-management.zip` and copy the following into your project's `.bob/` directory:
   - `custom_modes.yaml`
   - `rules-vault-expert/`

   Your `.bob/` directory should look like:
   ```
   .bob/
   ├── custom_modes.yaml
   └── rules-vault-expert/
       └── [mode rules files]
   ```

2. Reload the Bob UI → **Modes** → **Custom Modes** → select **Vault Expert**

### For Existing Projects

If your project already has a `custom_modes.yaml`, do not overwrite it.

1. Open your existing `.bob/custom_modes.yaml` and **append** the Vault Expert mode entry:

   ```yaml
   # Existing custom modes (do not remove)
   - slug: existing-mode
     name: Existing Mode
     # ... existing configuration ...

   # Append below
   - slug: vault-expert
     name: Vault Expert
     # ... vault-expert configuration from extracted zip ...
   ```

2. Add the rules directory from the zip without modifying existing rule folders:

   ```
   .bob/
   ├── custom_modes.yaml              (updated — new mode appended)
   └── rules/
       ├── existing-mode/
       │   └── [existing rules]
       └── rules-vault-expert/        (new — copied from zip)
           └── [vault expert rules]
   ```

3. Verify the configuration:
   - All existing modes still work correctly
   - The Vault Expert mode appears in IBM Bob
   - No YAML syntax errors

---

## Vault Installation

You do not need to install Vault manually. It is provisioned automatically as part of the Ansible deployment when deploying the Retail Application. See [ansible-deployment.md](ansible-deployment.md) for details.

Once deployed, the Vault unseal keys and root token are saved to:

```
/tmp/vault-keys.json
```

> **Important**: This file contains your root token and unseal keys. Copy its contents to a secure location immediately. It is stored in `/tmp`, which does not persist across system reboots.

---

## Sample Prompt for IBM Bob

Use the following prompt with the **Vault Expert** custom mode to generate the complete secrets management application. This will produce all files with full implementations — no placeholders or TODOs.

> **How to use**: Open IBM Bob, switch to the **Vault Expert** mode, and paste the prompt below.

```
Create a complete "Automated Hardcoded Secret Detection and Vault Migration"
system. Generate ALL files with full implementations - no placeholders, no TODOs.

PROJECT STRUCTURE
-----------------

vault-secret-scanner/
├── README.md, QUICK_START.md, .gitignore
├── ansible/
│   ├── site.yml, inventory/hosts.ini
│   └── roles/vault/
│       ├── defaults/main.yml, handlers/main.yml
│       ├── tasks/ (main, prerequisites, install, configure, service, firewall, initialize)
│       └── templates/ (vault.hcl.j2, vault.service.j2, vault.env.j2)
├── secret_scanner_app/
│   ├── app.py, vault_client.py, secret_patterns.py, code_refactor.py
│   ├── requirements.txt, .env.example, start.sh, TROUBLESHOOTING.md
└── docs/ (INSTALLATION.md, USER_GUIDE.md, SECURITY.md, API_REFERENCE.md)

PART 1: ROOT FILES
------------------

README.md: Title, features (detection, encryption, storage, refactoring),
architecture diagram, quick start (3 steps), requirements (Python 3.9+,
Ansible 2.9+, Vault 1.12+), docs links

QUICK_START.md: Prerequisites, deploy Vault (Ansible commands), start app
(env setup), scan code (example), view results

.gitignore: __pycache__/, *.pyc, .venv/, .env, *.log, vault_keys.json,
.vscode/, *.retry

PART 2: ANSIBLE DEPLOYMENT
--------------------------

ansible/inventory/hosts.ini:
[vault_servers]
# vault1 ansible_host=IP ansible_user=ubuntu
[vault_servers:vars]
ansible_python_interpreter=/usr/bin/python3

ansible/site.yml: Deploy to vault_servers, become: yes, call vault role,
display completion

ansible/roles/vault/defaults/main.yml:
vault_version: "1.15.4"
vault_bin_path: "/usr/local/bin"
vault_config_dir: "/etc/vault.d"
vault_data_dir: "/opt/vault/data"
vault_user: "vault"
vault_port: 8200
vault_cluster_port: 8201
vault_tls_disable: true
vault_storage_backend: "file"
vault_ui_enabled: true
vault_init_secret_shares: 5
vault_init_secret_threshold: 3

ansible/roles/vault/tasks/main.yml: Include prerequisites → install →
configure → service → firewall → initialize

tasks/prerequisites.yml: Install unzip/curl/jq, create vault user/group,
create dirs (/etc/vault.d, /opt/vault/data), set ownership vault:vault 0750

tasks/install.yml: Download Vault zip, unzip to /usr/local/bin, set
cap_ipc_lock, verify version

tasks/configure.yml: Deploy vault.hcl and vault.env templates, set
ownership 0640

tasks/service.yml: Deploy systemd service, reload daemon, enable/start
vault, wait for health

tasks/firewall.yml: UFW (Debian) or firewalld (RedHat) allow 8200/8201

tasks/initialize.yml: Check init status, initialize if needed, save keys
to vault_keys.json (0600), unseal, enable Transit and KV v2, create key
"secret-scanner-key" (aes256-gcm96)

templates/vault.hcl.j2:
storage "file" { path = "{{ vault_data_dir }}" }
listener "tcp" { address = "{{ vault_address }}:{{ vault_port }}", tls_disable = true }
api_addr = "{{ vault_api_addr }}"
ui = true

templates/vault.service.j2: Systemd unit with User=vault, ProtectSystem=full,
CAP_IPC_LOCK, ExecStart=vault server -config=/etc/vault.d/vault.hcl,
Restart=on-failure

templates/vault.env.j2: VAULT_ADDR=http://127.0.0.1:8200

handlers/main.yml: reload systemd, restart vault

PART 3: PYTHON APPLICATION
---------------------------

requirements.txt:
dash==2.14.2
dash-bootstrap-components==1.5.0
hvac==2.0.0
python-dotenv==1.0.0

.env.example:
VAULT_ADDR=http://localhost:8200
VAULT_TOKEN=your_root_token_here

vault_client.py: VaultClient class with methods:
- __init__(): Init hvac client with env vars
- is_connected(): Check auth
- store_secret(path, data): Store in KV v2 at secret/data/{path}
- encrypt_secret(plaintext, key_name): Transit encrypt, return ciphertext
- get_secret(path): Retrieve from KV v2
- decrypt_secret(ciphertext, key_name): Transit decrypt
- list_secrets(path), delete_secret(path)

Module instance: vault_client = VaultClient()

secret_patterns.py: SECRET_PATTERNS dict with regex for AWS keys, API keys
(stripe, github, slack, etc.), DB URLs (postgres, mysql, mongodb), private
keys (RSA, SSH), JWT, OAuth, passwords, encryption keys

Functions:
- scan_for_secrets(code): Return findings with type, line, column, context,
  severity, masked_value
- get_severity(type): Return critical/high/medium/low
- get_severity_color(severity): Bootstrap color class
- should_encrypt_with_transit(type): True for high-value secrets
- mask_secret(secret): Show first/last 4 chars
- get_severity_stats(findings): Count by severity

code_refactor.py:
- generate_vault_retrieval_code(language, vault_path, secret_key): Generate
  snippets for Python (hvac), Node.js (node-vault), Go (vault/api), CLI
  (vault kv get), cURL (with jq)
- refactor_code_with_vault(code, findings, base_path): Replace secrets with
  Vault calls, add imports, return refactored code + vault_paths
- generate_migration_report(findings, vault_paths, encrypted_count): Markdown
  with summary, breakdowns, locations, next steps, security tips
- generate_code_examples(vault_path): Dict of all language examples
- create_vault_policy_for_paths(vault_paths, policy_name): HCL policy with
  read/list

app.py: Dash app with Bootstrap theme

Layout:
1. Header with title + Vault status badge
2. Tabs:
   - Scanner: Textarea (10 rows), scan button, results table (Type, Severity
     badge, Line, Column, Masked Secret, Context)
   - Storage: Store button, encryption toggle, results with paths
   - Refactoring: Refactor button, language dropdown, refactored code textarea,
     code examples
   - Report: Generate button, markdown display

Callbacks:
1. update_vault_status(): Check connection, update badge
2. scan_code(n_clicks, code): Scan and display findings
3. store_secrets(n_clicks, findings, use_encryption): Store with optional Transit
4. refactor_code(n_clicks, code, findings): Generate refactored code
5. update_code_examples(language, vault_paths): Show language-specific examples
6. generate_report(n_clicks, findings, vault_paths, encrypted_count): Create report

Main: app.run_server(debug=True, host='0.0.0.0', port=8050)

start.sh:
#!/bin/bash
set -e
[ -f .env ] && export $(cat .env | grep -v '^#' | xargs)
[ -z "$VAULT_ADDR" ] && echo "Error: VAULT_ADDR not set" && exit 1
python app.py

TROUBLESHOOTING.md: Common issues (connection failures, auth errors, storage
failures, encryption errors, startup issues), debug mode, performance tips, FAQ

PART 4: DOCUMENTATION
---------------------

docs/INSTALLATION.md (280+ lines): Prerequisites, Ansible deployment
(inventory, execution, verification), manual Vault install, Python setup
(venv, requirements, .env), troubleshooting

docs/USER_GUIDE.md (430+ lines): Getting started, scanning (paste code,
interpret results, severity), storing (auto storage, encryption, verify),
refactoring (generate, language select, integrate), migration workflow,
best practices (rotation, access control, audit), advanced features

REQUIREMENTS
------------

Generate with:
✅ Complete code (no placeholders/TODOs)
✅ Error handling + logging
✅ Type hints for Python
✅ Security best practices
✅ Bootstrap UI styling
✅ Full documentation with examples
```

---

## Running the Application

1. **Retrieve your Vault credentials** from the bastion host:

   ```bash
   cat /tmp/vault-keys.json
   ```

   Note the `root_token` value — you will need it in the next step.

2. **Update the `.env` file** in the generated application directory with your actual values:

   ```env
   VAULT_ADDR=http://<bastion-host-ip>:8200
   VAULT_TOKEN=<root_token_from_vault-keys.json>
   ```

3. **Start the application:**

   ```bash
   python app.py
   ```

4. **Open the application in your browser:**

   ```
   http://localhost:8050
   ```

   You should see the dashboard with:
   - A **Vault status badge** confirming the connection (green = connected)
   - Four tabs: Scanner, Storage, Refactoring, and Report

---

## Architecture Overview

The solution consists of five integrated components:

| Component | Role |
|-----------|------|
| **Secret Scanner** | Detects hardcoded secrets in source code using regex patterns for 40+ secret types |
| **Vault Transit Engine** | Encrypts sensitive data using AES256-GCM96 before it is stored |
| **Vault KV Store** | Securely stores encrypted secrets with metadata in Vault KV v2 |
| **Code Refactoring Engine** | Replaces hardcoded secrets with Vault API calls across multiple languages |
| **Web UI** | Interactive Dash dashboard for managing the full detection-to-migration workflow |

---

## Security Best Practices

- Never commit Vault tokens, unseal keys, or the `vault-keys.json` file to version control
- Copy `/tmp/vault-keys.json` to secure storage immediately after Vault initialization — `/tmp` is ephemeral
- Rotate Vault tokens regularly and use short-lived tokens where possible
- Apply least-privilege access policies — grant only the permissions each application needs
- Enable Vault audit logging for all operations to support compliance and incident response
- Use the Transit engine to encrypt all high-value secrets before storing them in KV

---

## Related Documentation

- [Ansible Deployment](ansible-deployment.md)
- [Automated Resilience](automated-resilience.md)
- [Observability with Instana](observability-instana.md)

---

[← Back to Ansible Deployment](ansible-deployment.md) | [Back to Main](../README.md)
