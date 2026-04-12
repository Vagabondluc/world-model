# Mutation Testing Guide

This document provides comprehensive guidance on mutation testing for this React/TypeScript project using Stryker.

## Table of Contents

1. [What is Mutation Testing?](#what-is-mutation-testing)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Mutation Tests](#running-mutation-tests)
5. [Understanding Results](#understanding-results)
6. [Example: Weak vs Strong Tests](#example-weak-vs-strong-tests)
7. [Development Workflow](#development-workflow)
8. [CI Integration](#ci-integration)
9. [Best Practices](#best-practices)

---

## What is Mutation Testing?

Mutation testing evaluates the quality of your test suite by introducing small changes (mutations) to your code and checking if your tests detect them.

### Key Concepts

- **Mutant**: A small change to your code (e.g., `+` → `-`, `true` → `false`, removing code)
- **Killed**: A mutant that caused a test to fail (good - your tests caught the bug)
- **Survived**: A mutant that tests didn't detect (bad - your tests have blind spots)
- **Mutation Score**: Percentage of killed mutants (higher is better)

### Why Mutation Testing?

AI-generated tests often share the same blind spots as AI-generated code. Mutation testing reveals:

- Tests that only check types but not values
- Tests that pass regardless of implementation
- Missing edge case coverage
- Weak assertions that don't verify actual behavior

---

## Installation

The following packages are already installed in this project:

```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
```

> **Note**: The `@stryker-mutator/html-reporter` and `@stryker-mutator/typescript` packages are deprecated in Stryker 4+. The HTML reporter is now included with `@stryker-mutator/core`.

---

## Configuration

The Stryker configuration is in [`stryker.config.json`](../stryker.config.json):

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "testRunner": "vitest",
  "vitest": {
    "configFile": "vitest.config.ts",
    "related": false
  },
  "mutate": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.{test,spec}.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/vite-env.d.ts",
    "!src/test/**"
  ],
  "reporters": ["progress", "clear-text", "html"],
  "htmlReporter": {
    "fileName": "reports/mutation/mutation.html"
  },
  "coverageAnalysis": "off",
  "disableTypeChecks": "{src,test}/**/*.{ts,tsx}",
  "thresholds": {
    "high": 85,
    "low": 60,
    "break": 50
  }
}
```

### Key Configuration Options

| Option | Description |
|--------|-------------|
| `mutate` | Glob patterns for files to mutate (and exclude) |
| `testRunner` | Test runner to use (`vitest` for this project) |
| `reporters` | Output formats: `progress`, `clear-text`, `html` |
| `thresholds.high` | Score ≥ this: green status |
| `thresholds.low` | Score < this: red status |
| `thresholds.break` | Score < this: exit with error code |

---

## Running Mutation Tests

### Full Mutation Test

```bash
npm run mutation
```

This runs mutation testing against all source files defined in `mutate` config.

### Targeted Mutation Test

Run against specific files for faster feedback:

```bash
npm run mutation:demo
# or directly:
npx stryker run --mutate src/mutation-testing-demo/*.ts
```

### Single File

```bash
npx stryker run --mutate src/utils/format.ts
```

### Specific Test File

```bash
npx stryker run --mutate src/utils/format.ts --testFilter format.test.ts
```

---

## Understanding Results

### Console Output Example

```
INFO ProjectReader Found 1 of 4383 file(s) to be mutated.
INFO Instrumenter Instrumented 1 source file(s) with 9 mutant(s)
INFO DryRunExecutor Starting initial test run (vitest test runner)
INFO DryRunExecutor Initial test run succeeded. Ran 89 tests in 50 seconds

All tests
  mutation-testing-demo
    add.strong.test.ts
      ✓ add - STRONG tests correctly adds two positive numbers (killed 2)
      ✓ formatGreeting - STRONG tests formats greeting with exact output (killed 2)
      ✓ isPositive - STRONG tests returns true for positive numbers (killed 3)
      ✓ isPositive - STRONG tests returns false for zero (killed 2)
    add.weak.test.ts
      ~ add - WEAK tests returns a number (covered 2)
      ~ formatGreeting - WEAK tests returns a string (covered 2)
      ~ isPositive - WEAK tests returns a boolean (covered 5)

----------|------------------|----------|-----------|------------|----------|----------|
          | % Mutation score |          |           |            |          |          |
File      |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
----------|--------|---------|----------|-----------|------------|----------|----------|
All files | 100.00 |  100.00 |        9 |         0 |          0 |        0 |        0 |
 add.ts   | 100.00 |  100.00 |        9 |         0 |          0 |        0 |        0 |
----------|--------|---------|----------|-----------|------------|----------|----------|

INFO MutationTestReportHelper Final mutation score of 100.00 is greater than or equal to break threshold 50
INFO HtmlReporter Your report can be found at: file:///reports/mutation/mutation.html
INFO MutationTestExecutor Done in 1 minute and 14 seconds.
```

### HTML Report

After running, open `reports/mutation/mutation.html` for an interactive report showing:

- File-by-file mutation scores
- Exact locations of survived mutants
- Original vs mutated code
- Which tests ran against each mutant

### Interpreting Scores

| Score | Status | Action |
|-------|--------|--------|
| ≥ 85% | 🟢 Excellent | Tests are strong |
| 60-85% | 🟡 Acceptable | Some improvements needed |
| < 60% | 🔴 Poor | Significant test improvements required |
| < 50% | ❌ Failing | CI will fail (if `break: 50`) |

---

## Example: Weak vs Strong Tests

See the demo files in [`src/mutation-testing-demo/`](../src/mutation-testing-demo/):

### Source Code (`add.ts`)

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

### Weak Test (`add.weak.test.ts`)

```typescript
test("returns a number", () => {
  expect(typeof add(1, 2)).toBe("number");
});
```

**Problem**: This test only checks the return type. A mutation like `return a - b` or `return 42` would still pass!

### Strong Test (`add.strong.test.ts`)

```typescript
test("correctly adds two positive numbers", () => {
  expect(add(2, 3)).toBe(5);
});

test("correctly adds negative numbers", () => {
  expect(add(-1, -2)).toBe(-3);
});
```

**Result**: These tests will kill mutants that change the arithmetic behavior.

### Running the Demo

```bash
# Run with only weak tests - see mutants survive
npx stryker run --mutate src/mutation-testing-demo/add.ts --testFilter add.weak.test.ts

# Run with strong tests - see mutants killed
npx stryker run --mutate src/mutation-testing-demo/add.ts --testFilter add.strong.test.ts
```

---

## Development Workflow

### Recommended SPEC-Driven Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. SPEC: Write human test expectations                      │
│     - Define expected behavior                               │
│     - Document edge cases                                    │
│     - Specify assertion criteria                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. AI generates tests from spec                            │
│     - Use spec as context for AI                            │
│     - Generate initial test cases                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Developer reviews tests                                  │
│     - Check assertions are meaningful                       │
│     - Verify edge cases covered                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  4. AI implements code (if using AI for implementation)     │
│     - Implement to pass tests                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Run unit tests: npm test                                │
│     - Verify all tests pass                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  6. Run mutation testing: npm run mutation                  │
│     - Identify survived mutants                             │
│     - Examine weak test coverage                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  7. Strengthen tests                                        │
│     - Add specific assertions for survived mutants          │
│     - Add edge case tests                                   │
│     - Re-run mutation tests                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
                        Repeat until score ≥ threshold
```

### Local Development Tips

1. **Start small**: Run mutation tests on changed files only
   ```bash
   npx stryker run --mutate src/components/NewComponent.tsx
   ```

2. **Iterate quickly**: Use `--concurrency` to speed up
   ```bash
   npx stryker run --concurrency 8
   ```

3. **Debug specific mutants**: Use HTML report to identify issues

4. **Exclude irrelevant code**: Add exclusions to `stryker.config.json` for:
   - Type definitions
   - Pure data/constants
   - Generated code

---

## CI Integration

### GitHub Actions Example

```yaml
name: Mutation Testing

on:
  # Run on schedule (nightly)
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  
  # Run on main branch pushes
  push:
    branches: [main]
  
  # Optional: Run on PRs (can be slow)
  pull_request:
    branches: [main]

jobs:
  mutation:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run mutation tests
        run: npm run mutation
        
      - name: Upload mutation report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: mutation-report
          path: reports/mutation/
```

### PR Comment with Results

For PR integration, consider using `stryker-dashboard` or posting results as PR comments:

```yaml
- name: Comment PR with mutation score
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      // Parse mutation results and post as comment
```

### Where to Run Mutation Testing

| Environment | When | Scope |
|-------------|------|-------|
| **Local** | During development | Changed files only |
| **PR** | On pull requests | Changed files (optional - can be slow) |
| **Nightly** | Scheduled | Full codebase |
| **Pre-merge** | Before merging to main | Full codebase or changed modules |

---

## Best Practices

### DO ✅

1. **Focus on business logic**: Prioritize mutating core business logic over boilerplate
2. **Use specific assertions**: `expect(result).toBe(5)` not `expect(result).toBeDefined()`
3. **Test edge cases**: Zero, negative, null, empty string, etc.
4. **Run regularly**: Include in your development workflow
5. **Set realistic thresholds**: Start with lower thresholds and improve over time
6. **Review survived mutants**: Some may be false positives or irrelevant

### DON'T ❌

1. **Don't aim for 100%**: Some mutants are irrelevant (e.g., changing internal variable names)
2. **Don't test implementation details**: Focus on behavior, not how it's implemented
3. **Don't ignore timeout mutants**: They may indicate infinite loops
4. **Don't run full mutation tests on every commit**: Too slow for rapid iteration

### Common Anti-Patterns to Avoid

```typescript
// ❌ Weak: Only checks type
expect(typeof result).toBe('number');

// ❌ Weak: Only checks truthiness
expect(result).toBeTruthy();

// ❌ Weak: Only checks it doesn't throw
expect(() => fn()).not.toThrow();

// ❌ Weak: Vague match
expect(result).toContain('hello');

// ✅ Strong: Exact assertion
expect(result).toBe(42);

// ✅ Strong: Exact string match
expect(result).toBe('Hello, World!');

// ✅ Strong: Multiple specific assertions
expect(result.status).toBe(200);
expect(result.data.name).toBe('Alice');
```

---

## Troubleshooting

### Tests timeout

Increase timeout in `stryker.config.json`:
```json
{
  "timeoutMS": 90000
}
```

### Out of memory

Reduce concurrency:
```json
{
  "concurrency": 2
}
```

### Too many mutants

Exclude generated code or type definitions:
```json
{
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/generated/**"
  ]
}
```

### Vitest config not found

Ensure `vitest.config.ts` exists and is specified:
```json
{
  "vitest": {
    "configFile": "vitest.config.ts"
  }
}
```

---

## Resources

- [Stryker Documentation](https://stryker-mutator.io/docs/stryker-js/introduction/)
- [Stryker for Vitest](https://stryker-mutator.io/docs/stryker-js/vitest-runner)
- [Mutation Testing Patterns](https://stryker-mutator.io/docs/mutation-testing-elements/mutators)
