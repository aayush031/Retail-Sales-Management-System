import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://retail-sales-management-system-1-qvxh.onrender.com",
    },
  },
});
