# Custom Hooks Reference

This document provides a list of all custom React hooks used in the Mappa Imperium application and a brief description of their purpose.

---

## Core Application Hooks (`/src/hooks/`)

-   **`useOnClickOutside.ts`**
    -   **Purpose:** A utility hook that detects clicks outside of a specified React component. It's used to close dropdown menus, modals, or other temporary UI elements when the user clicks elsewhere on the page.

-   **`useStaticContent.ts`**
    -   **Purpose:** A hook designed to fetch and manage static content from external HTML files. It includes logic for loading states, error handling, and a hybrid fallback system to serve content from a bundled JavaScript object in environments where `fetch` is unreliable (like Google Cloud Run).

## Debug System Hooks (`/src/components/debug/hooks/`)

These hooks are specifically designed to gather data for the `UnifiedDebugSystem` and are only active when `isDebugMode` is true.

-   **`useConsoleLogger.ts`**
    -   **Purpose:** Captures and stores console messages (`log`, `warn`, `error`, `info`) to be displayed in the "Console" tab of the debug panel.

-   **`useEnvironmentConstraints.ts`**
    -   **Purpose:** Runs a suite of tests to probe the capabilities of the runtime environment (e.g., File System API access, Local Storage, network fetching). This is crucial for diagnosing platform-specific issues.

-   **`useFileHealthCheck.ts`**
    -   **Purpose:** Audits a list of critical source files, checking for their existence, size, and load times. It powers the "File Health" tab in the debug panel.

-   **`usePerformanceMetrics.ts`**
    -   **Purpose:** Collects various performance metrics like memory usage, DOM node count, and render times to be displayed in the "Performance" tab.

-   **`useSystemInfo.ts`**
    -   **Purpose:** Gathers information about the user's browser, operating system, and network connection for the "System Info" tab.