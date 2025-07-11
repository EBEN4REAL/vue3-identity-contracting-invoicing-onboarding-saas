import { components } from "./policies.schemas";

export type GetServiceConsumerAgreementsRequest = {
  cancelled?: boolean;
  assigned_organization_user_id?: string;
  assigned_own_organization?: boolean;
  assigned_organization_unit_id?: string;
};

export type ResourceTypeRead = components["schemas"]["ResourceTypeRead"];

export type PolicyRead = components["schemas"]["PolicyRead"];

export type PolicyReadWithOwnerName =
  components["schemas"]["PolicyReadWithOwnerName"];

export type PolicyTypeRead = components["schemas"]["PolicyTypeRead"];

export type PolicyTypeWithServiceProviderRead =
  components["schemas"]["PolicyTypeWithServiceProviderRead"];

export type PolicyUsageRead = components["schemas"]["PolicyUsageRead"];

export type PolicyTypeUsageRead = components["schemas"]["PolicyTypeUsageRead"];

export type AgreementTypeRead = components["schemas"]["AgreementTypeRead"];

export type AgreementTypeWithPoliciesRead =
  components["schemas"]["AgreementTypeWithPoliciesRead"];

export type AgreementTypeWithServiceProviderRead =
  components["schemas"]["AgreementTypeWithServiceProviderRead"];

export type OrganizationPolicyAssignmentRead =
  components["schemas"]["OrganizationPolicyAssignmentRead"];

export type ServiceConsumerAgreementPoliciesRead =
  components["schemas"]["ServiceConsumerAgreementPoliciesRead"];

export type SCAgreementRead = components["schemas"]["SCAgreementRead"];

export type SCAgreementContactUserUpdate =
  components["schemas"]["SCAgreementContactUserUpdate"];

export type BillingStatus = components["schemas"]["BillingStatus"];

export type LegalDocumentStatus = components["schemas"]["LegalDocumentStatus"];

export type PoliciesUserAccess = components["schemas"]["UserAccess"];

export type AgreementRead = components["schemas"]["AgreementRead"];
