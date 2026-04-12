> **_Architectural Note: This document outlines a content-driven architecture that was explored during development. This approach has since been deprecated in favor of a fully component-based system for the rulebooks. The component-based approach (embedding all rules directly in React components) was chosen for its superior reliability in the target deployment environment and its elimination of potential 404 errors for static content. This document is preserved as a record of the architectural decision-making process._**

# Static Content Architecture Specification

## 1. Overview & Rationale

This document specifies the architectural pattern for separating static, presentational content (primarily the era rulebooks) from the application's React (TSX) component logic.

**Problem:** Hardcoding large blocks of HTML-like JSX content within TSX components has several drawbacks:
-   **Bloats Components:** It makes component files larger and harder to read, mixing static content with dynamic logic.
-   **Difficult to Update:** Changing rule text or styling requires modifying a React component, which is unnecessary and increases the risk of introducing bugs.
-   **Poor Separation of Concerns:** It violates the principle of separating content (the "what") from presentation logic (the "how").

**Solution:** Move all static rulebook content into simple, external `.html` files. The React application will then fetch this content on demand and render it.

**Benefits:**
-   **Clean Components:** React components become leaner and focused on state management and interactivity.
-   **Easy Content Management:** Rule text and styling can be updated by editing a simple HTML file, without touching any JavaScript/TypeScript code.
-   **Improved Maintainability:** Clear separation between content and logic makes the codebase easier to understand and maintain.

## 2. Implementation Details

### 2.1. File Structure

A new directory will be created in the `public` folder to house the static HTML files.

```
public/
└── rules/
    ├── era-1-rules.html
    ├── era-2-rules.html
    ├── era-3-rules.html
    ├── era-4-rules.html
    └── ... (etc.)
```

### 2.2. The `useStaticContent` Hook

A new reusable custom hook will be created to manage the fetching and state of this static content.

-   **File Location:** `src/hooks/useStaticContent.ts`
-   **Functionality:**
    -   Accepts a `filePath` (e.g., `/rules/era-4-rules.html`) as an argument.
    -   Uses the `fetch` API to retrieve the content of the HTML file.
    -   Manages three states: `isLoading` (boolean), `error` (string | null), and `content` (string).
    -   Includes an in-memory cache (e.g., a simple JavaScript `Map`) to store fetched content. On subsequent calls for the same `filePath`, it will return the cached content immediately instead of making another network request.
    -   The hook will be implemented with `useState` and `useEffect`.

#### `useStaticContent.ts` - Code Signature
```typescript
// src/hooks/useStaticContent.ts

interface StaticContentState {
    content: string | null;
    isLoading: boolean;
    error: string | null;
}

export const useStaticContent = (filePath: string): StaticContentState => {
    // ... implementation with fetch, useState, useEffect, and caching ...
};
```

### 2.3. Component Integration

Era content components (e.g., `EraDiscoveryContent.tsx`) will be refactored to use this new pattern.

1.  **Remove Hardcoded Rules:** The large, hardcoded `RulesComponent` will be removed from the main component file.
2.  **Create a Dynamic Rules Component:** A new, smaller `RulesComponent` will be created within the file.
3.  **Use the Hook:** This new component will call the `useStaticContent` hook with the path to its corresponding HTML file.
4.  **Render the Content:**
    -   It will display a loading indicator while `isLoading` is true.
    -   It will display an error message if `error` is not null.
    -   Once the `content` is available, it will be rendered using `dangerouslySetInnerHTML`.

#### `dangerouslySetInnerHTML` - Security Note

Using `dangerouslySetInnerHTML` is often discouraged because it can expose an application to Cross-Site Scripting (XSS) attacks if the rendered content comes from an untrusted source (like user input).

In this specific architecture, its use is **safe and appropriate** because:
-   The HTML content is **not** user-generated.
-   The `.html` files are a **trusted, internal part of the application's source code**, checked into version control alongside the React components.
-   There is no mechanism for external or malicious HTML to be injected into this system.

#### Example Implementation
```tsx
// src/components/era-interfaces/EraDiscoveryContent.tsx

import { useStaticContent } from '../../hooks/useStaticContent';

// The new, lean RulesComponent
const RulesComponent = () => {
    const { content, isLoading, error } = useStaticContent('/rules/era-4-rules.html');

    if (isLoading) return <div>Loading Rules...</div>;
    if (error) return <div className="text-red-500">Error loading rules: {error}</div>;

    return <div dangerouslySetInnerHTML={{ __html: content || '' }} />;
};

// The main component passes this to the layout container
const EraDiscoveryContent = ({ ... }) => {
    // ... other component logic ...

    return (
        <EraLayoutContainer
            // ... other props
            rulesComponent={<RulesComponent />}
            // ... other props
        />
    );
};
```

This architecture provides a robust, maintainable, and clean solution for managing the application's static content.