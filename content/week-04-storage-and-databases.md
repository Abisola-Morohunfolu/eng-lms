# Week 4: Storage and Databases

## Goals

- Understand object, block, and file storage.
- Learn relational vs NoSQL tradeoffs.
- Practice choosing the right persistence model for a workload.

## Core resources

- [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [What is Amazon EBS?](https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html)
- [What is Amazon EFS?](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)
- [What is Amazon RDS?](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [What is Amazon DynamoDB?](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)

## Exercises

1. Choose storage for each case and explain why:
   - photo-sharing app uploads
   - OS disk for a VM
   - shared files for multiple servers
   - transaction records for an online store
   - a session store or shopping cart
2. Compare relational databases and NoSQL using consistency, schema, joins, scale, and operational complexity.
3. Write a backup and restore plan for a small web app.
4. Explain durability vs availability using examples from storage and databases.

## Deliverable

- One decision sheet mapping workload -> storage/database choice
- One backup plan

## Exit check

You are ready for week 5 if you can explain why an image upload service and an order-processing database should not use the same storage pattern.
