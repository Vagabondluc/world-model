# Folder Mapping: Roadmap Phases -> Target Paths

All paths relative to `world-model/`.

```text
world-model/
├── apps/
│   └── unified-app/           # Final application
├── adapters/
│   ├── mythforge/
│   │   ├── manifest.yaml
│   │   ├── source-snapshot/
│   │   └── mappings/
│   ├── orbis/
│   │   ├── manifest.yaml
│   │   ├── source-snapshot/
│   │   └── mappings/
│   └── adventure-generator/
│       ├── manifest.yaml
│       ├── source-snapshot/
│       └── mappings/
├── crates/
│   ├── world-model-core/      # Canonical record types
│   ├── world-model-adapters/  # Adapter implementations
│   ├── world-model-schema/    # Schema export tools
│   ├── world-model-specs/     # Spec promotion tools
│   └── world-model-driver/    # CLI driver
├── contracts/
│   ├── json-schema/           # Canonical JSON schemas
│   └── promoted-schema/       # Promoted concept schemas
├── docs/
│   ├── roadmap/               # Phase documentation
│   ├── adapters/              # Adapter documentation
│   ├── adr/                   # Architecture decision records
│   └── ...
├── fixtures/                  # Test fixtures
├── scripts/                   # Utility scripts
├── snapshots/                 # Example adapter snapshots
└── spec-sources/              # Donor TOML configs
```

---

## Phase-by-Phase File Mapping

### Phase 0: Boundaries
Files to Create:
- `world-model/docs/adr/0001-ownership-boundaries.md`
- `world-model/docs/adr/0002-adapter-contracts.md`

Files to Edit:
- `world-model/docs/roadmap/phase-0-boundaries.md` (mark complete)

Files to Avoid:
- Donor repos (`mythforge/`, `to be merged/`)

Dependencies:
- None (foundational phase)

---

### Phase 1: Canonical Model
Files to Create:
- `world-model/crates/world-model-core/src/records.rs` (if missing)
- `world-model/contracts/json-schema/*.schema.json` (any missing canonical schemas)

Files to Edit:
- `world-model/crates/world-model-core/src/lib.rs`
- `world-model/contracts/json-schema/VERSION.txt`

Files to Avoid:
- `world-model/crates/world-model-adapters/` (Phase 2 scope)

Dependencies:
- Phase 0 complete

---

### Phase 2: Adapter Snapshots
Files to Create:
- `world-model/adapters/mythforge/manifest.yaml`
- `world-model/adapters/mythforge/source-snapshot/*` (copied files)
- `world-model/adapters/mythforge/mappings/concept-map.yaml`
- `world-model/adapters/orbis/manifest.yaml`
- `world-model/adapters/orbis/source-snapshot/*`
- `world-model/adapters/orbis/mappings/concept-map.yaml`
- `world-model/adapters/adventure-generator/manifest.yaml`
- `world-model/adapters/adventure-generator/source-snapshot/*`
- `world-model/adapters/adventure-generator/mappings/concept-map.yaml`

Files to Edit:
- `world-model/crates/world-model-adapters/src/lib.rs`

Files to Avoid:
- Donor repos (copy-only, never edit)
- `world-model/apps/unified-app/` (Phase 3)

Dependencies:
- Phase 1 complete
- Access to donor source files

---

### Phase 3: Final App Scaffold
Files to Create:
- `world-model/apps/unified-app/package.json`
- `world-model/apps/unified-app/src/App.tsx`
- `world-model/apps/unified-app/src/components/Shell.tsx`
- `world-model/apps/unified-app/src/components/Navigation.tsx`
- `world-model/apps/unified-app/src/components/ContextBar.tsx`
- `world-model/apps/unified-app/src/components/Workspace.tsx`
- `world-model/apps/unified-app/src/components/Inspector.tsx`
- `world-model/apps/unified-app/src/stores/canonicalStore.ts`

Files to Edit:
- None (scaffold only)

Files to Avoid:
- `world-model/adapters/` (no changes)
- Donor repos

Dependencies:
- Phase 2 complete

---

### Phase 4: Import and Migration
Files to Create:
- `world-model/apps/unified-app/src/lib/adapterReader.ts`
- `world-model/apps/unified-app/src/lib/conceptTranslator.ts`
- `world-model/apps/unified-app/src/lib/migrationRunner.ts`
- `world-model/apps/unified-app/src/components/ImportWizard.tsx`

Files to Edit:
- `world-model/apps/unified-app/src/stores/canonicalStore.ts`

Files to Avoid:
- `world-model/adapters/*/source-snapshot/` (read-only)
- Donor repos

Dependencies:
- Phase 3 complete
- Adapter snapshots ready

---

### Phase 5: MVP Flows
Files to Create:
- `world-model/apps/unified-app/src/modes/guided/GuidedMode.tsx`
- `world-model/apps/unified-app/src/modes/guided/Wizard.tsx`
- `world-model/apps/unified-app/src/modes/studio/StudioMode.tsx`
- `world-model/apps/unified-app/src/modes/studio/EntityEditor.tsx`
- `world-model/apps/unified-app/src/modes/architect/ArchitectMode.tsx`
- `world-model/apps/unified-app/src/modes/architect/SchemaInspector.tsx`

Files to Edit:
- `world-model/apps/unified-app/src/App.tsx`
- `world-model/apps/unified-app/src/components/Shell.tsx`

Files to Avoid:
- `world-model/contracts/` (canonical model frozen)
- `world-model/adapters/*/source-snapshot/`

Dependencies:
- Phase 4 complete

---

### Phase 6: Hardening and Release
Files to Create:
- `world-model/apps/unified-app/tests/e2e/*.test.ts`
- `world-model/apps/unified-app/docs/user-guide.md`
- `world-model/CHANGELOG.md`

Files to Edit:
- `world-model/apps/unified-app/package.json` (version bump)
- `world-model/docs/release/RELEASE_CRITERIA.md` (mark complete)

Files to Avoid:
- Canonical model changes (frozen)
- Adapter snapshot changes (frozen)

Dependencies:
- Phase 5 complete
- All tests passing

