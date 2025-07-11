import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { PolicyReadWithOwnerName } from "~/policies/policies.types";

class PoliciesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.policies.url}`);
  }

  async getPolicies(
    params: TableRequestParams,
  ): Promise<TableResponse<PolicyReadWithOwnerName>> {
    const response: AxiosResponse = await this.client.get("/policies", params);

    return response.data;
  }
}

export const policiesService: PoliciesService = new PoliciesService();
