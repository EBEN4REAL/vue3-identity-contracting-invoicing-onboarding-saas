<script setup lang="ts">
import { PropType, computed } from "vue";
import { BadgeTypes } from "../types/badge.types";

const props = defineProps({
  status: {
    type: String as PropType<BadgeTypes>,
    default: null,
  },
  text: {
    type: String,
    default: "",
  },
  indicator: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "badge",
  },
});

const badgeClass = computed(() => [
  "mm-badge",
  props.status && `mm-badge-${props.status}`,
  { "mm-badge-indicator": props.indicator },
]);
const badgeText = computed(() => {
  return props.text
    ? props.text
    : props.status
      ? props.status.charAt(0).toUpperCase() + props.status.slice(1)
      : "";
});
</script>

<template>
  <div :class="badgeClass" :data-cy="cy">{{ badgeText }}<slot></slot></div>
</template>

<style scoped lang="scss">
.mm-badge {
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  line-height: 18px;
  border-radius: 16px;
  font-size: 12px;
  border: 1px solid;

  &-indicator:before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 100%;
  }

  &-inactive {
    background-color: #f9fafb;
    border-color: #eaecf0;
    color: #344054;

    &:before {
      background-color: #667085;
    }
  }

  &-cancelled {
    background-color: #fef3f2;
    border: 1px solid #fecdca;
    color: #f04438;

    &:before {
      background-color: #f04438;
    }
  }

  &-active {
    background-color: #ecfdf3;
    border-color: #abefc6;
    color: #067647;

    &:before {
      background-color: #17b26a;
    }
  }

  &-invited {
    background-color: #eff8ff;
    border-color: #b2ddff;
    color: #175cd3;

    &:before {
      background-color: #2e90fa;
    }
  }

  &-warning {
    background-color: #fffaeb;
    border-color: #fedf89;
    color: #b54708;

    &:before {
      background-color: #b54708;
    }
  }
}
</style>
