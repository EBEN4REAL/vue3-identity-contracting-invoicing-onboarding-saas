import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "../../mm.config.json";
import { PasswordRequirementRead } from "~/iam/iam.types";

class FieldRequirementsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam/settings`);
  }

  async getPasswordRequirements(): Promise<PasswordRequirementRead[]> {
    const response: AxiosResponse = await this.client.get(
      "/password-requirements",
    );

    return response.data;
  }
}

export const fieldRequirementsService: FieldRequirementsService =
  new FieldRequirementsService();
