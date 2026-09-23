# Auth 3: OAuth 2.0 and OIDC

## Summary

OAuth 2.0 lets a user grant your app limited access without sharing a password; OIDC adds an identity layer on top. This module traces the Authorization Code flow behind "Sign in with Google".

## Goals

- Learn the four OAuth 2.0 roles: resource owner, client, authorization server, resource server.
- Understand the Authorization Code flow with PKCE and why it replaced the implicit flow.
- Separate OAuth 2.0 (authorization / delegated access) from OpenID Connect (authentication / identity).
- Trace the exact flow you build in this platform: "Sign in with Google".

## Core resources

- [OAuth 2.0 overview](https://oauth.net/2/)
- [RFC 6749: The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [Google Identity: OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server)

## Exercises

1. Draw the Authorization Code flow end to end for Google login: redirect, consent, `code`, token exchange, ID token.
2. Explain the purpose of the `state` parameter (CSRF) and the `nonce` (replay), and where PKCE fits.
3. Explain the difference between an OAuth access token and an OIDC ID token, and which one tells you who the user is.
4. Map this onto AudioEye's auth service: it is an OIDC proxy that wraps Cognito. What is the authorization server there, and what is the client?

## Deliverable

- A sequence diagram of your Google login, from the SPA button to the session cookie your API sets.
- A short note on what could go wrong if you skipped `state` validation.

## Exit check

You are ready for the next module if you can explain why the authorization code is exchanged for tokens on the server, not in the browser.
