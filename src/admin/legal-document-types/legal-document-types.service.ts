import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { LegalDocumentTypeRead } from "~/organizations/licenses/legal-documents.types";

class LegalDocumentTypesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.contracting.url}`);
  }

  async getLegalDocumentTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<LegalDocumentTypeRead>> {
    const response: AxiosResponse = await this.client.get(
      "/legal-document-types",
      params,
    );

    return response.data;
  }
}

export const legalDocumentTypesService: LegalDocumentTypesService =
  new LegalDocumentTypesService();
