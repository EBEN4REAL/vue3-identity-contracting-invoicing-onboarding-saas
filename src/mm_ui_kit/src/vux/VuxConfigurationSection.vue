<script setup lang="ts">
import { computed, ComputedRef, defineExpose, ref, withDefaults } from "vue";
import { useVux } from "./composables/useVux";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "./types/vuxTemplateComponent";
import VuxPropertyGroupTemplate from "./VuxPropertyGroupTemplate.vue";
import { VuxModel } from "./types/useVuxModelType";
import { Vux } from "./types/vuxTemplateComponentLogic";
import { VuxAction } from "./types/useVuxActionType";

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

const isStatusDoneOrWarning: ComputedRef<boolean> = computed(() => {
  return (
    vux.value.getStatusClass === "status-done" ||
    vux.value.getStatusClass === "status-warning"
  );
});

const sectionClasses: ComputedRef<string[]> = computed(() => {
  return ["vux-configuration-section", vux.value.getStatusClass];
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
  <m-m-skeleton-loader v-if="vux.isSectionLoading" />
  <div v-else :class="sectionClasses">
    <!-- Header Section -->
    <div
      class="vux-configuration-section--header mm-flex mm-flex-gap-4 mm-flex-align-center"
      @click="vux.toggleCollapse"
    >
      <m-m-icon
        v-if="isStatusDoneOrWarning"
        icon="check-mark"
        class="mm-flex-shrink-0"
      />
      <div>Section status: {{ vux.getStatusClass }}</div>
      <div class="mm-ml-auto">
        <m-m-icon v-if="vux.isCollapsed" icon="chevron-down-gray" />
        <m-m-icon v-else icon="chevron-up-gray" />
      </div>
    </div>
    <transition name="collapse-transition" mode="out-in">
      <div
        v-if="!vux.isCollapsed"
        class="vux-configuration-section--content mm-my-14"
      >
        <p><strong>Status:</strong></p>
        <ul>
          <li><code>isChanged</code>: {{ vux.isChanged }}</li>
          <li><code>status</code>: {{ vux.groupModel?.status }}</li>
          <li><code>sync_status</code>: {{ vux.groupModel?.sync_status }}</li>
          <li>
            <code>publish_status</code>: {{ vux.groupModel?.publish_status }}
          </li>
        </ul>

        <vux-property-group-template
          v-if="vux.isValid"
          ref="groupRef"
          v-model="vux.groupModel.data"
          :meta-data="vux.groupMetadata.data"
          :resource-key="resourceKey"
          :mode="vux.renderMode"
          @vux-action="
            (name: string, action: VuxAction, actionModel: VuxModel) =>
              vux.handleVuxAction(name, action, actionModel)
          "
          @validation-changed="
            (propIsValid) =>
              vux.handlePropertyValidationChange(propertyName, propIsValid)
          "
        />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
$color-error: #fef3f2;
$color-warning: #fffaeb;
$color-success: #f0f9f4;

.vux-configuration-section {
  cursor: pointer;
  padding: 24px 16px;
  background-color: #ffffff;
  border: 1px solid #e6e8ec;
  border-radius: 8px;

  &.status-done {
    background-color: $color-success;
    border: 1px solid $color-success;
  }
  &.status-pending,
  &.status-warning {
    background-color: $color-warning;
    border: 1px solid $color-warning;
  }
  &.status-failure {
    background-color: $color-error;
    border: 2px solid $color-error;
  }
}

.collapse-transition-enter-active,
.collapse-transition-leave-active,
.collapse-transition-appear-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.collapse-transition-enter-from,
.collapse-transition-leave-to,
.collapse-transition-appear-from {
  opacity: 0;
  max-height: 0;
}

.collapse-transition-enter-to,
.collapse-transition-leave-from,
.collapse-transition-appear-to {
  opacity: 1;
  max-height: 100%;
}
</style>
