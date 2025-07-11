import { Given } from "cypress-cucumber-preprocessor/steps";
import {
  PaginationSchema_OauthClientRead_,
  OauthClientRead,
  PaginationSchema_ServiceProviderRead_,
} from "../../../../src/iam/iam.types";
import serviceProviders, {
  ServiceProvider,
} from "../../fixtures/service_providers";
import config from "../../../../src/mm.config.json";
import {
  servicesProvidersMetrics,
  servicesProvidersMetricsActiveUsers,
  servicesProvidersMetricsFailedLogins,
  servicesProvidersMetricsSignups,
} from "../../fixtures/service-provider/metrics";
import oauthClients from "../../fixtures/oauth_clients";
import { resourceTypes } from "../../fixtures/resource_types";
import { organizations } from "../../fixtures/service-provider/organizations";
import {
  customers,
  serviceProviderUsers,
} from "../../fixtures/service-provider/customers";

Given(
  "the IAM Service Providers request has been intercepted to return the Service Providers {string}",
  (serviceProviderIds: string): void => {
    const serviceProviderIdsArr: string[] = serviceProviderIds.split(",");
    const serviceProvidersPagination: PaginationSchema_ServiceProviderRead_ = {
      offset: 0,
      limit: 10,
      results: serviceProviderIdsArr.map(
        (serviceProviderId: string) => serviceProviders[serviceProviderId],
      ),
      size:
        serviceProviderIdsArr.length > 10 ? 10 : serviceProviderIdsArr.length,
      total: serviceProviderIdsArr.length,
    };
    cy.intercept("GET", `${config.iam.url}/iam/service-providers`, {
      statusCode: 200,
      body: serviceProvidersPagination,
    });
    cy.intercept("GET", `${config.iam.url}/iam/service-providers?*`, {
      statusCode: 200,
      body: serviceProvidersPagination,
    });
  },
);

Given(
  "the IAM Service Provider Metrics request has been intercepted to return the Metrics for Service Provider {string}",
  (serviceProviderId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/metrics`,
      {
        statusCode: 200,
        body: servicesProvidersMetrics[serviceProviderId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/metrics/active-users?*`,
      {
        statusCode: 200,
        body: servicesProvidersMetricsActiveUsers[serviceProviderId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/metrics/signups?*`,
      {
        statusCode: 200,
        body: servicesProvidersMetricsSignups[serviceProviderId],
      },
    );
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/metrics/failed-logins?*`,
      {
        statusCode: 200,
        body: servicesProvidersMetricsFailedLogins[serviceProviderId],
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to return the OAuth Clients {string} for Service Provider {string}",
  (oauthClientIds: string, serviceProviderId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderId];
    const oauthClientIdsArr: string[] = oauthClientIds.split(",");
    const results: OauthClientRead[] = oauthClientIdsArr.map(
      (oauthClientId: string) => oauthClients[oauthClientId],
    );
    const oauthClientsPagination: PaginationSchema_OauthClientRead_ = {
      offset: 0,
      limit: 10,
      results,
      size: oauthClientIdsArr.length > 10 ? 10 : oauthClientIdsArr.length,
      total: oauthClientIdsArr.length,
    };

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients?service_provider_id=${serviceProvider.id}&limit=10&offset=0`,
      {
        statusCode: 200,
        body: oauthClientsPagination,
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the Service Provider {string}",
  (serviceProviderFixtureId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}`,
      {
        statusCode: 200,
        body: serviceProvider,
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to create and return the Oauth Client {string} for Service Provider {string}",
  (
    oauthClientProviderFixtureId: string,
    serviceProviderFixtureId: string,
  ): void => {
    const oauthClient = oauthClients[oauthClientProviderFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "POST",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients`,
      {
        statusCode: 201,
        body: oauthClient,
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to return the Oauth Client {string} for Service Provider {string}",
  (
    oauthClientProviderFixtureId: string,
    serviceProviderFixtureId: string,
  ): void => {
    const oauthClient = oauthClients[oauthClientProviderFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients/${oauthClient.id}`,
      {
        statusCode: 200,
        body: oauthClient,
      },
    );
  },
);
Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to delete the Oauth Client {string} for Service Provider {string}",
  (
    oauthClientProviderFixtureId: string,
    serviceProviderFixtureId: string,
  ): void => {
    const oauthClient = oauthClients[oauthClientProviderFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "DELETE",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients/${oauthClient.id}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to update the Oauth Client {string} for Service Provider {string} and return {string}",
  (
    oauthClientProviderFixtureId: string,
    serviceProviderFixtureId: string,
    updatedClientProviderFixtureId: string,
  ): void => {
    const oauthClient = oauthClients[oauthClientProviderFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const updatedOauthClient = oauthClients[updatedClientProviderFixtureId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients/${oauthClient.id}`,
      {
        statusCode: 200,
        body: updatedOauthClient,
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to update the client secret for an Oauth Client {string} for Service Provider {string} and return {string}",
  (
    oauthClientProviderFixtureId: string,
    serviceProviderFixtureId: string,
    filterId: string,
  ): void => {
    const oauthClient = oauthClients[oauthClientProviderFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    cy.intercept(
      "PUT",
      `${config.iam.url}/iam/service-providers/${serviceProvider.id}/oauth-clients/${oauthClient.id}/secret`,
      {
        statusCode: 200,
        body: oauthClients[filterId],
      },
    );
  },
);

Given(
  "the IAM Service Providers Resource Types request has been intercepted to return Resource Types {string} for Service Provider {string}",
  (resourceTypesFixtureIds: string, serviceProviderFixtureId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const resourceTypesFixtures = resourceTypesFixtureIds
      .split(",")
      .map(
        (resourceTypesFixtureId: string) =>
          resourceTypes[resourceTypesFixtureId],
      );

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types`,
      {
        statusCode: 200,
        body: resourceTypesFixtures,
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the Organizations {string} for Service Provider {string}",
  (filterId: string, serviceProviderId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProviderId}/organizations?limit=10&offset=0`,
      {
        statusCode: 200,
        body: customers[filterId],
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the Organization with id {string} for Service Provider {string}",
  (organizationId: string, serviceProviderId: string): void => {
    const orgId = organizations[organizationId].results[0].organization.id;
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProviderId}/organizations/${orgId}?limit=10&offset=0`,

      {
        statusCode: 200,
        body: organizations[organizationId].results[0],
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the Users {string} for Service Provider {string} and Organization {string}",
  (userId: string, serviceProviderId: string, organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProviderId}/organizations/${organizationId}/users?limit=10&offset=0`,
      {
        statusCode: 200,
        body: serviceProviderUsers[userId],
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the SP Users {string} for Service Provider {string} and Organization {string}",
  (
    service_provider_user_id: string,
    serviceProviderId: string,
    organizationId: string,
  ): void => {
    const spUserId =
      serviceProviderUsers[service_provider_user_id]?.results[0].id;
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProviderId}/organizations/${organizationId}/users/${spUserId}`,
      {
        statusCode: 200,
        body: serviceProviderUsers[service_provider_user_id]?.results[0],
      },
    );
  },
);

Given(
  "the IAM Service Providers request has been intercepted to return the Organization with Service Provider {string} for filter {string} and with ids {string}",
  (
    serviceProviderId: string,
    filterId: string,
    organization_id: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/service-providers/${serviceProviderId}/organizations?organization_id=${organization_id}`,
      {
        statusCode: 200,
        body: organizations[filterId],
      },
    );
  },
);
