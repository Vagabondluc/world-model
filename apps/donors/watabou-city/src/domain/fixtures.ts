// @ts-nocheck
export type ReleaseProfileName = 'baseline' | 'strict' | 'release';

export interface FixtureRecord {
  fixture_id: string;
  seed: number;
  size: number;
  profile_set: ReleaseProfileName[];
  tags: string[];
}

export interface FixtureRegistryCheck {
  valid: boolean;
  errors: string[];
}

export const CANONICAL_FIXTURES: FixtureRecord[] = [
  { fixture_id: 'fx-s-01', seed: 120341, size: 8, profile_set: ['baseline', 'strict', 'release'], tags: ['small', 'inland', 'low-river'] },
  { fixture_id: 'fx-s-02', seed: 882117, size: 12, profile_set: ['baseline', 'strict', 'release'], tags: ['small', 'coastal', 'gate-heavy'] },
  { fixture_id: 'fx-s-03', seed: 3345091, size: 14, profile_set: ['baseline', 'strict', 'release'], tags: ['small', 'river-bend', 'dense'] },
  { fixture_id: 'fx-m-01', seed: 50217, size: 16, profile_set: ['baseline', 'strict', 'release'], tags: ['medium', 'inland', 'balanced'] },
  { fixture_id: 'fx-m-02', seed: 1900703, size: 18, profile_set: ['baseline', 'strict', 'release'], tags: ['medium', 'coastal', 'district-fragmented'] },
  { fixture_id: 'fx-m-03', seed: 4400121, size: 22, profile_set: ['baseline', 'strict', 'release'], tags: ['medium', 'river-crossing', 'arterial'] },
  { fixture_id: 'fx-m-04', seed: 7788123, size: 26, profile_set: ['baseline', 'strict', 'release'], tags: ['medium', 'peri-urban', 'rural-mix'] },
  { fixture_id: 'fx-l-01', seed: 2222221, size: 28, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'inland', 'multi-gate'] },
  { fixture_id: 'fx-l-02', seed: 9800017, size: 32, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'coastal', 'high-density'] },
  { fixture_id: 'fx-l-02a', seed: 9800029, size: 32, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'river-crossing', 'dense-core', 'stress'] },
  { fixture_id: 'fx-l-03', seed: 3141592, size: 36, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'river-delta', 'rural-band'] },
  { fixture_id: 'fx-l-03a', seed: 3141607, size: 36, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'river-crossing', 'high-density', 'stress'] },
  { fixture_id: 'fx-l-04', seed: 1234567, size: 40, profile_set: ['baseline', 'strict', 'release'], tags: ['large', 'mixed-terrain', 'stress'] },
];

// Focused fixture subset for goal-oriented visual tuning and regression checks.
export const GOAL_VISUAL_GOLDEN_FIXTURE_IDS = ['fx-m-03', 'fx-l-02a', 'fx-l-04'] as const;

export function getGoalVisualFixtures(): FixtureRecord[] {
  const idSet = new Set<string>(GOAL_VISUAL_GOLDEN_FIXTURE_IDS);
  return CANONICAL_FIXTURES.filter((f) => idSet.has(f.fixture_id)).map((f) => ({
    ...f,
    tags: [...f.tags, 'goal-golden'],
    profile_set: [...f.profile_set],
  }));
}

export function getCanonicalFixtures(): FixtureRecord[] {
  return CANONICAL_FIXTURES.map((f) => ({ ...f, tags: [...f.tags], profile_set: [...f.profile_set] }));
}

export function getFixtureById(fixtureId: string): FixtureRecord | undefined {
  return CANONICAL_FIXTURES.find((f) => f.fixture_id === fixtureId);
}

function countByTier(fixtures: FixtureRecord[]) {
  const counts = { small: 0, medium: 0, large: 0 };
  for (const fixture of fixtures) {
    if (fixture.size >= 6 && fixture.size <= 14) counts.small++;
    else if (fixture.size >= 15 && fixture.size <= 26) counts.medium++;
    else if (fixture.size >= 27 && fixture.size <= 40) counts.large++;
  }
  return counts;
}

export function validateFixtureRegistry(fixtures: FixtureRecord[]): FixtureRegistryCheck {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const fixture of fixtures) {
    if (ids.has(fixture.fixture_id)) errors.push(`Duplicate fixture_id: ${fixture.fixture_id}`);
    ids.add(fixture.fixture_id);

    if (!Number.isInteger(fixture.seed) || fixture.seed < 0) {
      errors.push(`Invalid seed for ${fixture.fixture_id}`);
    }
    if (!Number.isInteger(fixture.size) || fixture.size < 6 || fixture.size > 40) {
      errors.push(`Invalid size for ${fixture.fixture_id}`);
    }
  }

  const tiers = countByTier(fixtures);
  if (tiers.small < 3) errors.push('Need at least 3 small fixtures');
  if (tiers.medium < 3) errors.push('Need at least 3 medium fixtures');
  if (tiers.large < 3) errors.push('Need at least 3 large fixtures');

  const withTag = (predicate: (tag: string) => boolean) =>
    fixtures.filter((f) => f.tags.some((t) => predicate(t))).length;
  if (withTag((t) => t.includes('river')) < 2) errors.push('Need at least 2 river fixtures');
  if (withTag((t) => t.includes('coastal')) < 2) errors.push('Need at least 2 coastal fixtures');
  if (withTag((t) => t.includes('high-density') || t.includes('dense')) < 2) {
    errors.push('Need at least 2 high-density fixtures');
  }
  if (withTag((t) => t.includes('rural')) < 2) errors.push('Need at least 2 rural-dominant fixtures');

  return { valid: errors.length === 0, errors };
}

export function seedsAreImmutable(previous: FixtureRecord[], next: FixtureRecord[]): boolean {
  const previousById = new Map(previous.map((f) => [f.fixture_id, f.seed]));
  for (const fixture of next) {
    const prior = previousById.get(fixture.fixture_id);
    if (prior !== undefined && prior !== fixture.seed) return false;
  }
  return true;
}
