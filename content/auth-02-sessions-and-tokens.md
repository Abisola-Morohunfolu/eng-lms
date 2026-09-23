# Auth 2: Sessions and Tokens

## Summary

Once a user is authenticated, something must carry that fact across requests. This module compares server-side sessions with stateless JWTs, and the cookie flags that keep either one safe.

## Goals

- Understand server-side sessions (a cookie holding an opaque id) versus stateless tokens (a signed JWT the client carries).
- Read a JWT: header, payload, signature; know what it does and does not protect.
- Learn cookie security flags: `HttpOnly`, `Secure`, `SameSite`, `Domain`, `Path`.
- Understand access tokens versus refresh tokens and short-lived versus long-lived credentials.

## Core resources

- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [RFC 7519: JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## Exercises

1. Decode a sample JWT (paste one into a decoder) and label each field. Explain why you must never put a secret in the payload.
2. List the tradeoffs of sessions vs JWTs on four axes: revocation, statelessness, size, and logout.
3. For a browser SPA calling an API on a different domain, write the exact cookie flags the session cookie needs and why (`SameSite=None; Secure`).
4. Explain why the platform you are building stores the JWT in an `HttpOnly` cookie instead of `localStorage`.

## Deliverable

- A decision note: "sessions or JWT for this app, and why", covering how you would revoke a compromised session.
- A diagram of the access-token / refresh-token rotation.

## Exit check

You are ready for the next module if you can explain why a stateless JWT is hard to revoke before it expires, and one mitigation.
