import { OrganizationUnitIDRead } from "../../../../src/organizations/licenses/licenses.types";
import { TableResponse } from "../../../../src/common/types/table.types";

export const unitSC: {
  [key: string]: TableResponse<OrganizationUnitIDRead>;
} = {
  "001": {
    offset: 0,
    limit: 10,
    results: [
      {
        organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
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
        organization_unit_id: "01234567-89ab-cdef-0123-456789abcdef",
      },
      {
        organization_unit_id: "11234567-89ab-cdef-0123-456789abcdef",
      },
    ],
    size: 2,
    total: 2,
  },
};
