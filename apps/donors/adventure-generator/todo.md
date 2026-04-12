Ah – I misunderstood earlier. your repository is a **React/TypeScript** codebase with **vitest** for tests, not Python.  
Mutation‑testing in that world is handled by a completely different tool (`mutmut` is Python‑only), so the prior instructions weren’t appropriate.

Below is a **React‑specific mutation‑testing plan** that:

* works with your existing vitest suite
* mutates only application code under src
* ignores all test directories
* aims for a **minimum 80 % mutation score**
* includes an example showing a weak JSX test and how a mutant survives
* plugs into both local and CI workflows

---

## 1. Install & configure mutation testing

```bash
# install stryker and the vitest/jest runner
npm install --save-dev @stryker-mutator/core @stryker-mutator/vite-runner @stryker-mutator/typescript

# (or with pnpm/yarn as appropriate)
```

The core package drives the mutations; the vite‑runner runs your vitest suite against each mutation.  
Since you already use TypeScript, the `typescript` plugin tells Stryker how to compile.

---

## 2. stryker configuration

Create `stryker.conf.js` in your repo root:

```js
module.exports = {
  mutate: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.d.ts"
  ],
  mutator: "typescript",
  packageManager: "npm",
  testRunner: "vite",               // runs vitest via vite
  reporters: ["html", "clear-text"],
  coverageAnalysis: "off",          // vitest already reports coverage
  tsconfigFile: "tsconfig.json",
  jest: {                           // vite runner still uses jest-style options
    project: "tsconfig.json"
  },
  vite: {
    configFile: "vite.config.ts"
  },
  ignorePatterns: [
    "tests/**",                     // do not mutate tests
    "src/**/*.spec.tsx",            // or any test file pattern
    "src/**/*.test.tsx"
  ],
  thresholds: {                     // enforce an 80% score
    high: 80,                       // success ≥80
    low: 60,                        // warning below 60
    break: 80                       // fail CI if <80
  },
  timeoutMS: 600000                 // allow plenty of time
};
```

You can tweak `mutate` to restrict to particular packages, and you may add `filesToMutate` if you wish.

---

## 3. Recommended directory layout

```
my-react-app/
├── src/
│   ├── components/
│   │   └── Greeting.tsx
│   ├── utils/
│   │   └── math.ts
│   └── index.tsx
├── tests/                     # optional separate test folder
│   └── components/
│       └── Greeting.spec.tsx
├── vitest.config.ts
├── stryker.conf.js
├── package.json
└── tsconfig.json
```

Stryker will mutate the `.ts`/`.tsx` files under src only; tests under tests or matching `*.spec.tsx` are excluded.

---

## 4. Run mutation testing

```bash
# run a full mutation analysis
npx stryker run

# show live results in the terminal, HTML report is generated at `reports/mutation/html`

# rerun only survivors (use cache)
npx stryker run --mutant-filter survived

# reset the cache (start over)
npx stryker run --clean
```

In CI, simply invoke `npx stryker run` and fail the job if the exit code is non‑zero (Stryker returns a non‑zero code when the mutation score is below `thresholds.break`).

---

## 5. Example demonstrating a weak test

```ts
// src/utils/math.ts
export function add(a: number, b: number) {
  return a + b;
}
```

```tsx
// tests/utils/math.test.ts
import { add } from "../../src/utils/math";

test("add positive numbers", () => {
  expect(add(1, 2)).toBe(3);
});
```

Run vitest → passes.

Run Stryker:

```
$ npx stryker run
13 mutants generated
  12 killed
  1 survived

[Survivors]
  math.ts:3  -- replaced `+` with `-`
```

Mutation `math.ts:3` survives because the test never exercises the case where subtraction would show.  

Improve the test:

```ts
test("add various numbers", () => {
  expect(add(1, 2)).toBe(3);
  expect(add(-1, 1)).toBe(0);
  expect(add(0, 0)).toBe(0);
});
```

Re‑run `npx stryker run`:

```
13 mutants generated
13 killed    ✅ mutation score 100 %
```

Stryker’s HTML report now shows every mutant was detected.  

---

## 6. Recommended workflow integration

1. **SPEC** – write a human expectation or story.
2. **AI TESTS** – ask the assistant to scaffold React/vitest tests from the spec.
3. **AI CODE** – generate component/util implementation.
4. **pytest/vitest** – run `npm test` until green.
5. **MUTATION** – run `npx stryker run`.
6. Inspect survivors; **strengthen tests** until the mutation score ≥ 80 %.
7. Commit code + updated tests → push → CI runs Stryker.

Repeat steps 4‑6 whenever adding features or refactoring.

---

## 7. Interpreting results

* **Killed mutants** – your tests caught the injected fault.
* **Survived mutants** – code was modified but tests still passed; investigate.
* **Mutation score** = `100 × (killed / total)`.
  * 80 % +  = acceptable baseline; target 100 % for critical modules.
  * Score below `thresholds.low` can trigger warnings in CI.

The HTML report (`reports/mutation/html/index.html`) lets you click through each mutant, view the diff, and see which tests ran.

---

## 8. Where to run

* **Local dev** – run manually after writing tests, or add a `npm run mutate` alias.
* **CI pipeline** – add a job that executes `npx stryker run`; fail the build if the score < 80 %.
* **Nightly / weekly** – run a slower, full mutation analysis (e.g. include e2e tests) to catch drift.

Mutation testing is expensive (many test runs), so local developers may choose to run only changed modules, but CI/nightly should exercise the entire codebase.

---

### Tailoring to this repo

- the sample config above mutates `src/**/*.tsx`, which matches your React components.
- you can adjust `ignorePatterns` to skip `src/**/*.spec.tsx` or any fixtures.
- set the `thresholds.break` field to `80`; CI will fail when the score drops below that.
- run `npx stryker run --thresholds.high 80` if you prefer a CLI override.

With these settings your TypeScript/Vitest project will behave exactly like the Python example earlier, and you’ll know when AI‑generated tests are missing the mark.

Let me know if you need help adding the mutation step to your existing package.json scripts or CI YAML!