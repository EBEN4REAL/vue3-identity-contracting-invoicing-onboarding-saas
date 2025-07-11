import { AuditEventRead } from "../../../src/iam/iam.types";

export const auditEvents: { [key: string]: AuditEventRead } = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "ae5769f8-07ae-463e-ab39-d50b7ac251fe",
        date: "2024-07-09T17:26:07.701874Z",
        user_id: null,
        action: "CREATE",
        resource: {
          id: "52cb39d2-1915-484a-a030-0e5107b77273",
          type: "organization_group",
          name: null,
        },
        payload: {
          id: "52cb39d2-1915-484a-a030-0e5107b77273",
          organization_id: "626abbac-8a70-4df1-afb4-d083bf4c3e26",
          name: "Viewers",
          description: "Organization Viewers",
          role: "GroupRole.VIEWER",
        },
        service_provider_id: "00000000-0000-0000-0002-000000000001",
        oauth_client_id: "dc742b28-47f6-11ee-be56-0242ac120002",
        organization_id: "626abbac-8a70-4df1-afb4-d083bf4c3e26",
        service_provider_user_id: "39518eb3-df37-4e9a-8ff2-0a7393bcd0b7",
      },
    ],
    size: 1,
    total: 1,
  },
};
