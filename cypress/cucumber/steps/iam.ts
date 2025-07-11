import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../src/mm.config.json";
import organizations, { Organization } from "../fixtures/organizations";
import organizationUnits from "../fixtures/organization/units";
import users, { User } from "../fixtures/users";
import {
  organizationsMetrics,
  organizationsMetricsActiveUsers,
  organizationsMetricsFailedLogins,
  organizationsMetricsSignups,
} from "../fixtures/organization/metrics";
import organizationGroups from "../fixtures/organization/groups";
import {
  OrganizationGroupRead,
  OrganizationOIDCRead,
  OrganizationRead,
  OrganizationUnitRead,
  PasswordRequirementRead,
} from "../../../src/iam/iam.types";
import organizationUsers from "../fixtures/organization/users";
import cloneDeep from "lodash.clonedeep";
import { TableResponse } from "../../../src/mm_ui_kit/src/types/table.types";
import passwordRequirements from "../fixtures/password_requirements";
import { orgUsers } from "../fixtures/service-provider/organizations";
import { organizationUnit } from "../fixtures/organization/unit";
import organizationSSOConfig from "../fixtures/organization/sso_config";
import serviceProviders from "../fixtures/service_providers";
import { context } from "./app";

Given(
  "the IAM Organization Groups request has been intercepted to return the Groups {string} from Organization {string}",
  (groupIds: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups*`,
      {
        statusCode: 200,
        body: {
          results: groupIds
            .split(",")
            .map((groupId: string) => organizationGroups[groupId]),
        },
      },
    );
  },
);

Given(
  "the IAM Organization Groups request has been intercepted to return no Groups from Organization {string}",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups*`,
      {
        statusCode: 200,
        body: {
          results: [],
        },
      },
    );
  },
);

Given(
  "the IAM Organization Groups request has been intercepted to return Groups {string} from Organization {string}",
  (groupsIds: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const groupsArr = groupsIds.split(",");
    const validGroups = groupsArr.filter(
      (groupId) => !!organizationGroups[groupId],
    );
    if (validGroups.length !== groupsArr.length) {
      throw new Error(
        "One or more group IDs are not part of the organization.",
      );
    }
    const groupsPagination: TableResponse<OrganizationGroupRead> = {
      offset: 0,
      limit: 10,
      results: validGroups.map((groupId) => organizationGroups[groupId]),
      size: validGroups.length > 10 ? 10 : validGroups.length,
      total: validGroups.length,
    };

    const url = `${config.iam.url}/iam/organizations/${organization.id}/groups`;

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups`,
      {
        statusCode: 200,
        body: groupsPagination,
      },
    ).as(url);
    context.aliases.push(url);
  },
);

Given("the IAM Organization Groups request has been completed", () => {
  cy.wait("@getOrganizationGroups");
});

Given(
  "the IAM Organization Groups request has been intercepted to return Groups {string} for User {string} from Organization {string}",
  (groupsIds: string, userId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const user = users[userId];
    const groupsArr = groupsIds.split(",");
    const groupsPagination: TableResponse<OrganizationGroupRead> = {
      offset: 0,
      limit: 10,
      results: groupsArr.map(
        (groupsId: string) => organizationGroups[groupsId],
      ),
      size: groupsArr.length > 10 ? 10 : groupsArr.length,
      total: groupsArr.length,
    };
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${user.id}/groups?limit=10&offset=0`,
      {
        statusCode: 200,
        body: groupsPagination,
      },
    );
  },
);

Given(
  "the IAM Organization Groups request has been intercepted to return the Groups {string} from Organization {string} with new name {string}",
  (groupIds: string, organizationId: string, newName: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          results: groupIds.split(",").map((groupId: string) => ({
            ...organizationGroups[groupId],
            name: newName,
          })),
        },
      },
    );
  },
);

Given(
  "the IAM Organization Group request has been intercepted to return the Groups {string} from Organization {string} after deleting User with ID {string}",
  (groupId: string, organizationId: string, userId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    const groupWithFilteredUsers = group.users.filter(
      (user) => user.id !== userId,
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups`,
      {
        statusCode: 200,
        body: groupWithFilteredUsers,
      },
    );
  },
);

Given(
  "the IAM Organization Group request has been intercepted to return error after deleting User with ID {string} from the Groups {string} from Organization {string}",
  (userId: string, groupId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users/${userId}`,
      {
        statusCode: 400,
        body: {
          detail: "Error",
        },
      },
    );
  },
);

