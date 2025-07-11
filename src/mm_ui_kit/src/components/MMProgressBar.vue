<script lang="ts" setup>
import { computed, ComputedRef } from "vue";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "mm-progress-bar",
  },
  barColor: {
    type: String,
    default: "#17b26a",
  },
});

const computedProgress = computed(() => {
  return Math.max(0, Math.min(props.progress, 100));
});

const progressInnerFillClass = computed(() => [
  `progress-bar--fill ${props.barColor}`,
  props.progress >= 100 ? "rounded-right" : "",
]);

const progressFillStyleWidth: ComputedRef<string> = computed(
  () => `${computedProgress.value}%`,
);
const progressFillStyleBorderRadius: ComputedRef<string> = computed(() =>
  computedProgress.value < 100 ? "0 4px 4px 0" : "0",
);
const progressForView = computed(() => computedProgress.value.toFixed());
</script>

<template>
  <div
    class="progress-container mm-flex mm-flex-align-center mm-flex-gap-8"
    data-cy="mm-getting-started-progress-bar"
  >
    <div
      class="progress-bar-container"
      data-cy="mm-getting-started-progress-bar-container"
    >
      <div
        class="progress-bar"
        :class="progressInnerFillClass"
        data-cy="mm-getting-started-progress-bar-inner"
      ></div>
    </div>
    <div v-if="showLabel">
      <slot name="label">
        <span
          class="progress-label"
          data-cy="mm-getting-started-progress-bar-label"
          >{{ progressForView }}% Completed</span
        >
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.progress-container {
  .progress-bar-container {
    flex-grow: 1;
    background-color: #f4f5f7;
    border-radius: 4px;
    overflow: hidden;
    height: 6px;

    .progress-bar {
      height: 100%;
      border-radius: 4px;
      overflow: hidden;

      &--fill {
        height: 100%;
        transition: width 0.3s ease;
        width: v-bind(progressFillStyleWidth);
        border-radius: v-bind(progressFillStyleBorderRadius);
        background-color: v-bind(barColor);
      }
    }

    .rounded-right {
      border-radius: 0 4px 4px 0;
    }
  }
  .progress-label {
    color: #4d5761;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>
