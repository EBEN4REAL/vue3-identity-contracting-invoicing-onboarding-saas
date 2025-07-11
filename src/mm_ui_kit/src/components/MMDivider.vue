<script setup lang="ts">
defineProps({
  borderColor: {
    type: String,
    default: "#d0d5dd",
  },
});
</script>

<template>
  <div class="mm-divider" />
</template>

<style scoped lang="scss">
.mm-divider {
  border-bottom: 1px solid;
  width: 100%;
  height: 0;
  border-color: v-bind(borderColor);
}
</style>
