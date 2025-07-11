export type TableHeader = {
  key: string;
  label: string;
  sortLabel?: string;
  sortable?: boolean;
  sortName?: string;
  defaultSortItem?: boolean;
  searchable?: boolean;
  filter?: TableColumnFilter;
  width?: WidthType;
  cellClass?: string;
  order?: "asc" | "desc";
  sortIcon?: boolean;
};
type WidthType = number | `${number}%`;
export type TableColumnFilter = {
  type: "date" | "select";
  options?: { label: string; value: string }[];
};

export type TableRow = {
  [key: string]: string | number | boolean | string[] | null;
};

export type TableSort = {
  title: string;
  value: string;
};

export type TablePagination = {
  limit: string;
  offset: string;
};

export type TableRequestParams = TablePagination & {
  query?: string;
  sort?: string;
};

export type TableResponse<Type> = {
  results: Type[];
  total: number;
  size: number;
  limit: number;
  offset: number;
} | null;

export type EmptyStateType = {
  icon?: string;
  title: string;
  description?: string;
  learnMoreHref?: string;
};
