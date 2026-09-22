# 0014. Apple Maps-style globe on react-globe.gl

Status: accepted
Date: 2026-09-22
Provenance: autonomous

## Context

The travel page globe used a Blue Marble satellite texture, a starfield and
three.js text labels. It looked dated and blurry. The goal is an Apple
Maps-style illustrated globe; street-level zoom is explicitly not needed.

## Decision

Restyle the existing react-globe.gl globe over switching to a tile map engine
(MapLibre GL / Mapbox GL globe projection) because, without street-level zoom,
a tile engine buys nothing visible while losing the elevated 3D arcs.

Bake the surface from Natural Earth II over a paid stylised map provider
because it is public domain, needs no key or quota, and is close to Apple's
land-cover palette. `scripts/bake-globe-texture.py` rebuilds it.

Render markers and labels as HTML elements over three.js text meshes because
DOM text is crisp, uses the system font and renders diacritics.

## Consequences

- Texture ships as 8K (2.4 MB) for capable desktop GPUs and 4K (0.76 MB) for
  narrow screens or GPUs capped below 8192px.
- HTML labels can overlap in dense clusters; screen-space collision handling
  is needed.
