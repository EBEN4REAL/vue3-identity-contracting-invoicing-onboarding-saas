import { components } from "./onboarding.schemas";
import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";

export type FlowStageSchema = components["schemas"]["FlowStageSchema"];

export type FlowSchema = components["schemas"]["FlowSchema"];

export type OrganizationCreate = components["schemas"]["OrganizationCreate"];

export type OrganizationRead = components["schemas"]["OrganizationRead"];

export type UserRead = components["schemas"]["UserRead"];

export type UserUpdate = components["schemas"]["UserUpdate"];

export type OrganizationUsersInvite =
  components["schemas"]["OrganizationUsersInvite"];

export type OrganizationUpdate = components["schemas"]["OrganizationUpdate"];

export type AttributeTypeRead = components["schemas"]["AttributeTypeRead"];

export type AttributeTypeCreate = components["schemas"]["AttributeTypeCreate"];

export type WelcomeComponentsRead =
  components["schemas"]["WelcomeComponentsRead"];

export type ComponentsRead = components["schemas"]["ComponentsRead"];

export type UserWelcomeComponentRead =
  components["schemas"]["UserWelcomeComponentRead"];

export type AttributeTypeUpdate = components["schemas"]["AttributeTypeUpdate"];

export type AttributeOf = components["schemas"]["AttributeSetAttributesOf"];

export type DataType = components["schemas"]["DataType"];

export type ServiceProviderAttributesConsentsRead =
  components["schemas"]["ServiceProviderAttributesConsentsRead"];

export type ServiceProvidersAttributesConsentsRead =
  components["schemas"]["ServiceProvidersAttributesConsentsRead"];

export type OnboardingError = {
  detail: string;
};

export type FlowReadParams = {
  sync_code?: string;
  stage_index?: number;
};

export type FormDataItem = {
  name: string;
  value: string | number | boolean | null;
  data_type: DataType;
  items?: Array<{ title: string; value: string | number | boolean }>;
  placeholder: string;
  disabled?: boolean;
  isAttribute?: boolean;
};

export type OnboardingFormData = {
  [key: string]: FormDataItem | null;
};

export type FormattedAttributes = Record<string, string | boolean>;

export type TypeUserDetailsForm = {
  firstName: string;
  lastName: string;
  jobRole: string;
  [key: string]: string | boolean;
};

export type TypeUserDetailsFormRules = {
  firstName: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  lastName: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  [key: string]: {
    required?: ValidationRuleWithParams;
    minLength?: ValidationRuleWithParams;
    maxLength?: ValidationRuleWithParams;
  };
};

export type TypeValidatorUserDetails = Ref<
  Validation<TypeUserDetailsFormRules, TypeUserDetailsForm>
>;

export type TypeCreateOrganizationForm = Omit<
  OrganizationCreate,
  "auto_joined_enabled"
>;

export type TypeCreateOrganizationFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  [key: string]: {
    required?: ValidationRuleWithParams;
    minLength?: ValidationRuleWithParams;
    maxLength?: ValidationRuleWithParams;
  };
};

export type TypeValidatorCreateOrganization = Ref<
  Validation<TypeCreateOrganizationFormRules, TypeCreateOrganizationForm>
>;

export type TypeUpdateOrganizationForm = Omit<
  OrganizationUpdate,
  "auto_joined_enabled"
>;

export type TypeUpdateOrganizationFormRules = {
  [key: string]: {
    required?: ValidationRuleWithParams;
    minLength?: ValidationRuleWithParams;
    maxLength?: ValidationRuleWithParams;
  };
};

export type TypeValidatorUpdateOrganization = Ref<
  Validation<TypeUpdateOrganizationFormRules, TypeUpdateOrganizationForm>
>;

export enum WelcomeComponentAppEnum {
  SC = "sc",
  SP = "sp",
}

export type WelcomeComponentsReadParams = {
  app: WelcomeComponentAppEnum;
};

export type WelcomeComponentsCreateParams = {
  app: WelcomeComponentAppEnum;
  component: string;
};

export type Attributes = Attribute[];

export interface Attribute {
  id: string;
  name: string;
  data_type: string;
  visible: boolean;
  required: boolean;
  description: string | null;
  restrictions: Restrictions | null;
  value: string | null | boolean;
  consent: {
    required: boolean;
    granted: boolean;
    consent_date: string;
  };
}

export interface Restrictions {
  min_length?: number;
  max_length?: number;
}

export interface JobRole {
  department: string;
  abbr: string;
}

export interface OrganizationIndustries {
  title: string;
  value: string;
}

export type TypeOnboardingInviteUsersForm = {
  emails: string[];
};

export type TypeOnboardingInviteUsersFormRules = {
  emails: {
    required?: ValidationRuleWithParams;
    emails?: ValidationRuleWithParams;
    optionalEmailListValidator?: ValidationRuleWithParams;
  };
};

export type AttributeSetRead = components["schemas"]["AttributeSetRead"];
export type AttributesConsentUpdate =
  components["schemas"]["AttributesConsentUpdate"];
