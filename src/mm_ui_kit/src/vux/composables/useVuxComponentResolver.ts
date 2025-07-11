import { Component, markRaw } from "vue";
import VuxInputProperty from "../components/VuxInputProperty.vue";
import VuxDataViewProperty from "../components/VuxDataViewProperty.vue";
import VuxOptionsProperty from "../components/VuxOptionsProperty.vue";
import VuxPropertyGroupTemplate from "../VuxPropertyGroupTemplate.vue";
import { useComponentGroupLogic } from "./useComponentGroupLogic";
import { useComponentListLogic } from "./useComponentListLogic";
import { useConfigurationSectionLogic } from "./useConfigurationSectionLogic";
import { useConfigurationWizardLogic } from "./useConfigurationWizardLogic";
import VuxConfigurationSection from "../VuxConfigurationSection.vue";
import VuxConfigurationWizard from "../VuxConfigurationWizard.vue";
import VuxPocFullWizard from "../VuxPocFullWizard.vue";
import { VuxTemplateComponentLogicResolver } from "../types/vuxTemplateComponentLogic";
import VuxOutputProperty from "~/mm_ui_kit/src/vux/components/VuxOutputProperty.vue";

export function useComponentResolver() {
  // Pre-defined components mapping
  const components: Record<string, Component> = {
    "vux-input-property": markRaw(VuxInputProperty),
    "vux-output-property": markRaw(VuxOutputProperty),
    "vux-data-view-property": markRaw(VuxDataViewProperty),
    "vux-options-property": markRaw(VuxOptionsProperty),
    "vux-component-list": markRaw(VuxPropertyGroupTemplate),
    "vux-component-group": markRaw(VuxPropertyGroupTemplate),
    "vux-configuration-section": markRaw(VuxConfigurationSection),
    "vux-configuration-wizard-header": markRaw(VuxConfigurationSection),
    "vux-configuration-wizard": markRaw(VuxConfigurationWizard),
    "vux-poc-full-wizard": markRaw(VuxPocFullWizard),
  };

  // Pre-defined strategy mapping
  const componentStrategies: Record<string, VuxTemplateComponentLogicResolver> =
    {
      "vux-configuration-wizard-header": useComponentGroupLogic,
      "vux-component-group": useComponentGroupLogic,
      "vux-component-list": useComponentListLogic,
      "vux-poc-full-wizard": useComponentGroupLogic,
      "vux-configuration-section": useConfigurationSectionLogic,
      "vux-configuration-wizard": useConfigurationWizardLogic,
      "vux-input-property": useComponentGroupLogic,
      "vux-output-property": useComponentGroupLogic,
    };

  // Component resolver function
  const resolveComponent = (type: string): Component => {
    const component = components[type];
    if (!component) {
      throw new Error(
        `Component type "${type}" is not registered. Available types: ${Object.keys(components).join(", ")}`,
      );
    }
    return component;
  };

  // Strategy resolver function
  const resolveGroupStrategyComponent = (
    type: string,
  ): VuxTemplateComponentLogicResolver => {
    const strategy = componentStrategies[type];
    if (!strategy) {
      throw new Error(
        `Component type "${type}" has no registered strategy. Available types: ${Object.keys(componentStrategies).join(", ")}`,
      );
    }
    return strategy;
  };

  return {
    resolveComponent,
    resolveGroupStrategyComponent,
  };
}
