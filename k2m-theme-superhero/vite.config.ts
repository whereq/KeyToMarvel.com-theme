import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    keycloakify({
      accountThemeImplementation: "Single-Page",
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@keycloak-theme': '/src/keycloak-theme',
    },
  },
});