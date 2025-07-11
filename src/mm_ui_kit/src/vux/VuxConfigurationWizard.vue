<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "./types/vuxTemplateComponent";
import { VuxModel } from "./types/useVuxModelType";
import { Vux } from "./types/vuxTemplateComponentLogic";
import { VuxAction } from "./types/useVuxActionType";
import { useVux } from "./composables/useVux";
import { VuxMetadata } from "./types/useVuxMetadataType";

// Props
const props = withDefaults(defineProps<VuxTemplateComponentProps>(), {
  mode: "edit",
  dataFieldName: "",
});

// Emits
const emit = defineEmits<VuxTemplateComponentEmits>();

// Two-way binding
const model = defineModel<VuxModel>();

const vux = ref<Vux>(useVux(props, emit, model));

// Internal state
const groupRef = ref();

const metaDataWithoutWizard: ComputedRef<VuxMetadata> = computed(() => {
  const { wizard, ...rest } = vux.value.groupMetadata;
  return rest;
});

const metaDataWithoutGroups: ComputedRef<VuxMetadata> = computed(() => {
  const { create_group, read_group, ...rest } = vux.value.groupMetadata;
  return rest;
});

// Public methods
defineExpose({
  isValid: vux.value.isValid,
  validate: vux.value.validate,
  save: vux.value.save,
  edit: vux.value.edit,
  discard: vux.value.discard,
});
</script>

<template>
  <div class="wizard-component">
    <vux-property-group-template
      v-if="vux.groupModel && !vux.groupModel.wizard"
      ref="groupRef"
      v-model="vux.groupModel"
      :meta-data="metaDataWithoutWizard"
      :resource-key="props.resourceKey"
      :mode="props.mode"
      @vux-action="
        (name: string, action: VuxAction, actionModel: VuxModel) =>
          vux.handleVuxAction(name, action, actionModel)
      "
    />
    <vux-property-group-template
      v-if="vux.groupModel.wizard"
      ref="groupRef"
      v-model="vux.groupModel"
      :meta-data="metaDataWithoutGroups"
      :resource-key="props.resourceKey"
      :mode="props.mode"
      @vux-action="
        (name: string, action: VuxAction, actionModel: VuxModel) =>
          vux.handleVuxAction(name, action, actionModel)
      "
    />
  </div>
</template>

<style scoped>
.wizard-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}
</style>
