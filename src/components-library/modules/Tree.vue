<script setup lang="ts">
import { ref } from "vue";

const treeItems = ref([
  {
    id: "1",
    label: "Item 1",
    type: "folder",
    children: [
      {
        id: "1-1",
        label: "Item 1-1",
        type: "folder",
        children: [
          {
            id: "1-1-1",
            label: "Item 1-1-1",
            type: "file",
          },
          {
            id: "1-1-2",
            label: "Item 1-1-2",
            type: "file",
          },
        ],
      },
      {
        id: "1-2",
        label: "Item 1-2",
        type: "file",
      },
    ],
  },
]);

const activeTreeItem = ref("1-1-1");
</script>

<template>
  <m-m-tree v-model="activeTreeItem" :items="treeItems" />
</template>

<style scoped lang="scss"></style>
