# Week 6: Infrastructure as Code

## Goals

- Learn why infrastructure should be defined as code.
- Understand the Terraform workflow: `init`, `plan`, `apply`, `destroy`.
- Write a small reusable infrastructure definition.

## Core resources

- [Terraform AWS Get Started Tutorials](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)
- [Terraform: Manage Infrastructure](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-manage)
- [Terraform: Manage AWS RDS Instances](https://developer.hashicorp.com/terraform/tutorials/aws/aws-rds)

## Exercises

1. Install Terraform and complete the first tutorial.
2. Create a small config that describes:
   - one compute resource
   - one network/security rule
   - one storage resource
3. Use variables and outputs.
4. If you do not want to provision cloud resources yet, still write the config and run `terraform fmt` and `terraform validate`.
5. Explain why reviewable plans are safer than clicking through a console.

## Deliverable

- A minimal Terraform project with `main.tf`, `variables.tf`, and `outputs.tf`
- Notes describing what changed between `plan` and `apply`

## Exit check

You are ready for week 7 if you can explain how IaC improves repeatability, review, and rollback.
