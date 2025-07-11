import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../src/mm.config.json";
import { documentUrl, documents } from "../fixtures/licenses/documents";

Given(
  "the contracting request has been intercepted to return the documents {string} for agreement {string} for Service Consumer {string}",
  (
    filterId: string,
    agreement_id: string,
    service_consumer_id: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.contracting.url}/service-consumers/${service_consumer_id}/agreements/${agreement_id}/legal-documents*`,
      {
        statusCode: 200,
        body: documents[filterId],
      },
    );
  },
);

Given(
  "the contracting request has been intercepted to return the documents for signing {string} for a Service Consumer {string}",
  (filterId: string, service_consumer_id: string): void => {
    cy.intercept(
      "GET",
      `${config.contracting.url}/service-consumers/${service_consumer_id}/legal-document-types/${filterId}/pdf`,
      {
        statusCode: 200,
        body: documentUrl,
      },
    );
  },
);

Given(
  "the contracting request has been intercepted to create a legal doc signature for a Service Consumer {string}",
  (service_consumer_id: string): void => {
    cy.intercept(
      "POST",
      `${config.contracting.url}/service-consumers/${service_consumer_id}/signatures`,
      {
        statusCode: 200,
        body: [],
      },
    );
  },
);
