import { Given, Then } from "cypress-cucumber-preprocessor/steps";
import config from "../../../../src/mm.config.json";
import { CyHttpMessages } from "cypress/types/net-stubbing";
import { loginOrganizations } from "../../fixtures/organization/loginOrganizations";
import organizations from "../../fixtures/organizations";

Given("the IAM Login redirects to the Login page", (): void => {
  cy.intercept(
    "GET",
    `${config.idp.url}/login?*`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
      req.redirect(
        `${config.app.url}/login?next_url=${encodeURIComponent(nextUrl)}&csrf_token=CSRF_TOKEN`,
        307,
      );
    },
  );
});

Given("the IAM Login with Google has been intercepted", (): void => {
  cy.intercept("GET", `${config.idp.url}/login-google?*`, {
    statusCode: 200,
    body: "<html lang='en'>IAM Login with Google</html>",
  });
});

Given("the IAM Login with Microsoft has been intercepted", (): void => {
  cy.intercept("GET", `${config.idp.url}/login-microsoft?*`, {
    statusCode: 200,
    body: "<html lang='en'>IAM Login with Microsoft</html>",
  });
});

Given(
  "the API request for login organizations is intercepted with username {string}",
  (username: string) => {
    cy.intercept(
      "GET",
      `${config.idp.url}/login/organizations?username=${encodeURIComponent(username)}`,
      {
        statusCode: 200,
        body: loginOrganizations,
      },
    ).as("getLoginOrganizations");
  },
);

Given(
  "the POST request for login organization has been intercepted with id {string}",
  (organizationId) => {
    cy.intercept(
      "POST",
      `${config.idp.url}/login-organization?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/sc/organizations/${organizationId}`,
          307,
        );
      },
    ).as("postOrganization");
  },
);

Given(
  "the POST request for login to organization has been intercepted with id {string}",
  (organizationId) => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/sc/organizations/${organizationId}`,
          302,
        );
      },
    ).as("postLoginToOrganization");
  },
);

Given(
  "the IAM Login with SSO POST request has been intercepted with Organization {string}",
  (organizationFixtureId: string): void => {
    const organizationId = organizations[organizationFixtureId].id;

    cy.intercept(
      "POST",
      `${config.idp.url}/login-sso?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/sc/organizations/${organizationId}`,
          307,
        );
      },
    ).as("loginWithSSO");
  },
);

Given(
  "the IAM Login with SSO POST request has been intercepted for Organization Without SSO Configuration",
  () => {
    cy.intercept(
      "POST",
      `${config.idp.url}/login-sso?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/login/sso?error=LOGIN_MISSING_SSO&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    ).as("loginWithSSOForOrganizationWithoutSSO");
  },
);

Given("the IAM Login with Magic Link POST request has been intercepted", () => {
  cy.intercept(
    "POST",
    `${config.idp.url}/login-magic-link?*`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      req.redirect(
        `${config.app.url}/login?next_url=http://localhost/oauth2/authorize&csrf_token=CSRF_TOKEN&username=eben%2Bmagic%40test.com&stage=0&status=SUCCESS`,
        302,
      );
    },
  ).as("loginWithMagicLink");
});

Given(
  "the IAM POST request to login with Email OTP has been intercepted",
  (): void => {
    cy.intercept("POST", `${config.idp.url}/login-email-otp*`).as(
      "loginWithEmailOTP",
    );
  },
);

Then("the user should be logged in with Email OTP", () => {
  cy.wait("@loginWithEmailOTP");
});

Then(
  "the user should be redirected to login page and appropriate email sent success message should be shown",
  () => {
    cy.wait("@loginWithMagicLink");
    cy.url().should("include", `/login`);
  },
);

Then(
  "the user should be redirected to SSO page and appropriate error message should be shown if SSO is not configured",
  () => {
    cy.wait("@loginWithSSOForOrganizationWithoutSSO");
    cy.url().should("include", `/login/sso`);
  },
);

Then(
  "the User should be redirected to the organization dashboard with the Organization Fixture Id {string}",
  (organizationFixtureId: string) => {
    const organizationId = organizations[organizationFixtureId].id;

    cy.wait("@loginWithSSO");
    cy.url().should("include", `/organizations/${organizationId}`);
  },
);

Then(
  "verify that the user is currently in the organization dashboard with the id {string}",
  (organizationId) => {
    cy.wait("@postOrganization");
    cy.url().should("include", `/organizations/${organizationId}`);
  },
);

Then(
  "check that the user is currently logged in the organization dashboard with the id {string}",
  (organizationId) => {
    cy.wait("@postLoginToOrganization");
    cy.url().should("include", `/organizations/${organizationId}`);
  },
);

Then("the login organizations should be displayed", () => {
  cy.wait("@getLoginOrganizations");
});

Then(
  "the User should be redirected to the IAM Login with Google page",
  (): void => {
    cy.url().should("include", `${config.idp.url}/login-google`);
  },
);

Then(
  "the User should be redirected to the IAM Login with Microsoft page",
  (): void => {
    cy.url().should("include", `${config.idp.url}/login-microsoft`);
  },
);
