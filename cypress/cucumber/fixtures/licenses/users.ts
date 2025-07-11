import { OrganizationUserPolicyAssignmentUserIDRead } from "../../../../src/organizations/licenses/licenses.types";
import { TableResponse } from "../../../../src/common/types/table.types";

export const userSC: {
  [key: string]: TableResponse<OrganizationUserPolicyAssignmentUserIDRead>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        organization_user_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
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
};
