export enum TypeToastStatuses {
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export type TypeToast = {
  text: string;
  status: TypeToastStatuses;
  duration?: number;
};