Given(
  "the IAM Organization Group by ID request has been intercepted to return the Group {string} from Organization {string}",
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
  "the IAM Organization Group by ID request has been intercepted to return the Group {string} with new name {string} from Organization {string}",
  (groupId: string, newName: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}`,
      {
        statusCode: 200,
        body: { ...group, name: newName },
      },
    );
  },
);

Given(
  "the IAM Organization Group by ID request has been intercepted to return the Group {string} with Users {string} from Organization {string}",
  (groupId: string, usersIds: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = cloneDeep(organizationGroups[groupId]);
    group.users = usersIds.split(",").map((userId) => ({
      id: users[userId].id,
      name: `${users[userId].first_name} ${users[userId].last_name}`,
    }));

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
  "the IAM Organization Group by ID request has been intercepted to return error for the Group {string} from Organization {string}",
  (groupId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}`,
      {
        statusCode: 400,
        body: {
          details: "Error",
        },
      },
    );
  },
);

Given(
  "the IAM Organization Metrics request has been intercepted to return the Metrics for Organization {string}",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/metrics`,
      {
        statusCode: 200,
        body: organizationsMetrics[organizationId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/metrics/active-users?*`,
      {
        statusCode: 200,
        body: organizationsMetricsActiveUsers[organizationId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/metrics/signups?*`,
      {
        statusCode: 200,
        body: organizationsMetricsSignups[organizationId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/metrics/failed-logins?*`,
      {
        statusCode: 200,
        body: organizationsMetricsFailedLogins[organizationId],
      },
    );
  },
);

Given(
  "the IAM User @me request has been intercepted to return the User {string}",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept("GET", `${config.iam.url}/iam/users/@me`, {
      statusCode: 200,
      body: user,
    }).as("iamUserRead");
    context.aliases.push("iamUserRead");
  },
);

Given(
  "the IAM User @me sessions request has been intercepted to return IP's {string}",
  (ipAddresses: string): void => {
    const ipAddressesArr: string[] = ipAddresses.split(",");
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/users/@me/sessions?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          results: ipAddressesArr.map((ipAddress: string) => ({
            create_date: "Jul 25, 2024 18:36",
            ip_address: ipAddress,
            session_token: "123",
            user_agent: "Chrome",
            valid_till: "2099-08-05T09:06:48.873205Z",
          })),
        },
      },
    );
  },
);

Given(
  "the IAM User @me delete session by token {string} request has been intercepted",
  (token: string): void => {
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/users/@me/sessions/${token}`,
      {
        statusCode: 204,
        body: "",
      },
    );
  },
);

Given(
  "the IAM login histories @me request has been intercepted to return the User {string}",
  (userId: string): void => {
    const user: User = users[userId];
    cy.intercept("GET", `${config.iam.url}/iam/login-attempts/@me`, {
      statusCode: 200,
      body: user,
    }).as("iamUserRead");
  },
);

Given(
  "the IAM login histories @me request has been intercepted to return IP's {string}",
  (ipAddresses: string): void => {
    const ipAddressesArr: string[] = ipAddresses.split(",");
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/login-attempts/@me?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          results: ipAddressesArr.map((ipAddress: string) => ({
            ip_address: ipAddress,
            session_token: "123",
            user_agent: "Chrome",
          })),
        },
      },
    );
  },
);

Given(
  "the IAM Organization user {string} login histories request has been intercepted to return IP's {string} for Organization {string}",
  (userId: string, ipAddresses: string, organizationId: string): void => {
    const ipAddressesArr: string[] = ipAddresses.split(",");
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organizationId}/users/${userId}/login-attempts?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          results: ipAddressesArr.map((ipAddress: string) => ({
            ip_address: ipAddress,
            session_token: "123",
            user_agent: "Chrome",
          })),
        },
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to return the units of Organization {string}",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 200,
        body: organizationUnit,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the users of Unit {string} of Organization {string} with userId {string}",
  (
    organizationUnitId: string,
    organizationId: string,
    userId: string,
  ): void => {
    const organization = organizations[organizationId];
    const userIdList: string[] = userId.split(",");
    const usersPaginated = {
      offset: 0,
      limit: 10,
      results: userIdList.map((userId: string) => organizationUsers[userId]),
      size: userIdList.length > 10 ? 10 : userIdList.length,
      total: userIdList.length,
    };
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users?organization_unit_id=${organizationUnitId}*`,
      {
        statusCode: 200,
        body: usersPaginated,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return Unit {string} from Organization {string}",
  (unitId: string, organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organizations[organizationId].id}/units/${organizationUnit[unitId].id}`,
      {
        statusCode: 200,
        body: organizationUnit[unitId],
      },
    );
  },
);

Given(
  "the IAM Organization update unit with ID {string} of Organization {string} request has been intercepted to return new unit with name {string}",
  (unitId: string, organizationId: string, unitName: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    organizationUnit.name = unitName;
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unitId}`,
      {
        statusCode: 200,
        body: organizationUnit,
      },
    );
  },
);

