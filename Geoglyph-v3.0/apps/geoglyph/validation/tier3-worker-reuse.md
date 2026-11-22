# Tier 3: worker model reuse (GG-15 / GG-16)

## Changes

- `src/workers/font-geometry-worker.js`: look up a complete normalized model before requiring its parsed font. Existing parsed-font LRU touches remain intact when that font is resident. A missing model still uses the established `FONT_EVICTED` preparation path.
- `src/scripts/font-service.js`: mesh requests first send their render key without nested polygon data. The worker uses an existing mesh or the normalized model under that same key. `MESH_MODEL_MISSING` triggers one request containing the caller's model, covering eviction, independently supplied models and worker replacement. Other errors retain their existing behavior.
- No cache ceilings, glyph generation, outline validation, rendering quality, request deadlines or worker retry limits changed. Mesh responses continue to clone buffers; transferring retained cached buffers would detach them and remains excluded.

## Targeted verification

Commands run directly, without the full test battery:

```text
rtk proxy node tests/unit/worker-model-reuse.test.cjs  # 6 pass
rtk proxy node tests/unit/worker-recovery.test.cjs     # 11 pass
rtk proxy node tests/unit/fonts-rendering.test.cjs    # 10 pass
```

New protocol tests run the actual service and worker dispatch code in isolated VMs with structured-cloned message boundaries. Parsed-font and normalized-model generation are deterministic fixtures; mesh generation uses the production Three.js extrusion module. The existing font test also checks a generated real OpenType font's cached outlines after its parsed font was evicted.

The new six-case suite was run against source extracted from the previous committed baseline. Five cases fail as expected there; the error propagation case passes both versions. These failures establish changed protocol/counter expectations, rather than browser failures in the previous release.

| Reproducible workload | Previous source | Updated source |
|---|---:|---:|
| Five initial font/model loads, then 50 round-robin warm model requests | 55 parses total | 5 parses total |
| Extra parses during those 50 warm requests | 50 | 0 |
| Resident parsed-font limit | 2 | 2 |
| Full polygon payloads sent for normal model-to-mesh request | 1 | 0 |
| Requests for normal model-to-mesh request | 1 | 1 |
| Requests when model and mesh both absent in worker | 1 full | 1 key-only + 1 full fallback |

Tests additionally cover unchanged mesh typed arrays/bounds/material ranges, normalized-model eviction, repeated cached meshes, deterministic build errors, infrastructure recovery with one replacement worker and intact caller buffers. The fallback adds one small message round trip on a cache miss; this is the trade-off for removing large redundant main-to-worker polygon clones on the normal path. Results remain cloned back to the caller.

These are measured deterministic counters and geometry comparisons, not browser latency/FPS/heap measurements. No browser run or soak was performed for this isolated change. Browser transport integration and physical GPU/frame-tail validation remain separate release checks.

## Rollback criteria

Revert the service's key-only `mesh` wrapper and worker cache-lookup changes together if representative browser runs show changed geometry, unexpected fallback frequency, stale-key collisions or increased update latency. Reverting does not require persisted-data migration; neither protocol uses durable storage. If only normalized model residency regresses, restore the parsed-font check ordering independently while retaining the mesh transport changes.
