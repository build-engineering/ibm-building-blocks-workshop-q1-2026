# Build Academy Workshop - Automation

Welcome to the Build Academy Workshop on Infrastructure as Code (IaC). This workshop demonstrates modern automation practices using Ansible and Terraform, with hands-on exercises deploying a retail application on OpenShift.

---

## 📚 Workshop Documentation

This workshop is organized into multiple sections for easy navigation:

### 1. [Introduction to Infrastructure as Code](docs/introduction.md)
Learn the fundamentals of IaC, automation principles, and the tools we'll use:
- **Automation: Build and Deploy** - Modern DevOps practices
- **Ansible for Application Deployment** - Configuration management and app deployment
- **Terraform for Infrastructure Provisioning** - Infrastructure automation across clouds
- **Workshop Objectives** - What you'll learn and accomplish

**Topics Covered:**
- Infrastructure as Code principles
- Ansible vs Terraform comparison
- IBM Bob AI-assisted development
- Best practices and patterns

### 2. [TechZone Environment Setup](docs/techzone-setup.md)
Step-by-step guide to provision your OpenShift environment:
- **Prerequisites** - What you need before starting
- **Provisioning Steps** - Detailed setup instructions
- **Configuration Details** - Cluster specifications
- **Post-Provisioning** - Verification and access
- **Troubleshooting** - Common issues and solutions

> **Note for Build Academy Workshop Participants:** If you are part of the Build Academy workshop, the environment will be pre-provisioned in TechZone. You can ignore the provisioning steps and proceed directly to accessing your assigned cluster.

**Environment Specs:**
- OpenShift 4.18
- 3 Worker Nodes (16 vCPU x 64 GB each)
- Total: 48 vCPU, 192 GB RAM

### 3. [Deploying Retail Application with Ansible](docs/ansible-deployment.md)
Complete guide to deploy the retail application using IBM Bob-developed Ansible playbooks:
- **Docker Hub Setup** - Create and configure Docker Hub account
- **Ansible Installation** - Install Ansible on bastion host
- **Playbook Configuration** - Download and configure deployment scripts
- **Application Deployment** - Execute Ansible playbooks
- **Verification** - Validate successful deployment
- **Troubleshooting** - Resolve common deployment issues

**What You'll Deploy:**
- Multi-tier retail application
- PostgreSQL database with persistent storage
- Microservices architecture
- Frontend web interface

### 4. [Build End-to-End Application Observability](docs/observability-instana.md)
Comprehensive guide to implement application observability using IBM Instana and IBM Bob:
- **Instana Setup** - Provision and configure IBM Instana
- **Agent Installation** - Deploy Instana agent using OpenShift Operator
- **Application Monitoring** - Configure monitoring for retail application
- **IBM Bob Integration** - Import custom mode and leverage AI insights
- **Distributed Tracing** - Analyze end-to-end request flows
- **Custom Dashboards** - Create observability dashboards

**What You'll Learn:**
- Application observability fundamentals
- Instana agent deployment and configuration
- Using IBM Bob for intelligent analysis
- Performance optimization techniques
- Troubleshooting with distributed tracing

### 5. [Automated Resilience with IBM Concert](docs/automated-resilience.md)
Implement intelligent automation and self-healing capabilities using IBM Concert:
- **IBM Concert Setup** - Provision and configure IBM Concert instance
- **Resilience Policies** - Configure automated remediation policies
- **Application Vulnerabilities** - Detect and remediate security vulnerabilities
- **Certificate Management** - Automate certificate lifecycle management
- **Software Composition** - Analyze and manage software dependencies

**What You'll Learn:**
- Automated resilience fundamentals
- Proactive issue detection and remediation
- Security vulnerability management
- Certificate lifecycle automation
- Software composition analysis

### 6. [Secrets Management with HashiCorp Vault](docs/secrets-management.md)
Implement automated hardcoded secret detection and secure secrets management using HashiCorp Vault:
- **Vault Expert Mode** - Import custom Bob mode for Vault automation
- **Secret Detection** - Scan source code for 40+ types of hardcoded secrets
- **Transit Encryption** - Encrypt secrets using Vault Transit engine (AES256-GCM96)
- **Secure Storage** - Store encrypted secrets in Vault KV v2
- **Code Refactoring** - Automatically replace hardcoded secrets with Vault API calls
- **Multi-Language Support** - Generate code examples in Python, Node.js, Go, CLI, and cURL

