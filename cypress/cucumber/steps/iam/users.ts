import { Given } from "cypress-cucumber-preprocessor/steps";
import users, { User } from "../../fixtures/users";
import { TIMEOUT } from "../app";
import { context } from "../app";
import {
  OrganizationRead,
  OrganizationUserImportRead,
  PaginationSchema_UserRead_,
  UserRead,
} from "../../../../src/iam/iam.types";
import config from "../../../../src/mm.config.json";
import organizations from "../../fixtures/organizations";
import { TableResponse } from "../../../../src/mm_ui_kit/src/types/table.types";
import { webauthnRegistrationCredentials } from "../../fixtures/organization/webauthn";
import { importing } from "../../fixtures/organization/users_import";

Given(
  "the IAM User request has been intercepted to return the User {string}",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept("GET", `${config.iam.url}/iam/users/${user.id}`, {
      statusCode: 200,
      body: user,
    }).as("iamUserRead");
  },
);

Given(
  "the IAM User @me request has been intercepted to return the service-provider User @me",
  (): void => {
    cy.intercept("GET", `${config.iam.url}/iam/service-provider-users/@me`, {
      statusCode: 200,
      body: {
        onboarding_completed: true,
        onboarding_organization_completed: true,
      },
    });
  },
);

Given(
  "the IAM Update User @me request has been intercepted to return the User {string}",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept("PATCH", `${config.iam.url}/iam/users/@me`, {
      statusCode: 200,
      body: user,
    }).as("iamUserUpdate");
  },
);

