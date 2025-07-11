import { OrganizationUserRead } from "~/iam/iam.types";

export type TypeDialogAddUserToGroupsData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email" | "organization"
>;

export type TypeDialogAddUserToUnitData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email" | "unit" | "organization"
>;

export type TypeDialogConfirmResetPasswordData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email"
>;

export type TypeDialogConfirmDisableOrgUserData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "organization"
>;

export type TypeDialogConfirmEnableOrgUserData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "organization"
>;

export type TypeDialogConfirmDisableUserData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email"
>;

export type TypeDialogConfirmEnableUserData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name"
>;

export type TypeDialogConfirmRemoveUserData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "organization" | "email"
>;

export type TypeDialogConfirmResetTOTPData = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email"
>;

export type TypeDialogConfirmRemoveUserFromOrganizationData = {
  user_id: OrganizationUserRead["user_id"];
  first_name: OrganizationUserRead["first_name"];
  last_name: OrganizationUserRead["last_name"];
  organization: OrganizationUserRead["organization"];
};
export type TypeDialogConfirmRemoveUserFromMultipleOrganizationsData = {
  user_id: OrganizationUserRead["user_id"];
  first_name: OrganizationUserRead["first_name"];
  last_name: OrganizationUserRead["last_name"];
  organizations: OrganizationUserRead["organization"][];
};

export type TypeDialogConfirmDeleteAdminUser = {
  user_id: OrganizationUserRead["user_id"];
  first_name: OrganizationUserRead["first_name"];
  last_name: OrganizationUserRead["last_name"];
  email: OrganizationUserRead["email"];
};
