# Introduction to Infrastructure as Code

## Automation: Build and Deploy

Modern software development and operations rely heavily on automation to achieve consistency, reliability, and speed. This workshop focuses on **Infrastructure as Code (IaC)** principles and demonstrates how automation tools can streamline the entire application lifecycle—from infrastructure provisioning to application deployment.

In this workshop, we explore two fundamental automation approaches:

1. **Configuration Management with Ansible** - Automating application deployment and configuration
2. **Infrastructure Provisioning with Terraform** - Automating infrastructure and service provisioning

---

## Infrastructure as Code Building Block

**Infrastructure as Code (IaC)** is a key DevOps practice that treats infrastructure configuration as software code. This approach enables:

- **Version Control**: Track infrastructure changes over time
- **Repeatability**: Deploy identical environments consistently
- **Automation**: Eliminate manual configuration errors
- **Collaboration**: Enable team-based infrastructure management
- **Documentation**: Code serves as living documentation

---

## Ansible for Application Deployment

In this workshop, we demonstrate deploying a **Retail Application** using Ansible playbooks developed with **IBM Bob**. Ansible is an agentless automation tool that excels at:

- **Application Deployment**: Deploy multi-tier applications across clusters
- **Configuration Management**: Ensure consistent application configurations
- **Orchestration**: Coordinate complex deployment workflows
- **Idempotency**: Apply configurations safely multiple times

### Key Benefits of Ansible

- Simple YAML-based syntax
- Agentless architecture (SSH-based)
- Extensive module library for various platforms
- Strong OpenShift/Kubernetes integration
- Human-readable playbooks

### Workshop Use Case

We will use Ansible playbooks, developed with IBM Bob's assistance, to:

1. Deploy the Retail Application to OpenShift
2. Configure application components
3. Manage application lifecycle
4. Demonstrate best practices for automated deployments

**Example Ansible Workflow:**
```yaml
# Simplified example of Ansible playbook structure
- name: Deploy Retail Application
  hosts: openshift_cluster
  tasks:
    - name: Create namespace
      k8s:
        state: present
        definition:
          apiVersion: v1
          kind: Namespace
          metadata:
            name: retail-app
    
    - name: Deploy application components
      k8s:
        state: present
        src: "{{ item }}"
      loop:
        - deployment.yaml
        - service.yaml
        - route.yaml
```

---

## Terraform for Infrastructure Provisioning

While Ansible handles application deployment, **Terraform** excels at provisioning infrastructure and cloud services. Terraform is a declarative IaC tool that can:

- **Provision Infrastructure**: Create VMs, networks, storage, and more
- **Manage Cloud Services**: Deploy services across AWS, Azure, GCP, IBM Cloud
- **Multi-Cloud Support**: Use consistent syntax across providers
- **State Management**: Track infrastructure state and dependencies
- **Plan and Apply**: Preview changes before execution

### Key Benefits of Terraform

- Declarative configuration language (HCL)
- Provider ecosystem for 1000+ services
- Dependency management and resource graphing
- State file for tracking infrastructure
- Plan/apply workflow for safe changes

### Common Terraform Use Cases

- Provisioning OpenShift/Kubernetes clusters
- Creating cloud infrastructure (VPCs, subnets, security groups)
- Deploying databases and storage services
- Managing DNS and load balancers
- Setting up monitoring and logging infrastructure

### Example Terraform Configuration

```hcl
# Simplified example of Terraform configuration
provider "ibm" {
  region = "eu-de"
}

resource "ibm_container_cluster" "openshift_cluster" {
  name              = "retail-app-cluster"
  datacenter        = "fra02"
  machine_type      = "b3c.16x64"
  hardware          = "shared"
  public_vlan_id    = var.public_vlan_id
  private_vlan_id   = var.private_vlan_id
  workers_count     = 3
  
  tags = ["workshop", "retail-app"]
}
```

### Learn More About Terraform

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Terraform Registry](https://registry.terraform.io/)
- [Terraform Best Practices](https://developer.hashicorp.com/terraform/cloud-docs/recommended-practices)
- [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials)

---

## Workshop Objectives

By the end of this workshop, you will:

1. **Understand IaC Principles**: Learn the fundamentals of Infrastructure as Code
2. **Deploy with Ansible**: Use Ansible playbooks to deploy a retail application
3. **Explore Terraform**: Understand how Terraform provisions infrastructure
4. **Leverage IBM Bob**: See how AI assists in developing automation code
5. **Apply Best Practices**: Learn industry-standard automation patterns

### Workshop Flow

```
┌─────────────────────┐
│ Provision OpenShift │
│   (TechZone)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Deploy Retail App   │
│   (Ansible)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Explore IaC         │
│   Concepts          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Learn Terraform     │
│   Basics            │
└─────────────────────┘
```

---

## Ansible vs Terraform: When to Use Each

| Aspect | Ansible | Terraform |
|--------|---------|-----------|
| **Primary Use** | Configuration management, application deployment | Infrastructure provisioning |
| **Approach** | Procedural (how to do it) | Declarative (what you want) |
| **State Management** | Stateless | Stateful (tracks infrastructure) |
| **Best For** | Application deployment, OS configuration | Cloud resources, infrastructure setup |
| **Language** | YAML | HCL (HashiCorp Configuration Language) |
| **Execution** | Sequential tasks | Parallel resource creation |
| **Idempotency** | Built-in for most modules | Built-in by design |

### Complementary Usage

In practice, Ansible and Terraform work together:

1. **Terraform** provisions the infrastructure (clusters, networks, storage)
2. **Ansible** deploys and configures applications on that infrastructure

This workshop demonstrates both tools to provide a complete automation picture.

---

## IBM Bob: AI-Assisted Development

Throughout this workshop, we leverage **IBM Bob** to:

- Generate Ansible playbooks
- Create Terraform configurations
- Provide best practice recommendations
- Debug automation code
- Accelerate development workflows

IBM Bob serves as an AI pair programmer, helping you write better automation code faster.

---

[← Back to Main](../README.md) | [Next: TechZone Setup →](techzone-setup.md)