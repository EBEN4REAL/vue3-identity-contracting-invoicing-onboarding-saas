<script setup lang="ts">
import { computed } from "vue";
import { isOpened, text, status, showToast } from "../composables/useToast";
import { eventBus } from "../helpers/EventBus";
import { TypeToast } from "../types/toast.types";

eventBus.$on("onShowToast", (toast: TypeToast) => {
  showToast(toast);
});

const toastClassList = computed(() => [
  "mm-toast mm-flex mm-pa-4",
  `mm-toast--${status.value}`,
  {
    "mm-toast--is-opened": isOpened.value,
  },
]);
</script>

<template>
  <div :class="toastClassList">
    <m-m-icon :icon="status" class="mm-mr-4" />
    <div class="mm-toast-text">{{ text }}</div>
  </div>
</template>

<style scoped lang="scss">
$color-error: #fef3f2;
$color-warning: #fffaeb;
$color-info: #e8f1f4;
$color-success: #f0f9f4;

.mm-toast {
  position: fixed;
  right: 32px;
  bottom: 32px;
  margin-left: 32px;
  min-width: 480px;
  max-width: 1092px;
  border-radius: 8px;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  will-change: transform, opacity, visibility;
  transition:
    transform 0.2s,
    opacity 0.2s,
    visibility 0.2s;

  &-text {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
  }

  &--is-opened {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &--info {
    background-color: $color-info;
  }

  &--error {
    background-color: $color-error;
  }

  &--warning {
    background-color: $color-warning;
  }

  &--success {
    background-color: $color-success;
  }
}
</style>
