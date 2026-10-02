---
title: Reverse proxy
description: Put QuizDock behind nginx or Caddy with HTTPS — WebSocket upgrade, request body size, forwarded headers, TRUST_PROXY, the same-origin rule and the full setup.
sidebar:
  order: 6
---

QuizDock serves its pages, its API and its game socket from one port. A reverse proxy in front adds HTTPS and a domain name. This page lists what the proxy must do, with an nginx example.

## What the proxy must do

1. **Pass WebSocket upgrades on `/socket.io/`.** The game runs over Socket.IO. Without the upgrade, players stay stuck connecting or fall back to slow polling.
2. **Accept large request bodies.** Media uploads and quiz imports go up to the largest of `MEDIA_MAX_BYTES`, `MEDIA_MAX_VIDEO_MB`, `MEDIA_MAX_AUDIO_MB` and `IMPORT_MAX_BYTES`: 50 MB with the defaults. nginx refuses anything over 1 MB by default.
3. **Pass the original host and the forwarded headers:** `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`.
4. **Serve everything from one origin, at the root of a host name.** The pages, `/api/`, `/socket.io/` and `/health` must answer on the same scheme, host and port. QuizDock does not run under a sub-path.

## nginx

On the proxy, with QuizDock published on port `18080` of the same machine:

```nginx
server {
    listen 443 ssl;
    server_name quiz.example.org;

    ssl_certificate     /etc/ssl/quiz.example.org/fullchain.pem;
    ssl_certificate_key /etc/ssl/quiz.example.org/privkey.pem;

    # Above the largest upload (50 MB by default): multipart encoding adds a little.
    client_max_body_size 64m;

    location / {
        proxy_pass http://127.0.0.1:18080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # The game socket (Socket.IO): WebSocket upgrade.
    location /socket.io/ {
        proxy_pass http://127.0.0.1:18080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Raise `client_max_body_size` if you raise the upload limits. `./quizdock doctor` warns when the largest upload allowed is above 64 MB.

Then, in `.env`:

```dotenv
APP_PUBLIC_URL=https://quiz.example.org
```

## Caddy

Caddy passes WebSocket upgrades and the `X-Forwarded-*` headers by itself, sets no request body limit by default, and obtains the certificate:

```txt
quiz.example.org {
    reverse_proxy 127.0.0.1:18080
}
```

## TRUST_PROXY: who may speak for the client

The backend reads the client's address from `X-Forwarded-For`, and whether the connection is HTTPS from `X-Forwarded-Proto`, only when they come from a proxy it trusts. Two things depend on it:

- **The wrong-PIN limit:** each client address may try 30 wrong PINs a minute. With the wrong address, a whole room shares one limit, or the limit can be dodged with a forged header.
- **The `Secure` flag of the session cookie** in OIDC mode, set when the proxy says the connection is HTTPS.

| `TRUST_PROXY` | Trusted |
|---|---|
| unset or empty (default) | A peer on a private address: loopback, private ranges, link-local |
| `false` | No proxy: the headers are ignored |
| `true` | Every hop |
| a number, for example `1` | That many proxies in front of the backend |
| addresses and CIDR ranges, comma-separated | Those peers only |

The default fits a proxy on the same machine or the same private network. Set it explicitly when:

- the proxy reaches QuizDock from a public address: name it, or give the number of hops;
- there is **no proxy** and Docker hides the client's address (Docker Desktop, Docker's userland proxy): every connection then looks private, so a client could forge the header. Set `TRUST_PROXY=false`.

`TRUST_PROXY` is a C1 variable: `.env` only, applied at restart.

## The same-origin rule

The API and the game socket answer the application's own pages only.

- A browser opening the game socket from a page of another origin is refused, in every mode.
- In OIDC mode, a request that changes something and comes from another origin gets `403 auth.cross_origin`, even from the same site (another port, a sibling subdomain).
- There are no CORS headers: a page served elsewhere cannot call the API.

Serving QuizDock at one address, as above, satisfies it. Do not serve the pages from one host name and the API from another.

## HTTPS

Over plain HTTP on a trusted network, QuizDock works. Use HTTPS as soon as the instance is reachable from outside, and in OIDC mode: the session cookie is only marked `Secure` over HTTPS.

## The full setup behind HTTPS

The full setup has two browser-facing services, QuizDock and Keycloak, on two ports of the same host name. Behind TLS:

1. Proxy **both** ports (the application's and `KEYCLOAK_PORT`), each with its certificate.
2. In `.env`, set `PUBLIC_SCHEME=https`.
3. If the proxy changes the ports or gives Keycloak its own host name or path, set the three addresses explicitly:

   ```dotenv
   APP_PUBLIC_URL=https://quiz.example.org
   KEYCLOAK_PUBLIC_URL=https://sso.example.org
   KEYCLOAK_APP_URL=https://quiz.example.org
   ```

   `KEYCLOAK_PUBLIC_URL` becomes Keycloak's public host name (`KC_HOSTNAME`) and the base of `OIDC_ISSUER`; `KEYCLOAK_APP_URL` is the redirect address Keycloak allows.
4. Apply it: `./quizdock up`.

`KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true` is already set, so tokens obtained by the backend over the Docker network still carry the public issuer.

## Caching

Media are served with byte ranges (`206 Partial Content`) and never change under their address: a cache in front may keep them. Built files under `/assets/` carry a hash in their name. QuizDock sends `no-cache` or `no-store` on the pages and on `/config.js`, which carries the instance's name, language and logo: keep that behaviour in the proxy, or a renamed instance and a new release do not reach the browsers.
