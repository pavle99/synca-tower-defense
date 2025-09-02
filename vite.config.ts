/// <reference types="vitest" />

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
});
