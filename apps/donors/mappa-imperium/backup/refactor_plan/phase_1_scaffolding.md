
# Refactor Plan - Phase 1: Project Scaffolding & Foundation

**Goal:** Establish a clean, professional React/Vite/TypeScript project foundation that solves the styling and build issues permanently.

---

### Your Action Steps:

1.  Create a new, empty directory for your project (e.g., `mappa-imperium-refactor`).
2.  Navigate into it and run `npm create vite@latest . -- --template react-ts` to initialize a fresh Vite project in the current folder.
3.  Run `npm install` to get the basic dependencies.
4.  Run the following commands to install your chosen libraries:
    ```bash
    npm install zustand react-hook-form @google/genai lucide-react
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
5.  Copy your existing `/public` and `/docs` directories into the root of this new project.

---

### AI Action Steps:

When you are ready, say **"Let's start Phase 1."** I will then provide the code for the following:

1.  **Configure Build Tools:** I will generate the correct `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, and `tsconfig.json` to enable path aliasing (`@/`) and Tailwind processing.
2.  **Create Documentation Script:** I will create the `/scripts` folder and `generate-docs.ts` file. This will establish the architecture for automating documentation later. I will also add a `docs:gen` script to `package.json`.
3.  **Initial App Shell:** I will provide a clean `index.html`, `src/index.css`, and a basic `src/App.tsx` that will serve as the root of our new application.

---

### Stop Point & Verification

Once you have replaced the files in your new project with the ones I provide, run `npm run dev`.

**Before we proceed, please confirm:**

1.  Does the new project run correctly and display a "Phase 1 Complete" message?
2.  Do you see a `/scripts` directory with `generate-docs.ts` inside it?
3.  Are you ready to move on to migrating the core data types and state management?

When you're ready, say **"Let's start Phase 2."**