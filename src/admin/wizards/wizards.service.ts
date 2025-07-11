import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import { WizardExtendedRead } from "~/configuration/configuration.types";

class WizardsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.configuration.url}`);
  }

  async getWizards(
    params: TableRequestParams,
  ): Promise<TableResponse<WizardExtendedRead>> {
    const response: AxiosResponse = await this.client.get("/wizards", params);

    return response.data;
  }

  async getWizard(wizardId: string): Promise<WizardExtendedRead> {
    const response: AxiosResponse = await this.client.get(
      `/wizards/${wizardId}`,
    );

    return response.data;
  }
}

export const wizardsService: WizardsService = new WizardsService();
