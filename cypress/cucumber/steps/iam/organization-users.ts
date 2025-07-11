import { Given } from "cypress-cucumber-preprocessor/steps";
import users, { User } from "../../fixtures/users";
import organizations, { Organization } from "../../fixtures/organizations";
import config from "../../../../src/mm.config.json";
import {
  OrganizationGroupRead,
  OrganizationRead,
  OrganizationUserRead,
} from "../../../../src/iam/iam.types";
import { TableResponse } from "../../../../src/mm_ui_kit/src/types/table.types";
import organizationGroups from "../../fixtures/organization/groups";
import organizationUsers from "../../fixtures/organization/users";
import organizationJoinRequests from "../../fixtures/onboarding/organizationJoinRequests";
import { orgUsers } from "../../fixtures/service-provider/organizations";

Given(
  "the IAM Organization User request has been intercepted to return the Organization User {string}",
  (organizationUserId: string): void => {
    const organizationUser: OrganizationUserRead =
      organizationUsers[organizationUserId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organizationUser.organization.id}/users/${organizationUser.id}`,
      {
        statusCode: 200,
        body: organizationUser,
      },
    );
  },
);

Given(
  "the IAM Organization User request has been intercepted to return the User {string} from Organization {string}",
  (userId: string, organizationId: string): void => {
    const user: User = users[userId];
    const organization: OrganizationRead = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${user.id}`,
      {
        statusCode: 200,
        body: {
          id: user.id,
          user_id: user.id,
          job_role: "DEV",
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          unit: user.unit,
          organization: user.organization,
        },
      },
    );
  },
);

Given(
  "the IAM Organization Users request has been intercepted to return Users {string} from Organization {string}",
  (usersIds: string, organizationId: string): void => {
    const organization: OrganizationRead = organizations[organizationId];
    const usersRes = usersIds.split(",").map((userId: string) => users[userId]);
    const usersPagination: TableResponse<OrganizationUserRead> = {
      offset: 0,
      limit: 10,
      results: usersRes,
      size: usersRes.length > 10 ? 10 : usersRes.length,
      total: usersRes.length,
    };
    const url = `${config.iam.url}/iam/organizations/${organization.id}/users*`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: usersPagination,
    }).as("getOraganizationUsers");
  },
);

Given("the IAM Organization Users request has been completed", (): void => {
  cy.wait("@getOraganizationUsers");
});

Given(
  "the IAM Organization Users request has been intercepted to return Users {string} from Organization {string} with query params {string}",
  (usersIds: string, organizationId: string, queryParams: string): void => {
    const organization: OrganizationRead = organizations[organizationId];
    const usersRes = usersIds.split(",").map((userId: string) => users[userId]);
    const usersPagination: TableResponse<OrganizationUserRead> = {
      offset: 0,
      limit: 10,
      results: usersRes,
      size: usersRes.length,
      total: usersRes.length,
    };

    const url = `${config.iam.url}/iam/organizations/${organization.id}/users?limit=10&offset=0&status=A&${queryParams}`;

    cy.intercept("GET", url, {
      statusCode: 200,
      body: usersPagination,
    }).as(`getOraganizationUsers-${queryParams}`);
  },
);

Given(
  "the IAM Organization Users request has been completed with query params {string}",
  (queryParams: string) => {
    cy.wait(`@getOraganizationUsers-${queryParams}`);
  },
);

Given(
  "the IAM Organization request has been intercepted to return Group {string} from Organization {string}",
  (groupId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}`,
      {
        statusCode: 200,
        body: group,
      },
    );
  },
);

Given(
  "the IAM Organization add User request has been intercepted to return error from Organization {string} and Group {string}",
  (organizationId: string, groupId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users`,
      {
        statusCode: 400,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization invite User request has been intercepted to return error from Organization {string}",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/users`,
      {
        statusCode: 409,
        body: { detail: "Organization User test@test.com already exists" },
      },
    );
  },
);

