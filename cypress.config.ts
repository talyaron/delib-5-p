import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'wchvep',
  e2e: {
    baseUrl: "https://delib-v3-dev.web.app",
    
    // baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {

      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-site-isolation-trials');

          return launchOptions;
        }
      });

      on('task', {
        log(message) {
          console.log(message);

          return null;
        },
      });

      return config;
    },
  },
});
