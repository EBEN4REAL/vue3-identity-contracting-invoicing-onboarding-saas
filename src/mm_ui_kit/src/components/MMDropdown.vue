<script setup lang="ts">
import { PropType, useSlots, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type { TypeDropdownItem } from "../types/dropdown.types";
import { labelToKebabCase } from "../helpers/utils";
import usePopup from "../composables/usePopup";

const slots = useSlots();
const router = useRouter();
//const firstItemRef = ref<HTMLElement | null>(null);

const props = defineProps({
  items: {
    type: Array as PropType<TypeDropdownItem[]>,
    default: () => [],
  },
  listSide: {
    type: String as PropType<"left" | "right">,
    default: "left",
  },
  listVariant: {
    type: String as PropType<"border" | "shadow">,
    default: "border",
  },
  displayPosition: {
    type: String as PropType<"toLeft" | "toRight" | "center">,
    default: "toLeft",
  },
  maxWidth: {
    type: String,
    default: "auto",
  },
  cy: {
    type: String,
    default: "dropdown",
  },
});

const {
  isPopupActive,
  popupTarget: teleportTarget,
  activatorElement,
  togglePopup,
  hidePopup,
} = usePopup(props.displayPosition);

const emit = defineEmits(["showDropdown", "hideDropdown"]);

const isCustomActivator = computed(() => !!slots.activator);

const filteredItems = computed(() =>
  props.items.filter((item) => !item?.isHidden),
);

const mmDropdownClassList = computed(() => [
  "mm-dropdown",
  `mm-dropdown-list-side-${props.listSide}`,
  { "mm-dropdown-active": isPopupActive.value },
]);

const mmDropdownListClassList = computed(() => [
  "mm-dropdown-list",
  `mm-dropdown-list-${props.listSide}`,
  `mm-dropdown-list-variant-${props.listVariant}`,
  `mm-dropdown-list-${props.displayPosition}`,
  { "mm-dropdown-list-active": isPopupActive.value },
]);

const mmDropdownItemClassList = (item: TypeDropdownItem) => [
  "mm-dropdown-item",
  `mm-dropdown-item--${item.color}`,
  { "mm-dropdown-item--disabled": item.isDisabled },
];

const onClickOutside = () => {
  hidePopup();
};

// const focusFirstItem = async () => {
//   await nextTick();
//   if (firstItemRef.value) {
//     firstItemRef.value.focus();
//   }
// };

watch(isPopupActive, async (isActive) => {
  if (isActive) {
    emit("showDropdown");
    //await focusFirstItem();
  } else {
    emit("hideDropdown");
  }
});

const onItemClick = (item: TypeDropdownItem) => {
  if (item.isDisabled) return;

  if (item.onClick) item.onClick();
  else if (item.href) window.open(item.href, item.target);
  else if (item.to) router.push(item.to);
  else if (item.action) item.action();
};

// const onKeyDown = (event: KeyboardEvent, item: TypeDropdownItem) => {
//   if (event.key === "Enter" || event.key === " ") {
//     event.preventDefault();
//     onItemClick(item);
//   } else if (event.key === "Escape") {
//     hidePopup();
//     activatorElement.value?.focus();
//   }
// };

const mmDropdownItemCypressId = (label: string) =>
  `${props.cy}-item-${labelToKebabCase(label)}`;

// const getItemRef = (index: number) =>
//   index === 0 ? (el: HTMLElement) => (firstItemRef.value = el) : undefined;

defineExpose({
  togglePopup,
});
</script>

<template>
  <div
    v-mm-click-outside="onClickOutside"
    :class="mmDropdownClassList"
    :data-cy="cy"
  >
    <div v-if="!isCustomActivator" ref="activatorElement">
      <m-m-button
        variant="outlined"
        class="mm-dropdown-activator"
        prepend-icon="meatballs"
        @click="togglePopup"
      />
    </div>
    <div
      v-else
      ref="activatorElement"
      class="mm-dropdown-activator--custom"
      @click="togglePopup"
    >
      <slot name="activator" />
    </div>
    <teleport v-if="teleportTarget" :to="teleportTarget">
      <m-m-card :class="mmDropdownListClassList">
        <slot name="list">
          <div
            v-for="item in filteredItems"
            :key="item.label"
            :class="mmDropdownItemClassList(item)"
            :data-cy="mmDropdownItemCypressId(item.label)"
            @click="onItemClick(item)"
          >
            <div class="mm-dropdown-item--icon-label">
              <m-m-icon
                v-if="item.icon"
                :icon="item.icon"
                :stroke="item.iconColor"
              ></m-m-icon>
              <div class="mm-dropdown-item-label">{{ item.label }}</div>
            </div>
            <div
              v-if="item.hint"
              class="mm-dropdown-item-hint"
              :data-cy="`${props.cy}-item-hint`"
            >
              {{ item.hint }}
            </div>
          </div>
        </slot>
      </m-m-card>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.mm-dropdown {
  position: relative;
  user-select: none;

  &-list {
    position: absolute;
    z-index: 100;
    transform: translateY(6px);
    width: max-content;
    max-width: v-bind(maxWidth);
    border-radius: 8px;
    border: 1px solid #eaecf0;
    background-color: #fff;
    visibility: hidden;
    opacity: 0;
    transition:
      visibility 0.3s,
      opacity 0.3s;
    box-shadow:
      0px 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
    overflow: hidden;

    &-toLeft {
      right: 0;
    }

    &-toRight {
      left: 0;
    }

    &-center {
      left: 50%;
      transform: translateX(-50%);
    }

    &-variant-shadow {
      border: none;
    }
  }

  &-item {
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s;
    will-change: background-color;
    //outline: none;

    // &:focus-visible {
    //   background-color: #eaecf0;
    // }

    &--icon-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0;
    }

    &-hint {
      font-size: 11px;
      line-height: 15px;
      letter-spacing: 0;
      color: #6c737f;
      margin-top: 2px;
    }

    &--error {
      .mm-dropdown-item-label {
        color: #b42318;
      }
    }

    &--disabled {
      &.mm-dropdown-item {
        cursor: not-allowed;

        &:hover {
          background-color: #fff;
        }
      }

      .mm-dropdown-item-label {
        opacity: 0.4;
      }
    }

    &:hover {
      background-color: #eaecf0;
    }
    // &:focus {
    //   background-color: #eaecf0;
    // }
  }

  &-active {
    .mm-dropdown {
      &-activator {
        background-color: #e5e7eb;

        &:hover {
          background-color: #e5e7eb;
        }
      }
    }
  }

  &-list-active {
    visibility: visible;
    opacity: 1;
  }
}
</style>
