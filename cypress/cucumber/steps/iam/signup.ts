import { Given, Then } from "cypress-cucumber-preprocessor/steps";
import { CyHttpMessages } from "cypress/types/net-stubbing";
import config from "../../../../src/mm.config.json";

Given(
  "the IAM POST Signup redirects to the Signup page with Success for Email {string}",
  (email: string): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup?status=SUCCESS&username=${email}&next_url=NEXT_URL&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Signup redirects to the Signup page with Error {string} and Description {string}",
  (error: string, description: string): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup?status=ERROR&error=${error}&error_description=${description}&next_url=NEXT_URL&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Signup Confirmation redirects to the Signup Confirmation page with Error Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/confirmation*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/confirmation?status=ERROR&error=MISSING_OR_INVALID_PASSWORD&error_description=Missing or Invalid Password&token=TOKEN&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Signup Confirmation redirects to the Signup Confirmation page with Success Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/confirmation*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/confirmation?status=SUCCESS`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Signup TOTP redirects to the Signup Confirmation page with Success Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/totp*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/confirmation?status=SUCCESS`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Signup Confirmation redirects to the Signup Confirmation page with Success Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/confirmation*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/confirmation?status=SUCCESS`,
          302,
        );
      },
    );
  },
);

Given("the IAM Signup with Webauthn POST request has been intercepted", () => {
  cy.intercept(
    "POST",
    `${config.idp.url}/signup/webauthn`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      req.redirect(
        `${config.app.url}/signup/confirmation?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&status=SUCCESS&username=user@example.com&signup_completed=SD3T2Lh8nEHtLWTm&outcome=None`,
        302,
      );
    },
  ).as("signupWithWebauthn");
});

Given(
  "the IAM POST MFA Signup redirects to TOTP screen when TOTP MFA method is selected",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/mfa*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/totp?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&username=eben-mfa-9%40test.com&qr_url=otpauth%3A%2F%2Ftotp%2FAcme%2520Inc.%3Aeben-mfa-9%2540test.com%3Fsecret%3D2J7OIUVJABILBYOFZKVR5VMWCXGGPAWH%26issuer%3DAcme%2520Inc.`,
          302,
        );
      },
    ).as("signupTOTPMFA");
  },
);

Given(
  "the IAM POST MFA Signup redirects to Webauthn screen when Webauthn MFA method is selected",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/mfa*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/webauthn?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&username=eben-mfa-9%40test.com&qr_url=otpauth%3A%2F%2Ftotp%2FAcme%2520Inc.%3Aeben-mfa-9%2540test.com%3Fsecret%3D2J7OIUVJABILBYOFZKVR5VMWCXGGPAWH%26issuer%3DAcme%2520Inc.`,
          302,
        );
      },
    ).as("signupWebauthnMFA");
  },
);

Given(
  "the IAM POST MFA Signup redirects to Email OTP screen when Email OTP MFA method is selected",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/signup/mfa*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/signup/email-otp?next_url=NEXT_URL&csrf_token=c90de3f9daf38bfcdeac7f0000d1f06491255f01&username=eben-mfa-10%40test.com`,
          302,
        );
      },
    ).as("signupEmailOTPMFA");
  },
);

Given(
  "the IAM POST request to signup with Email OTP has been intercepted",
  (): void => {
    cy.intercept("POST", `${config.idp.url}/signup/email-otp*`).as(
      "signupWithEmailOTP",
    );
  },
);

Then("the user should be signed up with Email OTP", () => {
  cy.wait("@signupWithEmailOTP");
  // cy.url().should("include", `/signup/email-otp`);
});

Then("the user should be redirected to Email OTP page", () => {
  cy.wait("@signupEmailOTPMFA");
  cy.url().should("include", `/signup/email-otp`);
});

Then("the user should be redirected to Webauthn page", () => {
  cy.wait("@signupWebauthnMFA");
  cy.url().should("include", `/signup/webauthn`);
});

Then("the user should be redirected to TOTP page", () => {
  cy.wait("@signupTOTPMFA");
  cy.url().should("include", `/signup/totp`);
});

Then("the user should be redirected to signup confirmation page", () => {
  cy.wait("@signupWithWebauthn");
  cy.url().should("include", `/signup/confirmation`);
});
