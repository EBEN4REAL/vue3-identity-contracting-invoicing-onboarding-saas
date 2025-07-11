import { Given } from "cypress-cucumber-preprocessor/steps";
import { CyHttpMessages } from "cypress/types/net-stubbing";
import config from "../../../../src/mm.config.json";
import { UserProfileMM } from "../../../../src/auth/auth.types";
import { getUserIdTokenPayload } from "../users";
import JWT from "expo-jwt";
import { userManager } from "../../../../src/auth/auth.service";
import { spConfigs } from "../../fixtures/settings";

Given("the IAM OAuth Authorize redirects to the Login page", (): void => {
  cy.intercept(
    "GET",
    `${config.iam.url}/oauth2/authorize?*`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      const nextUrl: string = `${config.iam.url}/oauth2/authorize`;
      req.redirect(
        `${config.app.url}/login?next_url=${encodeURIComponent(nextUrl)}&csrf_token=CSRF_TOKEN`,
        307,
      );
    },
  );
});

Given("the IAM OAuth Authorize redirects to the Signup page", (): void => {
  cy.intercept(
    "GET",
    `${config.iam.url}/oauth2/authorize?*`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      const nextUrl: string = `${config.iam.url}/oauth2/authorize`;
      req.redirect(
        `${config.app.url}/signup?next_url=${encodeURIComponent(nextUrl)}&csrf_token=CSRF_TOKEN`,
        307,
      );
    },
  );
});

Given(
  "the IAM OAuth Authorize redirects to the Login page with sp {string}",
  (id: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.iam.url}/oauth2/authorize`;
        const sp: string = spConfigs[id];
        req.redirect(
          `${config.app.url}/login?next_url=${encodeURIComponent(nextUrl)}&csrf_token=CSRF_TOKEN&sp=${sp}`,
          307,
        );
      },
    );
  },
);

Given(
  "the IAM OAuth Authorize redirects to the Login page with username {string}",
  (username: string): void => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
        req.redirect(
          `${config.app.url}/login?next_url=${encodeURIComponent(nextUrl)}&username=${username}&csrf_token=CSRF_TOKEN`,
          307,
        );
      },
    );
  },
);

Given(
  "the IAM OAuth Authorize with stage 0 redirects to the Login page with username {string}",
  (username: string): void => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
        req.redirect(
          `${config.app.url}/login?stage=0&next_url=${encodeURIComponent(nextUrl)}&username=${username}&csrf_token=CSRF_TOKEN`,
          307,
        );
      },
    );
  },
);

Given(
  "the IAM OAuth Authorize with stage 3 redirects to the Login page with username {string}",
  (username: string): void => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
        req.redirect(
          `${config.app.url}/login?stage=3&next_url=${encodeURIComponent(nextUrl)}&username=${username}&csrf_token=CSRF_TOKEN&code=CODE`,
          307,
        );
      },
    );
  },
);

Given(
  "the IAM OAuth Authorize redirects to the Signup Confirmation",
  (): void => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const url = `${config.app.url}/signup/confirmation`;
        req.redirect(url, 200);
      },
    );
  },
);

Given("the IAM OAuth Authorize redirects to the Signup Page", (): void => {
  cy.intercept(
    "GET",
    `${config.idp.url}/oauth2/authorize?*`,
    async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
      req.redirect(`${config.app.url}/signup`, 307);
    },
  );
});

Given(
  "the IAM OAuth Authorize redirects to the Signup Page with sp configs {string}",
  (id: string): void => {
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        const nextUrl: string = `${config.idp.url}/oauth2/authorize`;
        const sp: string = spConfigs[id];
        req.redirect(
          `${config.app.url}/signup?stage=0&next_url=${encodeURIComponent(nextUrl)}&csrf_token=CSRF_TOKEN&sp=${sp}`,
          307,
        );
      },
    );
  },
);

Given(
  "the IAM OAuth Authorize redirects to Authorized for User {string}",
  (userId: string): void => {
    const idTokenPayload: UserProfileMM = getUserIdTokenPayload(userId);
    const idToken: string = JWT.encode(idTokenPayload, "secret");
    cy.intercept("POST", `${config.idp.url}/oauth2/token`, {
      statusCode: 200,
      body: {
        expires_in: 120,
        refresh_token_expires_in: 86400,
        scope: "profile email openid",
        token_type: "Bearer",
        id_token: idToken,
        access_token: idToken,
      },
    });
    cy.intercept(
      "GET",
      `${config.idp.url}/oauth2/authorize?*`,
      async (req: CyHttpMessages.IncomingHttpRequest): Promise<void> => {
        await userManager.settings.stateStore.set(
          "state",
          JSON.stringify({
            id: "state",
            client_id: config.idp.clientId,
            authority: userManager.settings.authority,
          }),
        );
        req.redirect(`${config.app.url}/authorized?state=state&code=code`, 307);
      },
    );
  },
);

Given(
  "the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User {string}",
  (userId: string): void => {
    const idTokenPayload: UserProfileMM = getUserIdTokenPayload(userId);
    const idToken: string = JWT.encode(idTokenPayload, "secret");
    cy.intercept("POST", `${config.idp.url}/oauth2/token`, {
      statusCode: 200,
      body: {
        expires_in: 1800,
        refresh_token_expires_in: 86400,
        scope: "profile email openid onboarding",
        token_type: "Bearer",
        id_token: idToken,
        access_token: idToken,
      },
    });
  },
);

Given("the IAM Logout redirects to {string}", (path: string): void => {
  cy.intercept(
    "GET",
    `${config.idp.url}/oauth2/logout?*`,
    async (req: CyHttpMessages.IncomingHttpRequest) => {
      req.redirect(`${config.app.url}${path}`, 307);
    },
  );
});

Given("the IAM Logout Front Channel has been intercepted", (): void => {
  cy.intercept(
    "GET",
    `${config.idp.url}/oauth2/logout/frontchannel?client_id=*`,
    {
      statusCode: 200,
      body: "<html><head></head></html>",
    },
  );
});
