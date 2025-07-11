<script setup lang="ts">
import { PropType } from "vue";

interface Step {
  title: string;
}

defineProps({
  steps: {
    type: Array as PropType<Step[] | null>,
    default: null,
  },
  activeStep: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="multi-step">
    <div class="step-indicators">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'step-indicator',
          { active: index === activeStep },
          { 'no-separator': index === 0 },
          { done: index < activeStep },
        ]"
      >
        <div v-if="index !== 0" class="indicator-separator"></div>
        <span class="step-number">{{ index + 1 }}</span>
        <span class="step-title">{{ step.title }}</span>
      </div>
    </div>
    <div class="step-content">
      <slot :name="'step-' + activeStep"></slot>
    </div>
  </div>
</template>

<style scoped>
.multi-step {
  display: flex;
  flex-direction: column;
}

.step-indicators {
  display: flex;
  align-items: center;
  margin-bottom: 56px;
  gap: 16px;
}

.step-indicator {
  display: flex;
  flex-grow: 1;
  align-items: center;
  color: #d9dbde;
  font-weight: 600;

  &.no-separator {
    flex-grow: 0;
  }

  &.active {
    color: #384250;
  }

  &.done {
    color: #384250;

    .step-number {
      background: #384250;
      color: #fff;
    }
  }

  .indicator-separator {
    flex-grow: 1;
    height: 1px;
    background: #e6e8ec;
    margin-right: 16px;
  }

  .step-number {
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border: 1px solid;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    flex-shrink: 0;
  }
}
</style>
