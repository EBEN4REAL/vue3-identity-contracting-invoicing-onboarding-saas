import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { components } from "../../policies/policies.schemas";
import { Ref } from "vue";

export type AgreementTypeRead = components["schemas"]["AgreementTypeRead"][];

export type AgreementTypeCreate =
  components["schemas"]["AgreementTypeCreate"][];

export type TypeAllocateLicenseToGroupForm = {
  agreement_id: string;
  optional_policy_ids: string[];
};

export type TypeAllocateLicenseToGroupFormRules = {
  agreement_id: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorAllocateLicenseToGroupForm = Ref<
  Validation<
    TypeAllocateLicenseToGroupFormRules,
    TypeAllocateLicenseToGroupForm
  >
>;

export type TypeAllocateLicenseToUserForm = {
  agreement_id: string;
  optional_policy_ids: string[];
};

export type TypeAllocateLicenseToUserFormRules = {
  agreement_id: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorAllocateLicenseToUserForm = Ref<
  Validation<
    TypeAllocateLicenseToGroupFormRules,
    TypeAllocateLicenseToGroupForm
  >
>;

export type SubmitType = {
  agreement_id: string;
  optional_policy_ids: string[];
};

export type ErrorAlertProp = {
  isInErrorState: boolean;
  resetErrorState: () => void;
  alertText: string;
};
