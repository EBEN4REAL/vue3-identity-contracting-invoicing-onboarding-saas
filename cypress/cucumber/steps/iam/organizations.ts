import { Given } from "cypress-cucumber-preprocessor/steps";
import organizations, { Organization } from "../../fixtures/organizations";
import config from "../../../../src/mm.config.json";
import {
  OrganizationRead,
  PaginationSchema_OrganizationRead_,
} from "../../../../src/iam/iam.types";
import users from "../../fixtures/users";
import serviceProviders, {
  ServiceProvider,
  registeredServiceProvider,
} from "../../fixtures/service_providers";
import { orgUsers } from "../../fixtures/service-provider/organizations";
import { BillingAddressRead } from "../../../../src/billing_and_invoicing/billing_and_invoicing.types";
import billing_addresses from "../../fixtures/organization/billing_addresses";
import { extendedAgreements } from "../../fixtures/extended_agreements";
import legalDocumentTypes from "../../fixtures/legal_document_types";
import { license } from "../../fixtures/licenses/license";
import { context } from "../app";
import { consents } from "../../fixtures/consents";

Given(
  "the IAM Organizations request has been intercepted to return the Organizations {string}",
  (organizationIds: string): void => {
    const organizationIdsArr: string[] = organizationIds.split(",");
    const organizationsPagination: PaginationSchema_OrganizationRead_ = {
      offset: 0,
      limit: 10,
      results: organizationIdsArr.map(
        (organizationId: string) => organizations[organizationId],
      ),
      size: organizationIdsArr.length > 10 ? 10 : organizationIdsArr.length,
      total: organizationIdsArr.length,
    };
    cy.intercept("GET", `${config.iam.url}/iam/organizations`, {
      statusCode: 200,
      body: organizationsPagination,
    });
    cy.intercept("GET", `${config.iam.url}/iam/organizations/?*`, {
      statusCode: 200,
      body: organizationsPagination,
    });
  },
);

