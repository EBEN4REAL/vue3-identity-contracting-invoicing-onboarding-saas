import { Given } from "cypress-cucumber-preprocessor/steps";
import serviceProviders, {
  ServiceProvider,
} from "../../fixtures/service_providers";
import config from "../../../../src/mm.config.json";
import resourceTypes from "../../fixtures/resource_types";
import resourceAttributeTypes from "../../fixtures/service-provider/resource_attributes";
import { license } from "../../fixtures/licenses/license";
import resourceAttributeTypes from "../../fixtures/service-provider/resource_attributes";
import { ResourceTypeRead } from "../../../../src/policies/policies.types";

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to return the Resources {string} for Service Provider {string}",
  (resourceTypesFixtureIds: string, serviceProviderFixtureId: string): void => {
    const resourceTypeArr: string[] = resourceTypesFixtureIds.split(",");
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types`,
      {
        statusCode: 200,
        body: {
          results: resourceTypeArr.map(
            (resourceTypeId: string) => resourceTypes[resourceTypeId],
          ),
          total: resourceTypeArr.length,
        },
      },
    );
  },
);
Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to return the Resource {string} for Service Provider {string}",
  (resourceTypesFixtureId: string, serviceProviderFixtureId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const resourceType: ResourceTypeRead =
      resourceTypes[resourceTypesFixtureId];
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types/${resourceType.id}`,
      {
        statusCode: 200,
        body: resourceTypes[resourceTypesFixtureId],
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to delete the Resource {string} for Service Provider {string}",
  (resourceTypesFixtureId: string, serviceProviderFixtureId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const resourceType = resourceTypes[resourceTypesFixtureId];

    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types/${resourceType.id}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the IAM Service Providers OAuth Clients request has been intercepted to update the Resource {string} for Service Provider {string} and return the Resource {string}",
  (
    resourceTypesFixtureId: string,
    serviceProviderFixtureId: string,
    updatedResourceTypeFixtureId: string,
  ): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const resourceType = resourceTypes[resourceTypesFixtureId];

    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types/${resourceType.id}`,
      {
        statusCode: 200,
        body: resourceTypes[updatedResourceTypeFixtureId],
      },
    );
  },
);
Given(
  "the Policies Serivice Providers Resource Attributes request has been intercepted to create the resource attribute type {string} for Service Provider {string}",
  (
    resource_attribute_type_fixture_id: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceAttributeType =
      resourceAttributeTypes[resource_attribute_type_fixture_id];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-attribute-types`,
      {
        statusCode: 201,
        body: resourceAttributeType,
      },
    );
  },
);

Given(
  "the Policies Service Providers Resource Attributes request has been intercepted to return the resource attribute types {string} for Service Provider {string}",
  (
    resource_attribute_type_fixture_id_arr: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceAttributeArr: string[] =
      resource_attribute_type_fixture_id_arr.split(",");
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-attribute-types`,
      {
        statusCode: 200,
        body: {
          results: resourceAttributeArr.map(
            (resource_attribute_id: string) =>
              resourceAttributeTypes[resource_attribute_id],
          ),
          total: resourceAttributeArr.length,
        },
      },
    );
  },
);

Given(
  "the Policies Serivice Providers Resource Attributes request has been intercepted to update the resource attribute type {string} for Service Provider {string} and return {string}",
  (
    resource_attribute_type_fixture_id: string,
    serviceProviderFixtureId: string,
    updated_resource_attribute_type_fixture_id: string,
  ): void => {
    const resourceAttributeType =
      resourceAttributeTypes[resource_attribute_type_fixture_id];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    const updatedResourceAttributeType =
      resourceAttributeTypes[updated_resource_attribute_type_fixture_id];
    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-attribute-types/${resourceAttributeType.id}`,
      {
        statusCode: 200,
        body: { updatedResourceAttributeType },
      },
    );
  },
);

Given(
  "the Policies Serivice Providers Resource Attributes request has been intercepted to delete the resource attribute type {string} for Service Provider {string}",
  (
    resource_attribute_type_fixture_id: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceAttributeType =
      resourceAttributeTypes[resource_attribute_type_fixture_id];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-attribute-types/${resourceAttributeType.id}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to fetch the License with id {string}",
  (serviceProviderId: string, licenseFixtureId: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types/${license[licenseFixtureId].id}`,
      {
        statusCode: 200,
        body: license[licenseFixtureId],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to update the License with id {string}",
  (serviceProviderId: string, licenseFixtureId: string): void => {
    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types/${license[licenseFixtureId].id}`,
      {
        statusCode: 200,
        body: license[licenseFixtureId],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to delete the License with id {string}",
  (serviceProviderId: string, licenseFixtureId: string): void => {
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types/${license[licenseFixtureId].id}`,
      {
        statusCode: 200,
        body: null,
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to create the License with id {string}",
  (serviceProviderId: string, licenseFixtureId: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProviderId}/agreement-types`,
      {
        statusCode: 200,
        body: license[licenseFixtureId],
      },
    );
  },
);

Given(
  "the Policies Service Providers Resource Attributes request has been intercepted to return the resource attribute types {string} for Service Provider {string}",
  (
    resource_attribute_type_fixture_id_arr: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceAttributeArr: string[] =
      resource_attribute_type_fixture_id_arr.split(",");
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-attribute-types`,
      {
        statusCode: 200,
        body: {
          results: resourceAttributeArr.map(
            (resource_attribute_id: string) =>
              resourceAttributeTypes[resource_attribute_id],
          ),
          total: resourceAttributeArr.length,
        },
      },
    );
  },
);
Given(
  "the Policies Service Providers Resource Attributes request has been intercepted to create and return the resource {string} for Service Provider {string}",
  (
    resource_type_fixture_id: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceType = resourceTypes[resource_type_fixture_id];

    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types`,
      {
        statusCode: 200,
        body: resourceType,
      },
    );
  },
);

Given(
  "the Policies Service Providers Resource Attributes request has been intercepted to return the resource {string} for Service Provider {string}",
  (
    resource_type_fixture_id: string,
    serviceProviderFixtureId: string,
  ): void => {
    const resourceType = resourceTypes[resource_type_fixture_id];

    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/resource-types/${resourceType.id}`,
      {
        statusCode: 200,
        body: resourceType,
      },
    );
  },
);