**What You'll Learn:**
- Automated secret detection and remediation
- HashiCorp Vault Transit encryption
- Secure secrets storage with Vault KV
- Code refactoring for Vault integration
- Python Dash application development
- Security best practices for secrets management

---

## 🚀 Quick Start

### For Workshop Participants

1. **Read the Introduction**
   - Start with [Introduction to IaC](docs/introduction.md)
   - Understand Ansible and Terraform concepts
   - Review workshop objectives

2. **Provision Your Environment**
   - Follow [TechZone Setup Guide](docs/techzone-setup.md)
   - Reserve OpenShift cluster
   - Verify access and connectivity

3. **Deploy the Retail Application**
   - Follow [Ansible Deployment Guide](docs/ansible-deployment.md)
   - Configure Docker Hub credentials
   - Execute Ansible playbooks
   - Verify application deployment

4. **Set Up Application Observability**
   - Follow [Observability Guide](docs/observability-instana.md)
   - Provision IBM Instana
   - Install and configure Instana agent
   - Monitor application with IBM Bob insights

5. **Implement Automated Resilience**
   - Follow [Automated Resilience Guide](docs/automated-resilience.md)
   - Set up IBM Concert
   - Configure resilience policies
   - Enable automated remediation
   - Manage vulnerabilities and certificates

6. **Set Up Secrets Management**
   - Follow [Secrets Management Guide](docs/secrets-management.md)
   - Import Vault Expert custom mode
   - Deploy secret scanner application
   - Configure Vault integration
   - Test automated secret detection and remediation

7. **Explore and Learn**
   - Test the deployed application
   - Review Ansible playbook structure
   - Analyze observability data
   - Test resilience scenarios
   - Apply IaC best practices

### Prerequisites

Before starting the workshop, ensure you have:

- ✅ IBM TechZone account
- ✅ Basic understanding of containers and Kubernetes
- ✅ Familiarity with command-line tools
- ✅ Text editor or IDE installed
- ✅ Git installed (for cloning repositories)

---

## 📖 Workshop Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Workshop Flow                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Introduction to IaC                                     │
│     └─ Learn automation principles                          │
│     └─ Understand Ansible & Terraform                       │
│                                                             │
│  2. Environment Setup                                       │
│     └─ Provision OpenShift on TechZone                      │
│     └─ Verify cluster access                                │
│                                                             │
│  3. Ansible Deployment                                      │
│     └─ Review playbooks (IBM Bob-assisted)                  │
│     └─ Deploy retail application                            │
│     └─ Manage application lifecycle                         │
│                                                             │
│  4. Application Observability                               │
│     └─ Set up IBM Instana                                   │
│     └─ Install Instana agent                                │
│     └─ Monitor with IBM Bob insights                        │
│                                                             │
│  5. Automated Resilience                                    │
│     └─ Configure IBM Concert                                │
│     └─ Set up resilience policies                           │
│     └─ Manage vulnerabilities & certificates                │
│     └─ Software Composition with IBM Bob                    │
│                                                             │
│  6. Secrets Management                                      │
│     └─ Import Vault Expert mode                             │
│     └─ Deploy secret scanner application                    │
│     └─ Detect and encrypt hardcoded secrets                 │
│     └─ Refactor code with Vault integration                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tools and Technologies