Given("the IAM User request has been completed", (): void => {
  cy.wait("@iamUserRead", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM Users request has been intercepted to return the Users {string}",
  (userIds: string): void => {
    const userIdsArr: string[] = userIds.split(",") || [];
    const usersPagination: PaginationSchema_UserRead_ = {
      offset: 0,
      limit: 10,
      results: userIdsArr.map((userId: string) => users[userId]),
      size: userIdsArr.length > 10 ? 10 : userIdsArr.length,
      total: userIdsArr.length,
    };
    cy.intercept("GET", `${config.iam.url}/iam/users/?*`, {
      statusCode: 200,
      body: usersPagination,
    }).as("iamUsersRead");
    context.aliases.push("iamUsersRead");
  },
);

Given("the IAM Users request has been completed", (): void => {
  cy.wait("@iamUsersRead", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM Users request has been intercepted to return the Users {string} with query params {string}",
  (userIds: string, queryParams: string): void => {
    const userIdsArr: string[] = userIds.split(",") || [];
    const usersPagination: TableResponse<UserRead> = {
      offset: 0,
      limit: 10,
      results: userIdsArr.map((userId: string) => users[userId]),
      size: userIdsArr.length,
      total: userIdsArr.length,
    };

    const url = `${config.iam.url}/iam/users/?offset=0&limit=10&${queryParams}`;

    cy.intercept("GET", url, {
      statusCode: 200,
      body: usersPagination,
    }).as(`iamUsersRead-${queryParams}`);
  },
);

Given(
  "the IAM Users request has been completed with query params {string}",
  (queryParams: string) => {
    cy.wait(`@iamUsersRead-${queryParams}`, {
      timeout: TIMEOUT,
    });
  },
);

Given(
  "the IAM User {string} Reset Password request has been intercepted",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/users/${user.id}/password-reset`,
      {
        statusCode: 201,
        body: {},
      },
    ).as("resetUserPassword");
  },
);

Given("the IAM User password reset request has been completed", (): void => {
  cy.wait("@resetUserPassword", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM User {string} Reset TOTP request has been intercepted",
  (userId: string): void => {
    const user: User = users[userId];

    cy.intercept("DELETE", `${config.iam.url}/iam/users/${user.id}/totp`, {
      statusCode: 201,
      body: null,
    }).as("resetAdminUserTOTP");
  },
);

Given("the IAM User TOTP reset request has been completed", () => {
  cy.wait(`@resetAdminUserTOTP`);
});

Given(
  "the IAM disable User request has been intercepted for User {string}",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept("PUT", `${config.iam.url}/iam/users/${user.id}/disable`, {
      statusCode: 200,
      body: {},
    }).as("disableUser");
  },
);

Given("the IAM disable User request has been completed", (): void => {
  cy.wait("@disableUser", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM Organization User {string} from Organization {string} Update request with field {string} and value {string} has been intercepted",
  (
    userId: string,
    organizationId: string,
    field: string,
    value: string,
  ): void => {
    const user: User = users[userId];
    const organization: OrganizationRead = organizations[organizationId];
    user[field] = value;
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${user.id}`,
      {
        statusCode: 200,
        body: user,
      },
    );
  },
);

Given(
  "the IAM User @me social accounts request has been intercepted to return {string}",
  (accounts: string): void => {
    const accountsArr: string[] = accounts
      .split(",")
      .filter((account: string): boolean => account !== "");
    cy.intercept("GET", `${config.iam.url}/iam/users/@me/social-accounts`, {
      statusCode: 200,
      body: accountsArr.map((account: string) => ({
        account_type: account.split("-")[0],
        username: account.split("-")[1],
      })),
    });
  },
);

Given(
  "the IAM Delete User @me Social Account request has been intercepted for Type {string}",
  (type: string): void => {
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/users/@me/social-accounts/${type}`,
      {
        statusCode: 204,
        body: {},
      },
    );
  },
);

Given(
  "the IAM GET User @me TOTP request has been intercepted to return 404",
  (): void => {
    cy.intercept("GET", `${config.iam.url}/iam/users/@me/totp`, {
      statusCode: 404,
      body: {},
    });
  },
);

Given(
  "the IAM GET User @me Webathn request has been intercepted to return 404",
  (): void => {
    cy.intercept("GET", `${config.iam.url}/iam/users/@me/webauthn`, {
      statusCode: 404,
      body: {},
    }).as("iamUserWebAuthnGET");
  },
);

Given("the IAM GET User @me Webauthn request has been completed", (): void => {
  cy.wait("@iamUserWebAuthnGET", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM GET User @me Webathn setup request has been intercepted to return confirmed Webauthn details with Id {string}",
  (webauthnId: string): void => {
    const webauthnInfo = webauthnRegistrationCredentials[webauthnId];
    cy.intercept("GET", `${config.iam.url}/iam/users/@me/webauthn`, {
      statusCode: 201,
      body: webauthnInfo,
    }).as("iamUserWebAuthnInfoGET");
  },
);

Given(
  "the IAM GET User @me Webauthn setup info request has been completed",
  (): void => {
    cy.wait("@iamUserWebAuthnInfoGET", {
      timeout: TIMEOUT,
    });
  },
);

Given(
  "the IAM DELETE User @me Webauthn request has been intercepted to reset Webauthn",
  (): void => {
    cy.intercept("DELETE", `${config.iam.url}/iam/users/@me/webauthn`, {
      statusCode: 204,
      body: {},
    }).as("iamUserWebAuthnDELETE");
  },
);

Given(
  "the IAM DELETE User @me Webauthn reset request has been completed",
  (): void => {
    cy.wait("@iamUserWebAuthnDELETE", {
      timeout: TIMEOUT,
    });
  },
);

Given(
  "the IAM GET User @me TOTP request has been intercepted to return confirmed TOTP",
  (): void => {
    cy.intercept("GET", `${config.iam.url}/iam/users/@me/totp`, {
      statusCode: 200,
      body: {
        confirmed: true,
      },
    });
  },
);

Given(
  "the IAM POST User @me TOTP request has been intercepted to return qr_url with secret {string}",
  (secret: string): void => {
    cy.intercept("POST", `${config.iam.url}/iam/users/@me/totp`, {
      statusCode: 201,
      body: {
        qr_url: `otpauth://totp/Acme%20Inc.:user%40metricsmatter.com?secret=${secret}&issuer=Acme%20Inc.`,
      },
    });
  },
);

Given(
  "the IAM POST User @me Webauthn request has been intercepted to return webauthn options {string}",
  (webauthn_options: string): void => {
    const webauthn_Options = {
      webauthn_options,
    };
    cy.intercept("POST", `${config.iam.url}/iam/users/@me/webauthn`, {
      statusCode: 201,
      body: webauthn_Options,
    }).as("iamUserWebAuthnPOST");
  },
);

