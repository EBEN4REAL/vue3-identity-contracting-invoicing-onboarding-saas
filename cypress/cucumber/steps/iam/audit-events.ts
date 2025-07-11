import { Given } from "cypress-cucumber-preprocessor/steps";
import { auditEvents } from "../../fixtures/audit_events";
import config from "../../../../src/mm.config.json";
import organizations from "../../fixtures/organizations";

Given(
  "the IAM Audit Events request has been intercepted to return the Audit Events {string}",
  (auditEventId: string): void => {
    cy.intercept("GET", `${config.events.url}/audit-events*`, {
      statusCode: 200,
      body: auditEvents[auditEventId],
    }).as("getAuditEventLog");
  },
);

Given(
  "the IAM Audit Events request has been intercepted to return the Audit Events {string} for Service Provider {string}",
  (auditEventIds: string, organizationId: string) => {
    const organization = organizations[organizationId];
    const auditEventIdsArr = auditEventIds.split(",");
    const auditEventsPagination = {
      offset: 0,
      limit: 10,
      results: auditEventIdsArr.map(
        (auditEventId) => auditEvents[auditEventId],
      ),
      size: auditEventIdsArr.length > 10 ? 10 : auditEventIdsArr.length,
      total: auditEventIdsArr.length,
    };

    const interceptUrl = `${config.events.url}/audit-events?organization_id=${organization.id}&limit=10&offset=0`;

    cy.intercept("GET", interceptUrl, {
      statusCode: 200,
      body: auditEventsPagination,
    }).as("getAuditEventLog");
  },
);

Given("the User waits for the audit events log to be populated", () => {
  cy.wait("@getAuditEventLog");
});