Given(
  "the IAM Organization update unit with ID {string} of Organization {string} request has been intercepted to return error",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unitId}`,
      {
        statusCode: 400,
        body: {
          detail: "Error",
        },
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to return the unit {string} of Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    const url = `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: organizationUnit,
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM Organization unit request has been intercepted to return the unit {string} without user {string} of Organization {string}",
  (unitId: string, userId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    const organizationUnitWithoutUser = organizationUnit.users.filter(
      (user) => user.id !== userId,
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}`,
      {
        statusCode: 200,
        body: organizationUnitWithoutUser,
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to update field {string} with value {string} and return the unit {string} of Organization {string}",
  (
    field: string,
    value: string,
    unitId: string,
    organizationId: string,
  ): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    organizationUnit[field] = value;
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}`,
      {
        statusCode: 200,
        body: organizationUnit,
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to create unit {string} with name {string} of Organization {string}",
  (unitId: string, unitName: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = {
      id: unitId,
      name: unitName,
      description: null,
      parent_organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      users: [],
    };
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 201,
        body: organizationUnit,
      },
    );
  },
);

Given(
  "the IAM Organization unit update request has been intercepted to to return error 409 for the unit {string} of Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}`,
      {
        statusCode: 409,
        body: {
          detail: "Conflict",
        },
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to add user to unit {string} within organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}/users`,
      {
        statusCode: 201,
        body: null,
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to remove user {string} from unit {string} within organization {string}",
  (userId: string, unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnit = organizationUnits[organizationId].find(
      (unit) => unit.id === unitId,
    );
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${organizationUnit.id}/organization_users/${userId}`,
      {
        statusCode: 204,
        body: null,
      },
    );
  },
);

Given(
  "the IAM Organization unit request has been intercepted to delete the unit {string} of Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unitId}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to return no units for Organization {string}",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 200,
        body: [],
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to successfully delete unit with ID {string} for Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unitId}`,
      {
        statusCode: 204,
        body: [],
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to return units without unit with ID {string} for Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const organizationUnitsWithoutUnit = organizationUnits[
      organizationId
    ].filter((unit: OrganizationUnitRead) => unit.id !== unitId);
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 200,
        body: organizationUnitsWithoutUnit,
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to return Units for Organization {string}",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 200,
        body: organizationUnits[organizationId],
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to unsuccessfully delete unit with ID {string} for Organization {string}",
  (unitId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unitId}`,
      {
        statusCode: 400,
        body: {
          detail: "Error",
        },
      },
    );
  },
);

Given(
  "the IAM Organization units request has been intercepted to return error for Organization {string}",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/units`,
      {
        statusCode: 400,
        body: {
          detail: "Error",
        },
      },
    );
  },
);

Given(
  "the IAM Organization groups request has been intercepted to return no groups for Organization {string}",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups`,
      {
        statusCode: 200,
        body: {
          results: [],
        },
      },
    );
  },
);

Given(
  "the IAM Organization groups request has been intercepted to add User {string} to Group {string} in Organization {string}",
  (userId: string, groupId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const group = organizationGroups[groupId];
    const user = organizationUsers[userId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/organization_users`,
      {
        statusCode: 201,
        body: [
          {
            id: user.id,
            name: "",
          },
        ],
      },
    );
  },
);

Given(
  "the IAM Organization groups request has been intercepted to add User {string} to Groups {string} in Organization {string}",
  (userId: string, groupId: string, organizationId: string): void => {
    const organization = organizations[organizationId];
    const group = organizationGroups[groupId];
    const user = organizationUsers[userId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users`,
      {
        statusCode: 201,
        body: [
          {
            id: user.id,
            name: "",
          },
        ],
      },
    );
  },
);

Given(
  "the IAM Organization User request has been intercepted to return Groups {string} for the User {string} from Organization {string}",
  (groupsIds: string, userId: string, organizationId: string): void => {
    const user: User = users[userId];
    const organization: Organization = organizations[organizationId];
    const userGroups = groupsIds
      .split(",")
      .map((groupId) => organizationGroups[groupId]);
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/${user.id}/groups?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          results: userGroups,
        },
      },
    );
  },
);

