# Week 10: Capstone

## Summary

The capstone combines the previous nine weeks into one small, deployed cloud project you can show in an interview. Use the deliverable checklist below to self-assess before you call it done.

## Goals

- Combine the previous nine weeks into one small cloud project.
- Practice design, deployment, security, observability, and cost review together.
- Produce something you can show in an interview or portfolio.

## Core resources

- [AWS Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [AWS Getting Started with Lightsail](https://aws.amazon.com/lightsail/getting-started/)
- [Launch a Linux Virtual Machine with Lightsail](https://aws.amazon.com/getting-started/hands-on/launch-a-virtual-machine/)
- [Deploy a Container Web Application on Amazon Lightsail](https://aws.amazon.com/tutorials/deploy-webapp-lightsail/)

## Project options

### Option A: Static + API + storage

Build:

- a static frontend
- a small API
- object storage for uploaded files
- a managed database or NoSQL table
- basic IAM and logging

### Option B: Containerized web app

Build:

- one containerized app
- a public endpoint
- persistent data storage
- monitoring and alerts
- IaC for the main resources

## Required outputs

1. Architecture diagram
2. Short README describing the system
3. IaC for the core resources
4. A cost estimate
5. A list of security controls
6. A basic monitoring and alert plan

## Capstone review questions

- What fails if one instance dies?
- What secrets exist and how are they protected?
- What would you monitor first?
- What is the most expensive part of the design?
- What would you automate next?

## Deliverable

- Architecture diagram of the whole system
- Short README describing what it does and how to run it
- Infrastructure as code for the core resources
- A monthly cost estimate
- A written list of security controls (IAM, secrets, encryption)
- A monitoring and alert plan with at least one SLO
- The system survives one instance failing
- Every secret is accounted for and protected
- You can name the most expensive part of the design
- You can state the one thing you would automate next

## Exit check

You have completed the plan if you can present the capstone clearly, justify your service choices, and explain what you would improve in version 2.
