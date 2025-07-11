import { Then } from "cypress-cucumber-preprocessor/steps";
import { getMode, Mode } from "./app";

Then(
  "the Visual Regression for the Page should match Snapshot {string}",
  (snapshot: string): void => {
    if (getMode() !== Mode.CI) {
      return;
    }
    cy.compareSnapshot(snapshot, 0.2);
  },
);

Then(
  "the Visual Regression for the Element with Cypress ID {string} should match Snapshot {string}",
  (cypressId: string, snapshot: string): void => {
    if (getMode() !== Mode.CI) {
      return;
    }
    cy.getByCypressID(cypressId).compareSnapshot(snapshot, 0.1);
  },
);
