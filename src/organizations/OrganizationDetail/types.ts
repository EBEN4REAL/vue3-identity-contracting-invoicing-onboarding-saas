import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue";

export type TypeAddOrganizationSSOConfig = {
  clientId: string;
  clientSecret: string;
  serverMetadataUrl: string;
};

export type TypeAddOrganizationSSOConfigFormRules = {
  clientId: {
    required: ValidationRuleWithParams;
  };
  clientSecret: {
    required: ValidationRuleWithParams;
  };
  serverMetadataUrl: {
    required: ValidationRuleWithParams;
    url: ValidationRuleWithParams;
  };
};

export type TypeAddOrganizationSSOConfigForm = {
  clientId: string;
  clientSecret: string;
  serverMetadataUrl: string;
};

export type TypeValidatorAddOrganizationSSOConfigForm = Ref<
  Validation<
    TypeAddOrganizationSSOConfigFormRules,
    TypeAddOrganizationSSOConfigForm
  >
>;
