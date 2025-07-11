import { TOTPConfirmationRead } from "~/iam/iam.types";
import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import { AxiosResponse } from "axios";

class SignupService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.idp.url}`, true);
  }

  async getTOTPQrUrl(username: string): Promise<TOTPConfirmationRead> {
    const response: AxiosResponse = await this.client.get(`/signup/totp`, {
      username,
    });
    return response.data;
  }
}

export const signupService: SignupService = new SignupService();
