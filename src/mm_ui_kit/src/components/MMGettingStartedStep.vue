<script setup lang="ts">
import { computed, PropType, reactive, watch } from "vue";
import { TypeGettingStartedStep } from "../types/getting-started.types";
import { BadgeTypes } from "../types/badge.types";

const props = defineProps({
  step: {
    type: Object as PropType<TypeGettingStartedStep>,
    required: true,
  },
  cy: {
    type: String,
    default: "getting-started-step",
  },
});

const emit = defineEmits(["toggle-completed", "toggle-step"]);

const form = reactive({
  completed: props.step.completed,
});

const stepCardContentClass = computed(() => [
  "mm-w-10",
  {
    "mm-flex mm-flex-align-center": props.step.collapsed,
  },
]);

const stepCardClass = computed(() => [
  "mm-w-10",
  "step-card",
  {
    "mm-flex mm-flex-align-center": props.step.collapsed,
    "mm-opacity-50 cursor-not-allowed": props.step.isLocked,
    "mm-getting-started-step-collapsed": props.step.collapsed,
  },
]);

const stepClass = computed(() => [
  props.step.collapsed ? "mm-flex-align-center" : "",
]);

const stepTitleClass = computed(() => {
  return [
    "title",
    props.step.completed || props.step.isLocked ? "mm-fw-400" : "mm-fw-600",
  ];
});

watch(
  () => form.completed,
  (completed) => {
    emit("toggle-completed", { id: props.step.id, completed });
  },
);
</script>

<template>
  <div
    :class="stepCardClass"
    :data-cy="`mm-getting-started-step-${cy}`"
    tabindex="0"
    @keydown.enter="emit('toggle-step')"
  >
    <div :class="stepCardContentClass">
      <h2
        class="step-card__title mm-flex mm-flex-gap-6 mm-w-10"
        :class="stepClass"
      >
        <m-m-icon
          :icon="step.icon"
          width="auto"
          height="auto"
          has-wrapper
          :data-cy="`mm-getting-started-step-icon-${cy}`"
        />
        <div class="step-card__content">
          <div class="mm-flex mm-flex-justify-between mm-flex-align-center">
            <span
              :class="stepTitleClass"
              :data-cy="`mm-getting-started-step-title-${cy}`"
            >
              {{ step.title }}
            </span>
            <m-m-badge
              v-if="step.badge"
              :text="step.badge.text"
              :status="step.badge.status as BadgeTypes"
              class="mm-ml-6 mm-mr-auto"
            />
            <div>
              <m-m-icon v-if="step.collapsed" icon="chevron-down-gray" />
              <m-m-icon v-else icon="chevron-up-gray" />
            </div>
          </div>

          <div v-if="!step.collapsed" class="mm-flex mm-flex-column">
            <slot name="welcome-component" />
            <slot name="buttons" />
          </div>

          <m-m-divider
            v-if="!step.collapsed"
            class="mm-py-4"
            border-color="#E6E8EC"
          />

          <div v-if="!step.collapsed" class="mm-flex mm-flex-gap-3">
            <m-m-checkbox
              v-model="form.completed"
              :checked="form.completed"
              class="mm-my-6"
              :value="props.step.completed"
              name="checkbox"
              :data-cy="`mm-getting-started-step-${cy}-checkbox`"
              @click.stop
            >
              Mark as Completed
            </m-m-checkbox>
          </div>
        </div>
      </h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.step-card {
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e6e8ec;
  border-radius: 8px;
  min-height: 91px;

  &__title {
    color: #384250;
    font-size: 18px;
    line-height: 28px;
  }

  &__content {
    width: 100%;
  }
}

@media (max-width: $breakpoint-lg) {
  .mm-badge.mm-mr-auto {
    margin-left: auto;
    margin-right: 0;
  }
  .title {
    margin-right: 5px;
  }
}
</style>
