import config from "../mm.config.json";
import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import { EventRead, EventType } from "~/events/events.types";
import { TableResponse } from "~/mm_ui_kit/src/types/table.types";

export type GetEventsRequest = {
  offset?: string;
  limit?: string;
  sort?: string;
  event_type?: EventType;
  from_date?: string;
  until_date?: string;
  organization?: string;
  service_provider_id?: string;
};

class EventsService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(config.events.url);
  }

  async getEvents(
    getEventRequest: GetEventsRequest,
  ): Promise<TableResponse<EventRead>> {
    const response: AxiosResponse<TableResponse<EventRead>> =
      await this.client.get(`/events`, getEventRequest);

    return response.data;
  }
}

export const eventsService: EventsService = new EventsService();
