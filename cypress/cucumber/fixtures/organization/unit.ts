import { OrganizationUnitRead } from "../../../../src/iam/iam.types";

export const organizationUnit: {
  [organization: string]: OrganizationUnitRead;
} = {
  "001": {
    id: "01234567-89ab-cdef-0123-456789abcdef",
    name: "Unit 1",
    description: "unit 1 Description",
    parent_organization_unit_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
  },
};
