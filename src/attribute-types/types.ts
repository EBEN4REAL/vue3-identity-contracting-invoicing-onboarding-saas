import { BadgeTypes } from "~/mm_ui_kit/src/types/badge.types";
import {
  AttributeOf,
  AttributeTypeUpdate,
  DataType,
} from "~/onboarding/onboarding.types";
import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";

export type TypeBadgeTableData = {
  status: BadgeTypes;
  text: "Enabled" | "Disabled";
};

export type TypeAttributeTypeEditInfo = {
  id: string;
  attribute_of: string;
  organization_attribute?: boolean;
};

export type TypeRestrictions = {
  min_length: string;
  max_length: string;
  options: string[];
};

export type TypeAttributeTypeForm = {
  attribute_of: AttributeOf | null;
  data_type: DataType | null;
  name: string;
  enabled?: boolean | null;
  restrictions?: Record<string, never> | null;
  claim_name: string;
};

export type TypeAttributeTypeFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  claim_name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
    claimNameValidator: ValidationRuleWithParams;
  };
  attribute_of: {
    required: ValidationRuleWithParams;
  };
  data_type: {
    required: ValidationRuleWithParams;
  };
  enabled: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorAttributeTypeForm = Ref<
  Validation<TypeAttributeTypeFormRules, TypeAttributeTypeForm>
>;

export type TypeAttributeTypeRestrictionsFormRules = {
  options: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorAttributeTypeRestrictionsForm = Ref<
  Validation<TypeAttributeTypeRestrictionsFormRules, TypeRestrictions>
>;

export type TypeUpdateAttributeTypeFormRules = {
  name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
  };
  enabled: {
    required: ValidationRuleWithParams;
  };
  claim_name: {
    required: ValidationRuleWithParams;
    maxLength: ValidationRuleWithParams;
    claimNameValidator: ValidationRuleWithParams;
  };
};

export type TypeUpdateValidatorAttributeTypeForm = Ref<
  Validation<TypeUpdateAttributeTypeFormRules, AttributeTypeUpdate>
>;

// Based on DataType enum from onboarding.types.ts
export enum EnumDataType {
  UUID = "uuid",
  STRING = "string",
  DATE = "date",
  BOOLEAN = "boolean",
  ENUM = "enum",
}
