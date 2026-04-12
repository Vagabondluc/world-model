import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "../..");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "src"),
      "@contracts": path.resolve(repoRoot, "contracts/json-schema"),
      "@tailwindcss/vite": path.resolve(appRoot, "node_modules/@tailwindcss/vite"),
      ajv: path.resolve(appRoot, "node_modules/ajv"),
      "d3-delaunay": path.resolve(appRoot, "node_modules/d3-delaunay"),
      "lucide-react": path.resolve(appRoot, "node_modules/lucide-react"),
      motion: path.resolve(appRoot, "node_modules/motion"),
      react: path.resolve(appRoot, "node_modules/react"),
      "react-dom": path.resolve(appRoot, "node_modules/react-dom"),
      zustand: path.resolve(appRoot, "node_modules/zustand")
    }
  },
  server: {
    fs: {
      allow: [repoRoot]
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"]
  }
});
