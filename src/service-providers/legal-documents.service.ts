import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import {
  LegalDocumentTypePdfPreSignUrl,
  LegalDocumentTypeWithLegalDocumentRead,
} from "~/organizations/licenses/legal-documents.types";

class LegalDocumentsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.contracting.url}`);
  }

  async getLegalDocumentsForSigning(
    service_consumer_id: string,
    legal_document_type_id: string,
  ): Promise<LegalDocumentTypePdfPreSignUrl> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/legal-document-types/${legal_document_type_id}/pdf`,
    );
    return response.data;
  }

  async createLegalDocsSignature(
    service_consumer_id: string,
    legal_document_ids: string[],
  ): Promise<void> {
    await this.client.post(
      `/service-consumers/${service_consumer_id}/signatures`,
      {
        legal_document_ids: legal_document_ids,
      },
    );
  }
  async getLegalDocumentTypesByAgreementTypeId(
    service_consumer_id: string,
    agreement_type_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<LegalDocumentTypeWithLegalDocumentRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreement-types/${agreement_type_id}/legal-document-types`,
      params,
    );
    return response.data;
  }
}

export const legalDocumentsService: LegalDocumentsService =
  new LegalDocumentsService();
