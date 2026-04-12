---
description: How to run unit tests safely without hanging background processes
---

# Safe Testing Workflow

When running unit tests, it is critical to ensure they do not enter "watch mode" (default for Vitest), as hese processes can hang in the background, consume resources, and lock files, leading to server instability.

## Using the Helper Script

We have created a PowerShell script to enforce "Single Run" mode.

1. Run the script from the root directory:
   ```powershell
   ./scripts/test_once.ps1
   ```

2. To test a specific file:
   ```powershell
   ./scripts/test_once.ps1 logic/ai/agent.test.ts
   ```

## Manual Command

If you cannot use the script, ALWAYS use the `run` command directly:

```bash
npx vitest run [file-pattern]
```

**NEVER** use `npm test` without arguments if it defaults to watch mode.
