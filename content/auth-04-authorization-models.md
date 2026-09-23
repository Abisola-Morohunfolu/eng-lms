# Auth 4: Authorization Models

## Summary

Authorization decides what an authenticated user may do. This module compares RBAC, ABAC, and ReBAC, and shows how policy engines scope grants across a multi-tenant hierarchy.

## Goals

- Compare authorization models: RBAC (roles), ABAC (attributes), and ReBAC (relationships).
- Understand policy engines and the request tuple `(subject, action, object)` plus scope/domain.
- Learn multi-tenant authorization: scoping grants to a tenant and its descendants.
- Understand row-level authorization: filtering reads by policy instead of returning 403.

## Core resources

- [NIST RBAC overview](https://csrc.nist.gov/projects/role-based-access-control)
- [Casbin: how it works](https://casbin.org/docs/how-it-works)
- [Casbin: RBAC with domains](https://casbin.org/docs/rbac-with-domains)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## Exercises

1. Design an RBAC scheme for this platform: Learner, Author, Admin. List each role's permissions on lessons, quizzes, and progress.
2. Rewrite one of those rules as an ABAC policy (attribute-based) and say when ABAC is worth the extra complexity.
3. Model a two-level tenant tree (account → sub-brand). Explain how an Admin grant at the account root should apply to every sub-brand beneath it.
4. Study AudioEye's approach: it encodes rules as `(subject, domain, object, action)` and resolves a tenant's ancestor chain via a closure table. Explain why a grant projects down to descendants and why an unknown compartment "fails closed to itself".

## Deliverable

- A permissions matrix (roles × resources × actions) for the platform.
- A one-paragraph note contrasting "deny by 403" with "row-level filtering to an empty list", and when each is correct.

## Exit check

You are ready for the Database track if you can explain the difference between RBAC and ABAC and give one case where relationship-based (ReBAC) authorization is the natural fit.
