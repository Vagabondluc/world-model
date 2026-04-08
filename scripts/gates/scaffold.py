"""Scaffold helper — creates minimal stubs for missing phase artefacts.

Called by run_harness.py --bootstrap before gate checks run.
A weak agent should be able to call bootstrap, fill in the REPLACE_ markers
that appear in every stub, and then re-run the harness to pass.
"""
from __future__ import annotations

import os
import textwrap
from typing import Callable, Dict, List

WM = "world-model"
_TEMPLATE_REF = f"{WM}/docs/templates/adapter-manifest-template.md"

# ── manifest stub ─────────────────────────────────────────────────────────────

_MANIFEST_STUB = textwrap.dedent("""\
    # Minimal stub created by run_harness.py --bootstrap
    # Fill in every REPLACE_ value before Phase 2 gates pass.
    # Full field reference: world-model/docs/templates/adapter-manifest-template.md
    id: {donor}
    name: "{donor_title}"
    version: "1.0.0"
    source:
      repo: "https://github.com/REPLACE_ORG/{donor}"
      commit: "REPLACE_SHA"
      path: "REPLACE_SOURCE_PATH"
    source_kind: "REPLACE_SOURCE_KIND"
    default_promotion_class: "REPLACE_PROMOTION_CLASS"
    snapshot:
      root: "adapters/{donor}/source-snapshot"
      fingerprint: "REPLACE_FINGERPRINT"
      file_count: 0
    included_paths:
      - "REPLACE_INCLUDE_PATH"
    excluded_paths:
      - "REPLACE_EXCLUDE_PATH"
    mappings:
      - "adapters/{donor}/mappings/concept-map.yaml"
    concepts:
      - "REPLACE_CONCEPT_1"
      - "REPLACE_CONCEPT_2"
    provenance:
      generated_at: "REPLACE_UTC_TIMESTAMP"
      generated_by: "REPLACE_GENERATOR"
""")

# ── migration plan stub ───────────────────────────────────────────────────────

_MIGRATION_PLAN_STUB = textwrap.dedent("""\
    # Migration Plan
    <!-- Auto-generated stub. Fill in all sections before Phase 4 gates pass. -->

    ## Overview
    One-time migration from donor repo snapshots to canonical bundles.

    ## Canonical bundles as durable state
    All data lands in canonical bundles after migration.
    Donor repos are not required after this point.

    ## Rollback / non-destructive policy
    Failed migration is non-destructive.
    Partial writes are rolled back or quarantined.
    Errors include donor provenance context.

    ## Audit and provenance
    Every imported bundle retains provenance.
    Every imported bundle can be audited later.
""")

# ── release criteria stub ─────────────────────────────────────────────────────

_RELEASE_CRITERIA_STUB = textwrap.dedent("""\
    # Release Criteria
    <!-- Auto-generated stub. Fill in all criteria before Phase 5/6 gates pass. -->

    ## Shipped UI
    - The public app uses the World, Story, and Schema taxonomy.
    - Legacy guided, studio, and architect routes redirect to public routes.

    ## Quality gates
    - No donor repo required at runtime.
    - All adapter manifests valid.
    - All regression, performance, and accessibility checks pass.
    - Release criteria reviewed and signed off.

    ## Verification commands
    - cd world-model/apps/unified-app && npm run verify
    - python world-model/scripts/check_phase_2_snapshots.py
    - python world-model/scripts/check_phase_4_migration.py
    - python world-model/scripts/check_phase_6_release.py
    - python world-model/scripts/run_harness.py --phase 6
    - python world-model/scripts/run_harness.py --phase 6 --cleanup --cleanup-scope safe
""")

_DONOR_UI_STUB = textwrap.dedent("""\
    # Donor UI Audit
    <!-- Auto-generated stub. Fill in donor classes, methodologies, and basis values before Phase 7 passes. -->

    | Donor | Class | Methodology | Basis | Notes |
    |---|---|---|---|---|
    | Mythforge | app donor | behavioral capture | captured | REPLACE |
    | Adventure Generator | fragment donor | intent reconstruction | reconstructed | REPLACE |
    | Orbis | semantic-only donor | designed intent authoring | designed | REPLACE |
""")

