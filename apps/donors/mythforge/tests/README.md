Test harness for MythForge — quick reference

How to run

```bash
# Run all suites via vitest
npx vitest

# Run a specific suite via the helper
npx tsx scripts/run-tests.ts shadow-copy
npx tsx scripts/run-tests.ts git
npx tsx scripts/run-tests.ts schema
npx tsx scripts/run-tests.ts openui
```

Organization

- tests/utils: shared fixtures, mocks and helpers used across suites
- src/lib/*/__tests__: test suites grouped by feature (shadow-copy, git, schema, openui)

Adding new tests

- Place unit tests next to feature under src/lib/<feature>/__tests__
- Use relative imports to the shared utilities in tests/ (e.g. ../../../../tests/utils/fixtures)

Mock usage examples

- Use createMockFs / createMockGit from tests/utils/mocks.ts to simulate file system and git operations
- Keep each test self-contained; prefer to stub external calls with vitest's vi.fn()
