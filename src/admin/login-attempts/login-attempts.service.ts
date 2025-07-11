import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { LoginAttemptRead } from "~/iam/iam.types";

class LoginAttemptsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam`);
  }

  async getLoginAttempts(
    params: TableRequestParams,
  ): Promise<TableResponse<LoginAttemptRead>> {
    const response: AxiosResponse = await this.client.get(
      "/login-attempts",
      params,
    );

    return response.data;
  }
}

export const loginAttemptsService: LoginAttemptsService =
  new LoginAttemptsService();
