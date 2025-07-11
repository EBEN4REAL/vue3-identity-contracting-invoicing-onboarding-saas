import config from "../../../src/mm.config.json";
import { Given } from "cypress-cucumber-preprocessor/steps";
import { filters } from "../fixtures/service-provider/filters";
import {
  agreementTypes,
  licenses,
} from "../fixtures/service-provider/licenses";
import { policyTypes } from "../fixtures/service-provider/policy-types";
import serviceProviders from "../fixtures/service_providers";
import { allPolicies, policies } from "../fixtures/service-provider/policies";
import {
  orgUsersPolicies,
  organizations,
} from "../fixtures/service-provider/organizations";
import { policyTypeUsages } from "../fixtures/service-provider/policy-type-usage";

Given(
  "the Filters request has been intercepted to return the Filters {string} for Service Provider {string}",
  (filterId: string, serviceProviderId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/filters*`,
      {
        statusCode: 200,
        body: filters[filterId],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to delete the Filter with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${service_provider_id}/filters/${filter_id}`,
      {
        statusCode: 204,
        body: filters[filter_id],
      },
    );
  },
);

Given(
  "the Licenses request has been intercepted to return the Licenses {string} for Service Provider {string}",
  (filterId: string, serviceProviderId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreements?limit=10&offset=0`,
      {
        statusCode: 200,
        body: licenses[filterId],
      },
    );
  },
);

Given(
  "the Licenses request has been intercepted to return for Service Provider {string} the Licenses {string} for service consumer {string}",
  (
    serviceProviderId: string,
    filterId: string,
    serviceConsumerId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreements?service_consumer_id=${serviceConsumerId}?limit=10&offset=0`,
      {
        statusCode: 200,
        body: licenses[filterId],
      },
    );
  },
);

Given(
  "the Licenses request has been intercepted to return for Service Provider {string} the Active Licenses {string} for service consumer {string}",
  (
    serviceProviderId: string,
    filterId: string,
    serviceConsumerId: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreements?cancelled=false?service_consumer_id=${serviceConsumerId}?limit=10&offset=0`,
      {
        statusCode: 200,
        body: licenses[filterId],
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to return the All Policies {string} for Service Provider {string}",
  (filterId: string, serviceProviderId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/external/all?limit=10&offset=0`,
      {
        statusCode: 200,
        body: allPolicies[filterId],
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to return the Organization with Service Provider {string} for filter {string} and with org id {string}",
  (
    serviceProviderId: string,
    policyTypeId: string,
    organization_id: string,
  ) => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/external/organizations?organization_id=${organization_id}&limit=10&offset=0`,
      {
        statusCode: 201,
        body: orgUsersPolicies[policyTypeId],
      },
    );
  },
);

Given(
  "the Agreements request has been intercepted to return the Agreement types {string} for Service Provider {string}",
  (filterId: string, serviceProviderId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types?limit=10&offset=0`,
      {
        statusCode: 200,
        body: {
          offset: 0,
          limit: 10,
          results: [agreementTypes[filterId]],
          size: 10,
          total: 18,
        },
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to assign an agreement with id {string} to an organization with id {string}",
  (
    serviceProviderId: string,
    agreementTypeId: string,
    organizationId: string,
  ): void => {
    const orgId = organizations[organizationId].results.map(
      (result) => result.organization.id,
    );
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types/${agreementTypeId}/assign/${orgId}`,
      {
        statusCode: 200,
        body: organizations[organizationId],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to cancel the License with id {string}",
  (serviceProviderId: string, agreementId: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreements/${agreementId}/cancel`,
      {
        statusCode: 200,
        body: licenses[agreementId],
      },
    );
  },
);

Given(
  "the Create Policy request has been intercepted to return the Policy {string} for Service Provider {string}",
  (policyId: string, serviceProviderId: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/policy-types`,
      {
        statusCode: 201,
        body: policyTypes[policyId],
      },
    );
  },
);

Given(
  "the Update Policy request has been intercepted to return the Policy {string} for Service Provider {string}",
  (policyId: string, serviceProviderId: string): void => {
    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${serviceProviderId}/policy-types/${policyTypes[policyId].id}`,
      {
        statusCode: 201,
        body: policyTypes[policyId],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to delete the Policy with id {string}",
  (service_provider_id: string, policy_type_id: string): void => {
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${service_provider_id}/policy-types/${policy_type_id}`,
      {
        statusCode: 204,
        body: policies[policy_type_id],
      },
    );
  },
);

Given(
  "the Update Policy request has been intercepted to update the PolicyType {string} for Service Provider {string}",
  (policyTypeId: string, serviceProviderId: string): void => {
    const serviceProvider = serviceProviders[serviceProviderId];
    const policyType = policyTypes[policyTypeId];
    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${serviceProvider.id}/policy-types/${policyType.id}`,
      {
        statusCode: 200,
        body: policyType,
      },
    );
  },
);

Given(
  "the Delete Policy {string} for Service Provider {string} request has been intercepted",
  (policyTypeId: string, serviceProviderId: string): void => {
    const serviceProvider = serviceProviders[serviceProviderId];
    const policyType = policyTypes[policyTypeId];
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${serviceProvider.id}/policy-types/${policyType.id}`,
      {
        statusCode: 200,
        body: "deleted",
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to assign Policy {string} for Service Provider {string}",
  (policyTypeId: string, serviceProviderId: string) => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/assign/organization_user`,
      {
        statusCode: 201,
        body: policies[policyTypeId],
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to assign Policy {string} to a organization for Service Provider {string}",
  (policyTypeId: string, serviceProviderId: string) => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/assign/organization`,
      {
        statusCode: 201,
        body: policies[policyTypeId],
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to unassign Policy {string} from Org User for Service Provider {string}",
  (policyTypeId: string, serviceProviderId: string) => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/unassign/organization_user`,
      {
        statusCode: 200,
        body: policies[policyTypeId],
      },
    );
  },
);

Given(
  "the Policies request has been intercepted to unassign Policy {string} from Organization for Service Provider {string}",
  (policyTypeId: string, serviceProviderId: string) => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/policies/unassign/organization`,
      {
        statusCode: 200,
        body: policies[policyTypeId],
      },
    );
  },
);

Given(
  "the Policies Usage request has been intercepted to return the Usage {string} for Policy {string} and Service Provider {string}",
  (usageId: string, policyTypeId: string, serviceProviderId: string): void => {
    const serviceProvider = serviceProviders[serviceProviderId];
    const policyType = policyTypes[policyTypeId];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/policy-types/${policyType.id}/usage`,
      {
        statusCode: 200,
        body: policyTypeUsages[usageId],
      },
    );
  },
);
