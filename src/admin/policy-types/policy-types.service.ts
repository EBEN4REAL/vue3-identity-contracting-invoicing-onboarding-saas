import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { PolicyTypeWithServiceProviderRead } from "~/policies/policies.types";

class PolicyTypesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.policies.url}`);
  }

  async getPolicyTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<PolicyTypeWithServiceProviderRead>> {
    const response: AxiosResponse = await this.client.get(
      "/policy-types",
      params,
    );

    return response.data;
  }
}

export const policyTypesService: PolicyTypesService = new PolicyTypesService();
