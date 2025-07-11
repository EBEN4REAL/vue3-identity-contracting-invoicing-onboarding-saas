<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const props = defineProps({
  rawDate: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: "D MMM YYYY",
  },
  utcOffset: {
    type: Number,
    default: dayjs().utcOffset(),
  },
  cy: {
    type: String,
    default: "formatted-date",
  },
});

const formattedDate: ComputedRef<string> = computed(() =>
  props.rawDate
    ? dayjs(props.rawDate).utcOffset(props.utcOffset).format(props.format)
    : "-",
);
</script>

<template>
  <span :data-cy="cy">{{ formattedDate }}</span>
</template>
