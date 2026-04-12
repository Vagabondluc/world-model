# Spec stub — ai_behavioral_experiments_hivemind_roles

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Provide a read-only API to query GM Team Roles and Player Types reference data for HiveMind scripts, returning role objects with abbreviation, name, description, preferences, contribution notes, and LLM config.

API / Inputs
- HiveMindRolesRequest {
  roleAbbreviation?: string,
  category: 'GM_Team_Roles' | 'Player_Types'
}

Outputs
- HiveMindRolesResponse {
  roles: Role[] | Role,
  metadata: { issuedAt: string; category: string; count: number }
}

Types
- `interface HiveMindRolesRequest { roleAbbreviation?: string; category: 'GM_Team_Roles' | 'Player_Types' }`
- `interface HiveMindRolesResponse { roles: Role[] | Role; metadata: { issuedAt: string; category: string; count: number } }`
- `interface Role { Abbreviation: string; Role_Name: string; Description: string; Want: string; Avoid: string; 'C&C': string; LLM_Config: { Temperature: string; Max_Tokens: string; Top_P: string } }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- If roleAbbreviation provided, return the single Role matching that abbreviation across both categories.
- If only category provided, return all roles in that category.
- If both provided, filter by abbreviation within category; return single Role or empty if not found.
- Include metadata with query category and result count.

Edge cases
- Invalid category → return ApiError 400.
- roleAbbreviation not found → return empty Role and 200 status with count 0.
- Empty request → return all roles (both categories) and flag in metadata.

Mapping to UI
- Role reference service used by other HiveMind scripts.
- UI can display role details and allow filtering/searching.
- Inspector dashboard shows query parameters and result counts.

Non-functional requirements
- Latency: query completes within 100 ms.
- Streaming: single-shot JSON response; no chunking.
- Accessibility: role fields labeled; metadata exposed with screen-reader-friendly labels.
- i18n: supports Unicode; role data is English-only.

Test cases
- Query by abbreviation returns single Role.
- Query by category returns array of Role.
- Invalid category returns ApiError 400.
- Non-existent abbreviation returns empty result with count 0.
- Empty request returns all roles and metadata flag.

Priority
- Low