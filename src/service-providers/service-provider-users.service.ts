import { AxiosResponse } from "axios";
import config from "~/mm.config.json";
import { ServiceProviderUserMeRead } from "~/iam/iam.types";
import { OAuthClientService } from "~/common/services/oauth.client.service";

class ServiceProviderUsersService extends OAuthClientService {
  constructor() {
    super(`${config.iam.url}/iam/service-provider-users`);
  }

  async getServiceProviderUserMe(): Promise<ServiceProviderUserMeRead> {
    const response: AxiosResponse = await this.axiosInstance.get(`/@me`);

    return response.data;
  }
}

export const serviceProviderUsersService: ServiceProviderUsersService =
  new ServiceProviderUsersService();
