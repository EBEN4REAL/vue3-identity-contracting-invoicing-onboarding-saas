import { OrganizationGroupRead, OrganizationUserUpdate } from "~/iam/iam.types";

export type TypeUpdateUserDetailsForm = Partial<
  Pick<
    OrganizationUserUpdate,
    "job_role" | "organization_unit_id" | "attributes"
  >
>;

export type TypeOrganizationGroupReadForTable = Pick<
  OrganizationGroupRead,
  "name" | "description"
>;
