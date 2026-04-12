module.exports = {
  // Restrict mutation to the single file under development to speed up runs
  mutate: [
    "src/utils/zodHelpers.ts"
  ],
  packageManager: "npm",
  testRunner: "vitest",                  // use the installed vitest runner plugin
  reporters: ["html", "clear-text"],
  coverageAnalysis: "perTest",
  tsconfigFile: "tsconfig.json",
  // vitest options are intentionally omitted to avoid schema validation errors;
  // the runner will autodetect the config file (vitest.config.ts) by default.
  ignorePatterns: [
    "src/**/*.spec.tsx",
    "src/**/*.test.tsx",
    "temp_lazy_gm_tools/**",
    "temp*/**",
    "*.html"
  ],
  disableTypeChecks: false,
  thresholds: {
    high: 80,
    low: 60,
    break: 80
  },
  timeoutMS: 600000,
  // Memory optimization settings
  concurrency: 1,                          // limited parallelism for lower memory
  maxTestRunners: 2,                       // cap test processes
  ignoreStatic: true,                      // ignore long-running static mutants
  warnings: {
    slow: false                            // silence slow mutation warnings
  }
};
