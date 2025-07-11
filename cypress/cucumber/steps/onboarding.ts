import { Given } from "cypress-cucumber-preprocessor/steps";
import config from "../../../src/mm.config.json";
import flows from "../fixtures/onboarding/flows";
import users, {
  User,
  UserAfterRequestToJoinOrganization,
} from "../fixtures/onboarding/users";
import organizations from "../fixtures/onboarding/organizations";
import type { Organization } from "../fixtures/onboarding/organizations";
import {
  attributeTypeCreate,
  attributeTypes,
} from "../fixtures/onboarding/attribute-types";
import {
  onboardingWelcomeSteps,
  userWelcomeComponents,
} from "../fixtures/onboarding/user-welcome-components";
import { consents } from "../fixtures/onboarding/consents";
import serviceProviders from "../fixtures/service_providers";

Given(
  "the Onboarding Flow request has been intercepted to return the Flow {string}",
  (flowId: string) => {
    cy.intercept("GET", `${config.onboarding.url}/flow`, {
      statusCode: 200,
      body: flows[flowId],
    });
  },
);

Given(
  "the Onboarding Flow request has been intercepted to return Error",
  () => {
    cy.intercept("GET", `${config.onboarding.url}/flow`, {
      statusCode: 500,
      body: {
        detail: "Not Found",
      },
    });
  },
);

Given(
  "the Onboarding Update User request has been intercepted to return the User {string}",
  (userId: string) => {
    const user: User = users[userId];
    cy.intercept("PATCH", `${config.onboarding.url}/users/${user.id}`, {
      statusCode: 200,
      body: user,
    });
  },
);

Given(
  "the Onboarding Create Organization request has been intercepted to return the Organization {string}",
  (organizationId: string) => {
    const organization = organizations[organizationId];
    cy.intercept("POST", `${config.onboarding.url}/organizations`, {
      statusCode: 201,
      body: organization,
    });
  },
);

Given(
  "the Onboarding Update Organization request has been intercepted to return the Organization {string}",
  (organizationId: string) => {
    const organization = organizations[organizationId];
    cy.intercept(
      "PATCH",
      `${config.onboarding.url}/organizations/${organization.id}`,
      {
        statusCode: 200,
        body: organization,
      },
    );
  },
);

Given(
  "the Onboarding check current User in the Organization {string} request has been intercepted to return error 404",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/users/@me`,
      {
        statusCode: 404,
        body: {
          details: "Error",
        },
      },
    );
  },
);

Given(
  "the Onboarding add current User in the Organization {string} request has been intercepted to request adding current User to Group",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/users/@me`,
      {
        statusCode: 200,
        body: {},
      },
    );
  },
);

