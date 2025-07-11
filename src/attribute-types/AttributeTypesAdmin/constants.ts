import { AttributeOf, DataType } from "~/onboarding/onboarding.types";

export const ATTRIBUTE_OF: Record<AttributeOf, string> = {
  ORGANIZATION: "Organization",
  USER: "User",
};

export const DATA_TYPE: Record<DataType, string> = {
  uuid: "UUID",
  string: "String",
  date: "Date",
  boolean: "Boolean",
  enum: "Enum",
};
