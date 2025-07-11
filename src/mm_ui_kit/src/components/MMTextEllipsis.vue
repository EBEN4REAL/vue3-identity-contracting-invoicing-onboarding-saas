<script setup lang="ts">
defineProps({
  maxWidth: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="mm-text-ellipsis">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.mm-text-ellipsis {
  max-width: v-bind(maxWidth);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
