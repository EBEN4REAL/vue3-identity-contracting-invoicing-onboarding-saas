import { OrganizationGroupRead, UserUpdate } from "~/iam/iam.types";

export type TypeUpdateUserDetailsForm = Partial<
  Pick<UserUpdate, "first_name" | "last_name">
>;

export type TypeOrganizationGroupReadForTable = Pick<
  OrganizationGroupRead,
  "name" | "description"
>;
