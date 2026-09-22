# 0015. Procedural starfield rendered with three directly

Status: accepted
Date: 2026-09-22
Provenance: autonomous

## Context

ADR 0014 dropped the night-sky backdrop texture. Stars were wanted back, at a
higher quality than the old texture, which blurred when stretched to the
viewport.

## Decision

Render a seeded, generated star field as a three.js `Points` object in the
globe's scene over a higher-resolution sky texture because points stay crisp
at any device pixel ratio, rotate with the camera, and cost ~1.4 KB gzipped
instead of a multi-megabyte image.

Add `three` as a direct dependency, pinned to the version react-globe.gl
already resolves (~0.184.0), over reaching into globe.gl internals because the
star layer needs `Points`/`ShaderMaterial`; the pin keeps a single deduped
copy in the bundle.

## Consequences

- `three` must be bumped together with react-globe.gl to avoid two copies.
- Stars are procedural (seeded), not a real star catalogue.
- Twinkle is disabled under `prefers-reduced-motion`.
