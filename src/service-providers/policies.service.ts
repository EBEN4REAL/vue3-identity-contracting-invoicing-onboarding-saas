import { AxiosResponse } from "axios";
import { reactive } from "vue";
import ClientService from "~/common/services/client.service";
import config from "../mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  AgreementReadExtended,
  ServiceConsumerAgreementRead,
  OrganizationGroupIDRead,
  OrganizationUnitIDRead,
  OrganizationUserPolicyAssignmentUserIDRead,
} from "~/organizations/licenses/licenses.types";
import {
  GetServiceConsumerAgreementsRequest,
  PolicyReadWithOwnerName,
  PolicyUsageRead,
  SCAgreementContactUserUpdate,
  SCAgreementRead,
  ServiceConsumerAgreementPoliciesRead,
  LegalDocumentStatus,
  PoliciesUserAccess,
  BillingStatus,
} from "~/policies/policies.types";

class PoliciesService {
  client: ClientService;
  state: {
    category_id: string | null;
  };

  constructor() {
    this.client = new ClientService(`${config.policies.url}`);
    this.state = reactive({
      category_id: null,
    });
  }

  async getServiceConsumerAgreements(
    service_consumer_id: string,
    params?: TableRequestParams &
      GetServiceConsumerAgreementsRequest & { category?: string },
  ): Promise<TableResponse<SCAgreementRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerAgreement(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<AgreementReadExtended> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}`,
    );
    return response.data;
  }

  async getServiceConsumerAgreementOrganizationUsers(
    service_consumer_id: string,
    agreement_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationUserPolicyAssignmentUserIDRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-users`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerAgreementOrganizationGroups(
    service_consumer_id: string,
    agreement_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationGroupIDRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-groups`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerAgreementOrganizationUnits(
    service_consumer_id: string,
    agreement_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationUnitIDRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-units`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerGroupAgreements(
    service_consumer_id: string,
    organization_group_id: string,
    params?: TableRequestParams & { category?: string },
  ): Promise<TableResponse<ServiceConsumerAgreementRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/organization-groups/${organization_group_id}/agreements`,
      params,
    );

    return response.data;
  }

  async assignServiceConsumerAgreementToGroup(
    service_consumer_id: string,
    agreement_id: string,
    organization_group_id: string,
    optional_policy_ids: string[] = [],
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/assign-to/organization-group/${organization_group_id}`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async assignServiceConsumerAgreementToOrgUser(
    service_consumer_id: string,
    agreement_id: string,
    organization_user_id: string,
    optional_policy_ids?: string[],
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/assign-to/organization-user/${organization_user_id}`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async assignServiceConsumerAgreementToOrgUnit(
    service_consumer_id: string,
    agreement_id: string,
    organization_unit_id: string,
    optional_policy_ids: string[] = [],
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/assign-to/organization-unit/${organization_unit_id}`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async unassignServiceConsumerAgreementFromOrgUser(
    service_consumer_id: string,
    agreement_id: string,
    organization_user_id: string,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/unassign-from/organization-user/${organization_user_id}`,
    );
    return response.data;
  }

  async unassignServiceConsumerAgreementFromOrgUnit(
    service_consumer_id: string,
    agreement_id: string,
    organization_unit_id: string,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/unassign-from/organization-unit/${organization_unit_id}`,
    );
    return response.data;
  }

  async unassignServiceConsumerAgreementFromGroup(
    service_consumer_id: string,
    agreement_id: string,
    organization_group_id: string,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/unassign-from/organization-group/${organization_group_id}`,
    );
    return response.data;
  }

  async assignServiceConsumerAgreementToUnit(
    service_consumer_id: string,
    agreement_id: string,
    organization_unit_id: string,
    optional_policy_ids: string[] = [],
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/assign-to/organization-unit/${organization_unit_id}`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async getServiceConsumerPolicies(
    service_consumer_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<PolicyReadWithOwnerName>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/policies/external/organization-users`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerOrgPolicies(
    service_consumer_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<PolicyReadWithOwnerName>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/policies/external/organization`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerAgreementPolicies(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<PolicyUsageRead[]> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/policies`,
    );
    return response.data;
  }

  async assignServiceConsumerAgreementToOrganization(
    service_consumer_id: string,
    agreement_id: string,
    optional_policy_ids?: string[],
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/assign-to/organization`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async unassignServiceConsumerAgreementToOrganization(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/unassign-from/organization`,
    );
    return response.data;
  }

  async getServiceConsumerAgreementPoliciesAssignedToUser(
    service_consumer_id: string,
    agreement_id: string,
    user_id: string,
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-users/${user_id}/policies`,
    );
    return response.data;
  }

  async updateServiceConsumerAgreementOptionalPoliciesAssignedToUser(
    service_consumer_id: string,
    agreement_id: string,
    user_id: string,
    optional_policy_ids: string[],
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.put(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-users/${user_id}/policies/optional`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async getServiceConsumerAgreementPoliciesAssignedToGroup(
    service_consumer_id: string,
    agreement_id: string,
    group_id: string,
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-groups/${group_id}/policies`,
    );
    return response.data;
  }

  async updateServiceConsumerAgreementOptionalPoliciesAssignedToGroup(
    service_consumer_id: string,
    agreement_id: string,
    group_id: string,
    optional_policy_ids: string[],
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.put(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-groups/${group_id}/policies/optional`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async getServiceConsumerAgreementPoliciesAssignedToUnit(
    service_consumer_id: string,
    agreement_id: string,
    unit_id: string,
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-units/${unit_id}/policies`,
    );
    return response.data;
  }

  async updateServiceConsumerAgreementOptionalPoliciesAssignedToUnit(
    service_consumer_id: string,
    agreement_id: string,
    unit_id: string,
    optional_policy_ids: string[],
  ): Promise<ServiceConsumerAgreementPoliciesRead> {
    const response: AxiosResponse = await this.client.put(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/organization-units/${unit_id}/policies/optional`,
      { optional_policy_ids },
    );
    return response.data;
  }

  async updateContact(
    service_consumer_id: string,
    agreement_id: string,
    contact_organization_user_id: SCAgreementContactUserUpdate,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.client.put(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/contact-update`,
      contact_organization_user_id,
    );
    return response.data;
  }

  async updateLegalDocumentStatus(
    service_consumer_id: string,
    agreement_id: string,
    legal_document_status: LegalDocumentStatus,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.client.patch(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/legal-document-status`,
      { legal_document_status },
      { isShowError: false },
    );
    return response.data;
  }

  async cancelServiceConsumerAgreement(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/cancel`,
    );
    return response.data;
  }

  async getUserAccess(
    service_consumer_id: string,
    organization_user_id: string,
  ): Promise<PoliciesUserAccess> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/user-access`,
      { organization_user_id },
      { isShowError: false },
    );
    return response.data;
  }
  async updateBillingStatus(
    service_consumer_id: string,
    agreement_id: string,
    billing_status: BillingStatus,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.client.patch(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/billing-status`,
      { billing_status },
    );
    return response.data;
  }
}

export const policiesService: PoliciesService = new PoliciesService();
