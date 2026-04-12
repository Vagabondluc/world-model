# External Dependency Map

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

All external dependencies must be recorded here. Only `esm.sh` is permitted for user-level imports.

| Package | Version | Source | Rationale |
| :--- | :--- | :--- | :--- |
| `react` | ^19.1.1 | `esm.sh` | Core framework. |
| `react-dom` | ^19.1.1 | `esm.sh` | DOM rendering. |
| `@google/genai` | ^1.14.0 | `esm.sh` | Google Gemini API SDK. |
| `marked` | ^13.0.2 | `esm.sh` | Markdown rendering for AI outputs. |
| `zustand` | 4.5.2 | `esm.sh` | Global state management (DEC-001). |
| `zod` | 3.23.8 | `esm.sh` | Runtime schema validation (DEC-002). |
| `dexie` | 4.0.8 | `esm.sh` | Client-side persistence (IndexedDB wrapper) (DEC-003). |
| `dompurify` | ^3.1.6 | `esm.sh` | HTML sanitization to prevent XSS from markdown rendering. |

## Version Management
- Prefer pinned versions for core runtime dependencies.
- Update versions via a dedicated maintenance PR with a changelog entry.
- Verify upgrades with `pnpm typecheck` and the critical-path test suite.

## Security Considerations
- All third-party browser dependencies must originate from trusted CDNs.
- Sanitize all HTML/markdown outputs before rendering.
- Review API clients for secret handling; never commit API keys.
