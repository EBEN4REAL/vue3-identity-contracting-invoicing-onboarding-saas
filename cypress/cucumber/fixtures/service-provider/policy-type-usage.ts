import { PolicyTypeUsageRead } from "../../../../src/policies/policies.types";

export const policyTypeUsages: {
  [key: string]: PolicyTypeUsageRead;
} = {
  "001": {
    policies: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "Policy 001",
      },
    ],
    agreements: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        name: "License 001",
      },
    ],
    users_count: 12,
    organizations_count: 13,
  },
  empty: {
    policies: [],
    agreements: [],
    users_count: 0,
    organizations_count: 0,
  },
};
