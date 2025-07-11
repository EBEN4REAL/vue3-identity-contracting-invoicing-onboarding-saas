<script setup lang="ts">
import { computed, ComputedRef, PropType } from "vue";

const props = defineProps({
  color: {
    type: String as PropType<"primary" | "danger" | "white">,
    default: "primary",
  },
  size: {
    type: Number,
    default: 16,
  },
});

const classList = computed(() => ["mm-spinner", `mm-spinner--${props.color}`]);

const spinnerStyle: ComputedRef<Record<string, string>> = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderWidth: "calc(" + props.size + " / 8)",
}));
</script>

<template>
  <span :class="classList" :style="spinnerStyle"></span>
</template>

<style lang="scss" scoped>
.mm-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  &--primary {
    border: 2px solid #072e51;
    border-bottom-color: transparent;
  }

  &--danger {
    border: 2px solid #d92d20;
    border-bottom-color: transparent;
  }

  &--white {
    border: 2px solid #fff;
    border-bottom-color: transparent;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
