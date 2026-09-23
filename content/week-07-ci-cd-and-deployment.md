# Week 7: CI/CD and Deployment

## Goals

- Learn how software moves from source code to running service.
- Build a basic CI workflow.
- Understand image registries, release strategies, and rollback thinking.

## Core resources

- [GitHub Actions Quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart)
- [Docker Hub: Push Images](https://docs.docker.com/docker-hub/repos/manage/hub-images/push/)
- [What is CodeDeploy?](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)
- [CodeDeploy Deployment Configurations](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html)

## Exercises

1. Create a CI workflow that runs on every push.
2. Build and tag a Docker image for a sample app.
3. Write a release plan for three deployment styles:
   - all-at-once
   - canary
   - blue/green
4. Create a rollback checklist with the first five actions you would take after a bad deploy.

## Deliverable

- A sample workflow file
- One image-tagging convention
- A one-page deployment and rollback note

## Exit check

You are ready for week 8 if you can explain the difference between building, testing, packaging, deploying, and rolling back.