### Core Technologies

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **OpenShift 4.18** | Container platform | [docs.openshift.com](https://docs.openshift.com) |
| **Ansible** | Configuration management | [docs.ansible.com](https://docs.ansible.com) |
| **Terraform** | Infrastructure provisioning | [terraform.io/docs](https://developer.hashicorp.com/terraform/docs) |
| **IBM Instana** | Application observability | [ibm.com/docs/instana](https://www.ibm.com/docs/en/instana-observability) |
| **IBM Concert** | Automated resilience | [ibm.com/concert](https://www.ibm.com/products/concert) |
| **IBM Bob** | AI-assisted development | IBM Internal |

### Supporting Tools

- **Git** - Version control
- **oc CLI** - OpenShift command-line interface
- **kubectl** - Kubernetes command-line tool
- **YAML** - Configuration file format
- **HCL** - Terraform configuration language

---

## 📋 Workshop Agenda

### Session 1: Introduction
- Infrastructure as Code overview
- Ansible and Terraform introduction
- Workshop objectives and outcomes
- Environment setup overview

### Session 2: Environment Provisioning
- TechZone reservation process
- OpenShift cluster provisioning
- Access verification
- CLI setup and testing

### Session 3: Ansible Deployment
- Ansible fundamentals
- Playbook structure and syntax
- Deploying retail application
- Configuration management
- Troubleshooting and debugging

### Session 4: Application Observability
- IBM Instana setup and configuration
- Agent installation and deployment
- Application monitoring and tracing
- IBM Bob integration for insights
- Dashboard creation and alerting

### Session 5: Automated Resilience
- IBM Concert introduction
- Concert agent deployment
- Resilience policy configuration
- Application vulnerability management
- Certificate lifecycle automation
- Software composition analysis
- Testing self-healing scenarios

### Session 6: Best Practices
- IaC design patterns
- Observability strategies
- Security considerations
- Version control strategies
- CI/CD integration
- Documentation practices

---

## 🎯 Learning Objectives

By completing this workshop, you will be able to:

### Knowledge Objectives
- ✅ Explain Infrastructure as Code principles
- ✅ Differentiate between Ansible and Terraform use cases

### Skill Objectives
- ✅ Provision OpenShift clusters on TechZone
- ✅ Write and execute Ansible playbooks
- ✅ Deploy multi-tier applications using Ansible
- ✅ Set up and configure IBM Instana
- ✅ Install and manage Instana agents
- ✅ Configure IBM Concert for automated resilience
- ✅ Implement self-healing policies
- ✅ Manage application vulnerabilities
- ✅ Automate certificate lifecycle management
- ✅ Analyze software composition
- ✅ Read and understand Terraform configurations
- ✅ Use IBM Bob for automation and observability insights

### Application Objectives
- ✅ Deploy a retail application on OpenShift
- ✅ Implement end-to-end application observability
- ✅ Configure automated resilience and self-healing
- ✅ Monitor and analyze application performance
- ✅ Manage security vulnerabilities proactively
- ✅ Automate certificate and dependency management
- ✅ Manage application lifecycle with automation
- ✅ Apply IaC principles to real-world scenarios
- ✅ Troubleshoot using distributed tracing

---

## 🔗 Quick Links

### Documentation
- [Introduction to IaC](docs/introduction.md)
- [TechZone Setup Guide](docs/techzone-setup.md)
- [Ansible Deployment Guide](docs/ansible-deployment.md)
- [Application Observability Guide](docs/observability-instana.md)
- [Automated Resilience Guide](docs/automated-resilience.md)
- [Secrets Management Guide](docs/secrets-management.md)

### External Resources
- [IBM TechZone](https://techzone.ibm.com)
- [OpenShift Documentation](https://docs.openshift.com)
- [Ansible Documentation](https://docs.ansible.com)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [IBM Instana Documentation](https://www.ibm.com/docs/en/instana-observability)
- [IBM Concert Documentation](https://www.ibm.com/products/concert)
- [Building Blocks Repository](https://github.com/ibm-self-serve-assets/building-blocks)
- [Retail App Repository](https://github.com/SunilManika/retailapp)

### Support
- Workshop Slack Channel: `#build-academy-workshop`
- TechZone Support: [techzone.ibm.com/help](https://techzone.ibm.com/help)
- Instructor Contact: Available during workshop sessions

---

## 💡 Key Concepts

### Infrastructure as Code (IaC)
Treating infrastructure configuration as software code, enabling version control, automation, and repeatability.

### Configuration Management
Using tools like Ansible to ensure systems are configured consistently and applications are deployed reliably.

### Infrastructure Provisioning
Using tools like Terraform to create and manage cloud resources and infrastructure components.

### Idempotency
The ability to apply the same configuration multiplei times without causing unintended changes or errors.

### Declarative vs Procedural
- **Declarative** (Terraform): Define the desired end state
- **Procedural** (Ansible): Define the steps to achieve the state

---

## 📄 License

This workshop material is provided for educational purposes as part of the IBM Build Academy program.

---

**Ready to begin?** Start with the [Introduction to Infrastructure as Code](docs/introduction.md) →

---

*Last Updated: March 2026*  
*Workshop Version: 1.0*  
*Maintained by: IBM Build Academy Team*