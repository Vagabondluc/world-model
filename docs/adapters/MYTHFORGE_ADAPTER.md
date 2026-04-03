# Mythforge Adapter

Mythforge is the trunk donor. Its adapter contributes the canonical identity and world-ownership shape for the final app.

## What Is Copied

Copy the Mythforge material that defines:

- world identity
- entity identity
- schema binding
- event history
- projections
- relation handling
- asset attachment
- spatial attachment

## What Is Not Copied

Do not copy Mythforge-only surfaces that depend on the donor app shell, including:

- donor navigation layout
- donor overlays that are not canonical
- donor-only AI copilot surfaces
- donor-specific editor chrome

## Canonical Mapping

The adapter maps Mythforge concepts into:

- `WorldRecord`
- `EntityRecord`
- `SchemaBindingRecord`
- `EventEnvelope`
- `ProjectionRecord`
- `RelationRecord`
- `AssetRecord`
- `LocationAttachment`

## Final App Role

In the final app, Mythforge becomes the primary source of:

- world creation
- entity editing
- schema-aware authoring
- append-only history

The final app must still own the UI, but the canonical meaning of Mythforge data comes from `world-model`.
