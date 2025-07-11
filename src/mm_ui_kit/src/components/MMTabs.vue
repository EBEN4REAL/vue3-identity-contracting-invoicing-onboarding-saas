<script lang="ts" setup>
import { PropType, computed, ref, onMounted, onBeforeUnmount } from "vue";
import { TypeTab } from "../types/types";
import { useEventListener } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  items: {
    type: Array as PropType<TypeTab[]>,
    default: () => [],
  },
  cy: {
    type: String,
    default: "tabs",
  },
  isTabItemFullWidth: {
    type: Boolean,
    default: false,
  },
  isSecondLevel: {
    type: Boolean,
    default: false,
  },
  isInEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const itemsFiltered = computed(() =>
  props.items.filter((item) => !item?.isHidden),
);

const mmTabsClassList = computed(() => [
  "mm-tabs",
  { "mm-tabs--second-level": props.isSecondLevel },
]);

const mmTabItemClassList = computed(() => (tab: TypeTab) => [
  "mm-tabs-item",
  { "mm-tabs-item--active": tab.name === props.modelValue },
  { "mm-tabs-item--full-width": props.isTabItemFullWidth },
  {
    "mm-tabs-item--required": props.isInEditMode && tab.isRequired,
  },
]);

const mmTabItemCypressId = computed(
  () => (label: string) =>
    `tab-item-${label.replaceAll(" ", "-").toLocaleLowerCase()}`,
);
const currentIndex = ref(0);
const isOverflowingLeft = ref(false);
const isOverflowingRight = ref(false);
const tabsContainer = ref<HTMLElement | null>(null);

const handleArrowNavigation = (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
    return;
  }
  const maxIndex = itemsFiltered.value.length - 1;

  if (event.key === "ArrowRight") {
    currentIndex.value =
      currentIndex.value + 1 > maxIndex ? 0 : currentIndex.value + 1;
  } else if (event.key === "ArrowLeft") {
    currentIndex.value =
      currentIndex.value - 1 < 0 ? maxIndex : currentIndex.value - 1;
  }

  emit("update:modelValue", itemsFiltered.value[currentIndex.value].name);
};

const checkOverflow = () => {
  if (tabsContainer.value) {
    const isOverflowingLeftValue = tabsContainer.value.scrollLeft > 0;
    const isOverflowingRightValue =
      tabsContainer.value.scrollWidth >
      tabsContainer.value.clientWidth + tabsContainer.value.scrollLeft;
    isOverflowingLeft.value = isOverflowingLeftValue;
    isOverflowingRight.value = isOverflowingRightValue;
  }
};

const scrollLeft = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: -130, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (tabsContainer.value) {
    tabsContainer.value.scrollBy({ left: 130, behavior: "smooth" });
  }
};

onMounted(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
  if (tabsContainer.value) {
    tabsContainer.value.addEventListener("scroll", checkOverflow);
    useEventListener(tabsContainer, "keydown", handleArrowNavigation);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkOverflow);
  if (tabsContainer.value) {
    tabsContainer.value.removeEventListener("scroll", checkOverflow);
  }
  useEventListener(tabsContainer, "keydown", handleArrowNavigation, false);
});
</script>

<template>
  <div class="tabs-wrapper">
    <m-m-button
      v-if="isOverflowingLeft"
      class="arrow left-arrow"
      variant="tertiary"
      @click="scrollLeft"
    >
      <m-m-icon icon="chevron-left-outline" stroke="#4D5761"></m-m-icon>
    </m-m-button>
    <div
      ref="tabsContainer"
      :class="mmTabsClassList"
      :data-cy="cy"
      tabindex="0"
    >
      <div
        v-for="(tab, index) in itemsFiltered"
        :key="index"
        :tabindex="index === currentIndex ? 0 : -1"
        :class="mmTabItemClassList(tab)"
        :data-cy="mmTabItemCypressId(tab.label)"
        @focus="() => emit('update:modelValue', tab.name)"
        @click="() => emit('update:modelValue', tab.name)"
      >
        {{ tab.label }}
      </div>
    </div>
    <m-m-button
      v-if="isOverflowingRight"
      class="arrow right-arrow"
      variant="tertiary"
      @click="scrollRight"
    >
      <m-m-icon icon="chevron-right-outline" stroke="#4D5761"></m-m-icon>
    </m-m-button>
  </div>
</template>

<style scoped lang="scss">
.tabs-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaecf0;

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 1;
    padding: 4px;

    &.left-arrow {
      left: -10px;
    }

    &.right-arrow {
      right: -10px;
    }
  }
}

.mm-tabs {
  display: flex;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  font-variant-ligatures: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .mm-tabs-item {
    color: #6c737f;
    padding: 11px 25px;

    &--active {
      box-shadow: inset 0px -2px 0px 0px #384250;
      color: #384250;
      font-weight: 600;
    }
    &:focus {
      outline: none;
    }
  }

  &--second-level {
    border-radius: 8px;
    border: 1px solid #eaecf0;
    background: #f9fafb;
    padding: 4px;

    .mm-tabs-item {
      transition: box-shadow 0.3s;
      color: #667085;
      padding: 8px 12px;
      border-radius: 6px;

      &--active {
        background-color: #fff;
        color: #344054;
        box-shadow: 0 1px 3px 0 #1018281a;
      }
    }
  }

  &-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    transition:
      box-shadow 0.3s,
      color 0.3s,
      background-color 0.3s;
    will-change: box-shadow, color, background-color;
    white-space: nowrap;

    &--full-width {
      flex: 1;
    }

    &--required {
      &:after {
        content: "*";
        position: absolute;
        top: 8px;
        right: 14px;
        color: #d92d20;
      }
    }
  }
}
</style>