Given(
  "the IAM Organization create Unit Users for Organization {string} request has been intercepted",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const units: OrganizationUnitRead[] = organizationUnits[organizationId];
    const unit = units[0];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/units/${unit.id}/users`,
      {
        statusCode: 200,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization create Group Users for Organization {string} request has been intercepted",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users`,
      {
        statusCode: 200,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization User request has been intercepted to return the Group Users {string} from Organization {string}",
  (userId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}/users*`,
      {
        statusCode: 200,
        body: orgUsers[userId],
      },
    );
  },
);

Given(
  "the IAM Organization create Group for Organization {string} request has been intercepted",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups`,
      {
        statusCode: 201,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization update Group {string} for Organization {string} request has been intercepted",
  (groupId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}`,
      {
        statusCode: 200,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization delete Group {string} for Organization {string} request has been intercepted",
  (groupId: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const group: OrganizationGroupRead = organizationGroups[groupId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/groups/${group.id}`,
      {
        statusCode: 204,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization create Group for Organization {string} request has been intercepted with duplicate error",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/groups`,
      {
        statusCode: 409,
        body: {
          detail: "Conflict",
        },
      },
    );
  },
);

Given(
  "the IAM Email verification has been intercepted to return verification code error",
  () => {
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/signups/email@email.com/verified`,
      {
        statusCode: 422,
        body: {
          detail: "Verification code is invalid",
        },
      },
    );
  },
);

Given(
  "the IAM Email verification has been intercepted to return email not found error",
  () => {
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/signups/email@email.com/verified`,
      {
        statusCode: 404,
        body: {
          detail: "Email not found",
        },
      },
    );
  },
);

Given(
  "the IAM Email verification has been intercepted to return expired code error",
  () => {
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/signups/email@email.com/verified`,
      {
        statusCode: 422,
        body: {
          detail: "Verification code expired",
        },
      },
    );
  },
);

Given(
  "the IAM Email verification has been intercepted to return success",
  () => {
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/signups/email@email.com/verified`,
      {
        statusCode: 200,
        body: {
          email: "email@email.com",
          created_date: new Date().toISOString(),
          expiration_date: new Date().toISOString(),
          verified: true,
          completed: true,
        },
      },
    );
  },
);

Given(
  "the Suborganizations request has been intercepted to return the Suborganizations {string} for Organization {string}",
  (suborgIds: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const suborgIdsArr: string[] = suborgIds.split(",");
    const suborgPagination: TableResponse<OrganizationRead> = {
      offset: 0,
      limit: 10,
      results: suborgIdsArr.map((id: string) => organizations[id]),
      size: suborgIdsArr.length > 10 ? 10 : suborgIdsArr.length,
      total: suborgIdsArr.length,
    };
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/sub-organizations?limit=10&offset=0*`,
      {
        statusCode: 200,
        body: suborgPagination,
      },
    );
  },
);

Given(
  "the Iam Organizations OIDC request has been intercepted to return SSO Config {string} for Organization {string}",
  (ssoConfigId: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const ssoConfig: OrganizationOIDCRead = organizationSSOConfig[ssoConfigId];

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/oidc`,
      {
        statusCode: 200,
        body: ssoConfig,
      },
    ).as("getOrganizationSSOConfig");
  },
);

Given(
  "the IAM Organization OIDC request to get SSO Configuration has been completed",
  () => {
    cy.wait("@getOrganizationSSOConfig");
  },
);

Given(
  "the Iam Organizations OIDC request has been intercepted to add SSO Config {string} for Organization {string}",
  (ssoConfigId: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const ssoConfig = organizationSSOConfig[ssoConfigId];

    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/oidc`,
      {
        statusCode: 200,
        body: ssoConfig,
      },
    ).as("addOrganizationSSOConfig");
  },
);

Given(
  "the IAM Organization OIDC request to add SSO Configuration should have been completed",
  () => {
    cy.wait("@addOrganizationSSOConfig");
  },
);

Given(
  "the Iam Organizations OIDC request has been intercepted to update SSO Config {string} for Organization {string}",
  (ssoConfigId: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const ssoConfig = organizationSSOConfig[ssoConfigId];

    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}/oidc`,
      {
        statusCode: 200,
        body: ssoConfig,
      },
    ).as("updateOrganizationSSOConfig");
  },
);

Given(
  "the IAM Organization OIDC request to update SSO Configuration should have been completed",
  () => {
    cy.wait("@updateOrganizationSSOConfig");
  },
);

