# Week 3: Compute

## Goals

- Learn when to use virtual machines, containers, and serverless functions.
- Understand load balancing and autoscaling.
- Deploy something small and runnable.

## Core resources

- [Docker: What is Docker?](https://docs.docker.com/get-started/docker-overview/)
- [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
- [What is an Application Load Balancer?](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
- [What is Amazon EC2 Auto Scaling?](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
- [Create Your First Lambda Function](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html)

## Exercises

1. Containerize a tiny app locally. A simple `hello world` web server is enough.
2. Make a table comparing VM vs container vs serverless with columns for startup time, control, operational overhead, and best use case.
3. Draw a scalable web architecture with a load balancer and at least two app instances.
4. Explain how autoscaling helps both availability and cost control.

## Deliverable

- A running local container or a written setup log
- A comparison table
- A compute architecture diagram

## Exit check

You are ready for week 4 if you can justify when you would choose EC2, a container, or Lambda for the same feature.
