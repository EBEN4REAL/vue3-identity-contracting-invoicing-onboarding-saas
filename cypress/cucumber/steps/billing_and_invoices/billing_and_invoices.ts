import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../../src/mm.config.json";
import serviceProviders from "../../fixtures/service_providers";
import { invoices } from "../../fixtures/billing";

Given(
  "the billing request has been intercepted to return the invoice {string} for the Service Consumer {string} and agreement {string}",
  (
    invoices_fixture_id: string,
    service_consumer_fixture_id: string,
    id: string,
  ): void => {
    const serviceProvider = serviceProviders[service_consumer_fixture_id];
    const fetched_invoices = invoices[invoices_fixture_id];
    const url: string = `${config.billing_and_invoicing.url}/service-consumers/${serviceProvider.id}/invoices?limit=10&offset=0&agreement_id=${id}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: { results: [fetched_invoices] },
    });
  },
);

Given(
  "the billing request has been intercepted to initialize checkout for the invoice {string} and Service Consumer {string}",
  (invoice_id: string, service_consumer_id: string): void => {
    const url: string = `${config.billing_and_invoicing.url}/service-consumers/${service_consumer_id}/invoices/${invoice_id}/checkout`;
    cy.intercept("POST", url, {
      statusCode: 200,
      body: {},
    });
  },
);
