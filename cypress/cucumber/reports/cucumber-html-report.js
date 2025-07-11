// eslint-disable-next-line import/no-extraneous-dependencies
const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: './cypress/cucumber/reports/json/',
  reportPath: './cypress/cucumber/reports/html/',
});
