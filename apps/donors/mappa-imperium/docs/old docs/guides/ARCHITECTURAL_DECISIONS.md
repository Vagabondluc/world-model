# Architectural Decision Record (ADR)

This document logs the key architectural decisions made during the development of Mappa Imperium. Each entry records the context of the decision, the decision itself, and its consequences.

---

### ADR 001: Component-Based Rulebooks

-   **Date**: 2023-10-25
-   **Status**: Implemented

**Context**:
The initial architecture planned to load static rulebook content from external HTML files (`/public/rules/*.html`). This was intended to separate content from logic. However, testing in the target deployment environment (Google Cloud Run) revealed that fetching these static files was unreliable, frequently resulting in 404 errors and a broken user experience.

**Decision**:
Abandon the external file fetching model. Refactor all rulebook content, including text and tables, into a series of dedicated, self-contained React components located in `/src/components/era-interfaces/common/rules/`.

**Consequences**:
-   **Positive**:
    -   **100% Reliability**: Completely eliminates the risk of 404 errors for rulebook content, as all rules are now part of the application's JavaScript bundle.
    -   **Type Safety**: Tables are now type-safe React components, reducing the risk of typos or data errors.
    -   **Maintainability**: Rule content is version-controlled directly alongside the application code.
-   **Negative**:
    -   Slightly increases the initial JavaScript bundle size.
    -   Updating rule text now requires editing a `.tsx` file, which is a minor inconvenience compared to the massive reliability gain.

---

### ADR 002: Inlined Component Class Library for Styling

-   **Date**: 2023-10-28
-   **Status**: Implemented

**Context**:
Similar to ADR 001, the application faced persistent 404 errors when trying to load an external CSS file in the deployment environment. Multiple strategies (fetching from `/src`, `/public`, using `@import`) failed. The root cause is a combination of the build-less nature of the project and the specific static file serving configuration of the target environment.

**Decision**:
Consolidate all reusable Tailwind CSS component styles into a single `<style type="text/tailwindcss">` block located directly in `index.html`. This block uses the `@apply` directive to create a semantic, reusable component class library (e.g., `.btn-primary`, `.card-base`).

**Consequences**:
-   **Positive**:
    -   **Complete Reliability**: Styling is guaranteed to load as it is part of the main `index.html` document and requires no external network requests.
    -   **Maintainability**: Provides a single source of truth for the application's design system.
    -   **Clean Components**: React components use semantic class names instead of long, unreadable strings of utility classes.
-   **Negative**:
    -   Makes `index.html` unusually large and unconventional.
    -   This is a workaround for the current environmental constraints. The long-term, professional solution is to implement a proper build step, as tracked in **TODO-0.0.2-035**.

---

### ADR 003: Rejection of `shadcn/ui`

-   **Date**: 2023-10-29
-   **Status**: Decided

**Context**:
The team considered using the popular `shadcn/ui` component library to accelerate UI development.

**Decision**:
Rejected the use of `shadcn/ui`. The library's installation method relies on a CLI command that copies component source code directly into the project's file system (e.g., into a `/components/ui` directory). This workflow is fundamentally incompatible with the project's core constraints:
1.  **Build-less Environment**: It assumes a build step to process dependencies and Tailwind CSS configuration.
2.  **Read-Only File System**: The CLI would fail to run in the Google AI Studio development environment.

**Consequences**:
-   **Positive**:
    -   The project remains fully compatible with its target development and deployment environments.
    -   Avoids introducing a complex dependency that goes against the project's core architecture.
-   **Negative**:
    -   UI components must continue to be built manually, which can be slower.
