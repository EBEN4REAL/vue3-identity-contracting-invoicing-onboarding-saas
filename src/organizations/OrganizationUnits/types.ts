import { OrganizationUnitRead } from "~/iam/iam.types";
import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";

export type UnitItemInTreeType =
  | ({
      children: UnitItemInTreeType[];
    } & OrganizationUnitRead & { type: string; append?: string })
  | null;

export type UnitItemFormUpdateType = {
  name: string;
  description: string;
  parent_unit: string;
};

export type TypeCreateOrganizationUnitForm = {
  parent_organization_unit_id: string | null;
  name: string;
  description?: string | null;
};

export type TypeCreateOrganizationUnitFormRules = {
  name: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorCreateOrganizationUnitForm = Ref<
  Validation<
    TypeCreateOrganizationUnitFormRules,
    TypeCreateOrganizationUnitForm
  >
>;

export type TypeEditOrganizationUnitForm = {
  parent_organization_unit_id?: string | null;
  name?: string | null;
  description?: string | null;
};

export type TypeEditOrganizationUnitFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  description: {
    maxLength: ValidationRuleWithParams;
  };
};

export type TypeValidatorEditOrganizationUnitForm = Ref<
  Validation<TypeEditOrganizationUnitFormRules, TypeEditOrganizationUnitForm>
>;

export type TypeAllocateLicenseToOrganizationUnitForm = {
  agreement_id: string;
  optional_policy_ids: string[];
};

export type TypeAllocateLicenseToOrganizationUnitFormRules = {
  agreement_id: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorAllocateLicenseToOrganizationUnitForm = Ref<
  Validation<
    TypeAllocateLicenseToOrganizationUnitFormRules,
    TypeAllocateLicenseToOrganizationUnitForm
  >
>;
export type TypeAddUsersToOrganizationUnitForm = {
  users: string[];
};

export type TypeOrganizationUnitsWithParent = {
  parent_organization_unit_id: string | null;
  name: string;
  description: string | null;
  id: string;
  level?: number;
  disabled?: boolean;
};

export type SubmitType = {
  agreement_id: string;
  optional_policy_ids: string[];
};
export type ErrorAlertProp = {
  isInErrorState: boolean;
  resetErrorState: () => void;
  alertText: string;
};
