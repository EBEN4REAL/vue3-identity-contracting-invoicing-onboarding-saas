import { Then } from "cypress-cucumber-preprocessor/steps";
import { cypressIdElementSelector, TIMEOUT } from "./app";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const theElementShouldBeVisible = (elementSelector: string): void => {
  cy.get(elementSelector, {
    timeout: TIMEOUT,
  })
    .scrollIntoView()
    .should("be.visible");
};

Then(
  "the Element with selector {string} should be visible",
  (elementSelector: string): void => {
    theElementShouldBeVisible(elementSelector);
  },
);

Then(
  "the Element with Cypress ID {string} should be visible",
  (cypressId: string): void => {
    theElementShouldBeVisible(cypressIdElementSelector(cypressId));
  },
);

Then(
  "the Element with Cypress ID {string} should have a class {string}",
  (cypressId: string, className: string) => {
    cy.getByCypressID(cypressId).should("have.class", className);
  },
);

Then(
  "the Element with Cypress ID {string} should NOT have a class {string}",
  (cypressId: string, className: string) => {
    cy.getByCypressID(cypressId).should("not.have.class", className);
  },
);

const theElementWithSelectorShouldNotBeVisible = (
  elementSelector: string,
): void => {
  cy.get(elementSelector, {
    timeout: TIMEOUT,
  }).should("not.be.visible");
};

Then(
  "the Element with selector {string} should NOT be visible",
  (elementSelector: string): void => {
    theElementWithSelectorShouldNotBeVisible(elementSelector);
  },
);

Then(
  "the Element with Cypress ID {string} should NOT be visible",
  (elementSelector: string): void => {
    theElementWithSelectorShouldNotBeVisible(
      cypressIdElementSelector(elementSelector),
    );
  },
);

Then(
  "the Element with Cypress ID {string} should exist",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).should("exist");
  },
);

Then(
  "the Element with Cypress ID {string} should exist after scrolling into view",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    })
      .scrollIntoView({ block: "nearest", inline: "nearest" })
      .should("exist");
  },
);

Then(
  "the Element with Cypress ID {string} should NOT exist",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId).should("not.exist");
  },
);

Then(
  "the Element with Cypress ID {string} should be NOT disabled",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId).should("be.not.disabled");
  },
);

Then(
  "the Element with Cypress ID {string} should be disabled",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId).should("be.disabled");
  },
);

Then(
  "the Element with selector {string} should exist",
  (elementSelector: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    }).should("exist");
  },
);

const theElementWithSelectorShouldNotExist = (
  elementSelector: string,
): void => {
  cy.get(elementSelector).should("not.exist");
};

Then(
  "the Element with selector {string} should NOT exist",
  (elementSelector: string): void => {
    theElementWithSelectorShouldNotExist(elementSelector);
  },
);

Then(
  "the Element with Cypress ID {string} should NOT exist",
  (cypressId: string): void => {
    theElementWithSelectorShouldNotExist(cypressIdElementSelector(cypressId));
  },
);

Then(
  "the Element with selector {string} should be enabled",
  (elementSelector: string): void => {
    cy.get(elementSelector).should("not.be.disabled");
  },
);

Then(
  "the Element with selector {string} should be disabled",
  (elementSelector: string): void => {
    cy.get(elementSelector).should("be.disabled");
  },
);

Then(
  "the Element with selector {string} should have the text as {string}",
  (elementSelector: string, text: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    }).should("have.text", text);
  },
);

Then(
  "the Element with Cypress ID {string} should have the text as {string}",
  (cypressId: string, text: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).should("have.text", text);
  },
);

Then(
  "the Element with Cypress ID {string} should have the formatted date as {string}",
  (cypressId: string, expectedDateString: string): void => {
    const currentUtcOffset = dayjs().utcOffset();
    const expectedDate = dayjs(expectedDateString).utcOffset(currentUtcOffset);
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).should(($el) => {
      const actualText = $el.text().trim();
      const actualDate = dayjs(actualText, "D MMM YYYY").utcOffset(
        currentUtcOffset,
      );

      return (
        actualDate.format("D MMM YYYY") === expectedDate.format("D MMM YYYY")
      );
    });
  },
);

