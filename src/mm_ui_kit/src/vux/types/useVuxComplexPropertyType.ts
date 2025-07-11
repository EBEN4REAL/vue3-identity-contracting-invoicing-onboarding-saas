import { typeValidationError } from "./useTypeValidationErrorHandling";
import { VuxMetadata } from "./useVuxMetadataType";
import { VuxActionList } from "./useVuxActionType";
import { isVuxProperty, VuxProperty } from "./useVuxPropertyType";

/**
 * Checks if the provided property is a VuxComplexProperty.
 */

export function isVuxComplexProperty(
  property: unknown,
): property is VuxComplexProperty {
  return (
    isVuxProperty(property) &&
    (property.type === "vux-complex-property" ||
      property.type === "vux-component-group" ||
      property.type === "vux-component-list" ||
      property.type === "vux-configuration-section" ||
      property.type === "vux-configuration-wizard" ||
      property.type === "vux-poc-full-wizard" ||
      property.type === "vux-configuration-wizard-header" ||
      property.type === "vux-input-property")
  );
}
/**
 * Ensures the provided property is a VuxComplexProperty.
 * Throws an error if the check fails.
 */

export function asVuxComplexProperty(
  property: VuxProperty,
  dataFieldName?: string,
): VuxComplexProperty {
  if (dataFieldName) {
    const complexField = asVuxComplexProperty(property);
    if (!(dataFieldName in complexField)) {
      throw new Error(
        `Data field name '${dataFieldName}' is not a key of VuxComplexProperty`,
      );
    } else if (isVuxComplexProperty(complexField[dataFieldName])) {
      return complexField[dataFieldName];
    } else {
      throw typeValidationError(
        "VuxComplexProperty",
        complexField,
        dataFieldName,
      );
    }
  } else {
    if (!isVuxComplexProperty(property)) {
      throw new Error("Property is not a VuxComplexProperty");
    }
    return property;
  }
}
/**
 * Represents a complex property in the VUX framework.
 * Complex properties are used for grouping or organizing other properties.
 */

export type VuxComplexProperty = VuxProperty & {
  /**
   * The type of the complex property. (Required)
   */
  type:
    | "vux-complex-property"
    | "vux-component-group"
    | "vux-component-list"
    | "vux-configuration-section"
    | "vux-configuration-wizard"
    | "vux-poc-full-wizard";

  /**
   * The layout configuration for the complex property. (Optional)
   */
  layout?: VuxComplexPropertyLayout;

  /**
   * A list of actions associated with the complex property. (Optional)
   */
  actions?: VuxActionList;

  /**
   * Additional metadata or configuration for the complex property. (Optional)
   */
  [key: string]:
    | VuxMetadata
    | VuxComplexPropertyLayout
    | string
    | VuxActionList
    | undefined;
};
/**
 * Represents the layout configuration for a complex property.
 */

export type VuxComplexPropertyLayout = {
  /**
   * Placeholder property to satisfy linting rules. (Optional)
   */
  placeholder?: true;

  /**
   * The orientation of the layout. (Optional)
   */
  orientation?: "horizontal" | "vertical";
};
/**
 * Represents validation rules for a complex property.
 */

export interface VuxComplexPropertyValidation {
  /**
   * Placeholder property to satisfy linting rules. (Optional)
   */
  placeholder?: true;
}
