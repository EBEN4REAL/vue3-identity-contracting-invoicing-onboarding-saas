<script setup lang="ts">
import { PropType, computed, watch, ref, Ref, ComputedRef } from "vue";
import { useRouter } from "vue-router";
import type { TypeIconDropdownItem } from "../types/dropdown.types";
import { labelToKebabCase } from "../helpers/utils";
import usePopup from "../composables/usePopup";

const router = useRouter();

const props = defineProps({
  items: {
    type: Array as PropType<TypeIconDropdownItem[]>,
    default: () => [],
  },
  currentItem: {
    type: Object as PropType<TypeIconDropdownItem>,
    default: () => undefined,
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
  width: {
    type: String,
    default: "auto",
  },
  cy: {
    type: String,
    default: "dropdown",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  shouldReset: {
    type: Boolean,
    default: false,
  },
  activatorElement: {
    type: Object as PropType<HTMLElement | null>,
    default: () => null,
  },
  removeBackgroundColor: {
    type: Boolean,
    default: false,
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

const defaultItem = computed(() =>
  props.items.length > 0
    ? props.items.find((item) => item.isSelected)
    : { label: "", hint: "", icon: "" },
);
const selectedItem: Ref<TypeIconDropdownItem | undefined> = ref(
  defaultItem.value,
);

const mmDropdownClassList = computed(() => [
  "mm-dropdown",
  `mm-dropdown-list-side-${props.listSide}`,
  { "mm-dropdown-active": isActive.value },
  { "mm-dropdown-disabled": props.isDisabled },
  { "mm-dropdown-white": props.removeBackgroundColor },
]);

const showMMDropdownLabelTooltip: ComputedRef<boolean> = computed(
  () =>
    !!(selectedItem.value?.label && selectedItem.value?.label?.length >= 20),
);

const showMMDropdownItemTooltip = (item: TypeIconDropdownItem) =>
  item.label.length >= 20;

const mmDropdownListClassList = computed(() => [
  "mm-dropdown-list",
  `mm-dropdown-list-${props.listSide}`,
  `mm-dropdown-list-variant-${props.listVariant}`,
  `mm-dropdown-list-${props.displayPosition}`,
  { "mm-dropdown-list-active": isPopupActive.value },
]);

const mmDropdownItemClassList = (item: TypeIconDropdownItem) => [
  "mm-dropdown-item",
  `mm-dropdown-item--${item.color}`,
  { "mm-dropdown-item--disabled": item.isDisabled },
  { "mm-dropdown-item--activated": item.isSelected },
];

watch(isPopupActive, (isActive) => {
  if (isActive) {
    emit("showDropdown");
  } else {
    emit("hideDropdown");
  }
});

watch(
  () => props.shouldReset,
  (newVal) => {
    if (newVal) {
      const defaultItem =
        props.items.length > 0
          ? props.items.find((item) => item.isSelected)
          : { label: "", hint: "", icon: "" };
      selectedItem.value = defaultItem;
    }
  },
);

watch(
  () => defaultItem.value,
  (newVal) => {
    if (newVal) {
      selectedItem.value = defaultItem.value;
    }
  },
);

watch(
  () => props.activatorElement,
  (activator: HTMLElement | null) => {
    if (activator) {
      activator.addEventListener("click", togglePopup);
    }
  },
);

const onItemClick = (item: TypeIconDropdownItem) => {
  if (item.isDisabled) return;
  if (item.isSelected) return;

  if (selectedItem.value) selectedItem.value.isSelected = false;
  selectedItem.value = item;
  item.isSelected = true;

  if (item.onClick) item.onClick();
  else if (item.href) window.open(item.href, item.target);
  else if (item.to) router.push(item.to);
};

const hasDropdownItems: ComputedRef<boolean | null> = computed(
  () => !props.isDisabled && teleportTarget.value && props.items.length > 0,
);

const isActive: ComputedRef<boolean> = computed(() =>
  Boolean(!props.isDisabled && isPopupActive.value),
);

const mmDropdownItemCypressId = (label: string) =>
  `${props.cy}-item-${labelToKebabCase(label)}`;

defineExpose({
  togglePopup,
});
</script>

<template>
  <div
    v-mm-click-outside="hidePopup"
    :class="mmDropdownClassList"
    :data-cy="cy"
  >
    <div ref="activatorElement" class="mm-flex mm-flex-align-center mm-w-10">
      <div class="mm-dropdown-icon-wrapper mm-mr-5">
        <m-m-icon
          :icon="selectedItem?.icon"
          width="32px"
          stroke="black"
          fill="white"
          height="32px"
        />
      </div>
      <div class="mm-dropdown-item-appbar-item">
        <span
          v-if="selectedItem?.label"
          ref="textElement"
          data-cy="appbar-item-name"
          class="mm-dropdown-label"
        >
          <m-m-text-ellipsis max-width="130px">
            {{ selectedItem.label }}
          </m-m-text-ellipsis>
        </span>
        <m-m-tooltip
          v-if="showMMDropdownLabelTooltip"
          display-position="toLeft"
        >
          {{ selectedItem.label }}
        </m-m-tooltip>
        <div
          v-if="selectedItem?.hint"
          class="mm-dropdown-item-hint"
          :data-cy="`${props.cy}-item-hint`"
        >
          {{ selectedItem?.hint }}
        </div>
      </div>
      <div
        v-if="isActive"
        class="mm-dropdown-item-selected"
        data-cy="org-selection-dropdown-up-icon"
      >
        <m-m-icon icon="chevron-up-down" stroke="#9EA5AF" />
      </div>
      <div
        v-if="hasDropdownItems && !isActive"
        class="mm-dropdown-item-selected"
        data-cy="org-selection-dropdown-down-icon"
        @click.stop="togglePopup"
      >
        <m-m-icon icon="chevron-up-down" stroke="#9EA5AF" />
      </div>
    </div>
    <teleport v-if="hasDropdownItems" :to="teleportTarget">
      <m-m-card :class="mmDropdownListClassList">
        <slot name="list">
          <div
            v-for="item in items"
            :key="item.label"
            :class="mmDropdownItemClassList(item)"
            :data-cy="mmDropdownItemCypressId(item.label)"
            @click="onItemClick(item)"
          >
            <div class="mm-dropdown-icon-wrapper mm-dropdown-item-icon">
              <m-m-icon
                :icon="item.icon"
                width="32px"
                stroke="black"
                fill="white"
                height="32px"
              />
            </div>
            <div class="mm-dropdown-item-content mm-mr-5">
              <div class="mm-dropdown-item-label">
                <m-m-text-ellipsis max-width="130px">
                  {{ item.label }}
                </m-m-text-ellipsis>
              </div>
              <m-m-tooltip
                v-if="showMMDropdownItemTooltip(item)"
                display-position="toLeft"
              >
                {{ item.label }}
              </m-m-tooltip>
              <div
                v-if="item.hint"
                class="mm-dropdown-item-hint"
                :data-cy="`${props.cy}-item-hint`"
              >
                {{ item.hint }}
              </div>
            </div>
            <div v-if="item.isSelected" class="mm-dropdown-item-selected">
              <m-m-icon
                icon="check-primary"
                width="24px"
                stroke="black"
                fill="white"
                height="24px"
              />
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
  width: 100%;
  height: 100%;
  padding: 12px;
  display: flex;
  transition: background-color 0.3s;
  will-change: background-color;

  &-item-appbar-item {
    min-width: 135px;
  }

  &:hover {
    background-color: #fafbfc;
    cursor: pointer;
  }

  &-label {
    font-size: 16px;
    line-height: 24px;
  }

  &-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    background-color: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 10px;
  }

  &-icon-wrapper .mm-icon-initials {
    font-size: 16px;
  }

  &-list {
    position: absolute;
    z-index: 101;
    width: max-content;
    border-radius: 8px;
    border: 1px solid #e6e8ec;
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
    top: 7px;

    &-toLeft {
      right: 0;
    }

    &-toRight {
      left: -10px;
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
    width: v-bind(width);
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.3s;

    &-icon {
      margin-right: 8px;
    }

    &-icon .mm-icon-initials {
      font-size: 14px;
    }

    &-content {
      flex-grow: 1;
    }

    &-label {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0;
      color: #111927;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-hint {
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0;
      color: #6d7480;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100px;
    }

    &-selected {
      margin-left: auto;
    }

    &:hover {
      background-color: #a5c8d41a;
    }

    &--activated {
      background-color: #fafbfc;
    }

    &--disabled {
      cursor: not-allowed;

      .mm-dropdown-item-label {
        opacity: 0.4;
      }

      &:hover {
        background-color: #fff;
      }
    }
  }
  &-white {
    background-color: #ffffff;
    padding: 6px;
  }
  &-active {
    background-color: #a5c8d41a;

    .mm-dropdown {
      &-activator {
        background-color: #fafbfc;

        &:hover {
          background-color: #fafbfc;
        }
      }
    }
  }

  &-disabled {
    &:hover {
      background-color: white;
      cursor: auto;
    }
  }

  &-list-active {
    visibility: visible;
    opacity: 1;
  }
}
</style>
