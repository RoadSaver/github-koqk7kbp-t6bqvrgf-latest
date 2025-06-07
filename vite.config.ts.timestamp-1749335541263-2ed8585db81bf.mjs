// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
function printExternalLink() {
  return {
    name: "print-external-link",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const address = "37.63.102.216";
        const port = server.config.server.port || 8080;
        console.log(`\x1B[32m
App is accessible externally at: http://${address}:${port}
\x1B[0m`);
      });
    }
  };
}
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  plugins: [react(), printExternalLink()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs: mode === "production" ? ["console.log", "console.info", "console.debug"] : []
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "router": ["react-router-dom"],
          "ui-core": ["@radix-ui/react-dialog", "@radix-ui/react-tabs"],
          "ui-forms": ["@radix-ui/react-toast", "@radix-ui/react-select", "@radix-ui/react-checkbox"],
          "maps": ["@react-google-maps/api"],
          "supabase": ["@supabase/supabase-js"],
          "utils": ["clsx", "tailwind-merge", "class-variance-authority"]
        }
      }
    },
    chunkSizeWarningLimit: 800,
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
    legalComments: "none",
    minifyIdentifiers: mode === "production",
    minifySyntax: mode === "production",
    minifyWhitespace: mode === "production"
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode)
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVml0ZURldlNlcnZlciB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZnVuY3Rpb24gcHJpbnRFeHRlcm5hbExpbmsoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ByaW50LWV4dGVybmFsLWxpbmsnLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXI6IFZpdGVEZXZTZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5odHRwU2VydmVyPy5vbmNlKCdsaXN0ZW5pbmcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSAnMzcuNjMuMTAyLjIxNic7XG4gICAgICAgIGNvbnN0IHBvcnQgPSBzZXJ2ZXIuY29uZmlnLnNlcnZlci5wb3J0IHx8IDgwODA7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcXHUwMDFiWzMybVxcbkFwcCBpcyBhY2Nlc3NpYmxlIGV4dGVybmFsbHkgYXQ6IGh0dHA6Ly8ke2FkZHJlc3N9OiR7cG9ydH1cXG5cXHUwMDFiWzBtYCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIHByaW50RXh0ZXJuYWxMaW5rKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgICAgIHB1cmVfZnVuY3M6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJywgJ2NvbnNvbGUuZGVidWcnXSA6IFtdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAncm91dGVyJzogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3VpLWNvcmUnOiBbJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LXRhYnMnXSxcbiAgICAgICAgICAndWktZm9ybXMnOiBbJ0ByYWRpeC11aS9yZWFjdC10b2FzdCcsICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JywgJ0ByYWRpeC11aS9yZWFjdC1jaGVja2JveCddLFxuICAgICAgICAgICdtYXBzJzogWydAcmVhY3QtZ29vZ2xlLW1hcHMvYXBpJ10sXG4gICAgICAgICAgJ3N1cGFiYXNlJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcbiAgICAgICAgICAndXRpbHMnOiBbJ2Nsc3gnLCAndGFpbHdpbmQtbWVyZ2UnLCAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5J10sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogODAwLFxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICBkcm9wOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyBbJ2NvbnNvbGUnLCAnZGVidWdnZXInXSA6IFtdLFxuICAgIGxlZ2FsQ29tbWVudHM6ICdub25lJyxcbiAgICBtaW5pZnlJZGVudGlmaWVyczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgIG1pbmlmeVN5bnRheDogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgIG1pbmlmeVdoaXRlc3BhY2U6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkobW9kZSksXG4gIH0sXG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUF3QztBQUMxUSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBSXpDLFNBQVMsb0JBQW9CO0FBQzNCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUF1QjtBQUNyQyxhQUFPLFlBQVksS0FBSyxhQUFhLE1BQU07QUFDekMsY0FBTSxVQUFVO0FBQ2hCLGNBQU0sT0FBTyxPQUFPLE9BQU8sT0FBTyxRQUFRO0FBQzFDLGdCQUFRLElBQUk7QUFBQSwwQ0FBdUQsT0FBTyxJQUFJLElBQUk7QUFBQSxRQUFhO0FBQUEsTUFDakcsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLGtCQUFrQixDQUFDO0FBQUEsRUFDdEMsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYyxTQUFTO0FBQUEsUUFDdkIsZUFBZSxTQUFTO0FBQUEsUUFDeEIsWUFBWSxTQUFTLGVBQWUsQ0FBQyxlQUFlLGdCQUFnQixlQUFlLElBQUksQ0FBQztBQUFBLE1BQzFGO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDckMsVUFBVSxDQUFDLGtCQUFrQjtBQUFBLFVBQzdCLFdBQVcsQ0FBQywwQkFBMEIsc0JBQXNCO0FBQUEsVUFDNUQsWUFBWSxDQUFDLHlCQUF5QiwwQkFBMEIsMEJBQTBCO0FBQUEsVUFDMUYsUUFBUSxDQUFDLHdCQUF3QjtBQUFBLFVBQ2pDLFlBQVksQ0FBQyx1QkFBdUI7QUFBQSxVQUNwQyxTQUFTLENBQUMsUUFBUSxrQkFBa0IsMEJBQTBCO0FBQUEsUUFDaEU7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsdUJBQXVCO0FBQUEsSUFDdkIsUUFBUTtBQUFBLElBQ1IsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU0sU0FBUyxlQUFlLENBQUMsV0FBVyxVQUFVLElBQUksQ0FBQztBQUFBLElBQ3pELGVBQWU7QUFBQSxJQUNmLG1CQUFtQixTQUFTO0FBQUEsSUFDNUIsY0FBYyxTQUFTO0FBQUEsSUFDdkIsa0JBQWtCLFNBQVM7QUFBQSxFQUM3QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sd0JBQXdCLEtBQUssVUFBVSxJQUFJO0FBQUEsRUFDN0M7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
