import config from "~/mm.config.json";
import { OAuthClientService } from "~/common/services/oauth.client.service";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  LegalDocumentTypePdfPreSignUrl,
  LegalDocumentTypeWithLegalDocumentRead,
} from "~/organizations/licenses/legal-documents.types";
import { AxiosResponse } from "axios";

class ContractingClientService extends OAuthClientService {
  constructor() {
    super(`${config.contracting.url}`);
  }

  async getLegalDocumentsForSigning(
    service_consumer_id: string,
    legal_document_type_id: string,
  ): Promise<LegalDocumentTypePdfPreSignUrl> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-consumers/${service_consumer_id}/legal-document-types/${legal_document_type_id}/pdf`,
    );
    return response.data;
  }

  async getLegalDocumentTypesByAgreementTypeId(
    service_consumer_id: string,
    agreement_type_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<LegalDocumentTypeWithLegalDocumentRead>> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-consumers/${service_consumer_id}/agreement-types/${agreement_type_id}/legal-document-types`,
      params,
    );
    return response.data;
  }

  async createLegalDocsSignature(
    service_consumer_id: string,
    legal_document_ids: string[],
  ): Promise<void> {
    await this.axiosInstance.post(
      `/service-consumers/${service_consumer_id}/signatures`,
      {
        legal_document_ids,
      },
    );
  }
}

export const contractingClientService: ContractingClientService =
  new ContractingClientService();
