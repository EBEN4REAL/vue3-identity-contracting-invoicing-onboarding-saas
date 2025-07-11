<script setup lang="ts">
import { computed } from "vue";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { VuxModel } from "../types/useVuxModelType";
import { useActionListLogic } from "../composables/useActionListLogic";

const props = defineProps<VuxTemplateComponentProps>();
const emit = defineEmits<VuxTemplateComponentEmits>();
const model = defineModel<VuxModel>();

const vux = useActionListLogic(props, emit, model);

const vuxActionsListClassList = computed(() => [
  "vux-actions-list",
  vux.actionsList.value?.style &&
    `vux-actions-list--${vux.actionsList.value?.style}`,
]);
</script>

<template>
  <div :class="vuxActionsListClassList">
    <template
      v-for="(reactiveAction, actionKey) in vux.reactiveActions.value"
      :key="`${reactiveAction}-${actionKey}`"
    >
      <m-m-button
        v-if="!reactiveAction.isHidden"
        :variant="reactiveAction.style.variant"
        :is-disabled="reactiveAction.isDisabled"
        :loading="reactiveAction.isWaiting"
        class="vux-actions-list__action"
        @click="vux.handleVuxAction(actionKey, reactiveAction.actionMetadata)"
      >
        <m-m-tooltip
          v-if="reactiveAction.tooltip"
          display-position="center-top"
        >
          {{ reactiveAction.tooltip }}
        </m-m-tooltip>
        <template v-if="reactiveAction.label">
          {{ reactiveAction.label }}
        </template>
        <m-m-icon
          v-else-if="reactiveAction.style.icon"
          :icon="reactiveAction.style.icon"
          height="16px"
        />
      </m-m-button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.vux-actions-list {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex-grow: 0 !important;
  flex-shrink: 1;
  width: fit-content;

  .vux-actions-list {
    &__action {
      margin-bottom: auto;
    }
  }

  &--sideBySide {
    flex-direction: row;
  }
}
</style>
