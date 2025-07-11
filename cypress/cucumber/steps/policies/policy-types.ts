import { Given } from "cypress-cucumber-preprocessor/steps";
import serviceProviders, {
  ServiceProvider,
} from "../../fixtures/service_providers";
import config from "../../../../src/mm.config.json";
import { PolicyTypeRead } from "../../../../src/policies/policies.types";
import { PolicyCategoryReadLimited } from "../../../../src/service-providers/ConfigurationTabs/Policies/policies.types";
import {
  policyUx,
  policyUxCategories,
} from "../../fixtures/service-provider/policies";
import { policyTypes } from "../../fixtures/service-provider/policy-types";

Given(
  "the Policies Policy Types request has been intercepted to return the Policy Types {string} for Service Provider {string}",
  (policyTypesFixtureIds: string, serviceProviderFixtureId: string): void => {
    const policyTypesArr: string[] = policyTypesFixtureIds.split(",");
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${serviceProvider.id}/policy-types?*`,
      {
        statusCode: 200,
        body: policyTypesArr,
      },
    );
  },
);

Given(
  "the Create Policy Types request has been intercepted to return the Policy Type {string} for Service Provider {string}",
  (policyTypeFixtureId: string, serviceProviderFixtureId: string): void => {
    const policyType: PolicyTypeRead = policyTypes[policyTypeFixtureId];
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderFixtureId];

    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${serviceProvider.id}/policy-types`,
      {
        statusCode: 201,
        body: policyType,
      },
    );
  },
);

Given(
  "the Policy Types UX Behavior request has been intercepted to return the Policy Types UX Behavior for UX Category {string}",
  (policyUxCategoryId: string): void => {
    const policyUxCategory: PolicyCategoryReadLimited =
      policyUxCategories[policyUxCategoryId];

    cy.intercept(
      "GET",
      `${config.policies.url}/policy-type-categories/${policyUxCategory.id}/ux`,
      {
        statusCode: 200,
        body: policyUx,
      },
    );
  },
);
