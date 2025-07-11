import { OAuthClientService } from "~/common/services/oauth.client.service";
import config from "~/mm.config.json";
import { AxiosResponse } from "axios";
import { OauthClientPlanPageRead, OrganizationUserRead } from "~/iam/iam.types";

class IAMClientService extends OAuthClientService {
  constructor() {
    super(`${config.iam.url}/iam`);
  }

  async addCurrentUserToOrganization(
    organizationId: string,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/organizations/${organizationId}/users/@me`,
      {},
    );

    return response.data;
  }

  async getOAuthClientPagePageDetails(
    service_provider_id: string,
    oauth_client_id: string,
  ): Promise<OauthClientPlanPageRead> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-providers/${service_provider_id}/oauth-clients/${oauth_client_id}/plan-page`,
    );

    return response.data;
  }
}

export const iamClientService: IAMClientService = new IAMClientService();
