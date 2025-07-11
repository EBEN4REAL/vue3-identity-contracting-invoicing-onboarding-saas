import { components } from "~/events/events.schemas";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export type AuditEventRead = components["schemas"]["AuditEventRead"];

export type FormattedAuditEvent = {
  id: string;
  date: string;
  user: string;
  type: string | null;
  resource: {
    id: string;
    type: string;
    name: string | null;
  };
  payload: Record<string, unknown> | null;
  action: AuditAction;
};
