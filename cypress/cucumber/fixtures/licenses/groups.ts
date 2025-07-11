import { OrganizationGroupIDRead } from "../../../../src/organizations/licenses/licenses.types";
import { TableResponse } from "../../../../src/common/types/table.types";

export const groupSC: {
  [key: string]: TableResponse<OrganizationGroupIDRead>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        organization_group_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      },
    ],
    size: 1,
    total: 1,
  },
  "001-Empty": {
    offset: 0,
    limit: 10,
    results: [],
    size: 0,
    total: 0,
  },
  "001-Updated": {
    offset: 0,
    limit: 10,
    results: [
      {
        organization_group_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
      },
      {
        organization_group_id: "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1",
      },
    ],
    size: 1,
    total: 1,
  },
};
