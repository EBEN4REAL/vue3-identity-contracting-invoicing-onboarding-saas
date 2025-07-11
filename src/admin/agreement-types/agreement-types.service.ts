import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { AgreementTypeWithServiceProviderRead } from "~/policies/policies.types";

class AgreementTypesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.policies.url}`);
  }

  async getAgreementTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<AgreementTypeWithServiceProviderRead>> {
    const response: AxiosResponse = await this.client.get(
      "/agreement-types",
      params,
    );

    return response.data;
  }
}

export const agreementTypesService: AgreementTypesService =
  new AgreementTypesService();
