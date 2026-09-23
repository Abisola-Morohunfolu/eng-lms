# Week 8: Monitoring and Reliability

## Goals

- Learn logs, metrics, traces, dashboards, and alerts.
- Understand `SLI`, `SLO`, error budgets, and incident basics.
- Start thinking about systems in terms of behavior under failure.

## Core resources

- [Amazon CloudWatch Getting Started](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-getting-started.html)
- [CloudWatch Metric Math Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create-alarm-on-metric-math-expression.html)
- [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook: Monitoring](https://sre.google/workbook/monitoring/)
- [What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/)

## Exercises

1. Define the four golden signals for a small API: latency, traffic, errors, saturation.
2. Create three alerts you would page on and two alerts you would only send to chat or email.
3. Draft one simple SLO, for example "99.9% successful requests over 28 days."
4. Write a short incident report for a simulated outage:
   - what happened
   - user impact
   - detection method
   - immediate fix
   - follow-up action

## Deliverable

- A dashboard sketch
- An alert list
- One SLO statement
- One incident note

## Exit check

You are ready for week 9 if you can explain why "more metrics" is not the same as "better observability."
