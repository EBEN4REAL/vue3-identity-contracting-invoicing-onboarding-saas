<template>
  <div class="mm-totals-card" :data-cy="cy">
    <div class="mm-totals-card-body">
      <div class="mm-totals-card-header">
        <div class="mm-totals-card-header-title">{{ title }}</div>
        <m-m-icon
          v-if="displayInfoTooltip"
          class="mm-totals-card-header-info"
          icon="info"
          width="14px"
        />
        <m-m-tooltip
          v-if="displayInfoTooltip"
          display-position="toRight"
          data-cy="tooltip-totals-card"
        >
          {{ tooltipContent }}
        </m-m-tooltip>
      </div>
      <div class="mm-totals-card-metrics">
        <div class="mm-totals-card-total" :data-cy="cy + '-value'">
          {{ endTimeValue }}
        </div>
        <div v-if="showFooterText" class="mm-totals-card-footer">
          <div class="mm-totals-card-percentages">
            <m-m-icon v-if="calculatedValue" :icon="arrowIcon" />{{
              displayedValue
            }}
          </div>
          <span class="mm-totals-card-footer-text">{{ footerText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, PropType, computed } from "vue";
import { useTimeValueCalculations } from "../composables/useTimeValueCalculations";
import { TimeBasedValues } from "../types/types";

const props = defineProps({
  title: { type: String, default: "" },
  showFooterText: { type: Boolean, default: true },
  timeBasedValues: {
    type: Object as PropType<TimeBasedValues>,
    default: () => {},
  },
  tooltipContent: {
    type: String,
    default: "",
  },
  cy: {
    type: String,
    default: "totals-card",
  },
  moreIsPositive: {
    type: Boolean,
    default: false,
  },
  isCurrency: {
    type: Boolean,
    default: false,
  },
});
const { calculatedValue, displayedValue } = useTimeValueCalculations(
  props.timeBasedValues,
);

const displayInfoTooltip: ComputedRef<boolean> = computed(
  () => props.tooltipContent.length > 0,
);
const footerText: ComputedRef<string> = computed(() => {
  const typeToText: Record<string, string> = {
    string: "vs the previous 30 days",
    null: "No changes in the last 30 days",
    number: `${(calculatedValue.value as number) > 0 ? "more" : "fewer"} vs the previous 30 days`,
  };
  const type =
    calculatedValue.value === null ? "null" : typeof calculatedValue.value;
  return typeToText[type as keyof typeof typeToText] || "";
});
const color = computed(() => {
  if (!calculatedValue.value) return null;
  if (typeof calculatedValue.value === "string") {
    return calculatedValue.value.charAt(0) == "+" && props.moreIsPositive
      ? "green"
      : "red";
  }
  return calculatedValue.value > 0 && props.moreIsPositive ? "green" : "red";
});
const arrowIcon = computed(() =>
  color.value == "green" ? "arrow-up-green" : "arrow-down-red",
);
const endTimeValue = computed(() =>
  props.isCurrency
    ? "€" + props.timeBasedValues.endTimeValue
    : props.timeBasedValues.endTimeValue,
);
</script>

<style scoped lang="scss">
.mm-totals-card {
  min-width: 32%;
  max-width: 450px;
  min-height: 140px;
  padding: 16px;
  gap: 16px;
  border-radius: 8px;
  background-color: #f9fafb;

  &-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    &-title {
      font-size: 18px;
      font-weight: 500;
      line-height: 28px;
      text-align: left;
      color: #384250;
    }
    &-info {
      margin-top: 3px;
    }
  }
  &-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-metrics {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &-total {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    text-align: left;
  }
  &-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    &-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      text-align: left;
      color: #6c737f;
    }
  }
  &-percentages {
    color: v-bind(color);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
