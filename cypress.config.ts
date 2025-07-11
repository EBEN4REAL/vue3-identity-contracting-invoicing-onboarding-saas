import { defineConfig } from "cypress";
import mm_config from "./src/mm.config.json";
import { configureVisualRegression } from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1400,
  viewportHeight: 1200,
  requestTimeout: 8000,
  responseTimeout: 8000,
  defaultCommandTimeout: 8000,
  e2e: {
    env: {
      MODE: process.env.MODE,
      visualRegression: {
        type: process.env.CYPRESS_VISUAL_REGRESSION_TYPE || "regression",
        baseDirectory: "./cypress/snapshots/base",
        diffDirectory: "./cypress/snapshots/diff",
      },
    },
    specPattern: "cypress/cucumber/features/**/*.feature",
    baseUrl: mm_config.app.url,
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("@cypress/code-coverage/task")(on, config);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("./cypress/plugins/index.ts")(on, config);
      configureVisualRegression(on);
      return config;
    },
  },
});
