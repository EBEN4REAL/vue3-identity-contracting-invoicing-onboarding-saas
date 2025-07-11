/**
 * Represents the metadata for a VUX property.
 * This can either be an input property or a complex property.
 */

import { typeValidationError } from "./useTypeValidationErrorHandling";
import { asVuxComplexProperty } from "./useVuxComplexPropertyType";
import { VuxOptionsPropertyLayout } from "~/mm_ui_kit/src/vux/types/useVuxOptionsType";

export type VuxMetadata = {
  /**
   * The type of the metadata. (Required)
   */
  type: string;
  /**
   * The layout configuration
   */
  layout: VuxOptionsPropertyLayout;
  // Add index signature to allow string keys
  [key: string]: unknown;
};

/**
 * Checks if the provided property is VuxMetadata.
 */
export function isVuxMetadata(metadata: unknown): metadata is VuxMetadata {
  return (
    typeof metadata === "object" &&
    metadata !== null &&
    "type" in metadata &&
    typeof metadata.type === "string"
  );
}

/**
 * Ensures the provided property is VuxMetadata.
 * Throws an error if the check fails.
 */
export function asVuxMetadata(
  property: object,
  dataFieldName?: string,
): VuxMetadata {
  if (isVuxMetadata(property)) {
    if (dataFieldName) {
      const complexField = asVuxComplexProperty(property);
      if (isVuxMetadata(complexField[dataFieldName])) {
        return complexField[dataFieldName];
      } else {
        throw typeValidationError("VuxMetadata", property, dataFieldName);
      }
    } else {
      return property;
    }
  } else {
    throw typeValidationError("VuxMetadata", property);
  }
}
