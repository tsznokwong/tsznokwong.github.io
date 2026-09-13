# 0009. Remove the Docker setup

Status: accepted
Date: 2026-09-13
Provenance: user-directed

## Context

`Dockerfile` used `node:16-alpine` (end-of-life 2023) and served `npm start`
on port 3000, a Create React App leftover. Vite 8 needs Node 20.19+, so the
image could not run the current app, and no workflow built it. Watching it with
the `docker` Dependabot ecosystem would propose a major `node` bump that
auto-merge rejects and that targets a runtime other than `.nvmrc`.

## Decision

Delete `Dockerfile`, `docker-compose.yaml`, `.dockerignore` and the README
section over repairing the image and adding a `docker` Dependabot watch,
because nothing uses the container and an unmaintained second runtime
definition drifts from `.nvmrc`.

## Consequences

- Local development is `npm` only.
- Reintroducing a container means pinning an exact `node:<.nvmrc>.x.y` image
  and adding the `docker` ecosystem with majors ignored.
