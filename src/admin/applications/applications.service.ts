import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { OAuthClientRead } from "~/admin/applications/applications.types";

class ApplicationsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam`);
  }

  async getApplications(
    params: TableRequestParams,
  ): Promise<TableResponse<OAuthClientRead>> {
    const response: AxiosResponse = await this.client.get(
      "/oauth-clients",
      params,
    );

    return response.data;
  }

  async getApplication(applicationId: string): Promise<OAuthClientRead> {
    const response: AxiosResponse = await this.client.get(
      `/oauth-clients/${applicationId}`,
    );

    return response.data;
  }
}

export const applicationsService: ApplicationsService =
  new ApplicationsService();
