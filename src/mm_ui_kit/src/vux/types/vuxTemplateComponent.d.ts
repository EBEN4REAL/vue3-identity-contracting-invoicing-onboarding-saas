// Vux component props
import { ComputedRef } from "vue";

import { VuxMetadata } from "./useVuxMetadataType";
import { VuxModel } from "./useVuxModelType";
import { VuxAction } from "./useVuxActionType";

export interface VuxTemplateComponentProps {
  mode?: VuxTemplateComponentMode;
  metaData: VuxMetadata;
  resourceKey: string;
  dataFieldName?: string;
}

// Vux component emits
export interface VuxTemplateComponentEmits {
  (e: "update:modelData", updatedModel: VuxModel): void;

  (e: "validation-changed", isValid: boolean): void;

  (e: "vux-action", name: string, action: VuxAction, model: VuxModel): void;
}

// Vux component exposed methods
interface VuxExposedMethods {
  isValid: ComputedRef<boolean>;
  validate: () => Promise<boolean>;
  save: () => Promise<void>;
  edit: () => void;
  minWidth: ComputedRef<int>;
}

export type VuxTemplateComponentMode = "view" | "edit" | "disabled";
