# Spec stub — output-prog-replace-empty-lines

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Collapse or replace sequences of empty lines to ensure tidy exported content.

Inputs
- text: string
- options?: { collapseMultiple?: boolean; replacement?: string }

Outputs
- string

Behavior
- collapseMultiple=true will convert consecutive blank lines into a single blank line.
- replacement set to e.g., "\n" or a separator string.

Edge cases
- Preserve intentional spacing in preformatted blocks.

Mapping to UI
- Toggle in export settings / preview toolbar.

Tests
- Multiple blank lines -> single blank line when collapseMultiple=true.

Priority
- Low
