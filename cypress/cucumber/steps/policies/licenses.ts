import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../../src/mm.config.json";
import licenses from "../../fixtures/organization/licenses";
import license from "../../fixtures/organization/license";
import {
  allPolicies,
  policies,
} from "../../fixtures/service-provider/policies";
import { policies as agreementsPolicies } from "../../fixtures/organization/policies";
import { userSC } from "../../fixtures/licenses/users";
import { groupSC } from "../../fixtures/licenses/groups";
import { unitSC } from "../../fixtures/licenses/units";
import users from "../../fixtures/users";
import { assignedPolicies } from "../../fixtures/licenses/assignedPolicies";
import { context } from "../app";
import { contactInfo } from "../../fixtures/contact_info";

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string}",
  (licenseFixtureIds: string, organizationId: string): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements*`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    );
  },
);

Given(
  "the Policies Service Agreements request has been intercepted to return no Licenses from Organization {string} with query params {string}",
  (organizationId: string, queryParams: string): void => {
    const results = [];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements?limit=10&offset=0&cancelled=false${queryParams}`,
      {
        statusCode: 200,
        body: {
          results,
          total: 0,
        },
      },
    ).as("getLicenses");
  },
);

Given(
  "the policies service agreements request have been completed successfully",
  () => {
    cy.wait("@getLicenses");
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return NO Licenses from Organization {string}",
  (organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements*`,
      {
        statusCode: 200,
        body: {
          results: [],
          total: 0,
        },
      },
    );
  },
);
Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} without query params",
  (licenseFixtureIds: string, organizationId: string): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements*`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the License {string} from Organization {string}",
  (licenseFixtureId: string, organizationId: string): void => {
    const url = `${config.policies.url}/service-consumers/${organizationId}/agreements/${license[licenseFixtureId].id}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: license[licenseFixtureId],
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string}",
  (licenseFixtureIds: string, organizationId: string): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements?limit=10&offset=0&cancelled=false`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} with query params {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    queryParams: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements${queryParams}`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    ).as(`getPoliciesServiceAgreements-${queryParams}`);
  },
);

Given(
  "the Policies Service Consumers Agreements request has been completed with query params {string}",
  (queryParams: string) => {
    cy.wait(`@getPoliciesServiceAgreements-${queryParams}`);
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} and Organization User {string} with query params {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    organization_user_id: string,
    queryParams: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements?limit=10&offset=0&sort=agreement_type.name:asc&assigned_organization_user_id=${organization_user_id}${queryParams}`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    ).as(`geOrganizationUserLicenses-${queryParams}`);
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} and Organization User {string} without sort with query params {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    organization_user_id: string,
    queryParams: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements?limit=10&offset=0&assigned_organization_user_id=${organization_user_id}${queryParams}`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    ).as(`geOrganizationUserLicenses-${queryParams}`);
  },
);

Given(
  "the organization user licenses request has been completed with query params {string}",
  (queryParams: string) => {
    cy.wait(`@geOrganizationUserLicenses-${queryParams}`);
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to assign the License {string} to Organization User {string} from Organization {string}",
  (
    agreement_id: string,
    organization_user_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/assign-to/organization-user/${organization_user_id}`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to unassign the License {string} from the Organization User {string} from Organization {string}",
  (
    agreement_id: string,
    organization_user_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/unassign-from/organization-user/${organization_user_id}`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return Organization Users {string} for the License {string} from Organization {string}",
  (
    organizationUsersFixtureId: string,
    licenseFixtureId: string,
    organizationId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements/${licenses[licenseFixtureId].id}/organization-users*`,
      {
        statusCode: 200,
        body: userSC[organizationUsersFixtureId],
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return Organization Groups {string} for the License {string} from Organization {string}",
  (
    organizationGroupFixtureId: string,
    licenseFixtureId: string,
    organizationId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements/${licenses[licenseFixtureId].id}/organization-groups*`,
      {
        statusCode: 200,
        body: groupSC[organizationGroupFixtureId],
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return Organization Units {string} for the License {string} from Organization {string}",
  (
    organizationUnitsFixtureId: string,
    licenseFixtureId: string,
    organizationId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements/${licenses[licenseFixtureId].id}/organization-units*`,
      {
        statusCode: 200,
        body: unitSC[organizationUnitsFixtureId],
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return Policies {string} for the License {string} from Organization {string}",
  (
    policiesFixtureId: string,
    licenseFixtureId: string,
    organizationId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements/${licenses[licenseFixtureId].id}/policies`,
      {
        statusCode: 200,
        body: agreementsPolicies[policiesFixtureId],
      },
    ).as("getLicensePolicies");
  },
);

Given("the license policies request has been completed", () => {
  cy.wait("@getLicensePolicies");
});

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} and Group {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    groupId: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/organization-groups/${groupId}/agreements*`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} and Group {string} with query params {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    groupId: string,
    queryParams: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/organization-groups/${groupId}/agreements${queryParams}`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to return the Licenses {string} from Organization {string} and Organization Unit {string}",
  (
    licenseFixtureIds: string,
    organizationId: string,
    organization_unit_id: string,
  ): void => {
    const licenseIdsArr: string[] = licenseFixtureIds.split(",");
    const results = licenseIdsArr.map(
      (licenseId: string) => licenses[licenseId],
    );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/agreements?limit=10&offset=0&assigned_organization_unit_id=${organization_unit_id}`,
      {
        statusCode: 200,
        body: {
          results,
          total: results.length,
        },
      },
    ).as("getOrganizationUnitPolicyAgreements");
  },
);

Given(
  "the organization unit Policies Service Consumers Agreements request has been completed",
  () => {
    cy.wait("@getOrganizationUnitPolicyAgreements");
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to assign the License {string} to Organization Unit {string} from Organization {string}",
  (
    agreement_id: string,
    organization_unit_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/assign-to/organization-unit/${organization_unit_id}`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to unassign the License {string} from the Organization User {string} from Organization {string}",
  (
    agreement_id: string,
    organization_unit_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/unassign-from/organization-user/${organization_unit_id}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to unassign the License {string} from the Organization Group {string} from Organization {string}",
  (
    agreement_id: string,
    organization_group_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/unassign-from/organization-group/${organization_group_id}`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to unassign the License {string} from the Organization Unit {string} from Organization {string}",
  (
    agreement_id: string,
    organization_unit_id: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/unassign-from/organization-unit/${organization_unit_id}`,
      {
        statusCode: 200,
      },
    ).as("unAssignLienceFromUnit");
  },
);

Given(
  "the Policies Service Consumers Agreements request has been completed to unassign the License",
  () => {
    cy.wait("@unAssignLienceFromUnit");
  },
);

Given(
  "the Service Consumers Policies request has been intercepted to return the PolicyType {string} from Organization {string}",
  (policyId: string, organizationId: string): void => {
    const policiesResponse = policies[policyId];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/policies/external/organization-users`,
      {
        statusCode: 200,
        body: policiesResponse,
      },
    );
  },
);

Given(
  "the Service Consumers Policies request has been intercepted to return the PolicyType {string} from Organization {string} with pagination",
  (policyId: string, organizationId: string): void => {
    const policiesResponse = policies[policyId];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/policies/external/organization-users*`,
      {
        statusCode: 200,
        body: policiesResponse,
      },
    ).as("serviceConsumersPoliciesRequest");
  },
);

Given(
  "the Service Consumers Policies request has been intercepted to return the PolicyType from Organization with pagination has been completed",
  () => {
    cy.wait("@serviceConsumersPoliciesRequest");
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to assign Agreement {string} to User {string}",
  (
    serviceConsumerId: string,
    licenseFixtureId: string,
    userFixtureId: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/assign-to/organization-user/${users[userFixtureId].id}`,
      {
        statusCode: 201,
        body: {},
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to assign Agreement {string} to Unit {string}",
  (
    serviceConsumerId: string,
    licenseFixtureId: string,
    unitId: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/assign-to/organization-unit/${unitId}`,
      {
        statusCode: 201,
        body: {},
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to assign Agreement {string} to Group {string}",
  (
    serviceConsumerId: string,
    licenseFixtureId: string,
    groupId: string,
  ): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/assign-to/organization-group/${groupId}`,
      {
        statusCode: 201,
        body: {},
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to fetch assigned Optional Policies {string} to User {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    userId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-users/${userId}/policies`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to update Optional Policies and return Optional Policies {string} to User {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    userId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "PUT",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-users/${userId}/policies/optional`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to fetch assigned Optional Policies {string} to Group {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    groupId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-groups/${groupId}/policies`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to update Optional Policies and return Optional Policies {string} to Group {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    groupId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "PUT",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-groups/${groupId}/policies/optional`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to fetch assigned Optional Policies {string} to Unit {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    unitId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-units/${unitId}/policies`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Service Consumers {string} Agreement request has been intercepted to update Optional Policies and return Optional Policies {string} to Unit {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    assignedPoliciesFixtureId: string,
    unitId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "PUT",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/organization-units/${unitId}/policies/optional`,
      {
        statusCode: 200,
        body: assignedPolicies[assignedPoliciesFixtureId],
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to assign the License {string} to Organization {string}",
  (agreement_id: string, organization_id: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/assign-to/organization`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Policies Service Consumers Agreements request has been intercepted to unassign the License {string} from Organization {string}",
  (agreement_id: string, organization_id: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-consumers/${organization_id}/agreements/${agreement_id}/unassign-from/organization`,
      {
        statusCode: 200,
      },
    );
  },
);

Given(
  "the Service Consumers Policies request has been intercepted to return the Org PolicyType {string} from Organization {string}",
  (policyId: string, organizationId: string): void => {
    const policiesResponse = allPolicies[policyId];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-consumers/${organizationId}/policies/external/organization*`,
      {
        statusCode: 200,
        body: policiesResponse,
      },
    );
  },
);

Given(
  "the Service Consumer {string} Agreement request has been intercepted to update contact {string} in Agreement {string}",
  (
    serviceConsumerId: string,
    contactId: string,
    licenseFixtureId: string,
  ): void => {
    cy.intercept(
      "PUT",
      `${config.policies.url}/service-consumers/${serviceConsumerId}/agreements/${licenses[licenseFixtureId].id}/contact-update`,
      {
        statusCode: 200,
        body: contactInfo[contactId],
      },
    );
  },
);
