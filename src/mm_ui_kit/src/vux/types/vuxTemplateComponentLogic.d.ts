import { Component, ComputedRef, ModelRef } from "vue";
import { VuxProperty } from "./useVuxPropertyType";
import { VuxMetadata } from "./useVuxMetadataType";
import {
  VuxExposedMethods,
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "./vuxTemplateComponent";
import { VuxModel } from "./useVuxModelType";
import { VuxAction } from "./useVuxActionType";

export interface VuxTemplateComponentLogic extends VuxExposedMethods {
  readonly strategyName: string;
  readonly groupModel: ComputedRef<VuxModel>;
  readonly groupMetadata: ComputedRef<VuxMetadata>;
  readonly groupProperties: ComputedRef<Record<string, VuxProperty>>;
  handlePropertyValidationChange: (property: string, isValid: boolean) => void;
  readonly isValid: ComputedRef<boolean>;
  handleVuxAction: (name: string, action: VuxAction, model: VuxModel) => void;
  registerPropertyComponent: (el: VuxExposedMethods, property: string) => void;
  discard: () => void;
  isChanged: ComputedRef<boolean>;
  renderMode: ComputedRef<string>;
  isCollapsed: ComputedRef<boolean>;
  toggleCollapse: () => void;
  getStatusClass: ComputedRef<string>;
  isSectionLoading: ComputedRef<boolean>;
}

export type VuxTemplateComponentLogicResolver = (
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
) => VuxTemplateComponentLogic;

export type Vux = VuxTemplateComponentLogic & {
  resolveComponent: (type: string) => Component;
  isReady: ComputedRef<boolean>;
};
