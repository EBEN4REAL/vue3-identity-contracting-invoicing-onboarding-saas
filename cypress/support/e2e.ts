import "@cypress/code-coverage/support";
import config from "../../src/mm.config.json";
import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command";
import FEATURES from "../cucumber/fixtures/features";

Cypress.on(
  "fail",
  (err: Cypress.CypressError, runnable: Mocha.Runnable): void => {
    if (err.message.includes("'coverageReport'")) {
      return;
    }
    console.error(runnable);
    throw err;
  },
);

Cypress.on(
  "uncaught:exception",
  (err: Cypress.CypressError, runnable: Mocha.Runnable): boolean => {
    console.error(err);
    console.error(runnable);
    return false;
  },
);

Cypress.Commands.add(
  "getByCypressID",
  (selector: string, options?: Record<string, unknown>) => {
    const fullSelector: string = selector
      .split(" ")
      .map((part: string): string => `[data-cy="${part}"]`)
      .join(" ");

    return cy.get(fullSelector, options);
  },
);

addCompareSnapshotCommand();

beforeEach((): void => {
  cy.intercept(`${config.idp.url}/.well-known/openid-configuration`, {
    statusCode: 200,
    body: {
      authorization_endpoint: `${config.idp.url}/oauth2/authorize`,
      token_endpoint: `${config.idp.url}/oauth2/token`,
      end_session_endpoint: `${config.idp.url}/oauth2/logout`,
    },
  });
  cy.intercept(`${config.unleash.url}?*`, {
    statusCode: 200,
    body: {
      toggles: FEATURES,
    },
  });
});
