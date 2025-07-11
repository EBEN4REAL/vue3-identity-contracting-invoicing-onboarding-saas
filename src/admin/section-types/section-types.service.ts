import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { AxiosResponse } from "axios";
import {
  SectionTypeExtendedRead,
  SectionTypeRead,
} from "~/configuration/configuration.types";

class SectionTypesService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.configuration.url}`);
  }

  async getSectionTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<SectionTypeRead>> {
    const response: AxiosResponse = await this.client.get(
      "/section-types",
      params,
    );

    return response.data;
  }

  async getSectionType(
    sectionTypeId: string,
  ): Promise<SectionTypeExtendedRead> {
    const response: AxiosResponse = await this.client.get(
      `/section-types/${sectionTypeId}`,
    );

    return response.data;
  }
}

export const sectionTypesService: SectionTypesService =
  new SectionTypesService();
