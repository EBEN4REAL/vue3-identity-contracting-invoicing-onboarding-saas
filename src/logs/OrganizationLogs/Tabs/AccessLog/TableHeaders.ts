import { TableHeader } from "~/mm_ui_kit/src/types/table.types";

export const headers: TableHeader[] = [
  {
    label: "Time",
    key: "evaluation_date",
  },
  {
    label: "User",
    key: "user",
  },
  {
    label: "Application owner",
    key: "service_provider",
  },
  {
    label: "Application name",
    key: "oauth_client",
  },
  {
    label: "Result",
    key: "outcome",
  },
  {
    label: "",
    key: "actions",
  },
];
