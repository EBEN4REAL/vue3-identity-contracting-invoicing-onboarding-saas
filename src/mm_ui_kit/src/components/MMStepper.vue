<script setup lang="ts">
import type { PropType } from "vue";

type TypeStep = {
  index: number;
  title: string;
  active: boolean;
  completed: boolean;
};

const props = defineProps({
  activeStep: {
    type: Number,
    default: 0,
  },
  steps: {
    type: Array as PropType<Array<TypeStep>>,
    default: () => [],
  },
});

const stepStatus = (step: TypeStep) => {
  if (step.index === props.activeStep) return "active";
  else if (step.completed) return "completed";
  else return "default";
};

const stepClassList = (step: TypeStep) => {
  return ["mm-step", `mm-step--${stepStatus(step)}`];
};
</script>

<template>
  <div class="mm-stepper" data-cy="stepper">
    <div
      v-for="step in steps"
      :key="step.index"
      :class="stepClassList(step)"
      :data-cy="`step-${step.index}`"
    >
      <div class="mm-step-marker" />
      <div class="mm-step-content">
        {{ step.title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-stepper {
  display: flex;
  flex-direction: column;

  .mm-step {
    display: flex;
    align-items: center;
    margin-bottom: 80px;

    &-marker {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
      transition: background-color 0.3s;
      will-change: background-color;

      &-content {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        color: #101828;
      }

      &:after {
        content: "";
        display: block;
        position: absolute;
        top: (calc(100% + 6px));
        left: 0;
        right: 0;
        margin: auto;
        width: 2px;
        height: 72px;
        border-radius: 1px;
      }
    }

    &--default {
      .mm-step {
        &-marker {
          border: 2px solid #eaecf0;

          &:after {
            background-color: #eaecf0;
          }
        }
      }
    }

    &--completed {
      .mm-step {
        &-marker {
          background-color: #072e5166;
          border: none;

          &:before {
            content: "";
            width: 14px;
            height: 12px;
            background-image: url("~/mm_ui_kit/src/assets/icons/check-thin.svg");
            background-size: contain;
            background-repeat: no-repeat;
          }

          &:after {
            background-color: #072e5166;
          }
        }
      }
    }

    &--active {
      .mm-step {
        &-marker {
          background-color: #072e51;
          border: none;

          &:after {
            background-color: #eaecf0;
          }
        }

        &-content {
          font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;

      .mm-step-marker {
        &:after {
          content: none;
        }
      }
    }
  }
}
</style>