Given(
  "the Iam Organizations OIDC request has been intercepted to return no SSO Config for Organization {string}",
  (organizationId: string) => {
    const organization: Organization = organizations[organizationId];

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/oidc`,
      {
        statusCode: 200,
        body: null,
      },
    ).as("getOrganizationWihoutSSOConfig");
  },
);

Given(
  "the IAM Organization OIDC request to return no SSO Configuration has been completed",
  () => {
    cy.wait("@getOrganizationWihoutSSOConfig");
  },
);

Given(
  "the the IAM  Organization OIDC request to remove SSO configuration has been intercepted for Organization {string}",
  (organizationId: string) => {
    const organization: Organization = organizations[organizationId];

    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/oidc`,
      {
        statusCode: 200,
        body: null,
      },
    ).as("removeOrganizationWihoutSSOConfig");
  },
);

Given(
  "the IAM Organization OIDC request to remove SSO Configuration should have been completed",
  () => {
    cy.wait("@removeOrganizationWihoutSSOConfig");
  },
);

Given(
  "the Create Suborganizations request has been intercepted to return success for Organization {string}",
  (organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/sub-organizations`,
      {
        statusCode: 201,
        body: {},
      },
    );
  },
);

Given(
  "the Delete Suborganization {string} for Organization {string} request has been intercepted to return success",
  (suborgId: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const subOrganization: Organization = organizations[suborgId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/sub-organizations/${subOrganization.id}`,
      {
        statusCode: 204,
        body: "deleted",
      },
    );
  },
);

Given(
  "the Delete Suborganization {string} for Organization {string} request has been intercepted to return failure",
  (suborgId: string, organizationId: string) => {
    const organization: Organization = organizations[organizationId];
    const subOrganization: Organization = organizations[suborgId];
    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/organizations/${organization.id}/sub-organizations/${subOrganization.id}`,
      {
        statusCode: 422,
        body: "failed",
      },
    );
  },
);

Given(
  "the password requirements request has been intercepted to return the Password Requirement {string}",
  (key: string): void => {
    const requirements: PasswordRequirementRead[] = passwordRequirements[key];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/settings/password-requirements`,
      {
        statusCode: 200,
        body: requirements,
      },
    );
  },
);

Given("the IAM POST Change Email Request with Success Status", (): void => {
  cy.intercept("PUT", `${config.idp.url}/iam/users/@me/email*`, {
    statusCode: 200,
    body: {},
  });
});

Given("the IAM GET Emails Request with Success Status", (): void => {
  cy.intercept("GET", `${config.idp.url}/iam/users/@me/emails`, {
    statusCode: 200,
    body: {
      emails: [
        {
          email: "user.003@example.com",
          id: "123455",
          verified: true,
          expiration_date: null,
        },
        {
          email: "test@metrics.com",
          id: "123455",
          verified: false,
          expiration_date: null,
        },
      ],
    },
  });
});

Given(
  "the IAM POST Verify Confirmation redirects to the Email Confirmation page with Success Status for Email {string}",
  (email: string): void => {
    cy.visit(
      `${config.app.url}/email/verification?status=SUCCESS&username=${email}`,
    );
  },
);

Given(
  "the IAM DELETE request to delete user account has been intercepted",
  (): void => {
    const url = `${config.idp.url}/iam/users/@me`;
    cy.intercept("DELETE", url, {
      statusCode: 200,
      body: {},
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM DELETE request to delete user account has been intercepted",
  (): void => {
    cy.intercept("DELETE", `${config.idp.url}/iam/users/@me`, {
      statusCode: 200,
      body: {},
    }).as("iamUserAccountDELETE");
  },
);

Given(
  "the IAM DELETE request to delete user account has been completed",
  () => {
    cy.wait("@iamUserAccountDELETE");
  },
);

Given(
  "the IAM DELETE Email Request with Success Status {string}",
  (email_id: string): void => {
    cy.intercept(
      "DELETE",
      `${config.idp.url}/iam/users/@me/emails/${email_id}`,
      {
        statusCode: 204,
        body: {},
      },
    );
  },
);

Given(
  "the IAM GET Service Providers {string} for Organization {string} request has been intercepted",
  (serviceProvidersFixtureId: string, organizationFixtureId: string): void => {
    const organizationId: string = organizations[organizationFixtureId].id;
    const serviceProvidersList = serviceProvidersFixtureId
      .split(",")
      .map(
        (serviceProviderFixtureId) =>
          serviceProviders[serviceProviderFixtureId],
      );
    const queryParams = serviceProvidersList
      .map((serviceProvider) => `service_provider_id=${serviceProvider.id}`)
      .join("&");
    const url: string = `${config.iam.url}/iam/organizations/${organizationId}/service-providers?${queryParams}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: serviceProvidersList,
    }).as("iamGetServiceProviders");
  },
);

Given(
  "the IAM GET Service Providers for Organization request has been completed",
  () => {
    cy.wait("@iamGetServiceProviders");
  },
);
