import { components } from "~/policies/policies.schemas";

export type PolicyOutcome = components["schemas"]["PolicyOutcome"];

export type TypeAccessLogsItemForTable = {
  evaluation_date: string;
  user: string;
  service_provider: string;
  oauth_client: string;
  outcome: PolicyOutcome;
};

export type TypeAccessLogDetailsItem = {
  label: string;
  value: string;
};
