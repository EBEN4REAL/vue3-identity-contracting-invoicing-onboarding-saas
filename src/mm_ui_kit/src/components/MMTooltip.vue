<template>
  <span ref="tooltipRef" class="mm-tooltip-container">
    <teleport v-if="popupTarget" :to="popupTarget">
      <div :class="mmTooltipClassList" data-cy="tooltip-content">
        <slot></slot>
      </div>
    </teleport>
  </span>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref, Ref, computed } from "vue";
import usePopup from "../composables/usePopup";

const props = defineProps({
  displayPosition: {
    type: String as PropType<
      "toLeft" | "toRight" | "center" | "top" | "center-top"
    >,
    default: "center",
  },
  maxWidth: {
    type: String,
    default: "320px",
  },
  cy: {
    type: String,
    default: "tooltip",
  },
});

const tooltipRef: Ref<HTMLElement | null> = ref(null);

const { activatorElement, isPopupActive, showPopup, hidePopup, popupTarget } =
  usePopup(props.displayPosition, props.cy);

const mmTooltipClassList = computed(() => [
  "mm-tooltip",
  `mm-tooltip-${props.displayPosition}`,
  { "mm-tooltip-active": isPopupActive.value },
]);

onMounted(() => {
  activatorElement.value = tooltipRef.value?.parentNode as HTMLElement;

  activatorElement.value?.addEventListener("mouseenter", () => {
    showPopup();
  });

  activatorElement.value?.addEventListener("mouseleave", () => {
    hidePopup();
  });
});

defineExpose({
  hidePopup,
});
</script>

<style scoped lang="scss">
.mm-tooltip-container {
  position: absolute;
}
.mm-tooltip {
  position: absolute;
  background-color: #384250;
  color: #fff;
  padding: 12px;
  font-size: 12px;
  border-radius: 8px;
  width: max-content;
  max-width: v-bind(maxWidth);
  z-index: 10000;
  transform: translateY(6px);
  width: max-content;
  border-radius: 8px;
  visibility: hidden;
  opacity: 0;
  transition:
    visibility 0.3s,
    opacity 0.3s;
  overflow: hidden;

  &-toLeft {
    right: 0;
  }

  &-toRight {
    left: 0;
  }

  &-top {
    transform: translateX(-50%);
    top: -37px;
  }

  &-center {
    left: 50%;
    transform: translateX(-50%);
    margin-top: 5px;
  }

  &-center-top {
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    margin-top: 5px;
  }

  &-active {
    visibility: visible;
    opacity: 1;
  }
}
</style>
