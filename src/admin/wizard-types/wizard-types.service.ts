import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import {
  WizardTypeExtendedRead,
  WizardTypeRead,
} from "~/configuration/configuration.types";

class WizardTypesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.configuration.url}`);
  }

  async getWizardTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<WizardTypeRead>> {
    const response: AxiosResponse = await this.client.get(
      "/wizard-types",
      params,
    );

    return response.data;
  }

  async getWizardType(wizardTypeId: string): Promise<WizardTypeExtendedRead> {
    const response: AxiosResponse = await this.client.get(
      `/wizard-types/${wizardTypeId}`,
    );

    return response.data;
  }
}

export const wizardTypesService: WizardTypesService = new WizardTypesService();
