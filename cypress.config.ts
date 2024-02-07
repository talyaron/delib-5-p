import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'wchvep',
  e2e: {
    baseUrl: "https://delib-v3-dev.web.app",
    
    // baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
