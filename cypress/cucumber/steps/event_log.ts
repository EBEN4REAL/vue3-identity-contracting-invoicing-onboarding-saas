import config from "../../../src/mm.config.json";
import { Given } from "cypress-cucumber-preprocessor/steps";
import organizations from "../fixtures/organizations";
import { events } from "../fixtures/events";
import serviceProviders, {
  ServiceProvider,
} from "../fixtures/service_providers";
import { PaginationSchema_EventRead_ } from "../../../src/events/events.types";

Given(
  "the Events request has been intercepted to return the Events {string}",
  (eventIds: string): void => {
    const eventIdsArr: string[] = eventIds.split(",");
    const eventsPagination = {
      offset: 0,
      limit: 10,
      results: eventIdsArr.map((eventId: string) => events[eventId]),
      size: eventIdsArr.length > 10 ? 10 : eventIdsArr.length,
      total: eventIdsArr.length,
    };
    cy.intercept("GET", `${config.events.url}/events*`, {
      statusCode: 200,
      body: eventsPagination,
    });
  },
);

Given(
  "the Event Types request has been intercepted to return the Event Types {string}",
  (eventTypes: string) => {
    cy.intercept("GET", `${config.events.url}/event-types`, {
      statusCode: 200,
      body: eventTypes.split(","),
    });
  },
);

Given(
  "the Events request has been intercepted to return the Events {string} for Service Provider {string}",
  (eventIds: string, serviceProviderId: string): void => {
    const serviceProvider: ServiceProvider =
      serviceProviders[serviceProviderId];
    const eventIdsArr: string[] = eventIds.split(",");
    const eventsPagination: PaginationSchema_EventRead_ = {
      offset: 0,
      limit: 10,
      results: eventIdsArr.map((eventId: string) => events[eventId]),
      size: eventIdsArr.length > 10 ? 10 : eventIdsArr.length,
      total: eventIdsArr.length,
    };
    cy.intercept(
      "GET",
      `${config.events.url}/events?service_provider_id=${serviceProvider.id}&sort=type&limit=10&offset=0`,
      {
        statusCode: 200,
        body: eventsPagination,
      },
    );
  },
);

Given(
  "the Events request has been intercepted to return the Events {string} for Organization {string}",
  (eventIds: string, organizationId: string) => {
    const organization = organizations[organizationId];
    const eventIdsArr: string[] = eventIds.split(",");
    const eventsPagination = {
      offset: 0,
      limit: 10,
      results: eventIdsArr.map((eventId: string) => events[eventId]),
      size: eventIdsArr.length > 10 ? 10 : eventIdsArr.length,
      total: eventIdsArr.length,
    };
    cy.intercept(
      "GET",
      `${config.events.url}/events?limit=10&offset=0&organization_id=${organization.id}`,
      {
        statusCode: 200,
        body: eventsPagination,
      },
    ).as("getEventLog");
  },
);

Given(
  "the Events request has been intercepted to return the Events {string} for Organization {string} with query params {string}",
  (eventIds: string, organizationId: string, queryParams: string): void => {
    const organization = organizations[organizationId];
    const eventIdsArr: string[] = eventIds.split(",");
    const eventsData = eventIdsArr.map((eventId: string) => events[eventId]);

    const sortTimestampDescending = queryParams.includes("sort=timestamp:desc");
    const sortTypeAscending = queryParams.includes("&sort=type:asc");

    /** Sorting logic */
    if (sortTimestampDescending) {
      eventsData.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
      });
    } else if (sortTypeAscending) {
      eventsData.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      });
    }

    const eventsPagination: PaginationSchema_EventRead_ = {
      offset: 0,
      limit: 10,
      results: eventsData.slice(0, 10),
      size: eventsData.length > 10 ? 10 : eventsData.length,
      total: eventsData.length,
    };

    const interceptUrl = `${config.events.url}/events?${queryParams}&organization_id=${organization.id}`;

    cy.intercept("GET", interceptUrl, {
      statusCode: 200,
      body: eventsPagination,
    }).as(`getEventLog-${queryParams}`);
  },
);

Given(
  "the User waits for the event log to be populated with query params {string}",
  (queryParams: string) => {
    cy.wait(`@getEventLog-${queryParams}`);
  },
);

Given("the User waits for the event log to be populated", () => {
  cy.wait("@getEventLog");
});
