<script setup lang="ts">
import { PropType, computed, Ref, ref, ComputedRef } from "vue";
import type { TypeTreeItem } from "./types";
import { BadgeTypes } from "../../types/badge.types";
import { eventBus } from "../../helpers/EventBus";

const props = defineProps({
  item: {
    type: Object as PropType<TypeTreeItem>,
    default: () => {},
  },
  label: {
    type: String,
    default: "label",
  },
  activeId: {
    type: String,
    default: "",
  },
});

const isExpanded: Ref<boolean> = ref(true);

const mmTreeItemClassList = computed(() => [
  "mm-tree-item",
  `mm-tree-item--${props.item?.type}`,
  { "mm-tree-item--active": props.activeId === props.item.id },
]);

const onTreeItemClick = (id?: string) => {
  eventBus.$emit("activateTreeItem", id);
};

const mmTreeItemContentClassList = (notClickable: boolean | undefined) => [
  "mm-tree-item-content",
  { "mm-tree-item-content--not-clickable": notClickable },
];

const onToggleCollapseExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const expandCollapseIcon: ComputedRef<
  "chevron-down-primary-thick" | "chevron-right-primary-thick"
> = computed(() =>
  isExpanded.value
    ? "chevron-down-primary-thick"
    : "chevron-right-primary-thick",
);

const isButtonCollapseExpandVisible: ComputedRef<boolean> = computed(() =>
  Boolean(props.item.children?.length && !props.item.notClickable),
);
</script>

<template>
  <div :class="mmTreeItemClassList" :data-cy="`tree-item-id-${item.id}`">
    <div
      :class="mmTreeItemContentClassList(props.item.notClickable)"
      @click.stop="onTreeItemClick(props.item.id)"
    >
      <m-m-button
        v-if="isButtonCollapseExpandVisible"
        is-tile
        is-only-icon
        variant="text"
        size="small"
        class="mm-mr-4"
        icon-size="16px"
        :prepend-icon="expandCollapseIcon"
        @click.stop="onToggleCollapseExpand"
      />
      <div v-if="item.icon" class="mm-tree-item-icon">
        <m-m-icon :icon="item.icon" width="8px" />
      </div>
      <div
        class="mm-tree-item-label"
        :data-cy="`tree-item-id-${item.id}-label`"
      >
        {{ item[label] }}
      </div>
      <m-m-badge
        v-if="item.appendBadge"
        :text="item.appendBadge"
        :status="BadgeTypes.Inactive"
        class="mm-ml-12"
      />
      <div class="mm-tree-item-append">
        {{ item.append }}
      </div>
    </div>
    <div v-if="item.children && isExpanded" class="mm-tree-item-children">
      <m-m-tree-item
        v-for="itemChild in item.children"
        :key="itemChild.id"
        :item="itemChild"
        :active-id="activeId"
        :label="label"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-tree-item {
  position: relative;
  padding-left: 32px;
  margin-bottom: 16px;

  &:before {
    content: "";
    position: absolute;
    top: 19px;
    left: 16px;
    margin: auto;
    width: 16px;
    height: 1px;
    background-color: #e5e7eb;
  }

  &:after {
    position: absolute;
    top: -16px;
    bottom: 0;
    left: 16px;
    display: block;
    width: 0;
    border-left: 1px solid #e5e7eb;
    content: "";
  }

  &:last-child:after {
    height: 36px;
  }

  &-children {
    position: relative;
    margin-top: 16px;
  }

  &-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 200px;
    max-width: fit-content;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    user-select: none;
    cursor: pointer;
    z-index: 1;
    transition:
      background-color 0.3s,
      border-color 0.3s,
      box-shadow 0.3s;
    will-change: background-color, border-color, box-shadow;

    &--not-clickable {
      cursor: default;
      pointer-events: none;
    }

    &:hover {
      background-color: #f3f4f6;

      .mm-tree-item {
        &-icon {
          background-color: #d2d6db;
        }
      }
    }
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 12px;
    transition: background-color 0.3s;
    will-change: background-color;
  }

  &-label {
    font-size: 14px;
    line-height: 20px;
  }

  &--organization {
    padding-left: 0;

    &:before {
      content: none;
    }

    & > .mm-tree-item {
      &-content {
        font-weight: 600;
        background-color: #f6f9fb;

        & > .mm-tree-item-icon {
          background-color: #a5c8d5;
        }

        &:hover {
          .mm-tree-item-icon {
            background-color: #a5c8d5;
          }
        }
      }
    }
  }

  &--unit {
    .mm-tree-item {
      &-icon {
        background-color: #f2f4f6;
      }
    }
  }

  &--active {
    & > .mm-tree-item-content {
      background-color: #f3f4f6;
      border-color: #072e51;
      box-shadow: 0 0 0 3px #072e511a;
      font-weight: 600;

      & > .mm-tree-item-icon {
        background-color: #d2d6db;
      }
    }
  }
}
</style>
