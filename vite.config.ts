import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : []),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "favicon-32.png",
        "favicon-48.png",
        "favicon-192.png",
        "apple-touch-icon.png",
        "logo-512.png",
        "robots.txt",
        "pwa-192.png",
        "pwa-512.png",
      ],
      manifest: {
        name: "BUSY STRONG 90",
        short_name: "BS90",
        description:
          "90-day training system for busy people 35+. Three sessions per week, gym or home. By Coach Milos.",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        lang: "en",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        // Precache icons/static only — hashed JS/CSS must always come from network to avoid blank screen after deploy.
        globPatterns: ["**/*.{ico,png,svg,webp,woff2}", "manifest.webmanifest", "robots.txt"],
        // Hero-slika.png is the 8 MB 4K original; the site uses the hero-lcp*.webp versions made from it
        globIgnores: ["**/index.html", "**/assets/**", "**/Hero-slika.png"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkOnly",
          },
          {
            urlPattern: ({ url, request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              (url.pathname.startsWith("/assets/") && /\.(js|css)$/.test(url.pathname)),
            handler: "NetworkOnly",
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/(rest|auth|realtime)\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 12,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@radix-ui")) return "radix-ui";
          return "vendor";
        },
      },
    },
  },
}));
