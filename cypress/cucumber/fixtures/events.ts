import { EventRead } from "../../../src/events/events.types";

export const events: { [key: string]: EventRead } = {
  "001": {
    id: "4ee1382c-9fd8-42ab-9847-92b34ec33fa8",
    type: "ONBOARDING_USER_UPDATED",
    timestamp: "2024-07-15T16:24:04.804120",
    user_id: "57d6eb79-f882-450c-a8da-cf7cd6d64ccc",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    organization_id: "555cebbf-21c2-4c7b-bce4-bc139375da26",
    payload: {
      ip_address: "127.0.0.1",
    },
    oauth_client_id: "dc742b28-47f6-11ee-be56-0242ac120002",
  },
  "002": {
    id: "3ee1382c-9fd8-42ab-9847-92b34ec33fa8",
    type: "LOGOUT",
    timestamp: "2024-07-13T03:13:24.869800",
    user_id: "57d6eb79-f882-450c-a8da-cf7cd6d64ccc",
    service_provider_id: "3a6f01d0-f3c6-4923-ad98-112d6d97355b",
    organization_id: "555cebbf-21c2-4c7b-bce4-bc139375da26",
    payload: {
      ip_address: "192.168.0.1",
    },
    oauth_client_id: "ac742b28-47f6-11ee-be56-0242ac120002",
  },
};
