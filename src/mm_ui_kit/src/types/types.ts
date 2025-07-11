export type TypeAlignX = "left" | "center" | "right";

export type TypeColors =
  | "primary"
  | "secondary"
  | "white"
  | "error"
  | "warning"
  | "warning-600"
  | "gray"
  | "gray-600"
  | "gray-700"
  | "blue"
  | "blue-dim";

export type TypePosition = "static" | "relative" | "absolute" | "fixed";

export type TypeTab = {
  label: string;
  isRequired: boolean;
  name: string;
  isHidden?: boolean;
};

export type SkeletonLoaderDimensions = {
  width: string;
  height: string;
};

export type TypeErrorResponseData = {
  detail: string;
};

export type TypeErrorResponse = {
  response?: {
    data?: TypeErrorResponseData;
  };
};

export type AutocompletePagination = {
  limit: string;
  offset: string;
  query?: string;
};
export type TimeBasedValues = {
  startTimeValue: number;
  endTimeValue: number;
};
export type TranslatedValuesType = {
  placeholder: string;
  label: string;
  learnMoreUrl: string;
  infoText: string;
  labelTooltip: string;
};