Given(
  "the IAM Organization {string} Join Request for User {string} has been intercepted to return the Request Status pending",
  (orgId: string): void => {
    const organization: Organization = organizations[orgId];
    const user: User | UserAfterRequestToJoinOrganization = users[orgId];
    const body = {
      ...user,
      organization,
    };
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organization.id}/users/@me`,
      {
        statusCode: 202,
        body,
      },
    );
  },
);

Given(
  "the Onboarding fetch all attribute type for MMAdmin request has been intercepted to return {string} attribute types",
  (attribute_types_fixture_id: string): void => {
    cy.intercept("GET", `${config.onboarding.url}/attribute-types?*`, {
      statusCode: 200,
      body: attributeTypes[attribute_types_fixture_id],
    }).as("onboardingAttributeTypes");
  },
);

Given("the Onboarding Attribute Types request has been completed", (): void => {
  cy.wait("@onboardingAttributeTypes");
});

Given(
  "the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id {string} for {string} app",
  (onboardingStepFixtureId: string, app: string): void => {
    cy.intercept("GET", `${config.onboarding.url}/welcome/${app}`, {
      statusCode: 200,
      body: onboardingWelcomeSteps[onboardingStepFixtureId],
    }).as("getOnboardingWelcomeComponents");
  },
);

Given(
  "the Onboarding Welcome Components POST request has been intercepted to update progress for Onboarding Step and User Welcome Component with FixtureId {string} for {string} app",
  (userWelcomeComponentFixtureId: string, app: string): void => {
    const componentName =
      userWelcomeComponents[userWelcomeComponentFixtureId].name;

    cy.intercept(
      "POST",
      `${config.onboarding.url}/welcome/${app}/${componentName}`,
      {
        statusCode: 200,
      },
    ).as("updateWelcomeComponentProgress");
  },
);

Given(
  "the Onboarding Welcome Components DELETE request has been intercepted to update progress for Onboarding Step and User Welcome Component with FixtureId {string} for {string} app",
  (userWelcomeComponentFixtureId: string, app: string): void => {
    const componentName =
      userWelcomeComponents[userWelcomeComponentFixtureId].name;

    cy.intercept(
      "DELETE",
      `${config.onboarding.url}/welcome/${app}/${componentName}`,
      {
        statusCode: 200,
      },
    ).as("updateWelcomeComponentProgressUncompleted");
  },
);

Given(
  "the Onboarding Welcome Components GET request has been intercepted to retrieve User updated Onboarding Welcome Components with Fixture Id {string} for {string} app",
  (onboardingStepFixtureId: string, app: string): void => {
    cy.intercept("GET", `${config.onboarding.url}/welcome/${app}`, {
      statusCode: 200,
      body: onboardingWelcomeSteps[onboardingStepFixtureId],
    }).as("getOnboardingWelcomeComponentsUpdated");
  },
);

Then(
  "the Onboarding User Welcome Components DELETE request has been completed",
  (): void => {
    cy.wait("@updateWelcomeComponentProgressUncompleted");
  },
);

Then(
  "the Onboarding User Welcome Components POST request has been completed",
  (): void => {
    cy.wait("@updateWelcomeComponentProgress");
  },
);

Then(
  "the Onboarding Welcome Components GET request has been completed",
  (): void => {
    cy.wait("@getOnboardingWelcomeComponents");
  },
);

Then(
  "the updated Onboarding Welcome Components GET request has been completed",
  (): void => {
    cy.wait("@getOnboardingWelcomeComponentsUpdated");
  },
);

Given(
  "the Onboarding create Attribute Type request has been intercepted to create Attribute Type {string}",
  (attribute_types_fixture_id: string): void => {
    cy.intercept("POST", `${config.onboarding.url}/attribute-types`, {
      statusCode: 201,
      body: attributeTypeCreate[attribute_types_fixture_id],
    }).as("onboardingAttributeTypeCreate");
  },
);

Given(
  "the Onboarding Attribute Type create request has been completed",
  (): void => {
    cy.wait("@onboardingAttributeTypeCreate");
  },
);

Given(
  "the Onboarding update Attribute Type request has been intercepted to update Attribute Type {string} and return updated Attribute Type {string}",
  (
    attribute_type_id: string,
    updated_attribute_types_fixture_id: string,
  ): void => {
    cy.intercept(
      "PATCH",
      `${config.onboarding.url}/attribute-types/${attribute_type_id}`,
      {
        statusCode: 200,
        body: attributeTypes[updated_attribute_types_fixture_id],
      },
    ).as("onboardingAttributeTypeUpdate");
  },
);

Given(
  "the Onboarding Attribute Type update request has been completed",
  (): void => {
    cy.wait("@onboardingAttributeTypeUpdate");
  },
);

Given(
  "the Onboarding delete Attribute Type request has been intercepted to delete Attribute Type {string}",
  (attribute_type_id: string): void => {
    cy.intercept(
      "DELETE",
      `${config.onboarding.url}/attribute-types/${attribute_type_id}`,
      {
        statusCode: 204,
      },
    ).as("onboardingAttributeTypeDelete");
  },
);

Given(
  "the Onboarding Attribute Type delete request has been completed",
  (): void => {
    cy.wait("@onboardingAttributeTypeDelete");
  },
);

Given(
  "the Onboarding User me GET consents {string} request has been intercepted",
  (consentsFixtureId: string): void => {
    cy.intercept("GET", `${config.onboarding.url}/users/@me/consents`, {
      statusCode: 200,
      body: consents[consentsFixtureId],
    });
  },
);

Given(
  "the Onboarding User me DELETE consent from Service Provider {string} request has been intercepted",
  (serviceProviderFixtureId: string): void => {
    const serviceProviderId: string =
      serviceProviders[serviceProviderFixtureId].id;
    cy.intercept(
      "DELETE",
      `${config.onboarding.url}/users/@me/consents/${serviceProviderId}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given(
  "the Onboarding DELETE Consents for Service Provider {string} for Organization {string} has been intercepted",
  (serviceProviderFixtureId: string, organizationFixtureId: string): void => {
    const serviceProviderId = serviceProviders[serviceProviderFixtureId].id;
    const organizationId: string = organizations[organizationFixtureId].id;
    cy.intercept(
      "DELETE",
      `${config.onboarding.url}/organizations/${organizationId}/consents/${serviceProviderId}`,
      {
        statusCode: 204,
      },
    );
  },
);

Given("the User should have Getting Started steps completed", () => {
  cy.getAllLocalStorage().then((result) => {
    expect(result[window.location.origin].GettingStarted).be.equal(
      "{'allStepsCompleted':true}",
    );
  });
});
