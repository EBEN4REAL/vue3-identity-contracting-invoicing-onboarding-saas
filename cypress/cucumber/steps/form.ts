import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import { getTheLastElementByCypressID, TIMEOUT } from "./app";

Given(
  "the value for Element with ID {string} has been set as {string}",
  (elementId: string, value: string) => {
    cy.get(`#${elementId}`).invoke("attr", "value", value);
  },
);

Then(
  "the Element with ID {string} should have a Form Error",
  (elementId: string) => {
    cy.get(`#${elementId}`)
      .parent()
      .parent()
      .parent()
      .parent()
      .children(".v-input__details")
      .find(".v-messages")
      .should("be.visible");
  },
);

Then(
  "the Element with selector {string} should have a Form Error",
  (selector: string) => {
    cy.get(selector).should("have.class", "v-input--error");
  },
);

Then(
  "the Element with selector {string} should NOT have a Form Error",
  (selector: string) => {
    cy.get(selector).should("not.have.class", "v-input--error");
  },
);

Then(
  "the Element with Cypress ID {string} should have a Form Error for validator {string} with text {string}",
  (cypressId: string, validator: string, text: string) => {
    cy.getByCypressID(`${cypressId} mm-input-error-${validator}-text`).contains(
      text,
    );
  },
);

Then(
  "the Form Element {string} with Cypress ID {string} should have a Form Error for validator {string}",
  (element: string, cypressId: string, validator: string) => {
    cy.getByCypressID(
      `${cypressId} mm-${element}-error-${validator}-text`,
    ).should("exist");
  },
);

Then(
  "the User selects file {string} inside DragNDrop with Cypress ID {string} via Click",
  (file: string, cypressId: string) => {
    cy.getByCypressID(`${cypressId} input-file-hidden`).selectFile(
      `cypress/cucumber/fixtures/${file}`,
      { force: true },
    );
  },
);

Then(
  "the User selects file {string} inside DragNDrop with Cypress ID {string} via DragNDrop",
  (file: string, cypressId: string) => {
    cy.getByCypressID(`${cypressId} input-file-hidden`).selectFile(
      `cypress/cucumber/fixtures/${file}`,
      { force: true, action: "drag-drop" },
    );
  },
);

Then(
  "the Form Element {string} with Cypress ID {string} should NOT have a Form Error for validator {string}",
  (element: string, cypressId: string, validator: string) => {
    cy.getByCypressID(
      `${cypressId} mm-${element}-error-${validator}-text`,
    ).should("not.exist");
  },
);

Then(
  "the Element with selector {string} should be inside {string}",
  (selectorChild: string, selectorParent: string) => {
    cy.get(selectorParent).find(selectorChild);
  },
);

Then(
  `the User selects item with label {string} from opened selector`,
  (label: string) => {
    cy.getByCypressID("select-item").contains(label).click();
  },
);

Then(
  "the Select with ID {string} should have a Form Error",
  (selectId: string) => {
    cy.get(`#${selectId}`)
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .children(".v-input__details")
      .find(".v-messages")
      .should("be.visible");
  },
);

Then(
  "the Select with ID {string} should have the selected value as {string}",
  (selectId: string, value: string) => {
    cy.get(".v-select__selection-text").invoke("text").should("include", value);
  },
);

Then(
  "the Input with first selector {string} should be focused",
  (selector: string) => {
    cy.get(selector).find("input").click();
  },
);

Then(
  "the Input with first selector {string} should be submitted by Enter",
  (selector: string) => {
    cy.get(selector).first().find("input").type("{enter}");
  },
);

Then(
  "the Input with first selector {string} is submitted by Enter",
  (selector: string) => {
    cy.get(selector).first().find("input").type("{enter}");
  },
);

Then(
  "enter text {string} in Input inside selector {string}",
  (text: string, selector: string) => {
    cy.get(selector).find("input").type(text);
  },
);

Then(
  "the User enters text {string} in Input inside selector {string}",
  (text: string, selector: string) => {
    cy.get(selector).find("input").type(text);
  },
);

Then(
  "the User clears the Input inside selector {string}",
  (selector: string) => {
    cy.get(selector).find("input").clear();
  },
);

Then("the User clears the Input with selector {string}", (selector: string) => {
  cy.get(selector).clear();
});

Then(
  "text {string} in Input inside selector {string} should exist",
  (text: string, selector: string) => {
    cy.get(selector).find("input").should("have.value", text);
  },
);

Then(
  "the Input inside selector {string} should be empty",
  (selector: string) => {
    cy.get(selector).find("input").should("have.value", "");
  },
);

Then(
  "enter text {string} in Input with ID {string}",
  (text: string, inputId: string) => {
    cy.get(`#${inputId}`).find("input").type(text);
  },
);

Then(
  "the User enters text {string} in Input inside Element with Cypress ID {string}",
  (text: string, cypressId: string) => {
    cy.getByCypressID(cypressId).find("input").type(text);
  },
);

Then(
  "the User types {string} in Input inside Element with Cypress ID {string}",
  (text: string, cypressId: string) => {
    cy.getByCypressID(cypressId).find("input").clear().type(text);
  },
);

Then(
  "the User types {string} in Tags Input inside Element with Cypress ID {string}",
  (tags: string, cypressId: string) => {
    cy.getByCypressID(cypressId).find("input").clear();

    tags.split(",").forEach((tag: string) => {
      cy.getByCypressID(cypressId).find("input").type(tag).type("{enter}");
    });
  },
);

Then(
  "the User types {string} in Textarea inside Element with Cypress ID {string}",
  (text: string, cypressId: string) => {
    cy.getByCypressID(cypressId).find("textarea").clear().type(text);
  },
);

Then(
  "the User clears the Input inside Element with Cypress ID {string}",
  (cypressId: string) => {
    cy.getByCypressID(cypressId).find("input").clear();
  },
);

Then(
  "the Input with Cypress ID {string} should have value as {string}",
  (cypressId: string, text: string) => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    })
      .find("input")
      .should("have.value", text);
  },
);

Then(
  "the Textarea with Cypress ID {string} should have value as {string}",
  (cypressId: string, text: string) => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    })
      .find("textarea")
      .should("have.value", text);
  },
);

When(
  "the User activates the Checkbox inside the Element with Cypress ID {string}",
  (cypressId: string) => {
    getTheLastElementByCypressID(cypressId)
      .find("input[type='checkbox']")
      .click();
  },
);

Then(
  "the Checkbox inside selector with Cypress ID {string} should be checked",
  (cypressId: string) => {
    getTheLastElementByCypressID(cypressId)
      .find("input[type='checkbox']")
      .should("be.checked");
  },
);

Then(
  "the Checkbox inside selector with Cypress ID {string} should exist",
  (cypressId: string) => {
    getTheLastElementByCypressID(cypressId)
      .find("input[type='checkbox']")
      .should("exist");
  },
);

Then(
  "the Radiobutton with Cypress ID {string} should be checked",
  (cypressId: string) => {
    cy.getByCypressID(cypressId).should("have.class", "mm-radiobutton-active");
  },
);

Then(
  "the Element with Cypress ID {string} should have the attribute {string} as {string}",
  (cypressId: string, attribute: string, value: string) => {
    cy.getByCypressID(cypressId).should("have.attr", attribute, value);
  },
);
