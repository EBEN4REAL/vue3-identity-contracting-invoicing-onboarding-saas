<script setup lang="ts">
import { PropType, computed, ComputedRef } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "20",
  },
  size: {
    type: String,
    default: "20",
  },
  type: {
    type: String as PropType<"default" | "circle">,
    default: "default",
  },
  cy: {
    type: String,
    default: "skeleton-loader",
  },
});

const classList: ComputedRef<string[]> = computed(() => [
  "mm-skeleton-loader",
  `mm-skeleton-loader-${props.type}`,
]);

const computedWidth: ComputedRef<string> = computed(() =>
  props.type === "circle" ? `${props.size}px` : `${props.width || "100%"}`,
);

const computedHeight: ComputedRef<string> = computed(
  () => `${props.type === "circle" ? props.size : props.height}px`,
);
</script>

<template>
  <div :class="classList" :data-cy="cy"></div>
</template>

<style scoped lang="scss">
.mm-skeleton-loader {
  width: v-bind(computedWidth);
  height: v-bind(computedHeight);
  background: linear-gradient(90deg, #e0e1e3 25%, #f4f5f7 50%, #e0e1e3 75%);
  background-size: 200% 100%;
  animation: loading 2s infinite;
  display: inline-block;
  border-radius: 8px;
  &-circle {
    border-radius: 50%;
  }
}

@keyframes loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
