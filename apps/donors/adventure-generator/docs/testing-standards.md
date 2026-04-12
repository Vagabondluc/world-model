# Testing Standards

This document captures the testing standards adopted to prevent future test failures and to keep tests deterministic, fast, and type-safe.

## Principles

- Tests must be deterministic: avoid real network calls, random seeds, or time-based flakiness.
- Prefer fast, focused unit tests for logic and integration/e2e tests for full-stack behavior.
- Use type-safe factories and validation to keep mocks aligned with runtime types.

## Guidelines

### Use fake timers for retry/timeout tests

When testing retry logic, timeouts or debounced behavior, use fake timers so tests run deterministically and quickly.

Example (Vitest / Jest-style):

```ts
// vitest
import { vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

it('retries 3 times on transient error', async () => {
  const fn = vi.fn()
  // exercise code that schedules retries via setTimeout
  // advance timers to trigger retries
  vi.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalledTimes(3)
})
```

### CI guards for performance-sensitive tests

Mark long-running or flaky tests to skip on CI. Prefer a helper like `it.skipIf(process.env.CI)` or use a test helper that checks an environment variable.

```ts
// example helper
function skipIfCI(title: string, fn: any) {
  const testFn = process.env.CI ? it.skip : it
  testFn(title, fn)
}

// usage
skipIfCI('heavy integration scenario', async () => { /* ... */ })
```

### Proper async cleanup patterns

Always await cleanup and unmount operations and prefer explicit teardown to avoid cross-test pollution.

```ts
import { cleanup } from '@testing-library/react'

afterEach(async () => {
  await cleanup()
  // clear mocks, restore timers
  vi.restoreAllMocks()
})
```

Avoid leaving unresolved promises or timers between tests.

### Integer arithmetic for financial calculations

Avoid floating-point rounding issues for money. Use integers (cents) or a dedicated decimal library.

```ts
// prefer cents (integer) for currency math
const priceCents = 1999 // $19.99
const totalCents = quantity * priceCents
```

### Type-safe mock factories vs unsafe casts

Prefer factories that guarantee returned shapes match TypeScript types rather than casting with `as any`.

```ts
// recommended: typed factory
function makeUser(overrides?: Partial<User>): User {
  return {
    id: 'user_1',
    name: 'Test',
    email: 'test@example.com',
    ...overrides,
  }
}

// avoid: const user = { ... } as unknown as User
```

Consider using Zod to validate AI-driven outputs in tests to prevent schema drift.

### Deterministic test design

- Seed RNGs (use a seeded RNG helper) for any stochastic components.
- Avoid tests that depend on wall-clock time or machine performance.
- Replace external services with deterministic fakes or in-memory implementations.

## Pre-commit hooks and CI checks

This repository did not contain an existing `.husky/` pre-commit hook or `lint-staged` configuration at the time of this change. Adopt one of the following recommended options to ensure type safety and tests pass before commits.

Option A — Husky + lint-staged (recommended):

1. Install dev deps:

```bash
# npm
npm install --save-dev husky lint-staged
# or pnpm
pnpm add -D husky lint-staged
```

2. Add `package.json` snippets:

```json
"husky": {
  "hooks": {
    "pre-commit": "sh .husky/pre-commit"
  }
},
"lint-staged": {
  "{src,python-backend}/**/*.{ts,tsx,js,jsx}": [
    "pnpm -s run typecheck",
    "pnpm -s test -- --changed"
  ]
}
```

3. Example `.husky/pre-commit`:

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run TypeScript typecheck first
pnpm -s run typecheck || exit 1

# Run tests affected by staged changes
pnpm -s test -- --changed || exit 1
```

Notes:
- `pnpm -s test -- --changed` passes `--changed` to Vitest to run tests related to changed files; if your test runner does not support `--changed`, replace with an appropriate command (e.g. a custom script that maps staged files to tests).
- On Windows, Husky runs in Git's shell; ensure shell tooling is available or adapt the scripts to PowerShell if required.

Option B — Lightweight pre-commit script (no Husky):

Add a `pre-commit` script to `package.json` that developers can run locally (less automatic):

```json
"scripts": {
  "pre-commit": "pnpm -s run typecheck && pnpm -s test -- --changed"
}
```

Then developers run `pnpm run pre-commit` before committing, or add a Git hook manually.

## CI recommendations

- Run `pnpm -s run typecheck` and full test suites in CI as gating checks.
- Consider running performance or integration tests in a separate workflow that can be retried independently.

## References

- Use Zod for runtime validation: https://github.com/colinhacks/zod
- Vitest docs: https://vitest.dev
- Husky docs: https://typicode.github.io/husky


Last updated: 2026-03-09
