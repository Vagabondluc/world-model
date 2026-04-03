# Phase 2: Adapter Snapshots

## Objective

Copy the necessary donor files into frozen adapter snapshots and map them into canonical concepts.

## Dependencies

- Phase 0 complete
- Phase 1 complete
- adapter copy policy documented
- concept families and manifests available

## Subphases

### 2.1 Snapshot selection

Deliverables:

- list of required source files per donor
- list of explicitly excluded source files per donor
- selection rationale for each file group

Acceptance:

- every copied file has a reason for existing
- every excluded file has a reason for being excluded

### 2.2 Mythforge snapshot

Deliverables:

- copied trunk identity material
- copied entity material
- copied schema binding material
- copied event/history material
- copied relation/asset/location material

Acceptance:

- Mythforge snapshot covers trunk semantics only
- donor shell assumptions are excluded

### 2.3 Orbis snapshot

Deliverables:

- copied simulation profile material
- copied domain toggle material
- copied snapshot/event material
- copied domain config material

Acceptance:

- Orbis snapshot covers simulation semantics only
- standalone dashboard assumptions are excluded

### 2.4 Adventure snapshot

Deliverables:

- copied workflow/session material
- copied checkpoint/progress material
- copied generated-output material
- copied location/adventure linkage material

Acceptance:

- Adventure snapshot covers workflow semantics only
- unrelated navigation/tool surfaces are excluded

### 2.5 Snapshot manifests

Deliverables:

- manifest per donor
- source root declaration
- included path list
- excluded path list
- source kind declaration
- expected concept family declaration
- default promotion class declaration

Acceptance:

- snapshots are reproducible
- a future agent can re-run the snapshot copy from the manifest

### 2.6 Snapshot hashing and versioning

Deliverables:

- stable hash or fingerprint for each snapshot
- snapshot version marker
- change detection notes

Acceptance:

- the final app can detect when an adapter snapshot changed

## Harness

- snapshot completeness check
- exclusion-path check
- provenance check
- adapter mapping check
- snapshot fingerprint check

## Exit Criteria

- every donor has a frozen snapshot
- every copied file is traceable to a manifest entry
- every copied concept maps to a canonical target or reference-only classification

## Failure Cases

- snapshot depends on live donor code
- copied files are missing provenance
- excluded files are accidentally copied
- snapshot changes are not detectable
