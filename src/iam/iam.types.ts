import { components } from "./iam.schemas";

export type AuditEventRead = components["schemas"]["AuditEventRead"];

export type MetricsChart = components["schemas"]["MetricsChart"];

export type MetricsDataset = components["schemas"]["MetricsDataset"];

export type UserMFARequiredStatusUpdate =
  components["schemas"]["UserMFARequiredStatusUpdate"];

export type UserMFARequiredStatusRead =
  components["schemas"]["UserMFARequiredStatusRead"];

export type PaginationSchema_OauthClientRead_ =
  components["schemas"]["PaginationSchema_OauthClientRead_"];

export type PaginationSchema_OrganizationRead_ =
  components["schemas"]["PaginationSchema_OrganizationRead_"];

export type MFARead = components["schemas"]["MFARead"];

export type UserEmailOTPStatusRead =
  components["schemas"]["UserEmailOTPStatusRead"];

export type UserEmailOTPStatusUpdate =
  components["schemas"]["UserEmailOTPStatusUpdate"];

export type OrganizationUserImportRead =
  components["schemas"]["OrganizationUserImportRead"];

export type PaginationSchema_ServiceProviderOrganizationUserRead_ =
  components["schemas"]["PaginationSchema_ServiceProviderOrganizationUserRead_"];

export type PaginationSchema_ServiceProviderRead_ =
  components["schemas"]["PaginationSchema_ServiceProviderRead_"];

export type PaginationSchema_UserRead_ =
  components["schemas"]["PaginationSchema_UserRead_"];

export type PaginationSchema_OrganizationUserRead_ =
  components["schemas"]["PaginationSchema_OrganizationUserRead_"];

export type OrganizationDomainSchema =
  components["schemas"]["OrganizationDomainSchema"];

export type OrganizationRead = components["schemas"]["OrganizationRead"];

export type OrganizationReadWithAttributes =
  components["schemas"]["OrganizationReadWithAttributes"];

export type OrganizationReadBase =
  components["schemas"]["OrganizationReadBase"];

export type OrganizationGroupRead =
  components["schemas"]["OrganizationGroupRead"];

export type OrganizationGroupCreate =
  components["schemas"]["OrganizationGroupCreate"];

export type OrganizationGroupUpdate =
  components["schemas"]["OrganizationGroupUpdate"];

export type OrganizationUserRead =
  components["schemas"]["OrganizationUserRead"];

export type OrganizationUserUpdate =
  components["schemas"]["OrganizationUserUpdate"];

export type OrganizationUsersCreate =
  components["schemas"]["OrganizationUsersCreate"];

export type OrganizationMetrics = components["schemas"]["OrganizationMetrics"];

export type OrganizationUnitRead =
  components["schemas"]["OrganizationUnitRead"];

export type OrganizationUnitReadWithUsers =
  components["schemas"]["OrganizationUnitReadWithUsers"];

export type OrganizationUnitCreate =
  components["schemas"]["OrganizationUnitCreate"];

export type OrganizationUnitUpdate =
  components["schemas"]["OrganizationUnitUpdate"];

export type SubOrganizationCreate =
  components["schemas"]["SubOrganizationCreate"];

export type OauthClientRead = components["schemas"]["OauthClientRead"];

export type OauthClientCreateResponse =
  components["schemas"]["OauthClientCreateResponse"];

export type OrganizationOIDCCreate = components["schemas"]["OIDCCreate"];

export type OrganizationOIDCRead = components["schemas"]["OIDCRead"];

export type ServiceProviderRead = components["schemas"]["ServiceProviderRead"];

export type ServiceProviderMetrics =
  components["schemas"]["ServiceProviderMetrics"];

export type UserRead = components["schemas"]["UserRead"];

export type UserEmailRead = components["schemas"]["UserEmailRead"];

export type UserUpdate = components["schemas"]["UserUpdate"];

export type OrganizationUserReadBase =
  components["schemas"]["OrganizationUserReadBase"];

