import { Given } from "cypress-cucumber-preprocessor/steps";
import { webauthnRegistrationCredentials } from "../../fixtures/organization/webauthn";

function grantPermission() {
  return Cypress.automation("remote:debugger:protocol", {
    command: "Browser.grantPermissions",
    params: {
      permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
      origin: window.location.origin,
    },
  });
}

function addVirtualAuthenticator() {
  return Cypress.automation("remote:debugger:protocol", {
    command: "WebAuthn.enable",
    params: {},
  }).then(() => {
    return Cypress.automation("remote:debugger:protocol", {
      command: "WebAuthn.addVirtualAuthenticator",
      params: {
        protocol: "ctap2",
        transport: "internal",
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: false,
      },
    }).then((result) => {
      cy.wrap(result.authenticatorId).as("authenticatorId");
    });
  });
}

function simulateSuccessfulPasskeyInput(operationTrigger: () => void) {
  cy.get("@authenticatorId").then((authenticatorId) => {
    Cypress.automation("remote:debugger:protocol", {
      command: "WebAuthn.setUserVerified",
      params: {
        authenticatorId,
        isUserVerified: true,
      },
    });
  });

  cy.get("@authenticatorId").then((authenticatorId) => {
    return Cypress.automation("remote:debugger:protocol", {
      command: "WebAuthn.setAutomaticPresenceSimulation",
      params: {
        authenticatorId,
        enabled: true,
      },
    });
  });

  operationTrigger();

  cy.get("@authenticatorId").then((authenticatorId) => {
    return Cypress.automation("remote:debugger:protocol", {
      command: "WebAuthn.setAutomaticPresenceSimulation",
      params: {
        authenticatorId,
        enabled: false,
      },
    });
  });
}

Given(
  "the User successfully validates on webauthn after clicking the button with Cypress ID {string} with mock response {string} and parsed options {string}",
  (cypressId: string, mockRespId: string, parsedOptionsId: string) => {
    grantPermission()
      .then(() => addVirtualAuthenticator())
      .then(() => {
        simulateSuccessfulPasskeyInput(() =>
          cy.getByCypressID(cypressId).click.click(),
        );
      })
      .then(() => {
        cy.window().then((win) => {
          const mockRegResp = webauthnRegistrationCredentials[mockRespId];

          // Check if startRegistration is available on the window object
          if (win.simpleWebAuthn && win.simpleWebAuthn.startRegistration) {
            cy.stub(win.simpleWebAuthn, "startRegistration").resolves(
              mockRegResp,
            );
          } else {
            throw new Error(
              "startRegistration is not available in window.simpleWebAuthn",
            );
          }

          const parsedWebauthnOptions =
            webauthnRegistrationCredentials[parsedOptionsId];

          // Stub startRegistration with valid options
          cy.stub(win.simpleWebAuthn, "startRegistration")
            .withArgs(parsedWebauthnOptions)
            .resolves(mockRegResp);

          cy.getByCypressID(cypressId).click.click();
          cy.log("WebAuthn registration was simulated successfully");
        });
      });
  },
);

Given("biometrics registration fails for the user", () => {
  cy.window().then((win) => {
    if (win.navigator.credentials && win.navigator.credentials.create) {
      cy.stub(win.navigator.credentials, "create").callsFake(() => {
        return Promise.reject(new Error("Biometrics Verification Failed"));
      });
    } else {
      throw new Error(
        "navigator.credentials.create is not available in this browser",
      );
    }
  });
});
