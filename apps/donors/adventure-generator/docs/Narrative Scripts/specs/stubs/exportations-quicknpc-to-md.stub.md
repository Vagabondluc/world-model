# Spec stub — exportations-quicknpc-to-md

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Define conversion rules from QuickNPC outputs to Markdown for authoring and sharing.

Inputs
- quicknpc_text: string

Outputs
- markdown: string

Behavior
- Map fields (name, description, stats) to Markdown sections.
- Normalize formatting for readability.

Edge cases
- Missing fields should be omitted gracefully.

Mapping to UI
- One-click export from generator preview.

Tests
- Template examples convert cleanly into Markdown.

Priority
- Medium
