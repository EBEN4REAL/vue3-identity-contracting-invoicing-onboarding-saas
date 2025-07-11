import config from "../../../../src/mm.config.json";
import { Given } from "cypress-cucumber-preprocessor/steps";
import { filter } from "../../fixtures/service-provider/filters";

Given(
  "the Service Provider {string} request has been intercepted to fetch the Filters with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${service_provider_id}/filters*`,
      {
        statusCode: 200,
        body: {
          results: [filter[filter_id]],
        },
        offset: 0,
        limit: 10,
        total: 1,
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to fetch the Filter with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "GET",
      `${config.policies.url}/service-providers/${service_provider_id}/filters/${filter[filter_id].id}`,
      {
        statusCode: 200,
        body: filter[filter_id],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to update the Filter with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "PATCH",
      `${config.policies.url}/service-providers/${service_provider_id}/filters/${filter[filter_id].id}`,
      {
        statusCode: 200,
        body: filter[filter_id],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to create the Filter with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "POST",
      `${config.policies.url}/service-providers/${service_provider_id}/filters`,
      {
        statusCode: 200,
        body: filter[filter_id],
      },
    );
  },
);

Given(
  "the Service Provider {string} request has been intercepted to delete the Filter item with id {string}",
  (service_provider_id: string, filter_id: string): void => {
    cy.intercept(
      "DELETE",
      `${config.policies.url}/service-providers/${service_provider_id}/filters/${filter[filter_id].id}`,
      {
        statusCode: 204,
      },
    );
  },
);