Given(
  "the IAM Organization invite User request has been intercepted to return invited users from Organization {string}",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/users`,
      {
        statusCode: 200,
        body: users,
      },
    );
  },
);

Given(
  "the IAM Organization ID {string} with Group ID {string} with User ID {string} delete User from organization request has been intercepted to delete User",
  (organizationId: string, groupId: string, userId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users/${userId}`,
      {
        statusCode: 204,
        body: orgUsers[userId],
      },
    );
  },
);

Given(
  "the IAM Organization User request has been intercepted to return the Organization User {string} from Organization {string}",
  (userId: string, organizationId: string): void => {
    const organizationUser: OrganizationUserRead = organizationUsers[userId];
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${organizationUser.user_id}`,
      {
        statusCode: 200,
        body: {
          user_id: organizationUser.user_id,
          status: organizationUser.status,
        },
      },
    );
  },
);

Given(
  "the IAM Organization {string} Check Request Status has been intercepted to return the Request Status {string}",
  (orgId: string, status: string): void => {
    const organization: Organization = organizations[orgId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/@me`,
      {
        statusCode: 200,
        body: organizationJoinRequests[status],
      },
    );
  },
);

Given(
  "the IAM Organization {string} Check Request Status has been intercepted to return the Request Status not found",
  (orgId: string): void => {
    const organization: Organization = organizations[orgId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/@me`,
      {
        statusCode: 404,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization add User request has been intercepted to add Users {string} from Organization {string} to Group {string}",
  (usersIDs: string, organizationId: string, groupId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    const usersRes = usersIDs.split(",").map((userId) => users[userId]);
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users`,
      {
        statusCode: 201,
        body: usersRes,
      },
    );
  },
);

Given(
  "the IAM Organization delete Organization User with ID {string} from Organization {string} request has been intercepted",
  (userId: string, organizationId: string): void => {
    const organizationUser: User = users[userId];
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${organizationUser.user_id}`,
      {
        statusCode: 204,
        body: null,
      },
    );
  },
);

Given(
  "the IAM Organization reset Organization User password with ID {string} from Organization {string} request has been intercepted",
  (userId: string, organizationId: string): void => {
    const organizationUser: User = users[userId];
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${organizationUser.user_id}/password-reset`,
      {
        statusCode: 201,
        body: null,
      },
    ).as("resetUserPassword");
  },
);

Given("Organization User Password has been reset successfuly", () => {
  cy.wait(`@resetUserPassword`);
});

Given(
  "the IAM Organization reset Organization User TOTP with ID {string} from Organization {string} request has been intercepted",
  (userId: string, organizationId: string): void => {
    const organizationUser: User = users[userId];
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${organizationUser.id}/totp`,
      {
        statusCode: 201,
        body: null,
      },
    ).as("resetOrganizationUserTOTP");
  },
);

Given("the Organization User TOTP has been reset successfuly", () => {
  cy.wait(`@resetOrganizationUserTOTP`);
});

Given(
  "the IAM Disable Organization User request has been intercepted to return the User {string} from Organization {string}",
  (userId: string, organizationId: string): void => {
    const user: User = users[userId];
    const organization: OrganizationRead = organizations[organizationId];
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${user.id}/disable`,
      {
        statusCode: 200,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization update Organization User with ID {string} for Organization {string} request has been intercepted",
  (userId: string, organizationId: string): void => {
    const organizationUser: OrganizationUserRead = organizationUsers[userId];
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${organizationUser.user_id}`,
      {
        statusCode: 200,
        body: {
          user_id: organizationUser.user_id,
          status: "A",
        },
      },
    );
  },
);

Given(
  "the IAM Organization delete User request has been intercepted to return the User {string} status of {string}",
  (userId: string, organizationId: string): void => {
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${userId}/users/${organizationId}`,
      {
        statusCode: 204,
        body: {},
      },
    );
  },
);
