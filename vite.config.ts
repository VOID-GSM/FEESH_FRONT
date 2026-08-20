import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",

  plugins: [react()],

  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