export type ServiceProviderUserMeRead =
  components["schemas"]["ServiceProviderUserMeRead"];

export type OrganizationUpdate = components["schemas"]["OrganizationUpdate"];

export type UserIdNameSchema = components["schemas"]["UserIdNameSchema"];

export type OrganizationUserStatus =
  components["schemas"]["OrganizationUserStatus"];

export type OrganizationUserStatusUpdate =
  components["schemas"]["OrganizationUserStatusUpdate"];

export type OrganizationUserJobRole = components["schemas"]["JobRole"];

export type Industry = components["schemas"]["Industry"];

export type OrganizationUserStatusMap = {
  [key: OrganizationUserStatus]: string;
};

export type OrganizationUserJobRoleMap = {
  [key: OrganizationUserJobRole]: string;
};

export type UserSessionRead = components["schemas"]["UserSessionRead"];

export type LoginAttemptRead = components["schemas"]["LoginAttemptRead"];

export type UserLoginHistoryAccessRead = components["schemas"]["PolicyOutcome"];

export type UserSocialAccountRead =
  components["schemas"]["UserSocialAccountRead"];

export type NumberOfEmployees = components["schemas"]["NumberOfEmployees"];

export type PasswordRequirementRead =
  components["schemas"]["PasswordRequirementRead"];

export type PasswordRequirementExtended = PasswordRequirementRead & {
  message: string;
};

export type EmailRequirementRead =
  components["schemas"]["EmailRequirementRead"];

export type EmailRequirementExtended = EmailRequirementRead & {
  message: string;
};

export type PasswordRequirementsMap = {
  [key: string]: {
    message: (param: number | string) => string;
    validator: (
      value: string,
      param: number | string,
      username: string,
    ) => boolean;
  };
};

export type TOTPRead = components["schemas"]["TOTPRead"];

export type WebAuthnRead = components["schemas"]["WebAuthnRead"];

export type WebAuthnOptionsRead = components["schemas"]["WebAuthnOptionsRead"];

export type WebAuthnUpdate = components["schemas"]["WebAuthnUpdate"];

export type WebAuthnStatusRead = components["schemas"]["WebAuthnStatusRead"];

export type TOTPConfirmationRead =
  components["schemas"]["TOTPConfirmationRead"];

export type TOTPVerificationRead =
  components["schemas"]["TOTPVerificationRead"];

export type TOTPUpdate = components["schemas"]["TOTPUpdate"];

export type UserMagicLinkUpdate = components["schemas"]["UserMagicLinkUpdate"];

export type UserMagicLinkRead = components["schemas"]["UserMagicLinkRead"];

export type AccessEvaluationBaseRead =
  components["schemas"]["AccessEvaluationBaseRead"];

export type AccessEvaluationRead =
  components["schemas"]["AccessEvaluationRead"];

export type PolicyReadIAM = components["schemas"]["PolicyRead"];

export type AgreementReadIAM = components["schemas"]["AgreementRead"];

export type SyncStatus = components["schemas"]["SyncStatus"];

export type AttributeRead = components["schemas"]["AttributeRead"];

export type UserAccess = components["schemas"]["UserAccess"];

export type OauthClientPlanPageRead =
  components["schemas"]["OauthClientPlanPageRead"];

export type Price = {
  amount: number;
  currency: string;
  description?: string | null;
  agreement_type_id?: string;
};

export type TypeDeleteOrganizationForMultiselect = {
  id: string;
  name: string;
  disabledText: string;
  $isDisabled: boolean;
};

export type AgreementType = {
  id: string;
  name: string;
  price: Price;
  billingType: string;
  description: string;
  billing_type: string;
  marketing_features: string[];
  self_service_order: number;
  billingPeriodLength?: number | null;
  billing_period_unit?: string | null;
  billing_period_length?: number | null;
  requires_legal_documents: boolean;
  logoSrc?: string;
};
