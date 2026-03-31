# Secrets Management

## Demo Video

[![Automated Hardcoded Secret Detection & HashiCorp Vault Migration](https://img.youtube.com/vi/thZ_KW31D_A/0.jpg)](https://www.youtube.com/watch?v=thZ_KW31D_A)

**[Watch: Automated Hardcoded Secret Detection & HashiCorp Vault Migration](https://www.youtube.com/watch?v=thZ_KW31D_A)**

---

## Automated Hardcoded Secret Detection and Vault Migration

A comprehensive solution for detecting hardcoded secrets in source code, encrypting them with HashiCorp Vault Transit engine, storing them securely in Vault KV, and automatically refactoring code to use Vault API calls.

### Features

- **Automated Secret Detection**: Scans source code for 40+ types of hardcoded secrets
- **Transit Encryption**: Encrypts sensitive secrets using Vault Transit engine (AES256-GCM96)
- **Secure Storage**: Stores encrypted secrets in Vault KV v2 with metadata
- **Code Refactoring**: Automatically replaces hardcoded secrets with Vault API calls
- **Multi-Language Support**: Generates code examples in Python, Node.js, Go, CLI, and cURL
- **Production-Ready**: Complete Ansible deployment automation for Vault
- **Interactive UI**: Python Dash web application with professional IBM Carbon Design

---

## Importing the Vault Expert Custom Mode

Download the custom mode from: [secrets-management.zip](https://github.com/ibm-self-serve-assets/building-blocks/blob/main/build-and-deploy/secrets-management/bob-modes/base-modes/secrets-management.zip)

### New Projects

1. Extract [`secrets-management.zip`](https://github.com/ibm-self-serve-assets/building-blocks/blob/main/build-and-deploy/secrets-management/bob-modes/base-modes/secrets-management.zip)
2. Copy to `.bob/`:
   - [`custom_modes.yaml`](.bob/custom_modes.yaml)
   - [`rules-vault-expert/`](.bob/rules-vault-expert/)
3. Reload Bob UI → **Modes** → **Custom Modes** → Select mode

### Existing Projects

**Do not overwrite existing files**

1. Append to [`.bob/custom_modes.yaml`](.bob/custom_modes.yaml):
   ```yaml
   - slug: vault-expert
     name: Vault Expert
   ```

2. Add directory:
   ```
   .bob/rules/rules-vault-expert/
   ```

---

## Vault Installation

We do not need to install Vault manually as this is handled as part of Ansible automation while deploying the Retail App. See [`ansible-deployment.md`](ansible-deployment.md) for details.

**Vault keys are stored in [`vault-keys.json`](/tmp/vault-keys.json) under `/tmp`**

---

## Sample Prompt for Bob

On successful import of the custom mode, use the following prompt in Bob to generate the sample application:

```
# Complete Prompt for Generating Automated Hardcoded Secret Detection and Vault Migration System

Use this prompt with any AI coding assistant to generate the complete application.

---

## Master Prompt

```
Create a complete, production-ready "Automated Hardcoded Secret Detection and Vault Migration" system with the following specifications:

## PROJECT OVERVIEW
Build a comprehensive solution that:
1. Deploys HashiCorp Vault using Ansible automation
2. Provides a Python Dash web application for detecting hardcoded secrets
3. Encrypts sensitive secrets using Vault Transit engine (AES256-GCM96)
4. Stores secrets securely in Vault KV v2
5. Automatically refactors code to use Vault API calls
6. Generates migration reports and Vault policies

## PART 1: ANSIBLE VAULT DEPLOYMENT

### Directory Structure
```
ansible/
├── inventory/
│   └── hosts.ini
├── roles/
│   └── vault/
│       ├── defaults/
│       │   └── main.yml
│       ├── tasks/
│       │   ├── main.yml
│       │   ├── prerequisites.yml
│       │   ├── install.yml
│       │   ├── configure.yml
│       │   ├── service.yml
│       │   ├── firewall.yml
│       │   └── initialize.yml
│       ├── templates/
│       │   ├── vault.hcl.j2
│       │   ├── vault.service.j2
│       │   └── vault.env.j2
│       └── handlers/
│           └── main.yml
└── site.yml
```

### Requirements
1. **Inventory Configuration** (inventory/hosts.ini):
   - Support for multiple Vault servers
   - SSH connection parameters
   - Group variables

2. **Default Variables** (defaults/main.yml):
   - vault_version: "1.15.4"
   - vault_address: "0.0.0.0"
   - vault_port: 8200
   - vault_cluster_port: 8201
   - vault_storage_backend: "file"
   - vault_tls_disable: true (for dev)
   - vault_init_secret_shares: 5
   - vault_init_secret_threshold: 3

3. **Tasks**:
   - **prerequisites.yml**: Install unzip, curl, jq; create vault user/group; create directories
   - **install.yml**: Download Vault binary, unzip, set capabilities, verify installation
   - **configure.yml**: Deploy vault.hcl configuration, set environment variables
   - **service.yml**: Deploy systemd service, enable and start Vault
   - **firewall.yml**: Configure UFW (Debian) or firewalld (RedHat) for ports 8200, 8201
   - **initialize.yml**: Initialize Vault, save keys, unseal, enable Transit and KV v2 engines, create encryption key

4. **Templates**:
   - **vault.hcl.j2**: Storage, listener, API/cluster addresses, UI, telemetry
   - **vault.service.j2**: Systemd service unit with security hardening
   - **vault.env.j2**: Environment variables for Vault

5. **Handlers**:
   - reload systemd
   - restart vault

## PART 2: PYTHON DASH SECRET SCANNER APPLICATION

### Directory Structure
```
secret_scanner_app/
├── app.py                    # Main Dash application
├── vault_client.py           # Vault API wrapper
├── secret_patterns.py        # Secret detection patterns
├── code_refactor.py          # Code refactoring engine
├── requirements.txt          # Python dependencies
├── .env.example              # Environment template
├── start.sh                  # Startup script
└── TROUBLESHOOTING.md        # Issue resolution guide
```

### Requirements

#### 1. vault_client.py - Vault API Wrapper
Create a VaultClient class with these methods:

**Connection Methods:**
- `__init__()`: Initialize with VAULT_ADDR and VAULT_TOKEN from environment
- `is_connected() -> bool`: Check connection status
- `get_health() -> Dict`: Get Vault health information

**KV v2 Operations:**
- `kv_list_secrets(path, mount_point="secret") -> Dict`: List secrets
- `kv_read_secret(path, mount_point="secret", version=None) -> Dict`: Read secret
- `kv_write_secret(path, secret, mount_point="secret") -> Dict`: Write secret
- `kv_delete_secret(path, mount_point="secret") -> Dict`: Delete secret

**Transit Encryption:**
- `transit_encrypt(plaintext, key_name="secret-scanner-key") -> Dict`: Encrypt data
- `transit_decrypt(ciphertext, key_name="secret-scanner-key") -> Dict`: Decrypt data
- `transit_create_key(key_name, key_type="aes256-gcm96") -> Dict`: Create encryption key
- `transit_list_keys() -> Dict`: List encryption keys

**Engine Management:**
- `enable_secrets_engine(engine_type, path, description, options) -> Dict`: Enable engine
- `list_secrets_engines() -> Dict`: List all engines
- `ensure_kv_enabled(mount_point="secret") -> Dict`: Ensure KV v2 is enabled
- `ensure_transit_enabled(mount_point="transit") -> Dict`: Ensure Transit is enabled

**Error Handling:**
- Return dictionaries with {"error": "message"} on failure
- Handle hvac.exceptions.InvalidPath, Forbidden, InvalidRequest
- Never expose secrets in error messages

#### 2. secret_patterns.py - Secret Detection

**Detect 40+ Secret Types:**

Cloud Providers:
- AWS: Access Key ID (AKIA...), Secret Access Key, Session Token
- GCP: API Keys (AIza...), Service Account Keys
- Azure: Storage Keys, Client Secrets

Version Control:
- GitHub: Personal Access Tokens (ghp_...), OAuth (gho_...), App Tokens (ghs_...)
- GitLab: Personal Access Tokens (glpat-...)

Communication:
- Slack: Tokens (xox...), Webhook URLs
- Twilio: Account SID (AC...), Auth Token

Payment:
- Stripe: Secret Keys (sk_live_...), Publishable Keys (pk_live_...)

Email:
- SendGrid: API Keys (SG....)
- Mailgun: API Keys (key-...)

Cryptographic:
- RSA, EC, OpenSSH, PGP Private Keys
- Generic Private Keys

Database:
- MySQL, PostgreSQL, MongoDB, Redis connection strings
- JDBC connection strings

Authentication:
- JWT Tokens
- Vault Tokens (hvs..., root tokens)
- Generic passwords, secrets, API keys, tokens

High-Entropy:
- Base64-encoded secrets (32+ characters)

**Functions:**
- `scan_for_secrets(content: str) -> List[Dict]`: Scan code and return findings
- `should_encrypt_with_transit(secret_type: str) -> bool`: Determine if should encrypt
- `get_severity_color(severity: str) -> str`: Get color code for severity
- `get_severity_stats(findings: List) -> Dict`: Calculate severity statistics

**Finding Structure:**
```python
{
    "line": 10,
    "column": 15,
    "type": "aws_secret_key",
    "severity": "critical",  # critical, high, medium, low
    "description": "AWS Secret Access Key",
    "value": "actual-secret-value",
    "preview": "wJal...EKEY",
    "line_content": "aws_secret = 'wJalrXUt...'"
}
```

**Sensitive Types for Transit Encryption:**
- generic_password, database_url, mysql_connection, postgresql_connection
- mongodb_connection, redis_connection, jdbc_connection
- aws_secret_key, azure_client_secret, azure_storage_key
- vault_token, vault_root_token, generic_secret, jwt_token
- stripe_secret_key, twilio_auth_token, sendgrid_api_key
- rsa_private_key, ec_private_key, openssh_private_key, pgp_private_key

#### 3. code_refactor.py - Code Refactoring Engine

**Functions:**

- `generate_vault_retrieval_code(language, vault_path, secret_key="value") -> str`:
  Generate code snippets for: python, nodejs, go, cli, curl

- `refactor_code_with_vault(original_code, findings, base_path="scanner") -> Tuple[str, List[str]]`:
  - Replace hardcoded secrets with TODO comments
  - Add Vault client initialization
  - Add get_secret() helper function
  - Return refactored code and list of Vault paths

- `generate_migration_report(findings, vault_paths, encrypted_count) -> str`:
  Generate markdown report with:
  - Summary statistics
  - Breakdown by type and severity
  - Vault storage locations
  - Next steps and recommendations

- `generate_code_examples(vault_path) -> Dict[str, str]`:
  Return code examples for all supported languages

- `create_vault_policy_for_paths(vault_paths, policy_name="secret-scanner") -> str`:
  Generate HCL policy for accessing stored secrets

#### 4. app.py - Main Dash Application

**UI Structure:**

**Header:**
- Title: "Automated Hardcoded Secret Detection and Vault Migration"
- Connection status indicator (green=connected, yellow=not connected)

**Tabs:**

1. **Secret Scanner Tab:**
   - Large textarea for code input
   - "Scan for Secrets" button
   - Results table with columns: #, Line, Type, Severity, Preview, Action
   - Severity badges with color coding
   - Individual "Store in Vault" buttons
   - "Store ALL in Vault" button
   - "Generate Refactored Code" button
   - Storage results table showing Vault paths and encryption status
   - Refactored code display with copy button

2. **Code Examples Tab:**
   - Language selector (Python, Node.js, Go, CLI, cURL)
   - Code example display for selected language

3. **Migration Report Tab:**
   - Markdown-formatted migration report
   - Statistics and recommendations

4. **Vault Policy Tab:**
   - Generated HCL policy
   - Copy button

**Callbacks:**

1. `check_vault_connection()`: Display connection status
2. `scan_code()`: Scan code and display findings
3. `store_all_secrets()`: Store all secrets in Vault with Transit encryption
4. `generate_refactored_code()`: Generate and display refactored code
5. `show_code_example()`: Display code example for selected language
6. `show_migration_report()`: Display migration report
7. `show_vault_policy()`: Display generated policy

**Styling:**
- Use dash-bootstrap-components with BOOTSTRAP theme
- IBM Carbon Design System colors for tables
- Bootstrap icons for UI elements
- Professional, clean interface

#### 5. requirements.txt
```
dash==2.17.1
dash-bootstrap-components==1.6.0
hvac==2.3.0
python-dotenv==1.0.1
requests==2.31.0
pandas==2.2.1
black==24.3.0
```

#### 6. .env.example
```
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=your-vault-root-token-here
DASH_PORT=8050
DASH_DEBUG=True
```

#### 7. start.sh
Bash script that:
- Creates .env from .env.example if not exists
- Creates Python virtual environment (.venv)
- Activates virtual environment
- Installs/upgrades dependencies
- Checks Vault configuration
- Starts the application

Make executable with: chmod +x start.sh

## PART 3: DOCUMENTATION

Create comprehensive documentation:

### 1. README.md
- Project overview
- Features list
- Architecture diagram (text-based)
- Quick start instructions
- Links to detailed documentation

### 2. QUICK_START.md
- 5-minute setup guide
- Step-by-step instructions
- Example code to scan
- Expected results
- Troubleshooting quick tips

### 3. docs/INSTALLATION.md
- System requirements
- Prerequisites installation
- Ansible deployment steps
- Application setup steps
- Verification checklist
- Detailed troubleshooting

### 4. docs/USER_GUIDE.md
- Complete feature walkthrough
- Tab-by-tab usage instructions
- All 40+ secret types explained
- Severity levels explained
- Transit encryption details
- Best practices
- Common workflows
- Integration examples

### 5. docs/SECURITY.md
- Vault security best practices
- Authentication methods
- Access control policies
- TLS configuration
- Audit logging
- Seal management
- Application security
- Secret management lifecycle
- Network security
- Operational security
- Compliance requirements
- Security checklist

### 6. docs/API_REFERENCE.md
- Complete API documentation for all classes and functions
- Parameter descriptions
- Return value structures
- Code examples for each function
- Integration examples
- Error handling patterns

### 7. secret_scanner_app/TROUBLESHOOTING.md
- Common issues and solutions
- Dependency installation problems
- Virtual environment issues
- Vault connection problems
- Port conflicts
- Import errors
- Diagnostic script

### 8. .gitignore
Exclude:
- Python cache (__pycache__, *.pyc)
- Virtual environments (.venv, venv)
- Environment files (.env)
- IDE files (.vscode, .idea)
- Logs (*.log)
- Vault keys (vault_keys.json)
- Temporary files

## CRITICAL REQUIREMENTS

1. **No Placeholders**: All code must be complete and functional
2. **No TODOs**: Every function must be fully implemented
3. **Error Handling**: Comprehensive try-except blocks everywhere
4. **Security**: Never log or expose secret values
5. **Production Ready**: Code must be deployment-ready
6. **Documentation**: Every function must have docstrings
7. **Type Hints**: Use Python type hints throughout
8. **Consistent Style**: Follow PEP 8 for Python, best practices for Ansible

## TESTING CHECKLIST

Before considering complete, verify:
- [ ] Ansible playbook deploys Vault successfully
- [ ] Vault initializes and unseals automatically
- [ ] Transit and KV v2 engines are enabled
- [ ] Application starts without errors
- [ ] Can scan code and detect secrets
- [ ] Can store secrets in Vault
- [ ] Transit encryption works for sensitive secrets
- [ ] Code refactoring generates valid code
- [ ] All tabs display correctly
- [ ] Code examples work in all languages
- [ ] Migration report is comprehensive
- [ ] Vault policy is valid HCL
- [ ] Documentation is complete and accurate

## DELIVERABLES

Provide complete, working code for:
1. All Ansible files (playbook, roles, templates, handlers)
2. All Python application files (app.py, vault_client.py, etc.)
3. All documentation files (README, guides, API reference)
4. Configuration files (requirements.txt, .env.example, .gitignore)
5. Utility scripts (start.sh)

Generate production-ready code with no placeholders, no TODOs, and comprehensive error handling throughout.
```

---

## Usage Instructions

1. Copy the entire prompt above (between the triple backticks)
2. Paste it into your AI coding assistant (Claude, ChatGPT, etc.)
3. The AI will generate all files with complete, production-ready code
4. Review and test the generated code
5. Deploy using the provided instructions

## Expected Output

The AI should generate approximately:
- 15+ Ansible files (playbook, tasks, templates, handlers)
- 5 Python application files (1,500+ lines total)
- 7 documentation files (2,500+ lines total)
- 5 configuration/utility files
- Complete project structure ready for deployment

## Customization

You can modify the prompt to:
- Add more secret detection patterns
- Support additional programming languages
- Add more Vault features (PKI, Database secrets, etc.)
- Customize UI styling
- Add additional documentation sections
- Include testing frameworks

## Notes

- The prompt is designed to be comprehensive and self-contained
- All requirements are explicitly stated
- No assumptions are made about prior knowledge
- The AI should generate complete, working code
- All edge cases and error handling are specified
```

---

## Running the Application

1. Update the `.env` file with:
   - Vault root token
   - Bastion node host details

2. Start the application:
   ```bash
   python app.py
   ```

---

## Architecture Overview

The solution consists of the following components:

1. **Secret Scanner**: Detects hardcoded secrets using regex patterns
2. **Vault Transit Engine**: Encrypts sensitive data before storage
3. **Vault KV Store**: Securely stores encrypted secrets with metadata
4. **Code Refactoring Engine**: Replaces hardcoded secrets with Vault API calls
5. **Web UI**: Interactive dashboard for managing the entire workflow

---

## Security Best Practices

- Never commit Vault tokens or keys to version control
- Rotate Vault tokens regularly
- Use least-privilege access policies
- Enable audit logging for all Vault operations
- Store Vault keys in secure, encrypted storage
- Use Transit encryption for sensitive data at rest

---

## Related Documentation

- [Ansible Deployment](ansible-deployment.md)
- [Automated Resilience](automated-resilience.md)
- [Observability with Instana](observability-instana.md)
