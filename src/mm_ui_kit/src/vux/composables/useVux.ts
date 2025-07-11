import { computed, ModelRef } from "vue";
import { useComponentResolver } from "./useVuxComponentResolver";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { Vux } from "../types/vuxTemplateComponentLogic";
import { VuxModel } from "../types/useVuxModelType";
import { asVuxMetadata } from "../types/useVuxMetadataType";

export function useVux(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
): Vux {
  const { resolveComponent, resolveGroupStrategyComponent } =
    useComponentResolver();

  const dataFieldMetadata = asVuxMetadata(props.metaData, props.dataFieldName);
  const strategyFn = resolveGroupStrategyComponent(dataFieldMetadata.type);

  const strategy = strategyFn(props, emit, model);

  const isReady = computed(() => {
    return (
      strategy.groupMetadata !== undefined && strategy.groupMetadata !== null
    );
  });

  const strategyName = strategy.strategyName;
  const groupModel = strategy.groupModel;
  const groupMetadata = strategy.groupMetadata;
  const groupProperties = strategy.groupProperties;

  return {
    resolveComponent,
    isReady,
    strategyName,
    groupModel,
    groupMetadata,
    groupProperties,
    handlePropertyValidationChange: strategy.handlePropertyValidationChange,
    isValid: strategy.isValid,
    handleVuxAction: strategy.handleVuxAction,
    validate: strategy.validate,
    save: strategy.save,
    edit: strategy.edit,
    registerPropertyComponent: strategy.registerPropertyComponent,
    discard: strategy.discard,
    isChanged: strategy.isChanged,
    renderMode: strategy.renderMode,
    isCollapsed: strategy.isCollapsed,
    toggleCollapse: strategy.toggleCollapse,
    getStatusClass: strategy.getStatusClass,
  };
}
