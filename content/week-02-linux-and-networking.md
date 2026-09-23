# Week 2: Linux and Networking

## Goals

- Get comfortable with the terminal and core Linux commands.
- Understand `IP`, `DNS`, `HTTP`, `HTTPS`, `TLS`, `CIDR`, subnets, route tables, and security groups.
- Learn how network traffic reaches an application.

## Core resources

- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [MDN: What is a Domain Name?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name)
- [MDN: Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [MDN: Transport Layer Security (TLS)](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security)
- [AWS VPC Basics](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html)
- [AWS Subnet CIDR Blocks](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html)
- [AWS Route Table Concepts](https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html)
- [AWS Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/creating-security-groups.html)

## Exercises

1. Practice these commands locally: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`, `cp`, `mv`, `rm`, `grep`, `curl`.
2. Run `curl -I https://example.com` and identify the status code and headers.
3. If available on your machine, run `dig example.com` or `nslookup example.com` and explain the result.
4. Split `10.0.0.0/24` into two `/25` subnets and explain how many IP addresses each subnet holds.
5. Draw the path from a browser request to an application: DNS lookup -> TCP/TLS connection -> HTTP request -> server response.

## Deliverable

- A terminal cheat sheet
- One DNS/HTTP request-flow diagram
- A short subnetting exercise write-up

## Exit check

You are ready for week 3 if you can explain what a subnet, route table, and security group each do, and why HTTPS uses TLS.
