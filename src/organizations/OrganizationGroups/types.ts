import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";
import { ServiceConsumerAgreementRead } from "~/organizations/licenses/licenses.types";

export type TypeGroupUserAddForm = {
  userIds: string[];
};

export type TypeGroupUserAddRules = {
  userIds: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorGroupUserAdd = Ref<
  Validation<TypeGroupUserAddRules, TypeGroupUserAddForm>
>;

export type TypeEditOrganizationGroupForm = {
  name?: string | null;
  description?: string | null;
};

export type TypeEditOrganizationGroupFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  description: {
    maxLength: ValidationRuleWithParams;
  };
};

export type TypeValidatorEditOrganizationGroupForm = Ref<
  Validation<TypeEditOrganizationUnitFormRules, TypeEditOrganizationUnitForm>
>;

export type ErrorAlertProp = {
  isInErrorState: boolean;
  resetErrorState: () => void;
  alertText: string;
};

export type TypeLicenseItemInRow = {
  id: Pick<ServiceConsumerAgreementRead, "id">;
  name: Pick<ServiceConsumerAgreementRead, "agreement_type_name">;
  description: Pick<ServiceConsumerAgreementRead, "description">;
};

export type TypeFormattedLicenses = {
  id?: string;
  name?: string;
  description?: string | null;
  value?: string;
  disabled?: boolean;
};
