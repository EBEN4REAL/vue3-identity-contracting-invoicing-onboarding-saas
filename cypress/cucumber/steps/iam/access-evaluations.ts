import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../../src/mm.config.json";
import {
  accessEvaluationDetails,
  accessEvaluations,
} from "../../fixtures/access_evaluations";

Given(
  "the IAM Access Evaluations request has been intercepted to return Access Logs {string} for Organization {string}",
  (accessEvaluationFixtureId: string, organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/access-evaluations?organization_id=${organizationId}*`,
      {
        statusCode: 200,
        body: accessEvaluations[accessEvaluationFixtureId],
      },
    ).as("getAccessEvaluationsLog");
  },
);

Given(
  "the IAM Access Evaluations request has been intercepted to return Access Logs {string}",
  (accessEvaluationFixtureId: string): void => {
    cy.intercept("GET", `${config.iam.url}/iam/access-evaluations*`, {
      statusCode: 200,
      body: accessEvaluations[accessEvaluationFixtureId],
    }).as("getAccessEvaluationsLog");
  },
);

Given("access log request has been intercepted", () => {
  cy.wait("@getAccessEvaluationsLog");
});

Given(
  "the IAM Access Evaluations request has been intercepted to return Access Log Details {string} for Organization {string}",
  (accessEvaluationDetailsFixtureId: string, organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organizationId}/access-evaluations/${accessEvaluationDetails[accessEvaluationDetailsFixtureId].id}`,
      {
        statusCode: 200,
        body: accessEvaluationDetails[accessEvaluationDetailsFixtureId],
      },
    ).as("getAccessEvaluationsLogDetails");
  },
);

Given("access log details request has been intercepted", () => {
  cy.wait("@getAccessEvaluationsLogDetails");
});

Given(
  "the IAM Access Evaluations request has been intercepted to return Access Log Details {string}",
  (accessEvaluationDetailsFixtureId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/access-evaluations/${accessEvaluationDetails[accessEvaluationDetailsFixtureId].id}`,
      {
        statusCode: 200,
        body: accessEvaluationDetails[accessEvaluationDetailsFixtureId],
      },
    ).as("getAccessEvaluationsLogDetails");
  },
);
