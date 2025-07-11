import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import {
  ConfigExtendedRead,
  ConfigOverviewRead,
} from "~/configuration/configuration.types";

class ConfigsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.configuration.url}`);
  }

  async getConfigs(
    params: TableRequestParams,
  ): Promise<TableResponse<ConfigOverviewRead>> {
    const response: AxiosResponse = await this.client.get("/configs", params);

    return response.data;
  }

  async getConfig(configId: string): Promise<ConfigExtendedRead> {
    const response: AxiosResponse = await this.client.get(
      `/configs/${configId}`,
    );

    return response.data;
  }
}

export const configsService: ConfigsService = new ConfigsService();
