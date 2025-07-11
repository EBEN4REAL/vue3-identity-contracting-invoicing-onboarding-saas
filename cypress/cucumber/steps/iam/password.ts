import { Given } from "cypress-cucumber-preprocessor/steps";
import { getMode, Mode } from "../app";
import { CyHttpMessages } from "cypress/types/net-stubbing";
import config from "../../../../src/mm.config.json";

Given(
  "the IAM GET Password Forgotten redirects to the Forgotten Password page",
  (): void => {
    if (getMode() === Mode.E2E) {
      return;
    }
    cy.intercept(
      "GET",
      `${config.idp.url}/password/forgotten*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
        req.redirect(
          `${config.app.url}/forgotten-password?next_url=${encodeURIComponent(
            nextUrl,
          )}&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Password Forgotten redirects to the Forgotten Password page with Error Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/password/forgotten*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/forgotten-password?status=ERROR&error=MISSING_OR_INVALID_EMAIL&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Password Forgotten redirects to the Forgotten Password page with Success Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/password/forgotten*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/forgotten-password?status=SUCCESS`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM GET Reset Forgotten redirects to the Reset Password page",
  (): void => {
    if (getMode() === Mode.E2E) {
      return;
    }
    cy.intercept(
      "GET",
      `${config.idp.url}/password/reset*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/reset-password?token=TOKEN&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Reset Forgotten redirects to the Reset Password page with Error Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/password/reset*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(
          `${config.app.url}/reset-password?status=ERROR&error=MISSING_OR_INVALID_PASSWORD&error_description=Missing or Invalid Password&token=TOKEN&csrf_token=CSRF_TOKEN`,
          302,
        );
      },
    );
  },
);

Given(
  "the IAM POST Reset Forgotten redirects to the Reset Password page with Success Status",
  (): void => {
    cy.intercept(
      "POST",
      `${config.idp.url}/password/reset*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        req.redirect(`${config.app.url}/reset-password?status=SUCCESS`, 302);
      },
    );
  },
);
