import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import {
  AccessEvaluationBaseRead,
  AccessEvaluationRead,
} from "~/iam/iam.types";

export type TypeAccessEvaluationsParams = {
  organization_id?: string;
  service_provider_id?: string;
  from_date?: string;
  until_date?: string;
  query?: string;
  offset?: string;
  limit?: string;
  sort?: string; // ['evaluation_date', 'outcome', 'resource_urn', 'user.email', 'organization.name', 'service_provider.name', 'oauth_client.name']
};

class AccessEvaluationsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam`);
  }

  async getAccessEvaluations(
    params: TypeAccessEvaluationsParams,
  ): Promise<TableResponse<AccessEvaluationBaseRead>> {
    const response: AxiosResponse<TableResponse<AccessEvaluationBaseRead>> =
      await this.client.get(`/access-evaluations`, params);

    return response.data;
  }

  async getOrganizationAccessEvaluation(
    organization_id: string,
    access_evaluation_id: string,
  ): Promise<AccessEvaluationRead> {
    const response: AxiosResponse<AccessEvaluationRead> = await this.client.get(
      `/organizations/${organization_id}/access-evaluations/${access_evaluation_id}`,
    );

    return response.data;
  }

  async getAccessEvaluation(
    access_evaluation_id: string,
  ): Promise<AccessEvaluationRead> {
    const response: AxiosResponse<AccessEvaluationRead> = await this.client.get(
      `/access-evaluations/${access_evaluation_id}`,
    );

    return response.data;
  }
}

export const accessEvaluationsService: AccessEvaluationsService =
  new AccessEvaluationsService();
