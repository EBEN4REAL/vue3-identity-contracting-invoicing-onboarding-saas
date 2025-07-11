<script lang="ts" setup>
defineProps({
  keepAlive: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "tab-item",
  },
  name: {
    type: String,
    default: "Tab Name",
  },
});
</script>

<template>
  <div class="mm-tab-item" :data-cy="cy">
    <slot />
  </div>
</template>
