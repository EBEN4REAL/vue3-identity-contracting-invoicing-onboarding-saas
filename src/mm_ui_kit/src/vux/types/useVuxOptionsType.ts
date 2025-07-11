import { VuxProperty } from "./useVuxPropertyType";
import {
  VuxInputProperty,
  VuxInputPropertyLayout,
} from "./useVuxInputPropertyType";
import { asVuxComplexProperty } from "~/mm_ui_kit/src/vux/types/useVuxComplexPropertyType";
import { typeValidationError } from "~/mm_ui_kit/src/vux/types/useTypeValidationErrorHandling";
import { VuxMetadata } from "~/mm_ui_kit/src/vux/types/useVuxMetadataType";

// Options Property

/**
 * Checks if the provided property is a VuxOptionsProperty.
 */
export function isVuxOptionsProperty(
  property: VuxProperty,
): property is VuxOptionsProperty {
  return property.type === "vux-options-property";
}

/**
 * Ensures the provided property is a VuxOptionsProperty.
 * Throws an error if the check fails.
 */
export function asVuxOptionsProperty(
  vuxMetadata: VuxMetadata,
  dataFieldName?: string,
): VuxOptionsProperty {
  if (dataFieldName) {
    const complexField = asVuxComplexProperty(vuxMetadata);
    if (!(dataFieldName in complexField)) {
      throw typeValidationError(
        "VuxOptionsProperty",
        vuxMetadata,
        dataFieldName,
      );
    }
    const metadata = complexField[dataFieldName] as VuxProperty;
    if (isVuxOptionsProperty(metadata)) {
      return metadata;
    } else {
      throw typeValidationError(
        "VuxOptionsProperty",
        vuxMetadata,
        dataFieldName,
      );
    }
  } else if (isVuxOptionsProperty(vuxMetadata)) {
    return vuxMetadata;
  }

  throw typeValidationError("VuxOptionsProperty", vuxMetadata);
}

/**
 * Represents an options property in the VUX framework.
 */
export type VuxOptionsProperty = VuxInputProperty & {
  /**
   * The type of the options property. (Required)
   */
  type: "vux-options-property";

  /**
   * The mode of the options property (static or dynamic). (Required)
   */
  mode: "static" | "dynamic";

  /**
   * Whether multiple options can be selected. (Optional)
   */
  multiple?: boolean;

  /**
   * The options available for selection. (Optional)
   */
  options?: object;
};

/**
 * Represents the layout configuration for an options property.
 */
export type VuxOptionsPropertyLayout = VuxInputPropertyLayout & {
  /**
   * The rendering style for the options property. (Required)
   */
  renderAs: "dropdown" | "radiogroup" | "checkboxgroup";
  visualSeparation?: boolean;
};
