# Spec stub — exportations-template-importfoundry

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Define JSON schema mapping to produce Foundry-compatible import files from generator output.

Inputs
- npc_or_scene: object or text

Outputs
- JSON object conforming to Foundry import expectations

Behavior
- Validate fields, map to schemas, include optional image references.

Edge cases
- Missing schema fields cause a clear validation error with hints.

Mapping to UI
- Export format dropdown -> "Foundry JSON"

Tests
- Sample NPC -> valid Foundry JSON that imports successfully.

Priority
- High
