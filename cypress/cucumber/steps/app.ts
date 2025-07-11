import { Before, Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import config from "../../../src/mm.config.json";

export enum Mode {
  CI = "ci",
  E2E = "e2e",
}

export const TIMEOUT: number = 8000;

export const getMode = (): string => Cypress.env("MODE") || "";

export const cypressIdElementSelector = (cypressId: string): string =>
  `[data-cy=${cypressId}]`;

export const getTheLastElementByCypressID = (elementSelector: string) => {
  const formattedSelector = elementSelector
    .split(" ")
    .map((selector: string) => cypressIdElementSelector(selector))
    .join(" ");
  return cy.get(formattedSelector).each(($el, index, $list) => {
    cy.get($el).should("exist"); // Ensure each element in the chain exists
    if (index === $list.length - 1) {
      return cy.wrap($el);
    }
  });
};

type Context = {
  aliases: [string?];
};

export const context: Context = {
  aliases: [],
};

Before((): void => {
  context.aliases = [];
});

Given("the User navigates to {string}", (url): void => {
  cy.visit(url);
});

Then("the User should be redirected to {string}", (url): void => {
  cy.url().should("include", url).should("not.include", `=${url}`);
  if (url !== "/") {
    cy.url().should("not.include", `${url}/`);
  }
});

Then(
  "the User should be redirected to {string} in a new tab when Element {string} is clicked",
  (path: string, cypressId: string): void => {
    cy.window().then((win) => {
      const originalOpen = win.open;
      if (originalOpen !== cy.state("windowOpenStub")) {
        cy.stub(win, "open").as("windowOpen");
        cy.state("windowOpenStub", win.open);
      }
    });

    cy.getByCypressID(cypressId).click();
    cy.get("@windowOpen").should("be.calledWith", path, "_blank");
  },
);

Then("the User should be redirected to the IAM Login", (): void => {
  cy.url().should("include", `${config.idp.url}/login`);
});

const theUserTypesInTheElementWithSelector = (
  value: string,
  elementSelector: string,
): void => {
  cy.get(elementSelector).clear().type(value);
};

When(
  "the User types {string} in the Element with selector {string}",
  (value: string, elementSelector: string): void => {
    theUserTypesInTheElementWithSelector(value, elementSelector);
  },
);

When(
  "the User types {string} in the Element with Cypress ID {string}",
  (value: string, cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    })
      .find("input")
      .clear()
      .type(value);
  },
);

When(
  "the User types {string} in the Textarea with Cypress ID {string}",
  (value: string, cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    })
      .find("textarea")
      .clear()
      .type(value);
  },
);

const theUserClicksOnTheElementWithSelector = (
  elementSelector: string,
): void => {
  cy.get(elementSelector, {
    timeout: TIMEOUT,
  })
    .first()
    .click({ scrollBehavior: "center" });
};

When(
  "the User clicks on the Element with selector {string}",
  (elementSelector: string): void => {
    theUserClicksOnTheElementWithSelector(elementSelector);
  },
);

When(
  "the User clicks on the Element with Cypress ID {string}",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).click();
  },
);

When(
  "the User selects label {string} on the Selectbox with Cypress ID {string}",
  (label: string, cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).select(label);
  },
);

When(
  "the User force clicks on the Element with Cypress ID {string}",
  (cypressId: string): void => {
    cy.getByCypressID(cypressId, {
      timeout: TIMEOUT,
    }).click({ force: true });
  },
);

When(
  "the User doubleclicks on the Element with selector {string}",
  (elementSelector: string): void => {
    cy.get(elementSelector, {
      timeout: TIMEOUT,
    })
      .first()
      .dblclick();
  },
);

When("the User clicks outside", () => {
  cy.get("body").click();
});

When(
  "the User clicks on the Element with selector {string} within {string}",
  (elementSelector: string, contextSelector: string): void => {
    cy.get(contextSelector, {
      timeout: TIMEOUT,
    }).within((): void => {
      cy.get(elementSelector).first().click();
    });
  },
);

Given(
  "the User selects {string} in the DropDown Element with ID {string}",
  (selectedOption: string, elementId: string): void => {
    cy.get(`#${elementId}`, {
      timeout: TIMEOUT,
    })
      .parent()
      .click({ scrollBehavior: "center" });
    cy.get(".v-list-item__content").contains(selectedOption).click();
  },
);

Given(
  "the User selects option with Cypress ID {string} in the Select with Cypress ID {string}",
  (optionCypressID: string, selectCypressID: string): void => {
    cy.getByCypressID(`${selectCypressID} mm-select-wrapper`).click({
      force: true,
    });
    cy.getByCypressID(`${selectCypressID} ${optionCypressID}`).click({
      force: true,
    });
  },
);

Given(
  "the User selects autocomplete option with Cypress ID {string} in the Select with Cypress ID {string}",
  (optionCypressID: string, selectCypressID: string): void => {
    cy.getByCypressID(`${selectCypressID}`).click({
      force: true,
    });
    cy.getByCypressID(`${selectCypressID} ${optionCypressID}`).click({
      force: true,
    });
  },
);

Given(
  "the User selects {string} from List with ID {string}",
  (selectedOption: string, elementId: string): void => {
    cy.get(`#${elementId} .v-list-item .v-checkbox`)
      .contains(selectedOption)
      .click();
  },
);

Then("the URL should contain the param {string}", (paramName: string): void => {
  cy.url().should("contain", `${paramName}=`);
});

Then(
  "the URL should contain the param {string} as {string}",
  (paramName: string, paramValue: string): void => {
    cy.url().should(
      "contain",
      `${paramName}=${encodeURIComponent(paramValue)}`,
    );
  },
);

Given("the User is using an {string} device", (deviceName: string): void => {
  cy.viewport(deviceName);
});

Given("the intercepted requests have resolved", (): void => {
  if (context.aliases.length === 0) {
    return;
  }
  cy.wait(context.aliases.map((alias: string): string => `@${alias}`));
  context.aliases = [];
});

Given(
  "the key {string} with data {string} should be set in localStorage",
  (key: string, value: string) => {
    cy.window().then((window) => {
      window.localStorage.setItem(key, value);
    });
  },
);
