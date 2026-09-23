# Auth 1: Authentication Basics

## Summary

Authentication proves who a user is. This module covers credentials, the account lifecycle, and why passwords are salted and slow-hashed rather than stored or encrypted.

## Goals

- Separate authentication (who you are) from authorization (what you may do).
- Understand credentials, identity, and the account lifecycle (register, verify, sign in, reset, delete).
- Learn why passwords are salted and hashed, and never encrypted or stored in plaintext.
- Know where multi-factor authentication (MFA) fits.

## Core resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [MDN: HTTP Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [Argon2 (password hashing)](https://github.com/P-H-C/phc-winner-argon2)

## Exercises

1. In your own words, write the difference between authentication and authorization with one backend example of each.
2. Explain why a fast hash (SHA-256) is the wrong choice for passwords and a slow one (bcrypt/argon2) is right.
3. Diagram the account lifecycle: register → verify email → sign in → reset password → delete.
4. List three things that must never appear in logs (hint: one is in every login request).

## Deliverable

- A one-page glossary: identity, principal, credential, salt, hash, pepper, MFA.
- A short note on why AudioEye's auth service delegates credential storage to Cognito instead of storing password hashes itself.

## Exit check

You are ready for the next module if you can explain why "store the password hash, not the password" is still not enough on its own, and what salting adds.
