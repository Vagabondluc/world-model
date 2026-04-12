# Spec stub — exportations-html-template

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Describe how to inject generated content into the HTML export template and which placeholders are supported.

Inputs
- content: string (HTML or preformatted text)
- metadata: { title?: string; author?: string }

Outputs
- string (ready-to-serve HTML)

Behavior
- Support placeholder tokens for title, body, and styles.
- Allow optional injection of CSS tokens or Tailwind preflight.

Edge cases
- Unsafe HTML content must be sanitized or flagged.

Mapping to UI
- Export modal with format choices; preview rendered HTML.

Tests
- Render sample content and validate placeholders are replaced.

Priority
- High
