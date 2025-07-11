import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";
import { OrganizationUserRead } from "~/iam/iam.types";

export enum OrganizationUserStatus {
  PENDING = "P",
  ACCEPTED = "A",
  REJECTED = "R",
  CANCELLED = "C",
}

export type TypeOrganizationUsersTabAdditionalQueryParams = {
  status: OrganizationUserStatus;
  invited?: boolean;
};

export type TypeInviteUsersForm = {
  emails: string[];
  groups: string[];
  organizationalUnit: string | null;
};

export type TypeInviteUsersFormRules = {
  emails: {
    required: ValidationRuleWithParams;
    emails: ValidationRuleWithParams;
  };
};

export type TypeValidatorInviteUsersForm = Ref<
  Validation<TypeInviteUsersFormRules, TypeInviteUsersForm>
>;

export type TypeChangePasswordForm = {
  old: string;
  new: string;
};

export type TypePasswordRules = {
  [key: string]: ValidationRuleWithParams;
};

export type TypeChangePasswordFormRules = {
  old: TypePasswordRules;
  new: TypePasswordRules;
};

export type TypeSetPasswordForm = {
  new: string;
};

export type TypeSetPasswordFormRules = {
  new: TypePasswordRules;
};

export type TypeValidatorChangePassword = Ref<
  Validation<TypeChangePasswordFormRules, TypeChangePasswordForm>
>;

export type TypeChangeEmailForm = {
  password: string;
  newEmail: string;
};

export type TypeDialogConfirmResetWebAuthenticationUser = Pick<
  OrganizationUserRead,
  "user_id" | "first_name" | "last_name" | "email"
>;