Given(
  "the IAM Organization request has been intercepted to return the Organization {string}",
  (organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 200,
        body: organization,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return {string} for the Organization with ID {string}",
  (status: string, organizationId: string): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organizationId}`,
      {
        statusCode: parseInt(status),
        body: {},
      },
    );
  },
);

Given(
  "the IAM Update Organization {string} request has been intercepted to return updated Organization {string}",
  (organizationId: string, updatedOrganizationId: string): void => {
    const organization: OrganizationRead = organizations[organizationId];
    const updatedOrganization: OrganizationRead =
      organizations[updatedOrganizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 200,
        body: updatedOrganization,
      },
    );
  },
);

Given(
  "the IAM Organization update organization with ID {string} request has been intercepted to return the Organization {string}",
  (organizationId: string, updatedOrganizationId: string): void => {
    const organization: OrganizationRead = organizations[organizationId];
    const updatedOrganization: OrganizationRead =
      organizations[updatedOrganizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 200,
        body: updatedOrganization,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the Organization {string} with users {string}",
  (organizationId: string, usersIds: string): void => {
    const organization: OrganizationRead = organizations[organizationId];
    organization.users = usersIds.split(",").map((userId: string) => ({
      user_id: users[userId].id,
      job_role: users[userId].job_role,
    }));
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 200,
        body: organization,
      },
    );
  },
);

Given(
  "the IAM Organization update organization request for Organization {string} has been forbidden",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 403,
      },
    );
  },
);

Given(
  "the IAM Organization {string} update request has been intercepted to return error",
  (organizationId: string): void => {
    const organization = organizations[organizationId];
    cy.intercept(
      "PATCH",
      `${config.iam.url}/iam/organizations/${organization.id}`,
      {
        statusCode: 400,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the Organization with id {string} for filter {string} and with user id {string}",
  (
    organization_id: string,
    filterId: string,
    organization_user_id: string,
  ): void => {
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization_id}/users?organization_user_id=${organization_user_id}`,
      {
        statusCode: 200,
        body: orgUsers[filterId],
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the Organization {string} for SP {string}",
  (organizationId: string, service_provider_id: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/service-providers/${service_provider_id}`,
      {
        statusCode: 200,
        body: organization,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the Organization SP {string} for user id {string}",
  (organizationId: string, organization_user_id: string): void => {
    const organization: Organization = organizations[organizationId];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/service-providers?organization_user_id=${organization_user_id}`,
      {
        statusCode: 200,
        body: [organization],
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to return the SP {string} from Organization {string}",
  (service_provider_id: string, organizationId: string): void => {
    const organization: Organization = organizations[organizationId];
    const serviceProvider: ServiceProvider =
      serviceProviders[service_provider_id];
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/service-providers/${serviceProvider.id}`,
      {
        statusCode: 200,
        body: serviceProvider,
      },
    );
  },
);

Given(
  "the IAM Organization request has been intercepted to register as a SP the Organization {string}",
  (organizationId: string): void => {
    cy.intercept(
      "POST",
      `${config.iam.url}/iam/organizations/${organizationId}/service-providers`,
      {
        statusCode: 200,
        body: registeredServiceProvider,
      },
    );
  },
);

Given(
  "the Billing and Invoicing request has been intercepted to add and return the billing address {string} from Organization {string}",
  (billingId: string, organizationId: string): void => {
    const billingAddress: BillingAddressRead = billing_addresses[billingId];
    cy.intercept(
      "POST",
      `${config.billing_and_invoicing.url}/service-consumers/${organizationId}/billing-address`,
      {
        statusCode: 200,
        body: billingAddress,
      },
    );
  },
);

Given(
  "the Billing and Invoicing request has been intercepted to update the billing address {string} from Organization {string}",
  (billingId: string, organizationId: string): void => {
    const billingAddress: BillingAddressRead = billing_addresses[billingId];
    cy.intercept(
      "PATCH",
      `${config.billing_and_invoicing.url}/service-consumers/${organizationId}/billing-address/${billingAddress.id}`,
      {
        statusCode: 200,
        body: billingAddress,
      },
    );
  },
);

Given(
  "the Billing and Invoicing request has been intercepted to update and return the billing address {string} from Organization {string}",
  (billingId: string, organizationId: string): void => {
    const billingAddress: BillingAddressRead = billing_addresses[billingId];
    cy.intercept(
      "PATCH",
      `${config.billing_and_invoicing.url}/service-consumers/${organizationId}/billing-address`,
      {
        statusCode: 200,
        body: billingAddress,
      },
    );
  },
);

Given(
  "the Billing and Invoicing request has been intercepted to return the billing address {string} from Organization {string}",
  (billingId: string, organizationId: string): void => {
    const billingAddress: BillingAddressRead = billing_addresses[billingId];
    cy.intercept(
      "GET",
      `${config.billing_and_invoicing.url}/service-consumers/${organizationId}/billing-address`,
      {
        statusCode: 200,
        body: billingAddress,
      },
    );
  },
);

Given(
  "the Billing and Invoicing request has been intercepted to return the billing details for the Agreement {string} of Service Consumer {string}",
  (agreement_fixture_id: string, service_consumer_fixture_id: string): void => {
    const agreement = extendedAgreements[agreement_fixture_id];
    const service_consumer = organizations[service_consumer_fixture_id];
    const url = `${config.billing_and_invoicing.url}/service-consumers/${service_consumer.id}/agreements/${agreement.id}`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: agreement,
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the Contracting request has been intercepted to return the legal document type {string} for the Agreement Type {string} of Service Consumer {string}",
  (
    legal_doc_type_fixture_id: string,
    agreement_fixture_id: string,
    service_consumer_fixture_id: string,
  ): void => {
    const legal_doc_type = legalDocumentTypes[legal_doc_type_fixture_id];
    const agreement_type = license[agreement_fixture_id];
    const service_consumer = organizations[service_consumer_fixture_id];
    const url = `${config.contracting.url}/service-consumers/${service_consumer.id}/agreement-types/${agreement_type.id}/legal-document-types*`;
    cy.intercept("GET", url, {
      statusCode: 200,
      body: [legal_doc_type],
    }).as(url);
    context.aliases.push(url);
  },
);

Given(
  "the IAM Organization request has been intercepted to return Service Providers {string} from Organization {string}",
  (serviceProvidersFixtureIds: string, organizationFixtureId: string): void => {
    const organization: Organization = organizations[organizationFixtureId];
    const serviceProvidersSplitted: string[] =
      serviceProvidersFixtureIds.split(",");
    const serviceProvidersFiltered: ServiceProvider[] =
      serviceProvidersSplitted.reduce((acc, id) => {
        if (serviceProviders[id]) acc.push(serviceProviders[id]);
        return acc;
      }, []);
    const serviceProvidersIdsFiltered: string[] = serviceProvidersFiltered.map(
      (serviceProviderFiltered) => serviceProviderFiltered.id,
    );
    const queryParams: string = serviceProvidersIdsFiltered
      .map(
        (serviceProviderId: string) =>
          `service_provider_id=${encodeURIComponent(serviceProviderId)}`,
      )
      .join("&");
    cy.intercept(
      "GET",
      `${config.iam.url}/iam/organizations/${organization.id}/service-providers?${queryParams}`,
      {
        statusCode: 200,
        body: serviceProvidersFiltered,
      },
    );
  },
);

Given(
  "the Onboarding GET Consents {string} for Organization {string} request has been intercepted",
  (consentsFixtureId: string, organizationFixtureId: string): void => {
    const organizationId = organizations[organizationFixtureId].id;
    cy.intercept(
      "GET",
      `${config.onboarding.url}/organizations/${organizationId}/consents`,
      {
        statusCode: 200,
        body: consents[consentsFixtureId],
      },
    );
  },
);
