<script setup lang="ts">
import { PropType, computed } from "vue";
import { AlertTypes } from "../types/alert.types";

const props = defineProps({
  status: {
    type: String as PropType<AlertTypes>,
    default: "info",
  },
  cy: {
    type: String,
    default: "alert",
  },
  isClosable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const alertClass = computed(() => [
  "mm-alert",
  props.status && `mm-alert-${props.status}`,
]);
</script>

<template>
  <div :class="alertClass" :data-cy="cy">
    <div class="mm-flex mm-w-10 mm-flex-align-center">
      <m-m-icon
        :icon="props.status"
        class="mm-alert-icon mm-mr-8 mm-flex-shrink-0"
        width="20px"
        height="20px"
      />
      <div class="mm-alert-text">
        <slot />
      </div>
    </div>
    <slot name="actions">
      <m-m-icon
        v-if="isClosable"
        icon="close"
        class="mm-alert-close"
        @click="emit('close')"
      />
    </slot>
  </div>
</template>

<style scoped lang="scss">
$color-error: #fef3f2;
$color-warning: #fffaeb;
$color-info: #fafbfc;

.mm-alert {
  display: flex;
  width: 100%;
  background-color: $color-info;
  border-radius: 8px;
  padding: 16px;

  &-error {
    background-color: $color-error;
  }

  &-warning {
    background-color: $color-warning;
  }

  &-text {
    flex-grow: 1;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  }

  &-close {
    cursor: pointer;
    margin-left: auto;
  }
}

@media (max-width: $breakpoint-md) {
  .mm-alert {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;

    &-text {
      flex-grow: 1;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-bottom: 20px;
    }

    &-icon {
      display: none !important;
    }

    &-close {
      margin-left: 0;
      align-self: flex-end;
    }
  }
}
</style>
