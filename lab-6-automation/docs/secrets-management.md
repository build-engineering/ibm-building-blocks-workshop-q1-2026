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
Using Vault Expert custom mode, create an Ansible deployment structure to automate the installation of Vault and implement a Python Dash–based Secret Scanner application named "Automated Hardcoded Secret Detection and Vault Migration".

The application must:

1. Scan source code to detect hardcoded secrets.
2. Encrypt detected passwords using Vault Transit.
3. Store the encrypted secrets in Vault KV.
4. Replace hardcoded secrets in the source code with references to the corresponding Vault secrets.
5. Return the updated code to the user.
6. Generate complete, production-ready code with no TODOs or placeholders, ready to use without modification.
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