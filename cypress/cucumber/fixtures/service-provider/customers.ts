import {
  PaginationSchema_ServiceProviderOrganizationRead_,
  PaginationSchema_ServiceProviderOrganizationUserRead_,
} from "../../../../src/iam/iam.types";

export const customers: {
  [key: string]: PaginationSchema_ServiceProviderOrganizationRead_ | null;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        organization: {
          id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
          name: "Acme Inc. SP",
        },
        is_active: true,
        created_date: "2024-04-15T13:13:51.058355",
      },
    ],
    size: 1,
    total: 1,
  },
};

export const serviceProviderUsers: {
  [key: string]: PaginationSchema_ServiceProviderOrganizationUserRead_ | null;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        id: "8f970a74-4a32-4690-b1cf-20286505fed0",
        user: {
          email: "test@metricsmatter.com",
          first_name: "test",
          last_name: "test",
        },
        organization_user: {
          id: "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d",
        },
        last_login_date: "2024-04-15T13:14:09.318238",
        last_login_access: null,
      },
    ],
    size: 1,
    total: 1,
  },
};
