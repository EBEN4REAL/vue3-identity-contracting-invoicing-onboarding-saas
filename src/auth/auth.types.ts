import { UserProfile } from "oidc-client-ts";
import { Validation, ValidationRuleWithParams } from "@vuelidate/core";
import { Ref } from "vue/dist/vue";

export enum ScreenHint {
  SIGNUP = "signup",
}

export enum Auth {
  Email = "0",
  Password = "1",
  OrganizationSelection = "2",
  MFA = "3",
}

export interface UserProfileMM extends UserProfile {
  sp?: string;
  org?: string;
  aao?: string;
  sp_org?: string;
  sp_url?: string;
  sp_name?: string;
  org_name?: string;
  roles?: string[];
  groups?: string[];
  onboarding_completed?: boolean;
}

export type LoginOrganization = {
  id: string;
  name: string;
};

export type TypeSignupForm = {
  email: string;
};

export type TypeLoginForm = {
  email: string;
  password: string;
};

export type TypeSSOLoginForm = {
  email: string;
};

export type TypeSignupFormRules = {
  email: {
    required: ValidationRuleWithParams;
    email: ValidationRuleWithParams;
  };
  password: {
    required: ValidationRuleWithParams;
  };
};

export type TypeLoginFormRules = {
  email: {
    required: ValidationRuleWithParams;
    email: ValidationRuleWithParams;
  };
};

export type SignupValidatorType = Ref<
  Validation<TypeSignupFormRules, TypeSignupForm>
>;
export type LoginValidatorType = Ref<
  Validation<TypeSignupFormRules, TypeSignupForm>
>;

export type TypeForgottenPasswordForm = {
  email: string;
};

export type TypeForgottenPasswordFormRules = {
  email: {
    required: ValidationRuleWithParams;
    email: ValidationRuleWithParams;
  };
};

export type TypeValidatorForgottenPassword = Ref<
  Validation<TypeForgottenPasswordFormRules, TypeForgottenPasswordForm>
>;

export type TypeResetPasswordForm = {
  password: string;
};

export type TypeResetPasswordFormRules = {
  password: {
    [key: string]: ValidationRuleWithParams;
  };
};

export type TypeValidatorResetPassword = Ref<
  Validation<TypeResetPasswordFormRules, TypeResetPasswordForm>
>;

export type TypeSignupConfirmationForm = {
  password: string;
};

export type TypeSignupConfirmationFormRules = {
  password: {
    [key: string]: ValidationRuleWithParams;
  };
};

export type TypeValidatorSignupConfirmation = Ref<
  Validation<TypeSignupConfirmationFormRules, TypeSignupConfirmationForm>
>;

export type TypeSignupTOTPVerificationForm = {
  code: string;
};

export type TypeDeleteAccountForm = {
  email: string;
  confirmText: string;
};

export type TypeSignupTOTPVerificationFormRules = {
  code: {
    [key: string]: ValidationRuleWithParams;
  };
};

export type TypeDeleteAccountFormRules = {
  email: {
    [key: string]: ValidationRuleWithParams;
  };
  confirmText: {
    [key: string]: ValidationRuleWithParams;
  };
};

export type TypeValidatorSignupTOTPVerification = Ref<
  Validation<TypeDeleteAccountFormRules, TypeDeleteAccountForm>
>;

export type BrandingConfigType = {
  button_background_color?: string;
  button_text_color?: string;
  name?: string;
  logo_url?: string;
};

export type TypeSelectOrganizationForm = {
  selectedOrganizationId: string;
};

export type TypeSelectOrganizationFormRules = {
  selectedOrganizationId: {
    required: ValidationRuleWithParams;
  };
};

export type TypeValidatorOrganizationSelect = Ref<
  Validation<TypeSelectOrganizationFormRules, TypeSelectOrganizationForm>
>;

export type TypeMFAMethod = {
  selected: boolean;
  name: string;
  icon: string;
};

export enum AuthStorageKeys {
  AUTH_STATE = "authState",
  ONBOARDING = "onboarding",
  ACCESS_DENIED = "accessDenied",
  PLAN_PAGE = "planPage",
}

export enum CookieType {
  USER_EMAIL = "user_email",
  SP_BRANDING = "sp",
}

export type EmailCookie = {
  email: string;
};

export type LoginStateRead = {
  csrf_token?: string;
};
