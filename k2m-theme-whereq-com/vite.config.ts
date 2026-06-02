import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { keycloakify } from "keycloakify/vite-plugin";

export default defineConfig({
    server: {
        host: true, // bind to 0.0.0.0 so Windows browser can reach WSL2
    },
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            themeName: "k2m-theme-whereq-com",
            accountThemeImplementation: "none",
        }),
    ],
    resolve: {
        alias: {
            "@": "/src",
            "@keycloak-theme": "/src/keycloak-theme",
        },
    },
});
