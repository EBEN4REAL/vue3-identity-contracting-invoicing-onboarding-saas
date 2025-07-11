<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";
import type { TypeTreeItem } from "./types";
import { eventBus } from "../../helpers/EventBus";

defineProps({
  items: {
    type: Array as PropType<TypeTreeItem[]>,
    default: () => [],
  },
  label: {
    type: String,
    default: "label",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const activeId = ref("");

const setTreeItemActiveId = (id: string) => {
  activeId.value = id;
  emit("update:modelValue", id);
};

onMounted(() => {
  eventBus.$on("activateTreeItem", (id: string) => {
    setTreeItemActiveId(id);
  });
});
</script>

<template>
  <div class="mm-tree">
    <m-m-tree-item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :active-id="modelValue"
      :label="label"
      :data-cy="`tree-item-id-${item.id}`"
    />
  </div>
</template>

<style scoped lang="scss">
.mm-tree {
  position: relative;

  & > .mm-tree-item {
    padding-left: 0;

    &:after {
      top: 0;
    }
  }
}
</style>