Given("the IAM POST User @me Webauthn request has been completed", (): void => {
  cy.wait("@iamUserWebAuthnPOST", {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM PUT User @me Webauthn setup request has been intercepted to verify and complete Webauthn setup with WebauthnCredentialId {string}",
  (webauthnCredentialId: string): void => {
    const result = webauthnRegistrationCredentials[webauthnCredentialId];
    cy.intercept("PUT", `${config.iam.url}/iam/users/@me/webauthn`, {
      statusCode: 201,
      body: result,
    }).as("iamUserWebAuthnPUT");
  },
);

Given(
  "the IAM PUT User @me Webauthn setup request has been completed",
  (): void => {
    cy.wait("@iamUserWebAuthnPUT", {
      timeout: TIMEOUT,
    });
  },
);

Given(
  "the IAM PUT User @me TOTP request has been intercepted to return confirmed TOTP and backup codes {string}",
  (backupCodes: string): void => {
    const backup_codes: string[] = backupCodes.split(",");
    cy.intercept("PUT", `${config.iam.url}/iam/users/@me/totp`, {
      statusCode: 201,
      body: {
        confirmed: true,
        backup_codes,
      },
    });
  },
);

Given(
  "the IAM PUT User @me Email OTP request has been intercepted to update user Email OTP setting",
  (): void => {
    const url = `${config.iam.url}/iam/users/@me/email-otp`;
    cy.intercept("PUT", url, {
      statusCode: 201,
      body: {
        enabled: true,
      },
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM PUT User @me Magic Link request has been intercepted to update user magic link setting",
  (): void => {
    cy.intercept("PUT", `${config.iam.url}/iam/users/@me/magic_link`, {
      statusCode: 201,
      body: {
        enabled: true,
      },
    }).as("updateUserMagicLink");
  },
);

Given("the IAM PUT User @me Magic Link request has been completed", () => {
  cy.wait(`@updateUserMagicLink`, {
    timeout: TIMEOUT,
  });
});

Given(
  "the IAM DELETE User @me TOTP request has been intercepted to delete TOTP",
  (): void => {
    cy.intercept("DELETE", `${config.iam.url}/iam/users/@me/totp`, {
      statusCode: 204,
      body: {},
    });
  },
);

Given(
  "the IAM PUT password request with 406 status response has been intercepted",
  (): void => {
    const url = `${config.iam.url}/iam/users/@me/password`;
    cy.intercept("PUT", url, {
      statusCode: 406,
    }).as(url);

    context.aliases.push(url);
  },
);

Given(
  "the IAM POST password request with 406 status response has been intercepted",
  (): void => {
    const url = `${config.iam.url}/iam/users/@me/password`;
    cy.intercept("POST", url, {
      statusCode: 406,
    }).as(url);

    context.aliases.push(url);
  },
);

Given(
  "the IAM PUT password successful request with override pwned has been intercepted",
  (): void => {
    const url = `${config.iam.url}/iam/users/@me/password?override_pwned=true`;
    cy.intercept("PUT", url, {
      statusCode: 200,
    }).as(url);

    context.aliases.push(url);
  },
);

Given(
  "the IAM POST password successful request with override pwned has been intercepted",
  (): void => {
    const url = `${config.iam.url}/iam/users/@me/password?override_pwned=true`;
    cy.intercept("POST", url, {
      statusCode: 200,
    }).as(url);

    context.aliases.push(url);
  },
);

Given(
  "the IAM Organization Users Imports has been intercepted to return error 409 for Organization {string}",
  (organizationFixtureId: string): void => {
    const organization: OrganizationRead = organizations[organizationFixtureId];
    const url = `${config.iam.url}/iam/organizations/${organization.id}/users/imports`;
    cy.intercept("POST", url, {
      statusCode: 409,
      body: {
        detail: "Conflict",
      },
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM Organization Users Imports has been intercepted to return error 400 for Organization {string}",
  (organizationFixtureId: string): void => {
    const organization: OrganizationRead = organizations[organizationFixtureId];
    const url = `${config.iam.url}/iam/organizations/${organization.id}/users/imports`;
    cy.intercept("POST", url, {
      statusCode: 400,
      body: {
        detail: "Bad Request",
      },
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM Organization Users Imports has been intercepted to return Accepted for import {string} for Organization {string}",
  (importFixtureId: string, organizationFixtureId: string): void => {
    const importRead: OrganizationUserImportRead = importing[importFixtureId];
    const organization: OrganizationRead = organizations[organizationFixtureId];
    const url = `${config.iam.url}/iam/organizations/${organization.id}/users/imports`;
    cy.intercept("POST", url, {
      statusCode: 202,
      body: importRead,
    }).as(url);
    context.aliases.push(url);
  },
);
Given(
  "the IAM Organization Users Imports has been intercepted to return status for import {string} for Organization {string}",
  (importFixtureId: string, organizationFixtureId: string): void => {
    const importRead: OrganizationUserImportRead = importing[importFixtureId];
    const organization: OrganizationRead = organizations[organizationFixtureId];
    const url = `${config.iam.url}/iam/organizations/${organization.id}/users/imports/${importRead.id}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: importRead,
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM DELETE Admin User with ID {string} request has been intercepted",
  (userId: string): void => {
    const organizationUser: User = users[userId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/users/${organizationUser.user_id}`,
      {
        statusCode: 204,
        body: null,
      },
    ).as("deleteAdminUser");
  },
);

Given("Admin User has been deleted successfuly", () => {
  cy.wait(`@deleteAdminUser`);
});
