import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "~/mm.config.json";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";
import { AuditEventRead } from "./audit-events.types";

export type GetAuditEventsRequest = {
  offset?: string;
  limit?: string;
  organization?: string;
};

class AuditEventsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.events.url}`);
  }

  async getAuditEvents(
    params: GetAuditEventsRequest,
  ): Promise<TableResponse<AuditEventRead>> {
    const response: AxiosResponse<TableResponse<AuditEventRead>> =
      await this.client.get(`/audit-events`, params);

    return response.data;
  }
}

export const auditEventsService: AuditEventsService = new AuditEventsService();
