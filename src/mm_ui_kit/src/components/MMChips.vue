<script setup lang="ts">
import { onBeforeUnmount, onMounted, PropType, ref } from "vue";
import { TypeChip } from "~/mm_ui_kit/src/types/chips";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  chips: {
    type: Array as PropType<TypeChip[]>,
    default: () => [],
  },
  itemTitle: {
    type: String as PropType<keyof TypeChip>,
    default: "title",
  },
  itemValue: {
    type: String as PropType<keyof TypeChip>,
    default: "value",
  },
  cy: {
    type: String,
    default: "mm-chips",
  },
});

const chipsContainer = ref<HTMLElement | null>(null);
const isOverflowingLeft = ref(false);
const isOverflowingRight = ref(false);

const checkOverflow = () => {
  if (chipsContainer.value) {
    const isOverflowingLeftValue = chipsContainer.value.scrollLeft > 0;
    const isOverflowingRightValue =
      chipsContainer.value.scrollWidth >
      chipsContainer.value.clientWidth + chipsContainer.value.scrollLeft;
    isOverflowingLeft.value = isOverflowingLeftValue;
    isOverflowingRight.value = isOverflowingRightValue;
  }
};

const scrollLeft = () => {
  if (chipsContainer.value) {
    chipsContainer.value.scrollBy({ left: -130, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (chipsContainer.value) {
    chipsContainer.value.scrollBy({ left: 130, behavior: "smooth" });
  }
};

const generateChipClassList = (value: string) => ({
  chip: true,
  "chip--active": props.modelValue === value,
});

onMounted(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
  if (chipsContainer.value) {
    chipsContainer.value.addEventListener("scroll", checkOverflow);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkOverflow);
  if (chipsContainer.value) {
    chipsContainer.value.removeEventListener("scroll", checkOverflow);
  }
});
</script>

<template>
  <div class="mm-chips mm-flex" :data-cy="cy">
    <m-m-button
      v-if="isOverflowingLeft"
      class="arrow left-arrow"
      variant="tertiary"
      @click="scrollLeft"
    >
      <m-m-icon icon="chevron-left-outline" height="16px" stroke="#4D5761" />
    </m-m-button>
    <div
      ref="chipsContainer"
      class="chips-container mm-flex mm-flex-column-gap-4"
    >
      <div
        v-for="chip in chips"
        :key="chip[itemValue]"
        :class="generateChipClassList(chip[itemValue])"
        :data-cy="`${cy}-${chip[itemValue]}`"
        @click="emit('update:modelValue', chip[itemValue])"
      >
        {{ chip[itemTitle] }}
      </div>
    </div>
    <m-m-button
      v-if="isOverflowingRight"
      class="arrow right-arrow"
      variant="tertiary"
      @click="scrollRight"
    >
      <m-m-icon icon="chevron-right-outline" height="16px" stroke="#4D5761" />
    </m-m-button>
  </div>
</template>

<style scoped lang="scss">
.mm-chips {
  position: relative;
}

.chips-container {
  scrollbar-width: none;
  overflow-x: auto;
}

.chip {
  padding: 2px 12px;
  background-color: #fff;
  border: 1px solid #eaecf0;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: #344054;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;

  &--active {
    background-color: #f4f5f7;
  }
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
  padding: 3px;
  width: 24px;

  &.left-arrow {
    left: -10px;
  }

  &.right-arrow {
    right: -10px;
  }
}
</style>