_UNIFIED_PRODUCT_DESIGN_STUB = textwrap.dedent("""\
    # Unified Product Design
    <!-- Auto-generated stub. Fill in the product/donor boundary before Phase 8 passes. -->

    ## Product surface
    - `/` is the unified landing page and is driven by canonical bundle state.
    - `/world`, `/story`, and `/schema` are the public product surfaces.

    ## Donor boundary
    - `src/product/surface-contract.ts` is the code-side product/donor boundary.
    - Donor-faithful rehost surfaces preserve donor language and interaction order.
    - Shared concept lens switching is read-only and does not mutate canonical state.
""")

_CROSS_DONOR_MATRIX_STUB = textwrap.dedent("""\
    # Cross-Donor Integration Matrix
    <!-- Auto-generated stub. Fill in the shared concept families before Phase 8 passes. -->

    | Family | Basis | Canonical key | Default lens | Notes |
    |---|---|---|---|---|
    | biome-location | captured | entity:harbor-biome | Mythforge | REPLACE |
    | entities | captured | entity:harbor-warden | Mythforge | REPLACE |
    | workflows | reconstructed | workflow:sample-adventure | Adventure Generator | REPLACE |
    | simulation-events | designed | event:session-advanced | Orbis | REPLACE |
    | projections | designed | projection:harbor-warden | Orbis | REPLACE |
    | attachments | captured | world:sample | Mythforge | REPLACE |

    The lens switch smoke test is required and must remain read-only.
""")

# ── helpers ───────────────────────────────────────────────────────────────────

_DONORS = ["mythforge", "orbis", "adventure-generator"]


def _write(path: str, content: str) -> str:
    """Write content to path only if it does not already exist."""
    if os.path.exists(path):
        return f"  EXISTS   {path}"
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    return f"  CREATED  {path}"


# ── per-phase scaffold functions ──────────────────────────────────────────────

def scaffold_phase_2() -> List[str]:
    """Create missing donor manifest stubs under world-model/adapters/."""
    results = []
    for donor in _DONORS:
        path = f"{WM}/adapters/{donor}/manifest.yaml"
        title = donor.replace("-", " ").title()
        content = _MANIFEST_STUB.format(donor=donor, donor_title=title)
        results.append(_write(path, content))
    return results


def scaffold_phase_4() -> List[str]:
    """Ensure migration plan doc stub exists."""
    return [_write(f"{WM}/docs/migration/MIGRATION_PLAN.md", _MIGRATION_PLAN_STUB)]


def scaffold_phase_5() -> List[str]:
    """Ensure release criteria doc stub exists."""
    return [_write(f"{WM}/docs/release/RELEASE_CRITERIA.md", _RELEASE_CRITERIA_STUB)]


def scaffold_phase_7() -> List[str]:
    """Ensure donor-ui audit stubs exist."""
    return [
        _write(f"{WM}/docs/testing/DONOR_UI_AUDIT.md", _DONOR_UI_STUB),
        _write(f"{WM}/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md", "# Donor Characterization Matrix\n"),
        _write(f"{WM}/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md", "# Donor UI Conformance Matrix\n"),
        _write(f"{WM}/tests/characterization/baselines.yaml", "donors:\n"),
        _write(f"{WM}/tests/conformance/waivers.yaml", "waivers:\n"),
    ]


def scaffold_phase_8() -> List[str]:
    """Ensure unified product design and cross-donor integration stubs exist."""
    return [
        _write(f"{WM}/docs/architecture/UNIFIED_PRODUCT_DESIGN.md", _UNIFIED_PRODUCT_DESIGN_STUB),
        _write(f"{WM}/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md", _CROSS_DONOR_MATRIX_STUB),
    ]


# Map phase → scaffold fn
SCAFFOLDS: Dict[int, Callable[[], List[str]]] = {
    2: scaffold_phase_2,
    4: scaffold_phase_4,
    5: scaffold_phase_5,
    7: scaffold_phase_7,
    8: scaffold_phase_8,
}


def run_bootstrap(up_to_phase: int) -> None:
    """Run all scaffold functions for phases 0 through up_to_phase."""
    print("\n[BOOTSTRAP] Creating missing stubs...\n")
    ran_any = False
    for phase in range(up_to_phase + 1):
        fn = SCAFFOLDS.get(phase)
        if fn is None:
            continue
        ran_any = True
        print(f"  Phase {phase}:")
        for line in fn():
            print(f"    {line}")
    if not ran_any:
        print(f"  (no scaffold steps defined for phases 0..{up_to_phase})")
    print("\n[BOOTSTRAP] Done. Continuing to gate checks...\n")