Then(
  "the Element with selector {string} contains the text as {string}",
  (elementSelector: string, text: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    }).contains(text);
  },
);

Then(
  "the Element with Cypress ID {string} contains the text as {string}",
  (cypressId: string, text: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).contains(text);
  },
);

Then(
  "the Element with Cypress ID {string} DOES NOT contain the text as {string}",
  (cypressId: string, text: string): void => {
    cy.getByCypressID(cypressId).should("not.include.text", text);
  },
);

Then(
  "the user force hovers over the element with the Cypress ID {string}",
  (cypressId) => {
    cy.getByCypressID(cypressId).trigger("mouseover", { force: true });
  },
);

Then(
  "the Element with selector {string} within {string} should have the text as {string}",
  (elementSelector: string, contextSelector: string, text: string): void => {
    cy.get(contextSelector, {
      timeout: TIMEOUT,
    }).within((): void => {
      cy.get(elementSelector).should("have.text", text);
    });
  },
);

Then(
  "the Element with selector {string} should include the text as {string}",
  (elementSelector: string, text: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    }).should("include.text", text);
  },
);

Then(
  "the Element with selector {string} should NOT include the text as {string}",
  (elementSelector: string, text: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    }).should("not.include.text", text);
  },
);

const theElementWithSelectorShouldHaveTheValueAs = (
  elementSelector: string,
  value: string,
): void => {
  cy.get(elementSelector).should("have.value", value);
};

Then(
  "the Element with selector {string} should have the value as {string}",
  (elementSelector: string, value: string): void => {
    theElementWithSelectorShouldHaveTheValueAs(elementSelector, value);
  },
);

Then(
  "the Element with Cypress ID {string} should have the value as {string}",
  (cypressId: string, value: string): void => {
    theElementWithSelectorShouldHaveTheValueAs(
      cypressIdElementSelector(cypressId),
      value,
    );
  },
);

Then(
  "the Input inside Element with Cypress ID {string} should have the value as {string}",
  (cypressId: string, text: string): void => {
    cy.getByCypressID(cypressId).find("input").should("have.value", text);
  },
);

Then(
  "the Textarea inside Element with Cypress ID {string} should have the value as {string}",
  (cypressId: string, text: string): void => {
    cy.getByCypressID(cypressId).find("textarea").should("have.value", text);
  },
);

Then(
  "the Select with Cypress ID {string} should have the value as {string}",
  (selectCypressId: string, value: string): void => {
    cy.getByCypressID(selectCypressId).should(
      "have.attr",
      "data-select-value",
      value,
    );
  },
);

Then(
  "the Element with Cypress ID {string} should have the color {string}",
  (cypressId: string, expectedColor: string) => {
    cy.getByCypressID(cypressId).should(
      "have.css",
      "background-color",
      expectedColor,
    );
  },
);

Then(
  "the Element with Cypress ID {string} should have the text color {string}",
  (cypressId: string, expectedTextColor) => {
    cy.getByCypressID(cypressId).should("have.css", "color", expectedTextColor);
  },
);

Then(
  "the Element with Cypress ID {string} should have the image inside",
  (cypressId: string) => {
    cy.getByCypressID(cypressId).find("img");
  },
);

Then("the browser window is resized to {string}", (width: string): void => {
  cy.viewport(Number(width), 844);
});

Then(
  "the SVG with Cypress ID {string} should have a height of {string} and a width of {string}",
  (cypressId: string, height: string, width: string) => {
    cy.getByCypressID(cypressId).should("have.attr", "height", height);
    cy.getByCypressID(cypressId).should("have.attr", "width", width);
  },
);

Then(
  "the document should be downloaded to filePath {string}",
  (filePath: string) => {
    cy.readFile(filePath).should("exist");
  },
);

Then("a new tab should open with URL {string}", () => {
  cy.window().then((win) => {
    cy.stub(win, "open").as("windowOpen");
    win.open.restore();
  });
});
