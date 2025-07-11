import { TableHeader } from "~/mm_ui_kit/src/types/table.types";

export function defaultSortItem(TABLE_HEADERS: TableHeader[]): string {
  const defaultSortHeader = TABLE_HEADERS.find(
    (header) => header.defaultSortItem,
  );
  return defaultSortHeader
    ? `${defaultSortHeader.key}:${defaultSortHeader.order}`
    : TABLE_HEADERS.length > 0
      ? `${TABLE_HEADERS[0].key}:asc`
      : "";
}
