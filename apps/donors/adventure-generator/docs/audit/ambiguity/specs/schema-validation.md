# Ambiguity Report: Zod Schema Validation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## File Information
- **Path:** `docs/specs/schema-validation.md`
- **Last Modified:** Not available
- **Related Files:** `docs/specs/persistence.md`, `docs/specs/state-migration.md`

## Ambiguities Found

### 1. "Graceful fallback defaults" Implementation
- **Location:** Section 2, Line 8
- **Issue:** The goal states "Provide graceful fallback defaults when AI returns partial data" but doesn't specify what constitutes a "graceful fallback" or how defaults are determined (hardcoded values, user preferences, last known good state).
- **Impact:** Medium
- **Suggested Resolution:** Define fallback strategy (e.g., use default values for missing required fields, preserve partial data for optional fields, notify user of missing information).

### 2. "Single source of truth" Mechanism
- **Location:** Section 2, Line 9
- **Issue:** The goal states "Single source of truth for TypeScript types (inferred from Zod)" but doesn't specify how to handle cases where TypeScript types are manually defined vs. inferred from Zod, or how to ensure consistency.
- **Impact:** Medium
- **Suggested Resolution:** Specify whether TypeScript types should always be inferred from Zod, or if manual types are allowed, how to ensure they stay synchronized.

### 3. Validation Gates Timing
- **Location:** Addendum, Line 23
- **Issue:** The addendum mentions "Add validation gates at pipeline boundaries: pre-gen, post-gen, and post-stitch" but doesn't specify what happens when validation fails at each gate (stop pipeline, retry with modified prompt, continue with warnings).
- **Impact:** High
- **Suggested Resolution:** Define validation failure handling for each gate (pre-gen: stop and notify, post-gen: retry or continue with warning, post-stitch: log and offer manual review).

## Vague Requirements

### 1. "Eliminate `any` types" Scope
- **Location:** Section 2, Line 7
- **Issue:** The goal states "Eliminate `any` types in API responses" but doesn't specify if this applies to all API responses or only AI-generated responses, or how to handle legacy code that still uses `any`.
- **Impact:** Medium
- **Suggested Resolution:** Specify scope of `any` type elimination (all API responses, only AI responses, only new code) and migration strategy for existing `any` types.

### 2. Naming Convention Enforcement
- **Location:** Section 3, Line 13
- **Issue:** The spec states "Naming Convention: `[Entity]Schema` (e.g., `LocationSchema`, `NpcSchema`)" but doesn't specify how to enforce this convention or handle violations.
- **Impact:** Low
- **Suggested Resolution:** Specify enforcement mechanism (ESLint rule, code review checklist, automated tool) or if this is just a guideline without enforcement.

### 3. AI Helper Functionality
- **Location:** Section 3, Line 14
- **Issue:** The spec mentions "Create `utils/zodHelpers.ts` to convert Zod to standard JSON schema for `responseSchema` in Gemini API calls" but doesn't specify the conversion format or how to handle complex Zod types (unions, intersections, optional fields).
- **Impact:** Medium
- **Suggested Resolution:** Specify conversion requirements (handle all Zod types, produce valid JSON Schema Draft 7 format, handle edge cases like recursive types).

## Missing Requirements

### 1. Schema Versioning and Migration
- **Context:** The spec mentions defining schemas but doesn't address how to handle schema versioning when data structures change.
- **Impact:** High
- **Suggested Addition:** Specify schema versioning strategy (version numbers in schema names, migration scripts, backward compatibility requirements).

### 2. Error Handling for Validation Failures
- **Context:** The spec mentions validation but doesn't specify how to handle validation failures (user notification, logging, data quarantine, retry strategies).
- **Impact:** High
- **Suggested Addition:** Specify validation error handling (user-friendly error messages, logging for debugging, quarantine of invalid data, retry logic with modified input).

### 3. Performance Requirements for Validation
- **Context:** The spec focuses on correctness but doesn't address performance implications of validation, especially for large datasets or complex nested structures.
- **Impact:** Medium
- **Suggested Addition:** Specify performance targets (validation time per record, memory usage, optimization strategies for large datasets).

### 4. Schema Documentation
- **Context:** The spec mentions creating schemas but doesn't address documentation requirements for schemas (JSDoc comments, README files, examples).
- **Impact:** Medium
- **Suggested Addition:** Specify schema documentation requirements (inline comments, separate documentation files, usage examples).

### 5. Testing Requirements for Schemas
- **Context:** The spec focuses on implementation but doesn't address testing requirements for Zod schemas (unit tests, integration tests, test data coverage).
- **Impact:** High
- **Suggested Addition:** Specify testing requirements (unit tests for each schema, test coverage percentage, integration tests with real data).

## Inconsistencies

### 1. Schema Location Ambiguity
- **Conflict:** The spec states schemas should be in `/schemas/` but doesn't clarify if this refers to root-level `/schemas/` directory or `docs/schemas/` directory.
- **Locations:** Section 3, Line 12
- **Impact:** Low
- **Suggested Resolution:** Clarify schema location (root `/schemas/` for TypeScript schema files, `docs/schemas/` for JSON schema files, or consolidate to single location).

