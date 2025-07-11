<script setup lang="ts">
import { PropType } from "vue";
import { OrganizationUnitRead } from "~/iam/iam.types";

type TreeNodeType = OrganizationUnitRead & { children: TreeNodeType[] };

defineProps({
  node: {
    type: Object as PropType<TreeNodeType>,
    default: () => ({}),
  },
});
</script>

<template>
  <v-list-item v-if="node" :key="node.id">
    <v-list-item-title>{{ node.name }}</v-list-item-title>
    <v-item-group v-if="node.children && node.children.length">
      <OrganizationUnitItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />
    </v-item-group>
  </v-list-item>
</template>
