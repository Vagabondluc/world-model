# Spec stub — output-prog-markdown-subtitle

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Normalize subtitle and heading levels within Markdown outputs, optionally auto-generating a subtitle block.

Inputs
- markdown: string
- options?: { levelTransform?: number; generateSubtitle?: boolean }

Outputs
- markdown: string

Behavior
- Adjust heading levels consistently across document; insert subtitle under top-level title when enabled.

Edge cases
- Code blocks with Markdown-like lines should be ignored.

Mapping to UI
- Preview toolbar action: "Normalize headings".

Tests
- Heading level adjustments verified across nested headings.

Priority
- Low
