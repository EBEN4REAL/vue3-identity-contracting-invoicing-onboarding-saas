import { VuxMetadata } from "./useVuxMetadataType";

/**
 * Represents the base structure for a VUX property.
 */

export type VuxProperty = VuxMetadata & {
  /**
   * The resource key associated with the property. (Optional)
   */
  resourceKey?: string;
};
/**
 * Checks if the provided object is a VuxProperty.
 */

export function isVuxProperty(property: unknown): property is VuxProperty {
  return (
    typeof property === "object" &&
    property !== null &&
    "type" in property &&
    typeof property.type === "string"
  );
}
/**
 * Ensures the provided object is a VuxProperty.
 * Throws an error if the check fails.
 */

export function asVuxProperty(property: object): VuxProperty {
  if (!isVuxProperty(property)) {
    throw new Error("Property is not a VuxProperty");
  }
  return property;
}
/**
 * Represents the layout configuration for a VUX property.
 */

export type VuxPropertyLayout = {
  /**
   * Placeholder property to satisfy linting rules. (Optional)
   */
  placeholder?: true;
  orientation: "horizontal" | "vertical";
};
