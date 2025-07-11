import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../src/mm.config.json";

const mockFeatures = (featureName: string, enabled: boolean) => [
  {
    name: "login_history",
    enabled: featureName === "login_history" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "import_organization_users",
    enabled: featureName === "import_organization_users" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "billing_and_invoicing",
    enabled: featureName === "billing_and_invoicing" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "email_otp",
    enabled: featureName === "email_otp" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "sso",
    enabled: featureName === "sso" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "magic_link",
    enabled: featureName === "magic_link" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "webauthn",
    enabled: featureName === "webauthn" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "totp",
    enabled: featureName === "totp" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "login_history",
    enabled: featureName === "login_history" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "access_logs",
    enabled: featureName === "access_logs" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },

  {
    name: "legal_documents",
    enabled: featureName === "legal_documents" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "consents_user",
    enabled: featureName === "consents_user" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
  {
    name: "consents_organization",
    enabled: featureName === "consents_organization" ? enabled : true,
    variant: {
      name: "disabled",
      enabled: false,
      feature_enabled: true,
      featureEnabled: true,
    },
  },
];

Given("the feature flag {string} is enabled", (flag: string): void => {
  cy.intercept("GET", `${config.unleash.url}?*`, {
    statusCode: 200,
    body: {
      toggles: mockFeatures(flag, true),
    },
  });
});

Given("the feature flag {string} is disabled", (flag: string): void => {
  cy.intercept("GET", `${config.unleash.url}?*`, {
    statusCode: 200,
    body: {
      toggles: mockFeatures(flag, false),
    },
  });
});
