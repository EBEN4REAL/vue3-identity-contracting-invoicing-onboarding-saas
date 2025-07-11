<script setup lang="ts">
import { computed, ComputedRef, PropType } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  hideAsterisk: {
    type: Boolean,
    default: false,
  },
  iconAppended: {
    type: String,
    default: "",
  },
  iconSize: {
    type: String,
    default: "15px",
  },
  iconColor: {
    type: String,
    default: "#475467",
  },
  tooltipText: {
    type: String,
    default: "",
  },
  tooltipDisplayPosition: {
    type: String,
    default: "top",
  },
  iconClickable: {
    type: Boolean,
    default: false,
  },
  whitespace: {
    type: String as PropType<"initial" | "wrap" | "nowrap">,
    default: "initial",
  },
});

const emit = defineEmits(["handleIconClick"]);

const mmFieldLabelClassList: ComputedRef<string[]> = computed(() => [
  `mm-field-label--${props.whitespace}`,
]);

const handleIconClick = () => {
  if (props.iconClickable) {
    emit("handleIconClick");
  }
};
</script>

<template>
  <div
    v-if="label"
    :class="[
      'mm-field-label mm-flex mm-flex-align-center',
      { 'mm-field-label--required': required && !hideAsterisk },
    ]"
  >
    <div v-sanitize-html="label" :class="mmFieldLabelClassList" />
    <div v-if="tooltipText">
      <m-m-icon
        icon="info"
        width="16px"
        height="16px"
        class="info-icon mm-ml-3"
      />
      <m-m-tooltip :display-position="tooltipDisplayPosition">
        <div v-sanitize-html="tooltipText"></div>
      </m-m-tooltip>
    </div>
    <span v-else-if="iconAppended" class="mm-ml-1">
      <m-m-icon
        :icon="iconAppended"
        :width="iconSize"
        :height="iconSize"
        :stroke="iconColor"
        @click="handleIconClick"
      />
    </span>
  </div>
</template>

<style scoped lang="scss">
.mm-field-label {
  text-align: left;
  color: #384250;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 6px;

  &--required {
    &::after {
      content: "*";
      color: #f04438;
      margin-left: 3px;
    }
  }

  &--initial {
    white-space: initial;
  }

  &--wrap {
    white-space: wrap;
  }

  &--nowrap {
    white-space: nowrap;
  }
}
</style>