### 2. Migration Steps vs. Addendum
- **Conflict:** The main spec mentions migration steps but the addendum introduces new pipeline integration requirements that may affect migration strategy.
- **Locations:** Section 4 vs. Addendum
- **Impact:** Medium
- **Suggested Resolution:** Update migration steps to include pipeline integration requirements or clarify that addendum is additional scope.

## Undefined Terms

| Term | Context | Suggested Definition |
|------|---------|----------------------|
| "Runtime type safety" | Section 1, Line 3 | Type checking that occurs at runtime (during execution) rather than just at compile time, ensuring data conforms to expected shapes. |
| "API responses" | Section 2, Line 7 | Data returned from API calls, particularly from AI services like Gemini. |
| "Standard JSON schema" | Section 3, Line 14 | JSON Schema Draft 7 specification for describing JSON structure, used by AI services for structured output. |
| "Validation gates" | Addendum, Line 23 | Checkpoints in a pipeline where data is validated before proceeding to the next step. |
| "Link integrity checks" | Addendum, Line 24 | Validation that ensures all links between entities resolve to valid target IDs and correct types. |

## Unclear Success Criteria

| Requirement | Current Criteria | Suggested Acceptance Criteria |
|-------------|-------------------|-------------------------------|
| Eliminate `any` types | No `any` types in API responses | Zero `any` types in new code, all existing `any` types have migration path defined, and linter enforces no new `any` types. |
| Graceful fallback defaults | Fallback when AI returns partial data | All AI responses are validated, partial data uses sensible defaults, user is notified of fallbacks, and data remains usable. |
| Single source of truth | TypeScript types inferred from Zod | TypeScript types are generated from Zod schemas, manual type definitions are deprecated, and type consistency is enforced. |
| Validation gates | Validation at pipeline boundaries | Validation occurs at pre-gen, post-gen, and post-stitch stages, failures are handled appropriately, and pipeline can recover or stop gracefully. |

## Edge Cases Not Addressed

| Scenario | Impact | Suggested Handling |
|----------|--------|---------------------|
| AI returns completely invalid structure | High | Detect validation failure, log error, notify user, and offer retry with modified prompt or manual input. |
| Zod schema has circular reference | Medium | Handle circular references in validation, provide clear error message, and suggest schema restructuring. |
| Very large nested structures (>10 levels deep) | Medium | Optimize validation performance, implement depth limits, and provide clear error for excessive nesting. |
| Schema uses advanced Zod features (unions, intersections) | Medium | Ensure JSON schema conversion handles all Zod features, provide fallback for unsupported features, and document limitations. |
| Concurrent validation of same data | Medium | Implement caching or memoization to avoid redundant validation, ensure thread safety if applicable. |
| Schema version mismatch | High | Detect version difference, run migration script, notify user, and preserve backward compatibility where possible. |
| Validation performance degradation | Medium | Monitor validation time, implement optimization for hot paths, and provide performance metrics. |

## Implicit Dependencies

| Dependency | Dependent Feature | Impact |
|------------|-------------------|--------|
| Zod library | All schema validation | High - Entire validation system depends on Zod. |
| TypeScript inference | Section 2: Single source of truth | High - Type inference from Zod is a core requirement. |
| AI service integration | Section 3: AI Helper | High - JSON schema conversion is required for AI services. |
| Pipeline implementation | Addendum: Validation gates | High - Validation gates require pipeline infrastructure. |
| Link Registry | Addendum: Link integrity checks | High - Link validation requires Link Registry. |

## Missing Performance Requirements

| Feature | Missing Metric | Suggested Target |
|---------|----------------|------------------|
| Schema validation performance | Time to validate single record | <10ms for simple schema, <50ms for complex nested schema |
| JSON schema conversion | Time to convert Zod to JSON Schema | <100ms for typical schema |
| Bulk validation | Time to validate 1000 records | <1s for 1000 records of medium complexity |
| Memory usage | Maximum memory for validation | <100MB for validating 10,000 records |

## Error Handling Gaps

| Scenario | Current Specification | Suggested Error Handling |
|----------|----------------------|-------------------------|
| Zod validation fails | Not specified | Log validation error with details, show user-friendly message, quarantine invalid data, and offer retry or manual correction. |
| JSON schema conversion fails | Not specified | Log conversion error, show error details, provide fallback (manual schema definition), and notify user of limitation. |
| Circular reference detected | Not specified | Detect circular reference, show clear error indicating cycle, suggest schema restructuring, and prevent infinite loop. |
| Schema not found | Not specified | Show clear error indicating missing schema, provide list of available schemas, and guide user to correct reference. |
| Type inference fails | Not specified | Log inference error, show TypeScript compilation error, suggest manual type definition, and provide guidance. |

## Overall Assessment
- **Clarity Score:** 7/10
- **Completeness Score:** 5/10
- **Priority Issues:** 2

### Summary
The schema validation specification provides a clear vision for runtime type safety using Zod but lacks critical details around error handling, performance, and testing. The "graceful fallback defaults" concept needs specific implementation guidance. Missing requirements for schema versioning, migration, and comprehensive error handling are significant gaps. The validation gates in the addendum need clearer failure handling strategies.
