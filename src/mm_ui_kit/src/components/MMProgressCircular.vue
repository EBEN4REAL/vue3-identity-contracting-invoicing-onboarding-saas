<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 128,
  },
  width: {
    type: Number,
    default: 12,
  },
});
</script>

<template>
  <v-progress-circular
    indeterminate
    :size="size"
    :width="width"
    class="m-m-progress-circular"
  />
</template>

<style scoped lang="scss">
.m-m-progress-circular {
  :deep(.v-progress-circular__overlay) {
    stroke: #072e51;
  }

  :deep(.v-progress-circular__underlay) {
    stroke: #d9dbdc;
  }
}
</style>
