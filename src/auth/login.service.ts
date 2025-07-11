import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import { AxiosResponse } from "axios";
import { LoginStateRead } from "~/auth/auth.types";

class LoginService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.idp.url}`, true);
  }

  async getLoginState(): Promise<LoginStateRead> {
    const response: AxiosResponse = await this.client.get("/login/state");
    return response.data;
  }
}

export const loginService: LoginService = new LoginService();
