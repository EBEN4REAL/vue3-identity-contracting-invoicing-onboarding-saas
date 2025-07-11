import config from "~/mm.config.json";
import { OAuthClientService } from "~/common/services/oauth.client.service";
import { AgreementReadExtended } from "~/organizations/licenses/licenses.types";
import { AxiosResponse } from "axios";
import {
  AgreementRead,
  BillingStatus,
  LegalDocumentStatus,
  SCAgreementRead,
} from "~/policies/policies.types";

class PoliciesClientService extends OAuthClientService {
  constructor() {
    super(`${config.policies.url}`);
  }

  async getServiceConsumerAgreement(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<AgreementReadExtended> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}`,
    );
    return response.data;
  }

  async signUpForAgreementType(
    service_consumer_id: string,
    agreement_type_id: string,
  ): Promise<AgreementRead> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/service-consumers/${service_consumer_id}/agreement-types/${agreement_type_id}/sign-up`,
    );
    return response.data;
  }

  async updateBillingStatus(
    service_consumer_id: string,
    agreement_id: string,
    billing_status: BillingStatus,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.axiosInstance.patch(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/billing-status`,
      { billing_status },
    );
    return response.data;
  }

  async updateLegalDocumentStatus(
    service_consumer_id: string,
    agreement_id: string,
    legal_document_status: LegalDocumentStatus,
  ): Promise<SCAgreementRead> {
    const response: AxiosResponse = await this.axiosInstance.patch(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/legal-document-status`,
      { legal_document_status },
    );
    return response.data;
  }
}

export const policiesClientService: PoliciesClientService =
  new PoliciesClientService();
