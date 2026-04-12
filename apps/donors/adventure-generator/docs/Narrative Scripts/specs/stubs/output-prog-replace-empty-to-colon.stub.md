# Spec stub — output-prog-replace-empty-to-colon

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Convert empty-line list formats into colon-separated key:value pairs to support structured exports.

Inputs
- text: string
- options?: { keyHint?: string }

Outputs
- string (converted list)

Behavior
- Detect list-like lines and insert colons where appropriate, preserving content indentation.

Edge cases
- Lines that contain punctuation that looks like the separator should be left unchanged if ambiguous.

Mapping to UI
- Option in conversion/export settings.

Tests
- Example list input -> expected colon-paired output.

Priority
- Low
