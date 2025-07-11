import { ComputedRef, computed } from "vue";
import { TimeBasedValues } from "../types/types";

const calculateDifference = (start: number, end: number): number => {
  return end - start;
};
const determineValue = (start: number, end: number): null | string | number => {
  if (end === start) {
    return null;
  } else return calculateDifference(start, end);
};

export const useTimeValueCalculations = (timeBasedValues: TimeBasedValues) => {
  const calculatedValue: ComputedRef<null | string | number> = computed(() => {
    const { startTimeValue, endTimeValue } = timeBasedValues;
    return determineValue(startTimeValue, endTimeValue);
  });

  const displayedValue: ComputedRef<number | string | null> = computed(() =>
    typeof calculatedValue.value === "number"
      ? Math.abs(calculatedValue.value)
      : calculatedValue.value,
  );

  return {
    calculatedValue,
    displayedValue,
  };
};
