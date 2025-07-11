import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";
import {
  BillingAddressCreate,
  BillingAddressRead,
} from "~/billing_and_invoicing/billing_and_invoicing.types";
import {
  Industry,
  NumberOfEmployees,
  OrganizationUpdate,
} from "~/iam/iam.types";

export type TypeCreateSuborganizationForm = {
  name: string;
  email: string;
  industry?: Industry;
  number_of_employees_range?: NumberOfEmployees;
};

export type TypeCreateSuborganizationRules = {
  name: {
    required: ValidationRuleWithParams;
  };
  email: {
    required: ValidationRuleWithParams;
    email: ValidationRuleWithParams;
  };
};

export type TypeValidatorCreateSuborganization = Ref<
  Validation<TypeCreateSuborganizationRules, TypeCreateSuborganizationForm>
>;

export type TypeUpdateOrganizationDetailsForm = OrganizationUpdate;
export type TypeUpdateBillingDetailsForm =
  | BillingAddressCreate
  | BillingAddressRead;
export type TypeUpdateOrganizationDetailsFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  industry: {
    required: ValidationRuleWithParams;
  };
  number_of_employees_range: {
    required: ValidationRuleWithParams;
  };
};

export type TypeUpdateOrganizationBillingAddressFormRules = {
  country: {
    required: ValidationRuleWithParams;
  };
  address_line_1: {
    required: ValidationRuleWithParams;
  };
  town_city: {
    required: ValidationRuleWithParams;
  };
  postal_code: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorUpdateOrganization = Ref<
  Validation<
    TypeUpdateOrganizationDetailsFormRules,
    TypeUpdateOrganizationDetailsForm
  >
>;

export type TypeValidatorUpdateOrganizationBillingAddress = Ref<
  Validation<
    TypeUpdateOrganizationBillingAddressFormRules,
    TypeUpdateBillingDetailsForm
  >
>;

export type TypeCreateOrganizationGroupForm = {
  name: string;
  description: string;
};

export type TypeDeleteOrganizationForm = {
  code: string | null;
};

export type TypeDeleteOrganizationFormRules = {
  code: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorDeleteOrganization = Ref<
  Validation<TypeDeleteOrganizationFormRules, TypeDeleteOrganizationForm>
>;

export type TypeCreateOrganizationGroupRules = {
  name: {
    required: ValidationRuleWithParams;
  };
  description: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorCreateOrganizationGroup = Ref<
  Validation<TypeCreateOrganizationGroupRules, TypeCreateOrganizationGroupForm>
>;
