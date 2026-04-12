# Feature Proposal: Portable Component Architecture & Robust Deployment

## 1. The Problem: Fragile Styling on Google Cloud

The current application architecture avoids a build step, relying on the Tailwind CSS CDN to process styles inlined within `index.html`. While functional, this approach has significant limitations and is not a scalable, professional solution.

Based on deployment experiences and analysis, the core issues are:
-   **Persistent 404 Errors**: Multiple attempts to serve CSS from external files (`/src`, `/public`, `/index.css`) have failed in the Google Cloud Run environment due to misconfiguration or inherent platform constraints.
-   **Bloated `index.html`**: The current workaround of inlining the entire component class library makes `index.html` difficult to read, maintain, and version control.
-   **Lack of Portability**: The current system is monolithic. The styles and components are not designed to be easily extracted, shared, or "remixed" in other projects, which is a key long-term goal.

## 2. The Solution: A Build Pipeline & Component Library

To address these issues and enable a truly portable "templating project," we must evolve from a build-less setup to a professional architecture with a dedicated build step.

### A. Recommended Build Pipeline

Embracing a build tool like Vite (which is already used for development) for production builds is the most robust solution.

**`package.json` Scripts:**
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && gcloud app deploy"
}
```

This generates an optimized `/dist` directory with hashed, production-ready assets that can be reliably served by any static host.

### B. Reliable Static Serving on Google Cloud

With a proper build output, we can correctly configure static file serving.

**For Google App Engine (`app.yaml`):**
```yaml
runtime: nodejs18
handlers:
  - url: /assets
    static_dir: dist/assets
    secure: always
  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
    secure: always
```

**For Google Cloud Run (with NGINX):**
```dockerfile
# Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
```nginx
# nginx.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 3. The Vision: A Portable Component & Styling Library

The ultimate goal is to structure our UI as a portable library that can be versioned and even published as an npm package. This makes the game's UI components and styles truly "remixable."

### `styles/componentLibrary.ts`
Instead of a CSS file with `@apply`, we can define our style tokens in TypeScript. This offers type safety and makes them easily exportable.

```typescript
// styles/componentLibrary.ts
export const components = {
  layouts: {
    centeredCard: "min-h-screen flex items-center justify-center bg-gray-200",
    pageCard: "bg-white p-10 rounded-xl shadow-2xl max-w-lg border-t-8 border-amber-600",
  },
  buttons: {
    base: "px-4 py-2 rounded-lg font-semibold transition-all duration-200",
    primary: "bg-amber-700 text-white hover:bg-amber-800",
  },
  // ... and so on for all components
};

export default components;
```

### Component Usage
This library can then be imported and used cleanly within components.

```typescript
import { components } from '@your-org/mappa-components';

const Button = ({ variant = 'primary', ...props }) => (
  <button
    className={`${components.buttons.base} ${components.buttons[variant]}`}
    {...props}
  />
);
```

This architecture provides the portability requested and aligns with modern design system best practices.

## 4. Alternative: CSS-in-JS

Another robust approach that eliminates external files is CSS-in-JS. This involves defining styles directly within the components.

```typescript
// styles/componentStyles.ts
export const buttonStyles = {
  btn: "px-4 py-2 rounded-lg font-semibold transition-all duration-200",
  primary: "bg-amber-700 text-white hover:bg-amber-800",
};

// components/Button.tsx
import { buttonStyles } from '../styles/componentStyles';

export const Button = ({ variant = 'primary', children, ...props }) => (
  <button
    className={`${buttonStyles.btn} ${buttonStyles[variant]}`}
    {...props}
  >
    {children}
  </button>
);
```
While effective, the Component Library approach (3) is more aligned with the goal of creating a shareable, template-based system.