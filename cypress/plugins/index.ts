const cucumber = require("cypress-cucumber-preprocessor").default;

const browserify = require("@cypress/browserify-preprocessor");

module.exports = (on: Cypress.PluginEvents) => {
  const options = {
    ...browserify.defaultOptions,
    typescript: require.resolve("typescript"),
  };

  on("file:preprocessor", cucumber(options));
};
