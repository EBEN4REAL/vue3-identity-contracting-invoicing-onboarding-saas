import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "../mm.config.json";
import {
  OauthClientPlanPageRead,
  PaginationSchema_ServiceProviderRead_,
} from "~/iam/iam.types";
import { TableRequestParams } from "~/mm_ui_kit/src/types/table.types";

export type GetServiceProvidersRequest = {
  offset?: string;
  limit?: string;
};

class ServiceProvidersService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam/service-providers`);
  }

  async getServiceProviders(
    params?: TableRequestParams,
  ): Promise<PaginationSchema_ServiceProviderRead_> {
    const urlParams: string = new URLSearchParams(params).toString();
    const url: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(url);

    return response.data;
  }

  async getOAuthClientPagePageDetails(
    service_provider_id: string,
    oauth_client_id: string,
  ): Promise<OauthClientPlanPageRead> {
    const response: AxiosResponse = await this.client.get(
      `/${service_provider_id}/oauth-clients/${oauth_client_id}/plan-page`,
    );

    return response.data;
  }
}

export const serviceProvidersService: ServiceProvidersService =
  new ServiceProvidersService();
