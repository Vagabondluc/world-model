# Semantic Overlay Resolver Spec (v1)

## Purpose
Specify deterministic multi-layer semantic overrides (geology/hydrology/biome/structure/realm/gameplay) without mutating base authority fields directly.

## Layer Order (Fixed)
1. geology
2. hydrology
3. biome
4. structure
5. realm
6. gameplay

## Overlay Patch Modes
- `set`: replace provided fields
- `merge`: merge provided fields into existing semantic state
- `remove`: remove tags/flags or clear explicitly provided fields

## Resolver Contract
```ts
type ResolveRequest = {
  position: { x: number; y: number; z: number };
  baseSemantic: Record<string, unknown>;
  overlays: SemanticOverlayPatch[];
};
```

```ts
type ResolveResult = {
  semantic: Record<string, unknown>;
  trace?: Array<{ layer: string; patchId: string; fieldsChanged: string[] }>;
};
```

## Determinism Rules
- Layer order is fixed and non-configurable at runtime.
- Within layer, patch ordering must be deterministic (priority then stable id).
- Unset fields pass through unchanged.

## Conflict Rule
- Later layer can override only fields it explicitly sets.
- No implicit wiping of unrelated fields.

## Debug Requirement
Resolver should support optional trace output for field-level provenance.

## Cross-Doc Dependencies
- `docs/08-data-contracts.md`
- `docs/09-test-and-determinism-spec.md`
- `docs/10-edit-propagation-policy.md`
