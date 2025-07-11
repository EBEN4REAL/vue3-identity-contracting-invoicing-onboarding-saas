<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  isOpened: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "expandable-card",
  },
  required: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:isOpened"]);
const isContentVisible: Ref<boolean> = ref(props.isOpened);
const classList = computed(() => [
  "mm-expandable-card",
  {
    "mm-expandable-card--active": isContentVisible.value,
  },
]);
const titleClass = computed(() => [
  "mm-expandable-card-title",
  {
    "mm-expandable-card--required": props.required,
  },
]);
const toggleContent = () => {
  isContentVisible.value = !isContentVisible.value;
  emit("update:isOpened", isContentVisible.value);
};
watch(
  () => props.isOpened,
  (newVal) => {
    isContentVisible.value = newVal;
  },
  { immediate: true },
);
</script>

<template>
  <m-m-card
    :class="classList"
    :data-cy="cy"
    tabindex="0"
    @keydown.enter="toggleContent"
  >
    <div class="mm-expandable-card-header mm-w-10" @click="toggleContent">
      <span :class="titleClass" data-cy="title">{{ title }}</span>
      <m-m-icon class="mm-expandable-card-icon" icon="chevron-down" />
    </div>
    <div v-show="isContentVisible" class="mm-expandable-card-container">
      <slot />
    </div>
  </m-m-card>
</template>

<style scoped lang="scss">
.mm-expandable-card {
  border-radius: 16px;
  border: 1px solid #d0d5dd;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-variant-ligatures: none;
  overflow: hidden;

  &-container {
    display: contents;
  }

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    cursor: pointer;
    font-variant-ligatures: none;
    transition: background-color 0.2s;
  }

  &-icon {
    margin: 12px 25px;
    font-size: 16px;
    opacity: 1;
    color: #0f172a;
    transition: transform 0.3s;
  }

  &--active {
    .mm-expandable-card {
      &-icon {
        transform: rotate(180deg);
      }
    }
  }

  &-title {
    color: #384250;
    font-weight: 500;
    display: flex;
    margin: 2px 23px;
  }

  &:deep(.mm-table) {
    width: 100%;

    .mm-table-body {
      box-shadow: none;
      border: none;
      box-shadow: none;
      border-radius: 0;
      background: none;
      table {
        th {
          background: none;

          &:first-child {
            border-radius: 0;
            border-left: 0;
          }
          &:last-child {
            border-radius: 0;
            border-right: 0;
          }
        }

        tr {
          td {
            background: none;
          }

          &:last-child {
            td {
              border-bottom: none;
            }
          }

          td:not(&.mm-table-empty-state) {
            padding: 5px 24px;
            background: none;

            &:first-child {
              border-left: none;
            }
            &:last-child {
              border-right: none;
            }
          }

          &.mm-table-empty-state {
            td {
              background: none;
              border: none;
              padding: 42px 0;
            }
          }
          &.expandable-mm-table-empty-state {
            td {
              background: none;
              border: none;
              padding: 22px 0;
              text-align: center;
            }
          }
        }
      }
    }
  }

  &--required {
    position: relative;
    &:after {
      content: "*";
      position: absolute;
      top: 0;
      right: -10px;
      color: #d92d20;
    }
  }
}
</style>
