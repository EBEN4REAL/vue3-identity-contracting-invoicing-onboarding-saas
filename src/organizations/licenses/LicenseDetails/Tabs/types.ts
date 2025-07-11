import { OrganizationGroupRead, OrganizationUserRead } from "~/iam/iam.types";

export type TypeOrganizationGroupForTable = Omit<
  OrganizationGroupRead,
  "users"
> & { users: number };

export type TypeOrganizationUsersForTable = Pick<
  OrganizationUserRead,
  "id" | "email"
> & { name: string };
